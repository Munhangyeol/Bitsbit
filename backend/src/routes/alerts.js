const express = require('express');
const router = express.Router();
const alertModel = require('../models/alertModel');
const coinGeckoService = require('../services/coinGeckoService');
const { validateCoin, validateTargetPrice } = require('../middleware/validate');

// 트리거된 알림 확인 (/:session_id 보다 먼저 선언해야 라우트 충돌 방지)
router.get('/check/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;

    // 현재 가격 조회 (객체 형태: { bitcoin: { price, change_24h }, ... })
    const prices = await coinGeckoService.fetchPrices();

    // 활성 알림 확인
    const activeAlerts = await alertModel.findActive(session_id);

    const triggeredAlerts = [];

    for (const alert of activeAlerts) {
      const priceData = prices[alert.coin];
      if (priceData) {
        const currentPrice = priceData.price;
        const shouldTrigger =
          (alert.direction === 'ABOVE' && currentPrice >= alert.target_price) ||
          (alert.direction === 'BELOW' && currentPrice <= alert.target_price);

        if (shouldTrigger) {
          await alertModel.markTriggered(alert.id);
          triggeredAlerts.push({
            ...alert,
            currentPrice,
            triggered: 1
          });
        }
      }
    }

    res.json({
      triggered: triggeredAlerts,
      active: activeAlerts.filter(a => !triggeredAlerts.find(t => t.id === a.id))
    });
  } catch (error) {
    console.error('Error in GET /api/alerts/check:', error.message);
    res.status(500).json({ error: 'Failed to check alerts' });
  }
});

// 세션별 알림 목록 조회
router.get('/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;
    const alerts = await alertModel.findBySession(session_id);
    res.json(alerts);
  } catch (error) {
    console.error('Error in GET /api/alerts:', error.message);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// 알림 생성
router.post('/', validateCoin('body'), validateTargetPrice, async (req, res) => {
  try {
    const { coin, target_price, direction, session_id } = req.body;

    // coin validated by validateCoin middleware, target_price by validateTargetPrice
    if (!direction || !session_id) {
      return res.status(400).json({
        error: 'direction and session_id are required'
      });
    }

    if (!['ABOVE', 'BELOW'].includes(direction)) {
      return res.status(400).json({ error: 'direction must be ABOVE or BELOW' });
    }

    const alert = await alertModel.create({ coin, target_price, direction, session_id });

    res.status(201).json({
      message: 'Alert created successfully',
      alert
    });
  } catch (error) {
    console.error('Error in POST /api/alerts:', error.message);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// 알림 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    const result = await alertModel.delete(parseInt(id), session_id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Alert not found or unauthorized' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/alerts:', error.message);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
