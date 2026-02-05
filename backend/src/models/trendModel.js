const db = require('../config/database');

class TrendModel {
  create(trendData) {
    return new Promise((resolve, reject) => {
      const { coin, trend, score, positive_count, negative_count, neutral_count } = trendData;

      const query = `
        INSERT INTO trends (coin, trend, score, positive_count, negative_count, neutral_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.run(query, [coin, trend, score, positive_count, negative_count, neutral_count], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...trendData });
        }
      });
    });
  }

  findLatest() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t1.*
        FROM trends t1
        INNER JOIN (
          SELECT coin, MAX(analyzed_at) as max_date
          FROM trends
          GROUP BY coin
        ) t2 ON t1.coin = t2.coin AND t1.analyzed_at = t2.max_date
        ORDER BY t1.coin
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  findByCoin(coin) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM trends
        WHERE coin = ?
        ORDER BY analyzed_at DESC
        LIMIT 1
      `;

      db.get(query, [coin], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = new TrendModel();
