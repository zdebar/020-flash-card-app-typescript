import sqlite3 from 'sqlite3';
import Papa from 'papaparse';
import fs from 'fs';
import logger from '../utils/logger';

// Old way for editing database. Now using DBeaver instead
// Insert into Table is already improved in databaseIntert.ts

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

interface BlockWord {
  block_id: number;
  word_id: number;
}

interface BlockBlock {
  block_id: number;
  blockNested_id: number;
}

interface LectureBlock {
  lecture_id: number;
  block_id: number;
}

export function checkDatabaseExists(dbPath: string): boolean {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database does not exist. Stopping execution. ${dbPath}`);
  }
  return true;
}

export function checkCSVFileExists(csvPath: string): boolean {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file does not exist. Stopping execution.${csvPath}`);
  }
  return true;
}

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

function createTable(db: sqlite3.Database, query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, (err: Error | null) => {
      if (err) {
        reject(new Error(`Error creating table: ${err.message}`));
      } else {
        resolve();
      }
    });
  });
}

export async function createTables(db: sqlite3.Database): Promise<void> {
  const queries = [
    `CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY,
      src TEXT NOT NULL,
      trg TEXT NOT NULL,
      prn TEXT NOT NULL,
      type TEXT CHECK(type IN ('word', 'phrase', 'sentence', 'grammar')) DEFAULT 'word'
    )`,
    `CREATE TABLE IF NOT EXISTS lectures (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS lecture_blocks (
      lecture_id INTEGER,
      block_id INTEGER,
      FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
      FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      PRIMARY KEY (lecture_id, block_id)
    )`,
    `CREATE TABLE IF NOT EXISTS block_words (
      block_id INTEGER NOT NULL,
      word_id INTEGER NOT NULL,
      FOREIGN KEY (block_id) REFERENCES blocks(id),
      FOREIGN KEY (word_id) REFERENCES words(id),
      PRIMARY KEY (block_id, word_id)
    )`,
    `CREATE TABLE IF NOT EXISTS block_blocks (
      parent_block_id INTEGER NOT NULL,
      child_block_id INTEGER NOT NULL,
      FOREIGN KEY (parent_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      FOREIGN KEY (child_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      PRIMARY KEY (parent_block_id, child_block_id)
    )`
  ];

  try {
    for (const query of queries) {
      await createTable(db, query);
    }
  } catch (err) {
    throw new Error('Error creating tables: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

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

export async function insertIntoTable<T>(
  db: sqlite3.Database,
  tableName: string,
  columns: string[],
  filePath: string
): Promise<void> {
  try {
    logger.debug(`Reading CSV for table ${tableName}: ${filePath}`);
    const data = await readCSV<T>(filePath);
    
    if (data.length === 0) {
      logger.warn(`No data to insert for table ${tableName}`);
      return;
    }

    const stmt = db.prepare(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`);
    await executeTransaction(db, data, stmt, columns, tableName);
  } catch (err: unknown) {
    logger.error(`Error during CSV import for ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    throw new Error(`Error during insertIntoTable for ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

export async function insertFromCSV<T>(
  dbPath: string, 
  csvPath: string, 
  insertFunction: (db: sqlite3.Database, data: T[]) => Promise<void>
): Promise<void> {
  try {
    checkCSVFileExists(csvPath);
    const db = await openDatabase(dbPath);
    const data = await readCSV<T>(csvPath);
    await insertFunction(db, data);
    await closeDatabase(db);
  } catch (err: unknown) {
    throw new Error('Error during CSV import: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

export async function setupDatabase(dbPath: string): Promise<void> {
  const db = await openDatabase(dbPath);
  try {
    await createTables(db);
    await insertIntoTable<Word>( db, "words", ["id", "src", "trg", "prn", "type"], "../data/words.csv" );
    await insertIntoTable<Block>( db, "blocks", ["id", "name"], "../data/blocks.csv" );
    await insertIntoTable<Lecture>( db, "lectures", ["id", "name"], "../data/lectures.csv" );
    await insertIntoTable<LectureBlock>( db, "lecture_blocks", ["lecture_id", "block_id"], "../data/lecture_blocks.csv" );
    await insertIntoTable<BlockBlock>( db, "block_blocks", ["block_id", "block_id"], "../data/block_blocks.csv" );
    await insertIntoTable<BlockWord>( db, "block_words", ["block_id", "word_id"], "../data/block_words.csv" );
    await closeDatabase(db);
  } catch (err) {
    await closeDatabase(db);
    throw new Error((err instanceof Error ? err.message : 'Unknown error'));
  }
}

setupDatabase("../data/cz-esp.db");