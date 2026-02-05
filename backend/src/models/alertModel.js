const db = require('../config/database');

class AlertModel {
  // 알림 생성
  create(alertData) {
    return new Promise((resolve, reject) => {
      const { coin, target_price, direction, session_id } = alertData;

      const query = `
        INSERT INTO alerts (coin, target_price, direction, session_id)
        VALUES (?, ?, ?, ?)
      `;

      db.run(query, [coin, target_price, direction, session_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...alertData, triggered: 0 });
        }
      });
    });
  }

  // 세션별 알림 목록 조회
  findBySession(session_id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM alerts
        WHERE session_id = ?
        ORDER BY created_at DESC
      `;

      db.all(query, [session_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 활성 알림 조회 (트리거되지 않은 알림)
  findActive(session_id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM alerts
        WHERE session_id = ? AND triggered = 0
        ORDER BY created_at DESC
      `;

      db.all(query, [session_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 알림 트리거 상태 업데이트
  markTriggered(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE alerts
        SET triggered = 1
        WHERE id = ?
      `;

      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, triggered: true });
        }
      });
    });
  }

  // 알림 삭제
  delete(id, session_id) {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM alerts
        WHERE id = ? AND session_id = ?
      `;

      db.run(query, [id, session_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedCount: this.changes });
        }
      });
    });
  }

  // 가격 도달 여부 체크
  checkAlerts(prices) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM alerts
        WHERE triggered = 0
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const triggeredAlerts = [];

          rows.forEach(alert => {
            const price = prices.find(p => p.id === alert.coin);
            if (price) {
              const currentPrice = price.current_price;
              const shouldTrigger =
                (alert.direction === 'ABOVE' && currentPrice >= alert.target_price) ||
                (alert.direction === 'BELOW' && currentPrice <= alert.target_price);

              if (shouldTrigger) {
                triggeredAlerts.push({
                  ...alert,
                  currentPrice
                });
              }
            }
          });

          resolve(triggeredAlerts);
        }
      });
    });
  }

  // 오래된 알림 삭제
  deleteOld(days = 30) {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM alerts
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

module.exports = new AlertModel();
