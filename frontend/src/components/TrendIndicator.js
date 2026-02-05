import React from 'react';
import './TrendIndicator.css';

function TrendIndicator({ coin, trend, score, positive, negative, neutral }) {
  const trendIcon = trend === 'UP' ? '📈' : trend === 'DOWN' ? '📉' : '📊';
  const trendLabel = trend === 'UP' ? '상승 추세' : trend === 'DOWN' ? '하락 추세' : '중립 추세';
  const trendClass = trend ? trend.toLowerCase() : 'neutral';

  const coinNames = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    solana: 'Solana',
  };

  const displayName = coinNames[coin] || coin;
  const totalCount = (positive || 0) + (negative || 0) + (neutral || 0);

  const positivePercent = totalCount > 0 ? ((positive || 0) / totalCount) * 100 : 0;
  const negativePercent = totalCount > 0 ? ((negative || 0) / totalCount) * 100 : 0;
  const neutralPercent = totalCount > 0 ? ((neutral || 0) / totalCount) * 100 : 0;

  return (
    <div className={`trend-indicator trend-indicator-${trendClass}`}>
      <div className="trend-header">
        <div className="trend-coin">
          <span className="trend-icon" role="img" aria-label={trendLabel}>{trendIcon}</span>
          <h4>{displayName}</h4>
        </div>
        <div className={`trend-badge trend-badge-${trendClass}`}>
          {trend || 'NEUTRAL'}
        </div>
      </div>

      <div className="trend-score">
        <span className="score-label">감성 점수</span>
        <span className={`score-value score-${trendClass}`}>
          {score ? (score > 0 ? '+' : '') + score.toFixed(2) : '0.00'}
        </span>
      </div>

      <div className="sentiment-breakdown">
        <div className="sentiment-bar" role="progressbar" aria-label="감성 분석 비율">
          <div
            className="sentiment-segment sentiment-positive"
            style={{ width: `${positivePercent}%` }}
            title={`긍정: ${positive || 0}개`}
            aria-label={`긍정 ${positivePercent.toFixed(0)}%`}
          />
          <div
            className="sentiment-segment sentiment-neutral"
            style={{ width: `${neutralPercent}%` }}
            title={`중립: ${neutral || 0}개`}
            aria-label={`중립 ${neutralPercent.toFixed(0)}%`}
          />
          <div
            className="sentiment-segment sentiment-negative"
            style={{ width: `${negativePercent}%` }}
            title={`부정: ${negative || 0}개`}
            aria-label={`부정 ${negativePercent.toFixed(0)}%`}
          />
        </div>

        <div className="sentiment-counts">
          <span className="sentiment-count sentiment-count-positive">
            <span role="img" aria-label="긍정">😊</span> {positive || 0}
          </span>
          <span className="sentiment-count sentiment-count-neutral">
            <span role="img" aria-label="중립">😐</span> {neutral || 0}
          </span>
          <span className="sentiment-count sentiment-count-negative">
            <span role="img" aria-label="부정">😟</span> {negative || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TrendIndicator;
