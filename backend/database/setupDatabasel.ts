import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

// Import the functions to create tables and insert data
import { setupDatabase } from './createDatabase';  // Adjust the path to your actual setupDatabase file
import { insertWords } from './importWords';
import { insertLectures } from './importLectures';
import { insertBlocks } from './importBlocks';
import { insertLectureBlocks } from './importLectureBlocks';
import { insertBlockWords } from './importBlockWords';

// Define paths
const dbPath: string = path.resolve(__dirname, '../data/cz-esp-01.db');
const dirPath: string = path.resolve(__dirname, '../data');

// Ensure the directory exists
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Initialize Database
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Database connected successfully');
  }
});

// Setup the database schema
setupDatabase(db);

// Now, load data and insert it into tables

// Insert words (you can change file path if needed)
import { readCSV as readWordsCSV } from './readCSV';  // Adjust path to CSV reading logic
const wordsCsvPath = path.resolve(__dirname, '../data/words.csv');
readWordsCSV(wordsCsvPath, insertWords);

// Insert lectures
import { readCSV as readLecturesCSV } from './readCSV';
const lecturesCsvPath = path.resolve(__dirname, '../data/lectures.csv');
readLecturesCSV(lecturesCsvPath, insertLectures);

// Insert blocks
import { readCSV as readBlocksCSV } from './readCSV';
const blocksCsvPath = path.resolve(__dirname, '../data/blocks.csv');
readBlocksCSV(blocksCsvPath, insertBlocks);

// Insert lecture blocks
import { readCSV as readLectureBlocksCSV } from './readCSV';
const lectureBlocksCsvPath = path.resolve(__dirname, '../data/lecture_blocks.csv');
readLectureBlocksCSV(lectureBlocksCsvPath, insertLectureBlocks);

// Insert block words
import { readCSV as readBlockWordsCSV } from './readCSV';
const blockWordsCsvPath = path.resolve(__dirname, '../data/block_words.csv');
readBlockWordsCSV(blockWordsCsvPath, insertBlockWords);

// Close the database connection after all operations
db.close((err: Error | null) => {
  if (err) {
    console.error('Error closing database', err.message);
  } else {
    console.log('Database connection closed');
  }
});


