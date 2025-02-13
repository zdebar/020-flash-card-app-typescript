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

// Path to the database
const dbPath: string = path.resolve(__dirname, '../data/cz-esp-01.db');
const csvPath: string = path.resolve(__dirname, '../data/words.csv');

// Check paths
if (!fs.existsSync(dbPath)) {
  console.error('Database does not exist. Stopping execution.');
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error('CSV file does not exist. Stopping execution.');
  process.exit(1);
}

// Initialize DB
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Database connected successfully');
  }
});

// Function to read and parse CSV
const readCSV = (filePath: string, callback: (data: Word[]) => void): void => {
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
};

// Function to insert words into the database
const insertWords = (data: Word[]): void => {
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
};

// Call to process CSV files
readCSV(csvPath, insertWords);

// Close the database connection after the operation
setTimeout(() => {
  db.close((err: Error | null) => {
    if (err) {
      console.error('Error closing database', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
}, 5000);
