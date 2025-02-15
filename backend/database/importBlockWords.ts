import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';


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
