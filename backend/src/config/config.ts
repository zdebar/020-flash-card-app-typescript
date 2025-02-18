import sqlite3 from 'sqlite3';

// Database Config
const dbPath = '../data/dictionary.db';

// Learning Algorithm Config
export const trainingWordCount = 100;
export const trainingSessionCount = 10;
export const defaultScore = 0;
export const learningLanguage = "en";

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connection to database:', err.message);
  } else {
    console.log('Successfully created connection to database.');
  }
});

// General Config
export const baseProgress = 0;
export const baseRepetionProgress = 100;
export const overRepetionProgress = 200;