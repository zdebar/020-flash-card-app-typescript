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

export async function deleteUser(userId: number): Promise<void> {
  try {
    const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
    const runQuery = promisify(stmt.run.bind(stmt));

    await runQuery(userId);
    logger.info(`User deleted with ID: ${userId}`);
  } catch (err) {
    logger.error('Error in deleteUser:', err instanceof Error ? err.message : 'Unknown error');
    throw err;
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const getAsync = promisify(db.get.bind(db));

    const query = `SELECT * FROM users WHERE email = ?`;
    const user = await getAsync(query, [email]);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return { userId: user.id, username: user.username };
  } catch (err) {
    logger.error('Error in authenticateUser:', err instanceof Error ? err.message : 'Unknown error');
    throw err;
  }
}