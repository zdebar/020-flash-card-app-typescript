import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';

// Define a type for the rows returned from the words table
interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string;
}

// Initialize DB
const db = new sqlite3.Database('../data/cz-esp-01.db');

// Function to export words table to CSV
const exportWordsToCSV = (): void => {
  // Query all data from the words table
  db.all('SELECT id, src, trg, prn FROM words', (err: Error | null, rows: Word[]) => {
    if (err) {
      console.error('Error fetching data from database:', err.message);
      return;
    }

    // Convert the rows to CSV format
    const csv: string = Papa.unparse(rows);

    // Write the CSV data to a file
    fs.writeFile('../data/words-export.csv', csv, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('Error writing CSV to file:', err.message);
      } else {
        console.log('CSV file has been saved successfully as words-export.csv');
      }
    });
  });
};

// Call the function to export the data
exportWordsToCSV();

// Close the database connection
db.close((err: Error | null) => {
  if (err) {
    console.error('Error closing database', err.message);
  } else {
    console.log('Database connection closed');
  }
});

