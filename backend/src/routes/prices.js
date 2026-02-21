const express = require('express');
const router = express.Router();
const coinGeckoService = require('../services/coinGeckoService');
const priceHistoryModel = require('../models/priceHistoryModel');
const { SUPPORTED_COINS } = require('../config/constants');

const VALID_RANGES = ['1d', '7d', '30d'];
const COIN_IDS = Object.keys(SUPPORTED_COINS);

// GET /api/prices
router.get('/', async (req, res) => {
  try {
    const prices = await coinGeckoService.fetchPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error in /api/prices:', error.message);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// GET /api/prices/history?coin=bitcoin&range=1d
router.get('/history', async (req, res) => {
  try {
    const { coin, range = '1d' } = req.query;

    if (!coin || !COIN_IDS.includes(coin)) {
      return res.status(400).json({
        error: `coin must be one of: ${COIN_IDS.join(', ')}`
      });
    }

    if (!VALID_RANGES.includes(range)) {
      return res.status(400).json({
        error: `range must be one of: ${VALID_RANGES.join(', ')}`
      });
    }

    const history = await priceHistoryModel.findHistory(coin, range);
    res.json(history);
  } catch (error) {
    console.error('Error in GET /api/prices/history:', error.message);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

module.exports = router;
