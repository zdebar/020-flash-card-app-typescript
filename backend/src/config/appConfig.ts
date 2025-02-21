import sqlite3 from 'sqlite3';
import path from 'path';
import logger from '../utils/logger';

// Database Config
const dbPath = path.resolve(__dirname, '../data/dictionary.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    logger.debug('Successfully connected to database.');
  }
});

//Internal Settings
export const progressScoreConfig = {
  baseProgressScore: 0, // initial progressScore for practice
  baseRepetitionProgressScore: 100, // initial progressScore for srs repetition
  endProgressScore: 200 // end progressScore for repetition
};
