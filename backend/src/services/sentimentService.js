const { keywords, weights } = require('../utils/keywords');
const { SUPPORTED_COINS } = require('../config/constants');
const newsModel = require('../models/newsModel');
const trendModel = require('../models/trendModel');

class SentimentService {
  analyzeSentiment(title) {
    if (!title) return 'neutral';

    const lowerTitle = title.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    for (const [level, keywordList] of Object.entries(keywords.positive)) {
      for (const keyword of keywordList) {
        if (lowerTitle.includes(keyword)) {
          positiveScore += weights[level];
        }
      }
    }

    for (const [level, keywordList] of Object.entries(keywords.negative)) {
      for (const keyword of keywordList) {
        if (lowerTitle.includes(keyword)) {
          negativeScore += weights[level];
        }
      }
    }

    if (positiveScore > negativeScore) {
      return 'positive';
    } else if (negativeScore > positiveScore) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  async calculateTrend(coin) {
    try {
      const coinData = SUPPORTED_COINS[coin];
      if (!coinData) {
        throw new Error(`Unsupported coin: ${coin}`);
      }

      const coinSymbol = coinData.symbol;
      const recentNews = await newsModel.findRecent(24, coinSymbol);

      if (!recentNews || recentNews.length === 0) {
        console.log(`No recent news found for ${coin} (${coinSymbol})`);
        return null;
      }

      let positiveCount = 0;
      let negativeCount = 0;
      let neutralCount = 0;
      let positiveScore = 0;
      let negativeScore = 0;

      for (const news of recentNews) {
        const sentiment = news.sentiment || 'neutral';
        const lowerTitle = news.title.toLowerCase();

        let newsPositiveScore = 0;
        let newsNegativeScore = 0;

        for (const [level, keywordList] of Object.entries(keywords.positive)) {
          for (const keyword of keywordList) {
            if (lowerTitle.includes(keyword)) {
              newsPositiveScore += weights[level];
            }
          }
        }

        for (const [level, keywordList] of Object.entries(keywords.negative)) {
          for (const keyword of keywordList) {
            if (lowerTitle.includes(keyword)) {
              newsNegativeScore += weights[level];
            }
          }
        }

        if (sentiment === 'positive') {
          positiveCount++;
          positiveScore += newsPositiveScore || 1;
        } else if (sentiment === 'negative') {
          negativeCount++;
          negativeScore += newsNegativeScore || 1;
        } else {
          neutralCount++;
        }
      }

      const totalScore = positiveScore + negativeScore;
      let normalizedScore = 0;

      if (totalScore > 0) {
        normalizedScore = (positiveScore - negativeScore) / totalScore;
      }

      let trend = 'NEUTRAL';
      if (normalizedScore > 0.15) {
        trend = 'UP';
      } else if (normalizedScore < -0.15) {
        trend = 'DOWN';
      }

      const trendData = {
        coin,
        trend,
        score: normalizedScore,
        positive_count: positiveCount,
        negative_count: negativeCount,
        neutral_count: neutralCount
      };

      await trendModel.create(trendData);

      console.log(`Trend calculated for ${coin}: ${trend} (score: ${normalizedScore.toFixed(2)})`);
      return trendData;
    } catch (error) {
      console.error(`Error calculating trend for ${coin}:`, error.message);
      throw error;
    }
  }
}

module.exports = new SentimentService();
