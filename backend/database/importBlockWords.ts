import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';
import path from 'path';

// Define a type for the CSV row data
interface BlockWord {
  block_id: number;
  word_id: number;
}

// Path to the database
const dbPath: string = path.resolve(__dirname, '../data/cz-esp-01.db');

// Path to the CSV file
const csvPath: string = path.resolve(__dirname, '../data/block_words.csv');

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
const readCSV = (filePath: string, callback: (data: BlockWord[]) => void): void => {
  const file = fs.readFileSync(filePath, 'utf-8');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      callback(result.data as BlockWord[]); // Cast result data to BlockWord[]
    },
    error: (err: { message: any; }) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
};

// Function to insert block_words
const insertBlockWords = (data: BlockWord[]): void => {
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
};

// Call to process CSV files
readCSV(csvPath, insertBlockWords);

// Close the database connection after the operation
db.close((err: Error | null) => {
  if (err) {
    console.error('Error closing database', err.message);
  } else {
    console.log('Database connection closed');
  }
});
