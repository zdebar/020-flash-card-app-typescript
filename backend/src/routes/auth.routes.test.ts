import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerUserController, loginUserController } from '../controllers/auth.controller';


vi.mock('../config/database.config', () => ({
  ...vi.importActual('../config/database.config'),
  query: vi.fn().mockResolvedValue([{ id: 1, username: 'testuser' }]), 
  close: vi.fn(), 
}));

import db from '../config/database.config';

// Create a mock Express app
const app = express();
app.use(express.json());

// Mock routes
app.post('/auth/register', registerUserController(db));
app.post('/auth/login', loginUserController(db));

describe('Authentication routes', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
  });

  it('should fail registration if fields are missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', email: '' });  // Missing password

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('All fields are required.');
  });

  it('should log in an existing user and return a token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should fail login if email or password is incorrect', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });
});
