import db from '../config/database.config';
import logger from './logger.utils';

/**
 * Helper function for SELECT ALL into database.
 * 
 * @param query sql SELECT query
 * @param params query parameters
 * @returns A Promise that resolves to an array of rows or empty Array if no rows are found
 */
export function queryDatabase<T>(query: string, params: any[]): Promise<T[]> {
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
 * @param query sql INSERT, UPDATE or DELETE query
 * @param params query parameters
 * @returns Returns void Promise
 */
export function executeQuery(query: string, params: any[]): Promise<void> {
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
