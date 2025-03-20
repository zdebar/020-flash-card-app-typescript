import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

const db: Database = new sqlite3.Database(':memory:');

export default db;
