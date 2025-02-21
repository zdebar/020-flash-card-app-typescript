import sqlite3 from 'sqlite3';
import path from 'path';

// Database Path
const dbPath = path.resolve(__dirname, '../data/dictionary.db');

// Global Database Connection
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Successfully connected to the database.');
  }
});

//Internal Settings
export const progressScoreConfig = {
  baseProgressScore: 0, // initial progressScore for practice
  baseRepetitionProgressScore: 100, // initial progressScore for srs repetition
  endProgressScore: 200 // end progressScore for repetition
};
