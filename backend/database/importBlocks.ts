import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';
import path from 'path';

// Define a type for the CSV row data
interface Block {
  id: number;
  name: string;
}

// Path to the database
const dbPath: string = path.resolve(__dirname, '../data/cz-esp-01.db');

// Path to the CSV file
const csvPath: string = path.resolve(__dirname, '../data/blocks.csv');

// Check if the database file exists
if (!fs.existsSync(dbPath)) {
  console.error('Database does not exist. Stopping execution.');
  process.exit(1);
}

// Check if the CSV file exists
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
const readCSV = (filePath: string, callback: (data: Block[]) => void): void => {
  const file = fs.readFileSync(filePath, 'utf-8');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      callback(result.data as Block[]); // Cast result data to Block[]
    },
    error: (err: { message: any; }) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
};

// Function to insert blocks
const insertBlocks = (data: Block[]): void => {
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
};

// Call to process CSV files
readCSV(csvPath, insertBlocks);

// Close the database connection after the operation
db.close((err: Error | null) => {
  if (err) {
    console.error('Error closing database', err.message);
  } else {
    console.log('Database connection closed');
  }
});
