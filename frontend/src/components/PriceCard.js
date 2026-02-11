import React from 'react';
import './PriceCard.css';

function PriceCard({ name, symbol, price, change24h, trend }) {
  const isPositive = change24h >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const trendIcon = trend === 'UP' ? '↑' : trend === 'DOWN' ? '↓' : '−';
  const trendClass = trend ? trend.toLowerCase() : 'neutral';

  const getCoinGradientClass = (sym) => {
    switch (sym?.toUpperCase()) {
      case 'BTC': return 'avatar-btc';
      case 'ETH': return 'avatar-eth';
      case 'SOL': return 'avatar-sol';
      default: return 'avatar-default';
    }
  };

  return (
    <div className="price-card">
      <div className="price-card-header">
        <div className="coin-info">
          <div className={`coin-avatar ${getCoinGradientClass(symbol)}`}>
            {symbol?.toUpperCase()[0]}
          </div>
          <div className="coin-name-group">
            <h3>{name}</h3>
            <span className="symbol">{symbol?.toUpperCase()}</span>
          </div>
        </div>
        <div className={`change-badge ${changeClass}`}>
          {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{change24h ? change24h.toFixed(2) : '0.00'}%
        </div>
      </div>

      <div className="price-card-body">
        <div className="price">
          ${price ? price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) : '0.00'}
        </div>
      </div>

      {trend && (
        <div className="price-card-footer">
          <span className={`trend trend-${trendClass}`}>
            {trendIcon} {trend === 'UP' ? '강세' : trend === 'DOWN' ? '약세' : '중립'}
          </span>
        </div>
      )}
    </div>
  );
}

export default PriceCard;
