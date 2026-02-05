const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/crypto_dashboard.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create news table
    db.run(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        external_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        published_at DATETIME NOT NULL,
        source TEXT,
        coins TEXT,
        sentiment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating news table:', err.message);
      } else {
        console.log('News table initialized');
      }
    });

    // Create trends table
    db.run(`
      CREATE TABLE IF NOT EXISTS trends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin TEXT NOT NULL,
        trend TEXT NOT NULL,
        score REAL NOT NULL,
        positive_count INTEGER,
        negative_count INTEGER,
        neutral_count INTEGER,
        analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating trends table:', err.message);
      } else {
        console.log('Trends table initialized');
      }
    });

    // Create predictions table (가격 예측 투표)
    db.run(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin TEXT NOT NULL,
        direction TEXT NOT NULL,
        session_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating predictions table:', err.message);
      } else {
        console.log('Predictions table initialized');
      }
    });

    // Create alerts table (가격 알림)
    db.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin TEXT NOT NULL,
        target_price REAL NOT NULL,
        direction TEXT NOT NULL,
        session_id TEXT NOT NULL,
        triggered INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating alerts table:', err.message);
      } else {
        console.log('Alerts table initialized');
      }
    });
  });
}

module.exports = db;
