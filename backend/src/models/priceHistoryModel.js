const db = require('../config/database');

/**
 * 가격 데이터 기록
 * @param {string} coin - 코인 ID (bitcoin, ethereum, solana)
 * @param {number} price - 현재 가격
 * @param {number} change_24h - 24시간 변동률
 */
function record(coin, price, change_24h) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO price_history (coin, price, change_24h) VALUES (?, ?, ?)`,
      [coin, price, change_24h ?? 0],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

/**
 * 특정 코인의 가격 이력 조회
 * @param {string} coin - 코인 ID
 * @param {string} range - '1d' | '7d' | '30d'
 * @returns {Promise<Array>}
 */
function findHistory(coin, range = '1d') {
  const rangeMap = { '1d': 1, '7d': 7, '30d': 30 };
  const days = rangeMap[range] ?? 1;

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT coin, price, change_24h, recorded_at
       FROM price_history
       WHERE coin = ?
         AND recorded_at >= datetime('now', ?)
       ORDER BY recorded_at ASC`,
      [coin, `-${days} days`],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/**
 * 30일 이상 된 오래된 데이터 삭제
 */
function deleteOld() {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM price_history WHERE recorded_at < datetime('now', '-30 days')`,
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

module.exports = { record, findHistory, deleteOld };
