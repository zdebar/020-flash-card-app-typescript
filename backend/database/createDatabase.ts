import sqlite3, { ERROR } from 'sqlite3';
import Papa from 'papaparse';
import{ promises as fs } from 'fs';
import winston from 'winston';

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
        reject(err); // Reject the promise if connection fails
      } else {
        logger.debug(`Established connection to database: ${dbPath}`);
        resolve(db); // Resolve the promise with the db object if connection succeeds
      }
    });
  });
}

// Function to close the database connection
export function closeDatabase(db: sqlite3.Database): void {
  db.close((err: Error | null) => {
    if (err) {
      console.error('Error closing database', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
}

// Function to read and parse CSV file
export function readCSV<T>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(filePath, 'utf-8');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        resolve(result.data as T[]);
      },
      error: (err: { message: any }) => {
        reject(new Error('Error parsing CSV: ' + err.message));
      },
    });
  });
}

// Function to insert words into the database
export function insertWords(db: sqlite3.Database, data: Word[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO words (src, trg, prn, type) VALUES (?, ?, ?, ?)');

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.src, row.trg, row.prn, row.type, (err: Error | null) => {
          if (err) {
            reject(new Error('Error inserting word: ' + err.message));
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          db.run('ROLLBACK');
          reject(new Error('Error finalizing statement: ' + err.message));
        } else {
          db.run('COMMIT');
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
          reject(new Error(`Error inserting block: id = ${blockId}, name = ${blockName}: ` + err.message));
        }
      });
    });

    // Finalize the statement after all insertions
    stmt.finalize((err: Error | null) => {
      if (err) {
        reject(new Error('Error finalizing statement: ' + err.message));
      } else {
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
          reject(new Error(`Error inserting lecture: id = ${lectureId}, name = ${lectureName}: ` + err.message));
        }
      });
    });

    // Finalize the statement after all insertions
    stmt.finalize((err: Error | null) => {
      if (err) {
        reject(new Error('Error finalizing statement: ' + err.message));
      } else {
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
  console.log('Tables created successfully');
}

// Function to export words table to CSV
export function exportWordsToCSV(db: sqlite3.Database, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.all('SELECT src, trg, prn, type FROM words', (err: Error | null, rows: Word[]) => {
      if (err) {
        reject(new Error('Error fetching data from database: ' + err.message));
      } else {
        const csv: string = Papa.unparse(rows);
        fs.writeFile(outputPath, csv, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            reject(new Error('Error writing CSV to file: ' + err.message));
          } else {
            console.log(`CSV file has been saved successfully as ${outputPath}`);
            resolve();
          }
        });
      }
    });
  });
}

// Function to process the CSV and insert words into the database
export async function processCSVAndInsertWords(dbPath: string, csvPath: string): Promise<void> {
  try {
    checkCSVPath(csvPath);
    const db = openDatabase(dbPath);
    const data = await readCSV<Word>(csvPath);
    await insertWords(db, data);
    await exportWordsToCSV(db, './output/words.csv');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during process:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  }
}

// Function to process the CSV and insert blocks
export async function processCSVAndInsertBlocks(dbPath: string, csvPath: string): Promise<void> {
  try {
    checkCSVPath(csvPath);
    const db = openDatabase(dbPath);
    const data = await readCSV<Block>(csvPath);
    await insertBlocks(db, data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during process:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  }
}

// Function to process the CSV and insert lectures
export async function processCSVAndInsertLectures(dbPath: string, csvPath: string): Promise<void> {
  try {
    checkCSVPath(csvPath);
    const db = openDatabase(dbPath);
    const data = await readCSV<Lecture>(csvPath);
    await insertLectures(db, data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during process:', error.message);
    } else {
      console.error('An unknown error occurred.');
    }
  }
}

// Function to check and set up the database
export async function checkAndSetupDatabase(dbPath: string): Promise<void> {
  try {
    await checkDatabaseExists(dbPath);
    console.log('Database already exists, skipping setup.');
  } catch (error) {
    console.log('Database does not exist, creating new database and schema...');
    setupDatabase(dbPath);
  }
}

// Function to set up the database schema
export function setupDatabase(dbPath: string): void {
  const db = openDatabase(dbPath);
  createTables(db);
  closeDatabase(db);
}
