const express = require('express');
const router = express.Router();
const newsModel = require('../models/newsModel');
const cryptoPanicService = require('../services/cryptoPanicService');

router.get('/', async (req, res) => {
  try {
    const { coin = 'btc', limit = 10 } = req.query;
    const coinName = coin.toLowerCase();

    const coinMap = {
      'btc': 'BTC',
      'eth': 'ETH',
      'sol': 'SOL',
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'solana': 'SOL'
    };

    const mappedCoin = coinMap[coinName] || coin.toUpperCase();

    const news = await newsModel.findByCoin(mappedCoin, parseInt(limit));

    res.json(news);
  } catch (error) {
    console.error('[NEWS API ERROR]:', error);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    await cryptoPanicService.refreshAllNews();
    res.json({ success: true, message: 'News refreshed successfully' });
  } catch (error) {
    console.error('Error in /api/news/refresh:', error.message);
    res.status(500).json({ error: 'Failed to refresh news' });
  }
});

module.exports = router;
