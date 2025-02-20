import sqlite3 from 'sqlite3';
import path from 'path';

// Database Config
const dbPath = path.resolve(__dirname, '../data/dictionary.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1); // Exit process if database connection fails
  } else {
    console.log('Successfully connected to database.');
  }
});

// Learning Algorithm Config
export const learningConfig = {
  trainingWordCount: 100,
  trainingSessionCount: 10,
  defaultScore: 0,
  learningLanguage: "en"
};

// General Progress Config
export const progressConfig = {
  baseProgress: 0,
  baseRepetitionProgress: 100,
  overRepetitionProgress: 200
};
