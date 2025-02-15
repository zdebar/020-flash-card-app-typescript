import sqlite3, { ERROR } from 'sqlite3';
import Papa from 'papaparse';
import{ promises as fs } from 'fs';
import winston from 'winston';
import { resolve } from 'path';

// Create logger instance with different levels and transports
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Define types for CSV data
interface Block {
  id: number;
  name: string;
}

interface Lecture {
  id: number;
  name: string;
}

interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string;
  type: string;
}

// Function to check if the database exists
export async function checkDatabaseExists(dbPath: string): Promise<boolean> {
  try {
    await fs.access(dbPath);
    logger.debug(`Database found: ${dbPath}`);
    return true;    
  } catch {
    logger.debug(`Database not found: ${dbPath}`);
    return false;
  }
}

// Check if the CSV file path is valid
export async function checkCSVPath(csvPath: string): Promise<boolean> {
  try {
    await fs.access(csvPath);
    logger.debug(`CSV file found: ${csvPath}`);
    return true;
  } catch {
    logger.debug(`CSV file not found: ${csvPath}`);
    return false;
  }
}

// Function to open a connection to the database
export async function openDatabase(dbPath: string): Promise<sqlite3.Database | null> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        logger.debug(`Failed to connect to database: ${dbPath}`);
        reject(err); 
      } else {
        logger.debug(`Established connection to database: ${dbPath}`);
        resolve(db);
      }
    });
  });
} 

// Function to close the database connection
export function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err: Error | null) => {
      if (err) {
        logger.debug(`Failed to close the database: ${err.message}`);
        reject(err);
      } else {
        logger.debug("Database connection closed");
        resolve();
      }
    });
  });
}

// Function to read and parse CSV file
export async function readCSV<T>(filePath: string): Promise<T[]> {
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const result = Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      logger.debug(`Error parsing CSV at ${filePath}: ${result.errors[0].message}`);
      throw new Error(`Error parsing CSV: ${result.errors[0].message}`);
    }
    
    logger.debug(`Successfully read CSV file: ${filePath}`);
    return result.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.debug(`Failed to read CSV file: ${filePath}, Error: ${err.message}`);
      throw new Error(`Failed to read CSV: ${err.message}`);
    } else {
      logger.debug(`Unknown error occurred while reading CSV file: ${filePath}`);
      throw new Error('Unknown error occurred');
    }
  }
}

// Function to insert words into the database
export function insertWords(db: sqlite3.Database, data: Word[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO words (src, trg, prn, type) VALUES (?, ?, ?, ?)');

    db.serialize(() => {
      logger.debug('Starting database transaction for inserting words');
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.src, row.trg, row.prn, row.type, (err: Error | null) => {
          if (err) {
            logger.error(`Error inserting word: ${row.src} | Error: ${err.message}`);
            reject(new Error('Error inserting word: ' + err.message));
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          db.run('ROLLBACK');
          logger.error(`Error finalizing statement: ${err.message}`);
          reject(new Error('Error finalizing statement: ' + err.message));
        } else {
          db.run('COMMIT');
          logger.debug('Transaction committed successfully');
          resolve();
        }
      });
    });
  });
}

// Function to insert blocks into the database
export function insertBlocks(db: sqlite3.Database, data: Block[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO blocks (id, name) VALUES (?, ?)');

    data.forEach((row) => {
      const blockId: number = row.id;
      const blockName: string = row.name;

      // Insert data into the blocks table
      stmt.run(blockId, blockName, (err: Error | null) => {
        if (err) {
          logger.error(`Error inserting block: id = ${blockId}, name = ${blockName}: ` + err.message);
          reject(new Error(`Error inserting block: id = ${blockId}, name = ${blockName}: ` + err.message));
        }
      });
    });

    // Finalize the statement after all insertions
    stmt.finalize((err: Error | null) => {
      if (err) {
        logger.error('Error finalizing statement: ' + err.message);
        reject(new Error('Error finalizing statement: ' + err.message));
      } else {
        logger.debug('Successfully inserted all blocks.');
        resolve();
      }
    });
  });
}

// Function to insert lectures into the database
export function insertLectures(db: sqlite3.Database, data: Lecture[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO lectures (id, name) VALUES (?, ?)');

    data.forEach((row) => {
      const lectureId: number = row.id;
      const lectureName: string = row.name;

      // Insert data into the lectures table
      stmt.run(lectureId, lectureName, (err: Error | null) => {
        if (err) {
          logger.error(`Error inserting lecture: id = ${lectureId}, name = ${lectureName}: ` + err.message);
          reject(new Error(`Error inserting lecture: id = ${lectureId}, name = ${lectureName}: ` + err.message));
        }
      });
    });

    // Finalize the statement after all insertions
    stmt.finalize((err: Error | null) => {
      if (err) {
        logger.error('Error finalizing statement: ' + err.message);
        reject(new Error('Error finalizing statement: ' + err.message));
      } else {
        logger.debug('Successfully inserted all lectures.');
        resolve();
      }
    });
  });
}

// Function to create tables in the database
export function createTables(db: sqlite3.Database): void {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY,
      src TEXT NOT NULL,
      trg TEXT NOT NULL,
      prn TEXT NOT NULL,
      type TEXT CHECK(type IN ('word', 'phrase', 'sentence', 'grammar')) DEFAULT 'word'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS lectures (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS lecture_blocks (
      lecture_id INTEGER,
      block_id INTEGER,
      FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
      FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      PRIMARY KEY (lecture_id, block_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS block_words (
      block_id INTEGER NOT NULL,
      word_id INTEGER NOT NULL,
      FOREIGN KEY (block_id) REFERENCES blocks(id),
      FOREIGN KEY (word_id) REFERENCES words(id),
      PRIMARY KEY (block_id, word_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS block_blocks (
      parent_block_id INTEGER NOT NULL,
      child_block_id INTEGER NOT NULL,
      FOREIGN KEY (parent_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      FOREIGN KEY (child_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      PRIMARY KEY (parent_block_id, child_block_id)
    )`);
  });
  logger.debug(`All database tables created: ${db}`);
}

// Function to export words table to CSV
export async function exportWordsToCSV(db: sqlite3.Database, outputPath: string): Promise<void> {
  try {
    logger.debug('Fetching words data from the database...');
    
    const rows: Word[] = await new Promise((resolve, reject) => {
      db.all('SELECT src, trg, prn, type FROM words', (err: Error | null, rows: Word[]) => {
        if (err) {
          logger.error('Error fetching data from database: ' + err.message);
          reject(new Error('Error fetching data from database: ' + err.message));
        } else {
          resolve(rows);
        }
      });
    });

    logger.debug(`Successfully fetched ${rows.length} rows from the database.`);

    const csv: string = Papa.unparse(rows);
    logger.debug(`CSV data created for ${rows.length} rows.`);

    // Use fs.promises.writeFile for async/await
    await fs.writeFile(outputPath, csv);
    logger.debug(`CSV file has been saved successfully as ${outputPath}`);
  } catch (err) {
    logger.error('Error during CSV export: ' + (err instanceof Error ? err.message : 'Unknown error'));
    throw new Error('Error during CSV export: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

// Function to process the CSV and insert words into the database
export async function processCSVAndInsertWords(dbPath: string, csvPath: string): Promise<void> {
  try {
    const isCSVValid = await checkCSVPath(csvPath);
    if (!isCSVValid) {
      logger.error(`CSV file not found at path: ${csvPath}`);
      return;
    }

    const db = await openDatabase(dbPath);
    if (!db) {
      logger.error('Failed to open database connection.');
      return;
    }

    const data = await readCSV<Word>(csvPath);
    await insertWords(db, data);
    await exportWordsToCSV(db, './output/words.csv');  
    logger.info('CSV processed, words inserted, and exported successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Error during process: ' + error.message);
    } else {
      logger.error('An unknown error occurred.');
    }
  }
}

// Function to process the CSV and insert blocks
export async function processCSVAndInsertBlocks(dbPath: string, csvPath: string): Promise<void> {
  try {
    // Check if the CSV path is valid
    const isCSVValid = await checkCSVPath(csvPath);
    if (!isCSVValid) {
      console.error(`CSV file not found at path: ${csvPath}`);
      return;
    }

    // Open the database connection
    const db = await openDatabase(dbPath);
    if (!db) {
      console.error('Failed to open database connection.');
      return;
    }

    // Read the CSV data
    const data = await readCSV<Block>(csvPath);

    // Insert blocks into the database
    await insertBlocks(db, data);
    logger.debug("Blocks inserted successfully.")
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Error during process: ' + error.message);
    } else {
      logger.error('An unknown error occurred.');
    }
  }
}

// Function to process the CSV and insert lectures
export async function processCSVAndInsertLectures(dbPath: string, csvPath: string): Promise<void> {
  try {
    // Check if the CSV path is valid
    const isCSVValid = await checkCSVPath(csvPath);
    if (!isCSVValid) {
      console.error(`CSV file not found at path: ${csvPath}`);
      return;
    }

    // Open the database connection
    const db = await openDatabase(dbPath);
    if (!db) {
      console.error('Failed to open database connection.');
      return;
    }

    // Read the CSV data
    const data = await readCSV<Lecture>(csvPath);

    // Insert lectures into the database
    await insertLectures(db, data);

    console.log('Lectures inserted successfully.');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during process:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  }
}

export async function setupDatabase(dbPath: string): Promise<void> {
  try {
    const db = await openDatabase(dbPath);

    if (db === null) {
      throw new Error(`Failed to open database at path: ${dbPath}`);
    }

    await createTables(db);
    await closeDatabase(db);
  } catch (error) {
    logger.error('Error setting up the database:', error);
  }
}

// Function to check and set up the database
export async function checkAndSetupDatabase(dbPath: string): Promise<void> {
  try {
    await checkDatabaseExists(dbPath);  // Assuming this function checks if the DB exists
    logger.info('Database already exists, skipping setup.');  // Using logger instead of console.log
  } catch (error) {
    logger.error('Database does not exist, creating new database and schema...', error);  // Log error with the message
    await setupDatabase(dbPath);  // Ensure to await the async setupDatabase
  }
}