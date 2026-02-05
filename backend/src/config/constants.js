require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  COINGECKO_API_URL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
  CRYPTOCOMPARE_API_URL: process.env.CRYPTOCOMPARE_API_URL || 'https://min-api.cryptocompare.com/data/v2',
  DATABASE_PATH: process.env.DATABASE_PATH || './database/crypto_dashboard.db',
  NEWS_REFRESH_INTERVAL: parseInt(process.env.NEWS_REFRESH_INTERVAL) || 300000, // 5 minutes
  SUPPORTED_COINS: {
    bitcoin: { id: 'bitcoin', symbol: 'BTC', newsCategory: 'BTC' },
    ethereum: { id: 'ethereum', symbol: 'ETH', newsCategory: 'ETH' },
    solana: { id: 'solana', symbol: 'SOL', newsCategory: 'Altcoin' }
  }
};
