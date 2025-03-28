import { app } from '../app'; 
import supertest from 'supertest';
import { createTestDb, cleanupTestDb } from '../test/utils';


beforeAll(async () => {
  await createTestDb(); 
});


afterAll(async () => {
  await cleanupTestDb();
});

