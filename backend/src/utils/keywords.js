const keywords = {
  positive: {
    high: ['surge', 'moon', 'bullish', 'breakout', 'rally', 'pump', 'soar', 'explode'],
    medium: ['rise', 'up', 'increase', 'growth', 'adoption', 'gain', 'jump', 'climb'],
    low: ['green', 'positive', 'buy', 'uptrend', 'recover']
  },
  negative: {
    high: ['crash', 'dump', 'plunge', 'collapse', 'hack', 'scam', 'fraud'],
    medium: ['fall', 'drop', 'decline', 'down', 'sell', 'loss', 'dip'],
    low: ['red', 'negative', 'concern', 'warning', 'risk']
  }
};

const weights = {
  high: 3,
  medium: 2,
  low: 1
};

module.exports = {
  keywords,
  weights
};
