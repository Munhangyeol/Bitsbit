const keywords = {
  positive: {
    high: [
      'surge', 'moon', 'bullish', 'breakout', 'rally', 'pump', 'soar', 'explode',
      'skyrocket', 'parabolic', 'ath', 'all-time high', 'record high', 'halving', 'etf approval',
      'institutional adoption', 'mainstream adoption'
    ],
    medium: [
      'rise', 'up', 'increase', 'growth', 'adoption', 'gain', 'jump', 'climb',
      'accumulate', 'bullrun', 'uptrend', 'outperform', 'upgrade', 'partnership',
      'integration', 'launch', 'listing', 'defi', 'staking', 'reward'
    ],
    low: [
      'green', 'positive', 'buy', 'recover', 'support', 'resilient',
      'stable', 'confidence', 'interest', 'nft', 'innovation'
    ]
  },
  negative: {
    high: [
      'crash', 'dump', 'plunge', 'collapse', 'hack', 'scam', 'fraud',
      'exploit', 'rug pull', 'ponzi', 'bankrupt', 'insolvency', 'ban',
      'crackdown', 'seizure', 'money laundering', 'sanction'
    ],
    medium: [
      'fall', 'drop', 'decline', 'down', 'sell', 'loss', 'dip',
      'correction', 'bearish', 'downtrend', 'underperform', 'vulnerability',
      'delay', 'fork', 'regulatory', 'lawsuit', 'investigation', 'fine'
    ],
    low: [
      'red', 'negative', 'concern', 'warning', 'risk', 'uncertainty',
      'volatile', 'fear', 'doubt', 'controversy', 'criticism'
    ]
  }
};

const weights = {
  high: 3,
  medium: 2,
  low: 1
};

// 부정어: 이 단어 바로 앞에 긍정 키워드가 오면 점수를 반전
const negators = ['not', 'no', 'never', 'without', 'despite', 'fails to', 'unable to'];

module.exports = {
  keywords,
  weights,
  negators
};
