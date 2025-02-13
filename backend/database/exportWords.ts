import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';

// Define a type for the rows returned from the words table
interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string;
  type: string;
}

// Check if the directory exists and create if necessary
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
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

// Function to export words table to CSV
export function exportWordsToCSV(db: sqlite3.Database, outputPath: string): void {
  // Query all data from the words table
  db.all('SELECT id, src, trg, prn, type FROM words', (err: Error | null, rows: Word[]) => {
    if (err) {
      console.error('Error fetching data from database:', err.message);
      return;
    }

    // Convert the rows to CSV format
    const csv: string = Papa.unparse(rows);

    // Write the CSV data to a file
    fs.writeFile(outputPath, csv, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('Error writing CSV to file:', err.message);
      } else {
        console.log(`CSV file has been saved successfully as ${outputPath}`);
      }
    });
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

// Main function to export words
export function processExport(dbPath: string, dirPath: string, outputPath: string): void {
  ensureDirectoryExists(dirPath);

  const db = initializeDatabase(dbPath);

  exportWordsToCSV(db, outputPath);

  // Close the database connection after a delay
  setTimeout(() => {
    closeDatabase(db);
  }, 5000);
}
