import React from 'react';
import './PriceCard.css';

function PriceCard({ name, symbol, price, change24h, trend }) {
  const changeClass = change24h >= 0 ? 'positive' : 'negative';
  const trendIcon = trend === 'UP' ? '↑' : trend === 'DOWN' ? '↓' : '−';
  const trendClass = trend ? trend.toLowerCase() : 'neutral';

  return (
    <div className="price-card">
      <div className="price-card-header">
        <h3>{name}</h3>
        <span className="symbol">{symbol?.toUpperCase()}</span>
      </div>

      <div className="price-card-body">
        <div className="price">
          ${price ? price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) : '0.00'}
        </div>

        <div className={`change ${changeClass}`}>
          {change24h >= 0 ? '+' : ''}{change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
      </div>

      {trend && (
        <div className="price-card-footer">
          <span className={`trend trend-${trendClass}`}>
            {trendIcon} {trend}
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceCard;
