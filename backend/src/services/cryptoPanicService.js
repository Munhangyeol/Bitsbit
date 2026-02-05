const axios = require('axios');
const { CRYPTOCOMPARE_API_URL, NEWS_REFRESH_INTERVAL, SUPPORTED_COINS } = require('../config/constants');
const newsModel = require('../models/newsModel');
const sentimentService = require('./sentimentService');

class CryptoNewsService {
  constructor() {
    this.refreshInterval = null;
  }

  async fetchNews(coin) {
    try {
      const coinData = SUPPORTED_COINS[coin];
      if (!coinData) {
        throw new Error(`Unsupported coin: ${coin}`);
      }

      const response = await axios.get(`${CRYPTOCOMPARE_API_URL}/news/`, {
        params: {
          categories: coinData.newsCategory,
          lang: 'EN'
        }
      });

      const newsItems = response.data.Data || [];
      const processedNews = [];

      for (const item of newsItems.slice(0, 20)) {
        try {
          const sentiment = sentimentService.analyzeSentiment(item.title);

          const newsData = {
            external_id: item.id,
            title: item.title,
            url: item.url || item.guid,
            published_at: new Date(item.published_on * 1000).toISOString(),
            source: item.source_info?.name || item.source || 'Unknown',
            coins: JSON.stringify([coinData.symbol]),
            sentiment: sentiment
          };

          await newsModel.create(newsData);
          processedNews.push(newsData);
        } catch (error) {
          if (!error.message.includes('UNIQUE constraint failed')) {
            console.error('Error processing news item:', error.message);
          }
        }
      }

      console.log(`Fetched ${processedNews.length} new news items for ${coin}`);
      return processedNews;
    } catch (error) {
      console.error(`Error fetching news for ${coin}:`, error.message);
      throw new Error(`Failed to fetch news for ${coin}`);
    }
  }

  async refreshAllNews() {
    console.log('Starting news refresh...');

    for (const coin of Object.keys(SUPPORTED_COINS)) {
      try {
        await this.fetchNews(coin);
        await sentimentService.calculateTrend(coin);
      } catch (error) {
        console.error(`Error refreshing news for ${coin}:`, error.message);
      }
    }

    console.log('News refresh completed');
  }

  startAutoRefresh() {
    console.log(`Starting auto-refresh with interval: ${NEWS_REFRESH_INTERVAL / 1000} seconds`);

    this.refreshAllNews();

    this.refreshInterval = setInterval(() => {
      this.refreshAllNews();
    }, NEWS_REFRESH_INTERVAL);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Auto-refresh stopped');
    }
  }
}

module.exports = new CryptoNewsService();
