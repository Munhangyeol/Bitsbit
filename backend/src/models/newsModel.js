const db = require('../config/database');

class NewsModel {
  create(newsData) {
    return new Promise((resolve, reject) => {
      const { external_id, title, url, published_at, source, coins, sentiment } = newsData;

      const query = `
        INSERT INTO news (external_id, title, url, published_at, source, coins, sentiment)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(query, [external_id, title, url, published_at, source, coins, sentiment], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...newsData });
        }
      });
    });
  }

  findByCoin(coin, limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM news
        WHERE coins LIKE ?
        ORDER BY published_at DESC
        LIMIT ?
      `;

      console.log(`[NewsModel] Searching for: %"${coin}"%`);
      db.all(query, [`%"${coin}"%`, limit], (err, rows) => {
        if (err) {
          console.error('[NewsModel] Error:', err);
          reject(err);
        } else {
          console.log(`[NewsModel] Found ${rows.length} results`);
          resolve(rows);
        }
      });
    });
  }

  findRecent(hours = 24, coin = null) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT * FROM news
        WHERE datetime(published_at) >= datetime('now', '-${hours} hours')
      `;

      const params = [];

      if (coin) {
        query += ` AND coins LIKE ?`;
        params.push(`%"${coin.toUpperCase()}"%`);
      }

      query += ` ORDER BY published_at DESC`;

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  deleteOld(days = 7) {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM news
        WHERE datetime(created_at) < datetime('now', '-${days} days')
      `;

      db.run(query, [], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedCount: this.changes });
        }
      });
    });
  }
}

module.exports = new NewsModel();
