import sqlite3, { ERROR } from 'sqlite3';
import Papa from 'papaparse';
import fs, { promises} from 'fs';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

interface Block {
  id: number;
  name: string;
}

interface Lecture {
  id: number;
  name: string;
}

interface Word {
  id: number;
  src: string;
  trg: string;
  prn: string;
  type: string;
}

interface BlockWord {
  block_id: number;
  word_id: number;
}

interface LectureBlock {
  lecture_id: number;
  block_id: number;
}

export function checkDatabaseExists(dbPath: string): boolean {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database does not exist. Stopping execution. ${dbPath}`);
  }
  return true;
}

export function checkCSVFileExists(csvPath: string): boolean {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file does not exist. Stopping execution.${csvPath}`);
  }
  return true;
}

export function openDatabase(dbPath: string): Promise<sqlite3.Database> {
  return new Promise<sqlite3.Database>((resolve) => {
    const db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        new Error(`Failed to connect to database: ${dbPath}`);
      } else {
        resolve(db);
      }
    });
  });
}

export async function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.close((err: Error | null) => {
      if (err) {
        reject(new Error('Error closing the database: ' + err.message));
      } else {
        resolve();
      }
    });
  });
}

export async function readCSV<T>(filePath: string): Promise<T[]> {
  try {
    const file = await fs.promises.readFile(filePath, 'utf-8');
    const result = Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      throw new Error(`Error parsing CSV: ${result.errors[0].message}`);
    }
    return result.data;

  } catch (err: unknown) {
    throw new Error('Error during CSV export: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

export function insertWords(db: sqlite3.Database, data: Word[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO words (id, src, trg, prn, type) VALUES (?, ?, ?, ?, ?)');

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.src, row.trg, row.prn, row.type, (err: Error | null) => {
          if (err) {
            db.run('ROLLBACK');
            logger.error(`Error inserting word: ${row.src} | ${err.message}`);
            reject(err);
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {  
          db.run('ROLLBACK');        
          logger.error('Error finalizing statement: ' + err.message);
          reject();
        } else {
          db.run('COMMIT');
          resolve();
        }
      });
    });
  });
}

export function insertBlocks(db: sqlite3.Database, data: Block[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO blocks (id, name) VALUES (?, ?)');

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.id, row.name, (err: Error | null) => {
          if (err) {
            db.run('ROLLBACK');
            logger.error(`Error inserting block: id = ${row.id}, name = ${row.name}: ` + err.message);
            reject(err); 
          }
        });
      });

      stmt.finalize((err: Error | null) => {
        if (err) {
          db.run('ROLLBACK'); 
          logger.error('Error finalizing statement: ' + err.message);
          reject(err);
        } else {
          db.run('COMMIT'); 
          resolve();
        }
      });
    });
  });
}

export function insertLectures(db: sqlite3.Database, data: Lecture[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO lectures (id, name) VALUES (?, ?)');

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.id, row.name, (err: Error | null) => {
          if (err) {
            db.run('ROLLBACK');
            logger.error(`Error inserting lecture: id = ${row.id}, name = ${row.name}: ` + err.message);
            reject();
          }
        });
      })

      stmt.finalize((err: Error | null) => {
        if (err) {
          db.run('ROLLBACK'); 
          logger.error('Error finalizing statement: ' + err.message);
          reject(err);
        } else {
          db.run('COMMIT'); 
          resolve();
        }
      });
    });
  });
}

export function insertLectureBlocks(db: sqlite3.Database, data: { lecture_id: number, block_id: number }[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO lecture_blocks (lecture_id, block_id) VALUES (?, ?)');

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.lecture_id, row.block_id, (err: Error | null) => {
          if (err) {
            db.run('ROLLBACK');
            logger.error(`Error inserting lecture_block: lecture_id = ${row.lecture_id}, block_id = ${row.block_id} | ${err.message}`);
            reject(err);
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          db.run('ROLLBACK');
          logger.error('Error finalizing statement: ' + err.message);
          reject();
        } else {
          db.run('COMMIT');
          resolve();
        }
      });
    });
  });
}

export function insertBlockWords(db: sqlite3.Database, data: { block_id: number, word_id: number }[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO block_words (block_id, word_id) VALUES (?, ?)');

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      data.forEach((row) => {
        stmt.run(row.block_id, row.word_id, (err: Error | null) => {
          if (err) {
            db.run('ROLLBACK');
            logger.error(`Error inserting block_word: block_id = ${row.block_id}, word_id = ${row.word_id} | ${err.message}`);
            reject(err);
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          db.run('ROLLBACK');
          logger.error('Error finalizing statement: ' + err.message);
          reject();
        } else {
          db.run('COMMIT');
          resolve();
        }
      });
    });
  });
}



export async function createTables(db: sqlite3.Database): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS words (
          id INTEGER PRIMARY KEY,
          src TEXT NOT NULL,
          trg TEXT NOT NULL,
          prn TEXT NOT NULL,
          type TEXT CHECK(type IN ('word', 'phrase', 'sentence', 'grammar')) DEFAULT 'word'
        )`, (err: Error | null) => {
          if (err) reject(new Error('Error creating words table: ' + err.message));
        });

        db.run(`CREATE TABLE IF NOT EXISTS lectures (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        )`, (err: Error | null) => {
          if (err) reject(new Error('Error creating lectures table: ' + err.message));
        });

        db.run(`CREATE TABLE IF NOT EXISTS blocks (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        )`, (err: Error | null) => {
          if (err) reject(new Error('Error creating blocks table: ' + err.message));
        });

        db.run(`CREATE TABLE IF NOT EXISTS lecture_blocks (
          lecture_id INTEGER,
          block_id INTEGER,
          FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
          FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
          PRIMARY KEY (lecture_id, block_id)
        )`, (err: Error | null) => {
          if (err) reject(new Error('Error creating lecture_blocks table: ' + err.message));
        });

        db.run(`CREATE TABLE IF NOT EXISTS block_words (
          block_id INTEGER NOT NULL,
          word_id INTEGER NOT NULL,
          FOREIGN KEY (block_id) REFERENCES blocks(id),
          FOREIGN KEY (word_id) REFERENCES words(id),
          PRIMARY KEY (block_id, word_id)
        )`, (err: Error | null) => {
          if (err) reject(new Error('Error creating block_words table: ' + err.message));
        });

        db.run(`CREATE TABLE IF NOT EXISTS block_blocks (
          parent_block_id INTEGER NOT NULL,
          child_block_id INTEGER NOT NULL,
          FOREIGN KEY (parent_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
          FOREIGN KEY (child_block_id) REFERENCES blocks(id) ON DELETE CASCADE,
          PRIMARY KEY (parent_block_id, child_block_id)
        )`, (err: Error | null) => {
          if (err) reject(new Error('Error creating block_blocks table: ' + err.message));
        });

        resolve();
      });
    });
  } catch (err) {
    throw new Error('Error creating tables: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

export async function exportWordsToCSV(db: sqlite3.Database, outputPath: string): Promise<void> {
  try { 
    const rows: Word[] = await new Promise((resolve, reject) => {
      db.all('SELECT src, trg, prn, type FROM words', (err: Error | null, rows: Word[]) => {
        if (err) {
          logger.error(`Error fetching data from database: ` + err.message);
          reject();
        } else {
          resolve(rows);
        }
      });
    });

    const csv: string = Papa.unparse(rows);
    await fs.promises.writeFile(outputPath, csv);

  } catch (err: unknown) {
    throw new Error('Error during CSV export: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

export async function insertFromCSV<T>(
  dbPath: string, 
  csvPath: string, 
  insertFunction: (db: sqlite3.Database, data: T[]) => Promise<void>
): Promise<void> {
  try {
    checkCSVFileExists(csvPath);
    const db = await openDatabase(dbPath);
    const data = await readCSV<T>(csvPath);
    await insertFunction(db, data);
    await closeDatabase(db);
  } catch (err: unknown) {
    throw new Error('Error during CSV import: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

export async function setupDatabase(dbPath: string): Promise<void> {
  try {
    const db = await openDatabase(dbPath);
    await createTables(db);
    await closeDatabase(db);
  } catch (err) {
    throw new Error('Error during CSV import: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

// Function to check and set up the database
export async function importAll(dbPath: string): Promise<void> {
  try {
    await insertFromCSV<Word>(dbPath, '../data/words.csv', insertWords);
    await insertFromCSV<Block>(dbPath, '../data/blocks.csv', insertBlocks);
    await insertFromCSV<Lecture>(dbPath, '../data/lectures.csv', insertLectures);
  } catch (err: unknown) {
    throw new Error('Error during import: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}
