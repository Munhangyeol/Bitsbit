const express = require('express');
const router = express.Router();
const trendModel = require('../models/trendModel');

router.get('/', async (req, res) => {
  try {
    const trends = await trendModel.findLatest();
    res.json(trends);
  } catch (error) {
    console.error('Error in /api/trends:', error.message);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

module.exports = router;
