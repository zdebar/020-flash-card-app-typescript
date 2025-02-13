import sqlite3 from 'sqlite3';

// Utility function to setup a SQLite database connection
export function setupDatabase(dbPath: string): sqlite3.Database {
  const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
      console.error(`Error opening database at ${dbPath}:`, err.message);
      process.exit(1);
    } else {
      console.log(`Database connected successfully at ${dbPath}`);
    }
  });

  return db;
}

// Function to create user-related tables
export function createUserTables(db: sqlite3.Database): void {
  const createUserWordsHistoryTable = `
    CREATE TABLE IF NOT EXISTS user_words_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      success TEXT CHECK(success IN ('Y', 'N')),
      timestamp INTEGER,
      FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
    );
  `;
  
  const createUserWordsScoreTable = `
    CREATE TABLE IF NOT EXISTS user_words_score (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      score INTEGER,
      next_day INTEGER,
      FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
    );
  `;

  const createUserSentencesHistoryTable = `
    CREATE TABLE IF NOT EXISTS user_sentences_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      success TEXT CHECK(success IN ('Y', 'N')),
      timestamp INTEGER,
      FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
    );
  `;
  
  const createUserSentencesScoreTable = `
    CREATE TABLE IF NOT EXISTS user_sentences_score (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER,
      score INTEGER,
      next_day INTEGER,
      FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
    );
  `;

  // Create tables
  db.run(createUserWordsHistoryTable, (err) => {
    if (err) console.error('Error creating user_words_history table:', err.message);
    else console.log('user_words_history table created or already exists');
  });

  db.run(createUserWordsScoreTable, (err) => {
    if (err) console.error('Error creating user_words_score table:', err.message);
    else console.log('user_words_score table created or already exists');
  });

  db.run(createUserSentencesHistoryTable, (err) => {
    if (err) console.error('Error creating user_sentences_history table:', err.message);
    else console.log('user_sentences_history table created or already exists');
  });

  db.run(createUserSentencesScoreTable, (err) => {
    if (err) console.error('Error creating user_sentences_score table:', err.message);
    else console.log('user_sentences_score table created or already exists');
  });
}

// Function to enable foreign keys and attach databases
export function setupForeignKeys(userDb: sqlite3.Database, mainDbPath: string): void {
  userDb.run(`ATTACH DATABASE ? AS mainDb`, [mainDbPath], (err: Error | null) => {
    if (err) {
      console.error('Error attaching main database to user database:', err.message);
      return;
    }
    console.log('Main database attached to user database');

    // Enable foreign keys
    userDb.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) console.error('Error enabling foreign keys in user database:', err.message);
      else console.log('Foreign keys enabled in user database');
    });
  });
}
