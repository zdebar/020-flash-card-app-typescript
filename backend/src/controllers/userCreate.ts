import bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import { db } from '../config/appConfig';
import { promisify } from 'util';

const saltRounds = 10;

export async function createUser(username: string, email: string, password: string): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds); 
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `);

    // Convert the `stmt.run` method to a Promise using promisify
    const runQuery = promisify(stmt.run.bind(stmt));

    // Run the SQL statement and handle the response
    await runQuery(username, email, hashedPassword);
    logger.info(`User created with username: ${username}`);

  } catch (err) {
    logger.error('Error in createUser:', err instanceof Error ? err.message : 'Unknown error');
    throw err;
  }
}

