import bcrypt from 'bcryptjs';
import { db } from '../config/appConfig';
import logger from '../utils/logger';
import { promisify } from 'util';

// Function to authenticate user
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


