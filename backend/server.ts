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
  res.json({ id: "1", email: "test@email.com", name: "Test User"});
});

app.get('/library', (req: Request, res: Response) => {
  res.send('Library route');
});

app.get('/user', (req: Request, res: Response) => {
  res.send('User route');
});

app.get("/user/settings/:id", async (req, res) => {
  const { id } = req.params;
  const user = await db.get("SELECT algorithm_settings, notifications_enabled FROM users WHERE id = ?", [id]);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  res.json({
      algorithmSettings: JSON.parse(user.algorithm_settings),
      notificationsEnabled: user.notifications_enabled
  });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
