import Database from "better-sqlite3";
import bcrypt from "bcryptjs"

export default async function registerUser (req: any, res: any, db: Database) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if username or email already exists
    db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
      if (user) {
        return res.status(400).json({ error: "Username or email already taken." });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
        [username, email, hashedPassword], 
        function (err) {
          if (err) return res.status(500).json({ error: "Database error" });

          res.status(201).json({ message: "User registered successfully!" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
