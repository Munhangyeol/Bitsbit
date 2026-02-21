const { keywords, weights, negators } = require('../utils/keywords');
const { SUPPORTED_COINS } = require('../config/constants');
const newsModel = require('../models/newsModel');
const trendModel = require('../models/trendModel');

/**
 * 단어 경계(\b)를 활용해 부분 일치 오탐을 방지.
 * 복합어("all-time high" 등)는 공백 포함이라 \b로 감싸도 정상 동작.
 */
function buildPattern(keyword) {
  // 특수 정규식 문자 이스케이프
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i');
}

/**
 * 텍스트에서 키워드 점수를 계산.
 * 부정어 뒤에 오는 긍정 키워드는 점수를 반전(긍정→부정 처리).
 *
 * @returns {{ positiveScore: number, negativeScore: number }}
 */
function computeScores(text) {
  if (!text) return { positiveScore: 0, negativeScore: 0 };
  const lower = text.toLowerCase();

  let positiveScore = 0;
  let negativeScore = 0;

  // 긍정 키워드 스캔
  for (const [level, keywordList] of Object.entries(keywords.positive)) {
    for (const keyword of keywordList) {
      const pattern = buildPattern(keyword);
      const match = pattern.exec(lower);
      if (match) {
        // 매치 위치 앞의 텍스트에서 부정어 확인 (최대 5단어 이내)
        const before = lower.slice(Math.max(0, match.index - 40), match.index);
        const isNegated = negators.some(neg => {
          const negPattern = new RegExp(`\\b${neg}\\b\\s*$`);
          return negPattern.test(before.trimEnd());
        });

        if (isNegated) {
          negativeScore += weights[level]; // 긍정이 부정됨 → 부정 점수 추가
        } else {
          positiveScore += weights[level];
        }
      }
    }
  }

  // 부정 키워드 스캔 (부정어 처리 없이 단순 합산)
  for (const [level, keywordList] of Object.entries(keywords.negative)) {
    for (const keyword of keywordList) {
      const pattern = buildPattern(keyword);
      if (pattern.test(lower)) {
        negativeScore += weights[level];
      }
    }
  }

  return { positiveScore, negativeScore };
}

class SentimentService {
  analyzeSentiment(title) {
    if (!title) return 'neutral';

    const { positiveScore, negativeScore } = computeScores(title);

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
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
        const { positiveScore: ps, negativeScore: ns } = computeScores(news.title);

        if (sentiment === 'positive') {
          positiveCount++;
          positiveScore += ps || 1;
        } else if (sentiment === 'negative') {
          negativeCount++;
          negativeScore += ns || 1;
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
