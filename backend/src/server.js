require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/constants');
const db = require('./config/database');

const pricesRouter = require('./routes/prices');
const newsRouter = require('./routes/news');
const trendsRouter = require('./routes/trends');
const predictionsRouter = require('./routes/predictions');
const alertsRouter = require('./routes/alerts');

const cryptoPanicService = require('./services/cryptoPanicService');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/prices', pricesRouter);
app.use('/api/news', newsRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/alerts', alertsRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Crypto Dashboard API',
    endpoints: {
      prices: '/api/prices',
      news: '/api/news?coin=btc&limit=10',
      trends: '/api/trends',
      refreshNews: 'POST /api/news/refresh',
      predictions: '/api/predictions',
      createPrediction: 'POST /api/predictions',
      alerts: '/api/alerts/:session_id',
      createAlert: 'POST /api/alerts',
      checkAlerts: '/api/alerts/check/:session_id'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);

  cryptoPanicService.startAutoRefresh();
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  cryptoPanicService.stopAutoRefresh();
  db.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});

module.exports = app;
