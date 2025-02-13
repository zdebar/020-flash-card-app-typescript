import sqlite3 from 'sqlite3';
import path from 'path';

// Cesty k databázím
const mainDbPath = path.resolve(__dirname, '../data/cz-esp-01.db');  // Existující databáze
const userDbPath = path.resolve(__dirname, '../data/user-cz-esp-01.db');  // Nová databáze pro uživatele

// Připojení k existující databázi cz-esp-01.db
const mainDb = new sqlite3.Database(mainDbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening main database:', err.message);
    process.exit(1);
  } else {
    console.log('Main database (cz-esp-01.db) connected successfully');
  }
});

// Vytvoření nové databáze user-cz-esp-01.db
const userDb = new sqlite3.Database(userDbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening user database:', err.message);
    process.exit(1);
  } else {
    console.log('User database (user-cz-esp-01.db) created or opened successfully');
  }
});

// Funkce pro vytvoření tabulek v uživatelské databázi
const createUserTables = (): void => {
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

  // Vytvoření tabulek pro uživatele
  userDb.run(createUserWordsHistoryTable, (err) => {
    if (err) {
      console.error('Error creating user_words_history table:', err.message);
    } else {
      console.log('user_words_history table created or already exists');
    }
  });

  userDb.run(createUserWordsScoreTable, (err) => {
    if (err) {
      console.error('Error creating user_words_score table:', err.message);
    } else {
      console.log('user_words_score table created or already exists');
    }
  });

  userDb.run(createUserSentencesHistoryTable, (err) => {
    if (err) {
      console.error('Error creating user_sentences_history table:', err.message);
    } else {
      console.log('user_sentences_history table created or already exists');
    }
  });

  userDb.run(createUserSentencesScoreTable, (err) => {
    if (err) {
      console.error('Error creating user_sentences_score table:', err.message);
    } else {
      console.log('user_sentences_score table created or already exists');
    }
  });
};

// Funkce pro propojení obou databází pomocí FOREIGN KEY
const createForeignKeyRelation = (): void => {
  // Připojení k hlavní databázi
  userDb.run(`ATTACH DATABASE ? AS mainDb`, [mainDbPath], (err: Error | null) => {
    if (err) {
      console.error('Error attaching main database to user database:', err.message);
      return;
    }
    console.log('Main database attached to user database');

    // Povolení cizího klíče
    userDb.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Error enabling foreign keys in user database:', err.message);
      } else {
        console.log('Foreign keys enabled in user database');
      }
    });
  });
};

// Zavolání funkcí pro vytvoření tabulek a propojení databází
createForeignKeyRelation();
createUserTables();

// Zavření databází
mainDb.close((err: Error | null) => {
  if (err) {
    console.error('Error closing main database:', err.message);
  } else {
    console.log('Main database connection closed');
  }
});

userDb.close((err: Error | null) => {
  if (err) {
    console.error('Error closing user database:', err.message);
  } else {
    console.log('User database connection closed');
  }
});
