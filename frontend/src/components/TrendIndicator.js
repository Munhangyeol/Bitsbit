import React from 'react';
import './TrendIndicator.css';

function TrendIndicator({ coin, trend, score, positive, negative, neutral }) {
  const trendClass = trend ? trend.toLowerCase() : 'neutral';
  const trendLabel = trend === 'UP' ? '강세' : trend === 'DOWN' ? '약세' : '중립';

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

  // Convert score (-1.0 ~ 1.0) to bar width (0% ~ 100%)
  const scoreBarWidth = Math.min(Math.max(((score || 0) + 1) / 2 * 100, 0), 100);

  return (
    <div className={`trend-indicator trend-indicator-${trendClass}`}>
      <div className="trend-header">
        <h4>{displayName}</h4>
        <span className={`trend-badge trend-badge-${trendClass}`}>
          {trend === 'UP' ? '▲' : trend === 'DOWN' ? '▼' : '−'} {trend || 'NEUTRAL'}
        </span>
      </div>

      <div className="trend-sentiment-row">
        <span className="sentiment-label">시장 심리</span>
        <span className={`sentiment-value sentiment-value-${trendClass}`}>{trendLabel}</span>
      </div>

      {/* Score bar (Main Dashboard style) */}
      <div className="score-bar-track" role="progressbar" aria-label="감성 점수">
        <div
          className={`score-bar-fill score-bar-${trendClass}`}
          style={{ width: `${scoreBarWidth}%` }}
        />
      </div>
      <div className="score-bar-labels">
        <span>-1</span>
        <span className="score-number">{score ? (score > 0 ? '+' : '') + score.toFixed(2) : '0.00'}</span>
        <span>+1</span>
      </div>

      {/* Sentiment breakdown */}
      <div className="sentiment-breakdown">
        <div className="sentiment-bar" aria-label="감성 분포">
          <div
            className="sentiment-segment sentiment-positive"
            style={{ width: `${positivePercent}%` }}
            title={`긍정: ${positive || 0}개`}
          />
          <div
            className="sentiment-segment sentiment-neutral-seg"
            style={{ width: `${neutralPercent}%` }}
            title={`중립: ${neutral || 0}개`}
          />
          <div
            className="sentiment-segment sentiment-negative"
            style={{ width: `${negativePercent}%` }}
            title={`부정: ${negative || 0}개`}
          />
        </div>

        <div className="sentiment-counts">
          <span className="sentiment-count positive-count">긍정 {positive || 0}</span>
          <span className="sentiment-count neutral-count">중립 {neutral || 0}</span>
          <span className="sentiment-count negative-count">부정 {negative || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default TrendIndicator;
