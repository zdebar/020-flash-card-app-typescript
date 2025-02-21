import sqlite3 from 'sqlite3';
import Papa from 'papaparse';
import fs from 'fs';
import logger from '../utils/logger';
import { WordData } from '../types';

const databasePath = "../../data/dictionary.db";
const csvPath = "../../data/en-source/CZ-EN.csv";
const inputLanguage = "en";
const inputColumns = ["id", "src", "trg", "prn", "type", "language", "frequency_order"];
const startFrequencyOrder = 1;
const wordType = "word";

// Open the database connection
export function openDatabase(dbPath: string): Promise<sqlite3.Database> {
  return new Promise<sqlite3.Database>((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        reject(new Error(`Failed to connect to database: ${dbPath}`));
      } else {
        resolve(db);
      }
    });
  });
}

// Close the database connection
export async function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.close((err: Error | null) => {
      if (err) {
        reject(new Error('Error closing the database: ' + err.message));
      } else {
        resolve();
      }
    });
  });
}

// Read and parse CSV file
export async function readCSV<T>(filePath: string): Promise<T[]> {
  try {
    const file = await fs.promises.readFile(filePath, 'utf-8');
    const result = Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      throw new Error(`Error parsing CSV: ${result.errors[0].message}`);
    }
    return result.data;

  } catch (err: unknown) {
    throw new Error('Error during reading CSV: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

// Prepare word data by adding `language` and `frequency_order`
export async function prepareWordData<T>(
  data: T[],
  type: string,
  language: string,
  startFrequencyOrder: number = 1
): Promise<any[]> {
  return data.map((row, index) => ({
    ...row, 
    type,
    language,
    frequency_order: startFrequencyOrder + index,
  }));
}

// Prepare the insert statement
export async function prepareInsertStatement<T>(
  db: sqlite3.Database,
  tableName: string,
  columns: string[]
): Promise<sqlite3.Statement> {
  return db.prepare(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`);
}

// Insert data into the table
export async function insertIntoTable<T>(
  db: sqlite3.Database,
  tableName: string,
  columns: string[],
  filePath: string,
  wordType: string,
  language: string,
  startFrequencyOrder: number
): Promise<void> {
  try {
    logger.debug(`Reading CSV for table ${tableName}: ${filePath}`);
    const data = await readCSV<T>(filePath);
    
    if (data.length === 0) {
      logger.warn(`No data to insert for table ${tableName}`);
      return;
    }

    // Prepare data by adding type, language and frequency_order
    const preparedData = await prepareWordData(data, wordType, language, startFrequencyOrder);
    
    const stmt = await prepareInsertStatement<T>(db, tableName, columns);

    // Execute transaction to insert data
    await executeTransaction(db, preparedData, stmt, columns, tableName);
  } catch (err: unknown) {
    logger.error(`Error during CSV import for ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    throw new Error(`Error during insertIntoTable for ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// Execute transaction
function executeTransaction<T>(
  db: sqlite3.Database,
  data: T[],
  stmt: sqlite3.Statement,
  columns: string[],
  tableName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      logger.debug(`Starting transaction for ${tableName}`);
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          logger.error(`Failed to start transaction: ${err.message}`);
          return reject(err);
        }

        let hasError = false;
        for (const row of data) {
          const values = columns.map((col) => row[col as keyof T]);
          stmt.run(values, (err: Error | null) => {
            if (err) {
              logger.error(`Error inserting into ${tableName}: ${JSON.stringify(row)} | ${err.message}`);
              hasError = true;
            }
          });
          if (hasError) break;
        }

        stmt.finalize((err) => {
          if (err) {
            db.run('ROLLBACK', () => reject(err));
            logger.error(`Error finalizing statement for ${tableName}: ${err.message}`);
          } else {
            db.run('COMMIT', (err) => {
              if (err) {
                logger.error(`Error committing transaction for ${tableName}: ${err.message}`);
                db.run('ROLLBACK', () => reject(err));
              } else {
                logger.debug(`Transaction committed successfully for ${tableName}`);
                resolve();
              }
            });
          }
        });
      });
    });
  });
}

// Insert data into the database
export async function insertData(dbPath: string): Promise<void> {
  const db = await openDatabase(dbPath);
  try {
    await insertIntoTable<WordData>(db, "words", inputColumns, csvPath, wordType, inputLanguage, startFrequencyOrder);
  } catch (err) {
    throw new Error((err instanceof Error ? err.message : 'Unknown error'));
  } finally {
    await closeDatabase(db); // Ensure the database is closed after the operation
  }
}

// Call the insertData function
insertData(databasePath)
  .then(() => logger.info('Data inserted successfully'))
  .catch((err) => logger.error('Data insertion failed: ' + (err instanceof Error ? err.message : 'Unknown error')));