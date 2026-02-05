const express = require('express');
const router = express.Router();
const coinGeckoService = require('../services/coinGeckoService');

router.get('/', async (req, res) => {
  try {
    const prices = await coinGeckoService.fetchPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error in /api/prices:', error.message);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

module.exports = router;
