import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const db = new sqlite3.Database("./data/cz-esp.db");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Home route');
});

app.get('/library', (req: Request, res: Response) => {
  res.send('Library route');
});

app.get('/user', (req: Request, res: Response) => {
  res.send('User route');
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
