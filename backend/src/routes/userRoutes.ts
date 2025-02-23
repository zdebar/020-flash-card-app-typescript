import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/appConfig';
import { promisify } from 'util';

const userRoutes = express.Router();

// Funkce pro registraci uživatele
userRoutes.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  
  if (!email || !username || !password) {
    res.status(400).json({ message: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (email, username, password)
      VALUES (?, ?, ?)
    `);
    const runQuery = promisify(stmt.run.bind(stmt));
    await runQuery(email, username, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

export default userRoutes;
