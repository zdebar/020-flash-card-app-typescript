import fs from 'fs';
import Papa from 'papaparse';
import sqlite3 from 'sqlite3';

// Define a type for the CSV row data
interface LectureBlock {
  lecture_id: number;
  block_id: number;
}

// Check if paths are valid
export function checkPaths(dbPath: string, csvPath: string): void {
  if (!fs.existsSync(dbPath)) {
    console.error('Database does not exist. Stopping execution.');
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file does not exist. Stopping execution.');
    process.exit(1);
  }
}

// Initialize Database Connection
export function initializeDatabase(dbPath: string): sqlite3.Database {
  const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    } else {
      console.log('Database connected successfully');
    }
  });
  return db;
}

// Read and parse CSV file
export function readCSV(filePath: string, callback: (data: LectureBlock[]) => void): void {
  const file = fs.readFileSync(filePath, 'utf-8');
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      callback(result.data as LectureBlock[]);
    },
    error: (err: { message: any; }) => {
      console.error('Error parsing CSV:', err.message);
    },
  });
}

// Insert lecture blocks into the database
export function insertLectureBlocks(db: sqlite3.Database, data: LectureBlock[]): void {
  const stmt = db.prepare('INSERT INTO lecture_blocks (lecture_id, block_id) VALUES (?, ?)');

  data.forEach((row) => {
    const lectureId: number = row.lecture_id;
    const blockId: number = row.block_id;

    // Insert data into the lecture_blocks table
    stmt.run(lectureId, blockId, (err: Error | null) => {
      if (err) {
        console.error(
          `Error inserting lecture_block: lecture_id = ${lectureId}, block_id = ${blockId}:`,
          err.message
        );
      } else {
        console.log(
          `Inserted lecture_block: lecture_id = ${lectureId}, block_id = ${blockId}`
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
export function processCSVAndInsertLectureBlocks(dbPath: string, csvPath: string): void {
  checkPaths(dbPath, csvPath);

  const db = initializeDatabase(dbPath);

  readCSV(csvPath, (data: LectureBlock[]) => {
    insertLectureBlocks(db, data);
  });

  // Close the database connection after the operation
  setTimeout(() => {
    closeDatabase(db);
  }, 5000);
}