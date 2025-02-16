import bcrypt from 'bcrypt';
import winston from 'winston';
import sqlite3 from 'sqlite3';

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const saltRounds = 10;

function connectToDatabase(dbName: string): sqlite3.Database {
  const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
      logger.error('Chyba při připojování k databázi:', err.message);
    } else {
      logger.info(`Připojeno k databázi: ${dbName}`);
    }
  });

  return db;
}

async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const query = `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`;

  db.run(query, [email, hashedPassword, name], function (err) {
    if (err) {
      logger.error('Chyba při registraci uživatele:', err.message);
    } else {
      logger.info(`Uživatel ${name} byl úspěšně zaregistrován! ID: ${this.lastID}`);
    }
  });
}

async function verifyUser(email: string, inputPassword: string) {
  db.get('SELECT password FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      logger.error('Chyba při ověřování uživatele:', err.message);
      return;
    }

    if (row) {
      // Porovnání hesla
      const match = await bcrypt.compare(inputPassword, row.password);
      if (match) {
        logger.info('Heslo je správné!');
      } else {
        logger.warn('Heslo je nesprávné.');
      }
    } else {
      logger.warn('Uživatel s tímto e-mailem neexistuje.');
    }
  });
}

const db = connectToDatabase(process.argv[2] || './default_database.db');
createUser('newuser@example.com', 'Heslo123!', 'Jan Novák');
verifyUser('newuser@example.com', 'Heslo123!');