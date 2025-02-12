import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';

// Define a type for the words table rows
interface Word {
  src: string;
  trg: string;
  prn: string;
}

// Path to the database
const dbPath: string = '../data/cz-esp-01.db';

// Check if the database file exists
if (!fs.existsSync(dbPath)) {
  console.error('Database does not exist. Stopping execution.');
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
      callback(result.data as Word[]); // Cast result data to Word[]
    },
    error: (err: { message: any; }) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
};

// Function to insert words into the database
const insertWords = (data: Word[]): void => {
  const stmt = db.prepare('INSERT INTO words (src, trg, prn) VALUES (?, ?, ?)');

  data.forEach((row) => {
    stmt.run(row.src, row.trg, row.prn, (err: Error | null) => {
      if (err) {
        console.error('Error inserting word:', err.message);
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
readCSV('../data/words.csv', insertWords);

// Close the database connection after the operation
db.close((err: Error | null) => {
  if (err) {
    console.error('Error closing database', err.message);
  } else {
    console.log('Database connection closed');
  }
});
