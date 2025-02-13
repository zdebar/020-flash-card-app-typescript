import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';

// Define a type for the CSV row data
interface BlockWord {
  block_id: number;
  word_id: number;
}

// Check if paths are valid
export function checkPaths(dbPath: string, csvPath: string): void {
  if (!fs.existsSync(dbPath)) {
    console.error('Database does not exist. Stopping execution.');
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file does not exist. Stopping execution.');
    process.exit(1);
  }
}

// Initialize Database Connection
export function initializeDatabase(dbPath: string): sqlite3.Database {
  const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    } else {
      console.log('Database connected successfully');
    }
  });
  return db;
}

// Read and parse CSV file
export function readCSV(filePath: string, callback: (data: BlockWord[]) => void): void {
  const file = fs.readFileSync(filePath, 'utf-8');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      callback(result.data as BlockWord[]);
    },
    error: (err: { message: any; }) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
}

// Insert block words into the database
export function insertBlockWords(db: sqlite3.Database, data: BlockWord[]): void {
  const stmt = db.prepare('INSERT INTO block_words (block_id, word_id) VALUES (?, ?)');

  data.forEach((row) => {
    const blockId: number = row.block_id;
    const wordId: number = row.word_id;

    // Insert data into the block_words table
    stmt.run(blockId, wordId, (err: Error | null) => {
      if (err) {
        console.error(
          `Error inserting block_word: block_id = ${blockId}, word_id = ${wordId}:`,
          err.message
        );
      } else {
        console.log(
          `Inserted block_word: block_id = ${blockId}, word_id = ${wordId}`
        );
      }
    });
  });

  // Finalize the statement after all insertions
  stmt.finalize((err: Error | null) => {
    if (err) {
      console.error('Error finalizing statement:', err.message);
    } else {
      console.log('Statement finalized successfully');
    }
  });
}

// Close the database connection
export function closeDatabase(db: sqlite3.Database): void {
  db.close((err: Error | null) => {
    if (err) {
      console.error('Error closing database', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
}

// Function to process the CSV and insert data
export function processCSVAndInsertBlockWords(dbPath: string, csvPath: string): void {
  checkPaths(dbPath, csvPath);

  const db = initializeDatabase(dbPath);

  readCSV(csvPath, (data: BlockWord[]) => {
    insertBlockWords(db, data);
  });

  // Close the database connection after the operation
  setTimeout(() => {
    closeDatabase(db);
  }, 5000);
}
