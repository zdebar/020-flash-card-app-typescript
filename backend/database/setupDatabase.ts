import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

// Define the database file path
const dbPath: string = path.resolve('../data/cz-esp-01.db');

// Check if the database file exists
fs.access(dbPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.log('Database does not exist, creating new database and schema...');
    setupDatabase();
  } else {
    console.log('Database already exists, skipping setup.');
  }
});

// Function to set up the database schema
const setupDatabase = (): void => {
  const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
      console.error('Error opening database', err.message);
    } else {
      console.log('Database connected successfully');
    }
  });

  db.serialize(() => {
    // Create the words table
    db.run(`
      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY,
        src TEXT NOT NULL,
        trg TEXT NOT NULL,
        prn TEXT NOT NULL,
        type TEXT CHECK(type IN ('word', 'phrase', 'sentence')) DEFAULT 'word'
      )
    `);

    // Create the lectures table
    db.run(`
      CREATE TABLE IF NOT EXISTS lectures (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    // Create the blocks table
    db.run(`
      CREATE TABLE IF NOT EXISTS blocks (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    // Create lecture_block linking table
    db.run(`
      CREATE TABLE IF NOT EXISTS lecture_blocks (
        lecture_id INTEGER,
        block_id INTEGER,
        FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
        FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
        PRIMARY KEY (lecture_id, block_id)
      )
    `);

    // Create block_words linking table
    db.run(`
      CREATE TABLE IF NOT EXISTS block_words (
        block_id INTEGER NOT NULL,
        word_id INTEGER NOT NULL,
        FOREIGN KEY (block_id) REFERENCES blocks(id),
        FOREIGN KEY (word_id) REFERENCES words(id),
        PRIMARY KEY (block_id, word_id)
      )
    `);

    // Create block_block linking table
    db.run(`
    CREATE TABLE IF NOT EXISTS block_blocks (
      parent_block_id INTEGER NOT NULL,
      child_block_id INTEGER NOT NULL,
      FOREIGN KEY (parent_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      FOREIGN KEY (child_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
      PRIMARY KEY (parent_block_id, child_block_id)
      )
    `);
  });

  console.log('Database setup complete');

  // Close the database connection
  db.close((err: Error | null) => {
    if (err) {
      console.error('Error closing database', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
};
