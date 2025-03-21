import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express, { NextFunction } from 'express';
import userRouter from '../routes/user.routes';
import { authenticateTokenMiddleware } from '../middlewares/auth.middleware';
import db from '../config/database.config';

// Create a mock Express app
const app = express();
app.use(express.json());
app.use(userRouter);

// Mock database methods
vi.mock('../config/database.config', () => ({
  ...vi.importActual('../config/database.config'),
  query: vi.fn().mockResolvedValue([{ id: 1, username: 'testuser', email: 'test@example.com' }]), 
  close: vi.fn(), 
}));

// Mock the authenticateTokenMiddleware to always pass
vi.mock('../middlewares/auth.middleware', () => ({
  authenticateTokenMiddleware: (req: Request, res: Response, next: NextFunction) => {
    req.user = { id: 1 }; 
    next();
  },
}));

describe('User routes', () => {
  it('should fetch user profile successfully', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer mockToken'); 

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, username: 'testuser', email: 'test@example.com' });
  });

  it('should return 401 if no token is provided for user profile', async () => {
    const response = await request(app).get('/user');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication required');
  });

  it('should fetch user words successfully', async () => {
    const response = await request(app)
      .get('/words/1/en')
      .set('Authorization', 'Bearer mockToken'); 

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, word: 'testword' }]); 
  });

  it('should return 400 if userId or language is missing', async () => {
    const response = await request(app)
      .get('/words/1')
      .set('Authorization', 'Bearer mockToken');  

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Language and block are required.');
  });

  it('should update user words successfully', async () => {
    const response = await request(app)
      .post('/words/1/progress')
      .set('Authorization', 'Bearer mockToken')
      .send({
        words: ['word1', 'word2'],
        SRS: [1, 2]
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User words updated successfully.');
  });

  it('should return 400 if words or SRS is not provided in progress update', async () => {
    const response = await request(app)
      .post('/words/1/progress')
      .set('Authorization', 'Bearer mockToken')
      .send({}); 

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Words and SRS must be arrays.');
  });

  it('should return 401 if token is invalid for user words update', async () => {
    const response = await request(app)
      .post('/words/1/progress')
      .send({
        words: ['word1'],
        SRS: [1]
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication required');
  });
});
