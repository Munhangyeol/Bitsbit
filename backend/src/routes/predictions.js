const express = require('express');
const router = express.Router();
const predictionModel = require('../models/predictionModel');

// 모든 코인의 투표 통계 조회
router.get('/', async (req, res) => {
  try {
    const stats = await predictionModel.getAllStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in GET /api/predictions:', error.message);
    res.status(500).json({ error: 'Failed to fetch prediction stats' });
  }
});

// 특정 코인의 투표 통계 조회
router.get('/:coin', async (req, res) => {
  try {
    const { coin } = req.params;
    const stats = await predictionModel.getStats(coin);
    res.json(stats);
  } catch (error) {
    console.error('Error in GET /api/predictions/:coin:', error.message);
    res.status(500).json({ error: 'Failed to fetch prediction stats' });
  }
});

// 투표하기
router.post('/', async (req, res) => {
  try {
    const { coin, direction, session_id } = req.body;

    if (!coin || !direction || !session_id) {
      return res.status(400).json({ error: 'coin, direction, session_id are required' });
    }

    if (!['UP', 'DOWN'].includes(direction)) {
      return res.status(400).json({ error: 'direction must be UP or DOWN' });
    }

    // 이미 투표했는지 확인
    const existing = await predictionModel.findBySession(coin, session_id);
    if (existing) {
      return res.status(400).json({
        error: 'Already voted for this coin today',
        existingVote: existing
      });
    }

    const prediction = await predictionModel.create({ coin, direction, session_id });
    const stats = await predictionModel.getStats(coin);

    res.status(201).json({
      message: 'Vote recorded successfully',
      prediction,
      stats
    });
  } catch (error) {
    console.error('Error in POST /api/predictions:', error.message);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// 세션의 투표 확인
router.get('/check/:coin/:session_id', async (req, res) => {
  try {
    const { coin, session_id } = req.params;
    const vote = await predictionModel.findBySession(coin, session_id);
    res.json({ hasVoted: !!vote, vote });
  } catch (error) {
    console.error('Error in GET /api/predictions/check:', error.message);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
});

module.exports = router;
