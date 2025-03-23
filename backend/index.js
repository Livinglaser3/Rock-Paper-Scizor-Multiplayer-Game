// backend/index.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database('game.db');

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS players (
    username TEXT PRIMARY KEY
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS moves (
    username TEXT PRIMARY KEY,
    move TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS results (
    username TEXT PRIMARY KEY,
    wins INTEGER
  )`);

  // 🧹 Clear old data
  db.run(`DELETE FROM players`);
  db.run(`DELETE FROM moves`);
});


// Join game if slots available
app.post('/join', (req, res) => {
  const { username } = req.body;

  db.all(`SELECT COUNT(*) AS count FROM players`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const count = rows[0].count;

    if (count >= 2) {
      return res.status(200).json({ status: 'full' });
    }

    db.run(`INSERT OR IGNORE INTO players(username) VALUES(?)`, [username], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ status: 'joined' });
    });
  });
});
// Save player's move
app.post('/move', (req, res) => {
  const { username, move } = req.body;

  db.run(`INSERT OR REPLACE INTO moves(username, move) VALUES(?, ?)`, [username, move], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ status: 'move saved' });
  });
});
// Check result if both players have played
app.get('/result', (req, res) => {
  db.all(`SELECT * FROM moves`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length < 2) return res.status(200).json({ status: 'waiting' });

    const [p1, p2] = rows;

    const matrix = {
      Rock: { Rock: 'Draw', Paper: 'Lose', Scissors: 'Win' },
      Paper: { Rock: 'Win', Paper: 'Draw', Scissors: 'Lose' },
      Scissors: { Rock: 'Lose', Paper: 'Win', Scissors: 'Draw' },
    };

    const outcome = matrix[p1.move][p2.move];

    let winner = null;
    if (outcome === 'Win') winner = p1.username;
    if (outcome === 'Lose') winner = p2.username;

    // Save win count
    if (winner) {
      db.run(`INSERT INTO results(username, wins)
              VALUES(?, 1)
              ON CONFLICT(username) DO UPDATE SET wins = wins + 1`, [winner]);
    }

    // Reset for next round
    db.run(`DELETE FROM moves`);
    db.run(`DELETE FROM players`);

    return res.status(200).json({ result: outcome, winner });
  });
});
// Get leaderboard
app.get('/leaderboard', (req, res) => {
  db.all(`SELECT username, wins FROM results ORDER BY wins DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(rows);
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
