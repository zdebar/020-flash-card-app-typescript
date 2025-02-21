import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET; 

if (!secretKey) {
  throw new Error('Missing JWT secret key in environment variables');
}

export function generateToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, secretKey, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error('Invalid token');
  }
}

