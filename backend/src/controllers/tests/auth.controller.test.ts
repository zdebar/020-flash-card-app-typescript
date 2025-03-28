import { describe, it, expect, vi } from 'vitest';
import { Client } from 'pg';
import postgresDB from '../../config/database.config.postgres';

vi.mock('pg', () => ({
  Client: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue('connected'),
    query: vi.fn().mockResolvedValue({ rows: [{ id: 1, name: 'Test User' }] }),
    end: vi.fn().mockResolvedValue('disconnected'),
  })),
}));

describe('Database Configuration with Environment Variables', () => {
  it('should connect to the test database', async () => {
    // Override the environment variables for the test
    process.env.DB_HOST = 'test-db-host';
    process.env.DB_PORT = '5433';
    process.env.DB_NAME = 'test-database';
    process.env.DB_USER = 'test-user';
    process.env.DB_PASSWORD = 'test-password';

    // Now, initialize the postgresDB with new settings
    const testClient = new Client();  // Uses the new env settings

    await testClient.connect();

    // Assert if the correct connection settings were used
    expect(testClient).toHaveProperty('host', 'test-db-host');
    expect(testClient).toHaveProperty('port', 5433);
    expect(testClient).toHaveProperty('database', 'test-database');
    expect(testClient).toHaveProperty('user', 'test-user');
    expect(testClient).toHaveProperty('password', 'test-password');

    await testClient.end();
  });
});
