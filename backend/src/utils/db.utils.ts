import logger from './logger.utils';
import sqlite3, { Database } from 'sqlite3';
import { Client } from 'pg';

/**
 * Helper function for SELECT ALL into database.
 * @param db db SQLite database
 * @param query sql SELECT query
 * @param params query parameters
 * @returns A generic type Promise returning array of objects
 */
export function queryDatabaseSQLite<T>(db: Database, query: string, params: any[]): Promise<T[]> {
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
 * @param db db SQLite database
 * @param query sql INSERT, UPDATE or DELETE query
 * @param params query parameters
 * @returns Returns void Promise
 */
export function executeQuerySQLite(db: sqlite3.Database, query: string, params: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err: Error | null) {
      if (err) {
        logger.error(`Error executing query: ${err.message}`);
        reject(new Error("Error executing query: " + err.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Helper function for SELECT ALL into PostgreSQL database.
 * @param client PostgreSQL client
 * @param query sql SELECT query
 * @param params query parameters
 * @returns A generic type Promise returning array of objects
 */
export async function queryDatabasePostgres<T>(client: Client, query: string, params: any[]): Promise<T[]> {
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (err: any) {
    logger.error(`Error executing PostgreSQL query: ${err.message}`);
    throw new Error("Error querying PostgreSQL database: " + err.message);
  }
}

/**
 * Helper function for running INSERT, UPDATE, DELETE PostgreSQL queries
 * @param client PostgreSQL client
 * @param query sql INSERT, UPDATE or DELETE query
 * @param params query parameters
 * @returns Returns void Promise
 */
export async function executeQueryPostgres(client: Client, query: string, params: any[]): Promise<void> {
  try {
    await client.query(query, params);
  } catch (err: any) {
    logger.error(`Error executing PostgreSQL query: ${err.message}`);
    throw new Error("Error executing PostgreSQL query: " + err.message);
  }
}
