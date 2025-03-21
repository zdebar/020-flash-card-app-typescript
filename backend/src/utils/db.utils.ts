import logger from './logger.utils';
import sqlite3 from 'sqlite3';

/**
 * Helper function for SELECT ALL into database.
 * @param db database
 * @param query sql SELECT query
 * @param params query parameters
 * @returns A generic type Promise returning arrary of objects
 */
export function queryDatabase<T>(db: sqlite3.Database, query: string, params: any[]): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    db.all(query, params, (err, rows: T[]) => {
      if (err) {
        logger.error(`Error executing query: ${err.message}`);
        reject(new Error("Error querying database: " + err.message));
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Helper function for running INSERT, UPDATE, DELETE database queries
 * @param db database
 * @param query sql INSERT, UPDATE or DELETE query
 * @param params query parameters
 * @returns Returns void Promise
 */
export function executeQuery(db: sqlite3.Database, query: string, params: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err: Error) {
      if (err) {
        logger.error(`Error executing query: ${err.message}`);
        reject(new Error("Error executing query: " + err.message));
      } else {
        resolve();
      }
    });
  });
}
