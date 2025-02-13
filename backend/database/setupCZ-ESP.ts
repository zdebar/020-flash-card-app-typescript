import { setupDatabase, createTables } from './setupDatabase';

// Specify the path for the Spanish database
const spanishDbPath = path.join(__dirname, 'data', 'cz-esp-01.db');

// Use the `setupDatabase` function to set up the Spanish database
const db = setupDatabase(spanishDbPath);

// Optionally, you can call `createTables` to ensure the necessary tables are set up
createTables(db);

// You can now use the `db` object to perform queries related to the Spanish database
