import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';
import path from 'path';

// Define a type for the CSV row data
interface Block {
  id: number;
  name: string;
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
export function readCSV(filePath: string, callback: (data: Block[]) => void): void {
  const file = fs.readFileSync(filePath, 'utf-8');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      callback(result.data as Block[]);
    },
    error: (err: { message: any; }) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
}

// Insert blocks into the database
export function insertBlocks(db: sqlite3.Database, data: Block[]): void {
  const stmt = db.prepare('INSERT INTO blocks (id, name) VALUES (?, ?)');

  data.forEach((row) => {
    const blockId: number = row.id;
    const blockName: string = row.name;

    // Insert data into the blocks table
    stmt.run(blockId, blockName, (err: Error | null) => {
      if (err) {
        console.error(
          `Error inserting block: id = ${blockId}, name = ${blockName}:`,
          err.message
        );
      } else {
        console.log(`Inserted block: id = ${blockId}, name = ${blockName}`);
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
export function processCSVAndInsertBlocks(dbPath: string, csvPath: string): void {
  checkPaths(dbPath, csvPath);

  const db = initializeDatabase(dbPath);

  readCSV(csvPath, (data: Block[]) => {
    insertBlocks(db, data);
  });

  // Close the database connection after the operation
  setTimeout(() => {
    closeDatabase(db);
  }, 5000);
}
