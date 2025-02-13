import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';

// Define a type for the words table rows
interface Word {
  src: string;
  trg: string;
  prn: string;
  type: string;
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
export function readCSV(filePath: string, callback: (data: Word[]) => void): void {
  const file = fs.readFileSync(filePath, 'utf-8');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      callback(result.data as Word[]);
    },
    error: (err: Error) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
}

// Insert words into the database
export function insertWords(db: sqlite3.Database, data: Word[]): void {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION'); // Start transaction

    const stmt = db.prepare('INSERT INTO words (src, trg, prn, type) VALUES (?, ?, ?, ?)');

    data.forEach((row) => {
      stmt.run(row.src, row.trg, row.prn, row.type, (err: Error | null) => {
        if (err) {
          console.error('Error inserting word:', err.message);
        }
      });
    });

    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement:', err.message);
        db.run('ROLLBACK'); // Rollback transaction on error
      } else {
        console.log('Data inserted successfully.');
        db.run('COMMIT'); // Commit transaction if everything is fine
      }
    });
  });
}

// Close database connection
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
export function processCSVAndInsertData(dbPath: string, csvPath: string): void {
  checkPaths(dbPath, csvPath);

  const db = initializeDatabase(dbPath);

  readCSV(csvPath, (data: Word[]) => {
    insertWords(db, data);
  });

  // Close the database connection after the operation
  setTimeout(() => {
    closeDatabase(db);
  }, 5000);
}
