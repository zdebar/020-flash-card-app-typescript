import fs from 'fs';
import sqlite3 from 'sqlite3';
import Papa from 'papaparse';

interface BlockWord {
  id: number; 
  word: string;
}

// Path to the database
const dbPath: string = '../data/cz-esp-01.db';

// Open the database
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Database connected successfully');

  // Query to select all rows from the block_words table
  const query: string = 'SELECT * FROM block_words';

  db.all(query, (err: Error | null, rows: BlockWord[]) => {
    if (err) {
      console.error('Error querying block_words table:', err.message);
      return;
    }

    // Convert the rows to CSV format using PapaParse
    const csv: string = Papa.unparse(rows);

    // Write the CSV data to a file
    fs.writeFile('../data/block_words_export.csv', csv, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('Error writing CSV to file:', err.message);
      } else {
        console.log('block_words table exported to block_words_export.csv');
      }
    });
  });

  // Close the database connection
  db.close((err: Error | null) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
});

