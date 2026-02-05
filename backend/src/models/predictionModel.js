const db = require('../config/database');

class PredictionModel {
  // 투표 추가
  create(predictionData) {
    return new Promise((resolve, reject) => {
      const { coin, direction, session_id } = predictionData;

      const query = `
        INSERT INTO predictions (coin, direction, session_id)
        VALUES (?, ?, ?)
      `;

      db.run(query, [coin, direction, session_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...predictionData });
        }
      });
    });
  }

  // 세션별 투표 여부 확인
  findBySession(coin, session_id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM predictions
        WHERE coin = ? AND session_id = ?
        AND datetime(created_at) >= datetime('now', '-24 hours')
        ORDER BY created_at DESC
        LIMIT 1
      `;

      db.get(query, [coin, session_id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 코인별 투표 통계 조회
  getStats(coin) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          direction,
          COUNT(*) as count
        FROM predictions
        WHERE coin = ?
        AND datetime(created_at) >= datetime('now', '-24 hours')
        GROUP BY direction
      `;

      db.all(query, [coin], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const stats = {
            coin,
            up: 0,
            down: 0,
            total: 0
          };

          rows.forEach(row => {
            if (row.direction === 'UP') {
              stats.up = row.count;
            } else if (row.direction === 'DOWN') {
              stats.down = row.count;
            }
            stats.total += row.count;
          });

          resolve(stats);
        }
      });
    });
  }

  // 모든 코인의 투표 통계
  getAllStats() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          coin,
          direction,
          COUNT(*) as count
        FROM predictions
        WHERE datetime(created_at) >= datetime('now', '-24 hours')
        GROUP BY coin, direction
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const statsMap = {};

          rows.forEach(row => {
            if (!statsMap[row.coin]) {
              statsMap[row.coin] = { coin: row.coin, up: 0, down: 0, total: 0 };
            }
            if (row.direction === 'UP') {
              statsMap[row.coin].up = row.count;
            } else if (row.direction === 'DOWN') {
              statsMap[row.coin].down = row.count;
            }
            statsMap[row.coin].total += row.count;
          });

          resolve(Object.values(statsMap));
        }
      });
    });
  }

  // 오래된 투표 삭제
  deleteOld(days = 7) {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM predictions
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

module.exports = new PredictionModel();
