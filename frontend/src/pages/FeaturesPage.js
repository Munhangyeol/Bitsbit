import React from 'react';
import VotingCard from '../components/VotingCard';
import PriceAlert from '../components/PriceAlert';
import { useAppContext } from '../context/AppContext';
import './FeaturesPage.css';

function FeaturesPage() {
  const { prices, pricesLoading, sessionId } = useAppContext();

  if (pricesLoading) {
    return (
      <div className="features-loading">
        <div className="loading-spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="features-page">
      <header className="features-header">
        <h1>커뮤니티 기능</h1>
        <p>가격 예측 투표 및 알림 설정</p>
      </header>

      <section className="voting-section">
        <div className="section-header">
          <h2>가격 예측 투표</h2>
          <span className="section-badge">Vote</span>
        </div>
        <p className="section-description">
          24시간 후 코인 가격이 오를지 내릴지 예측해보세요. 하루에 코인당 1회 투표 가능합니다.
        </p>
        <div className="voting-grid">
          {prices.map(coin => (
            <VotingCard
              key={coin.id}
              coin={coin.id}
              coinName={coin.name}
              sessionId={sessionId}
            />
          ))}
        </div>
      </section>

      <section className="alert-section">
        <div className="section-header">
          <h2>가격 알림 설정</h2>
          <span className="section-badge">Alert</span>
        </div>
        <p className="section-description">
          목표 가격을 설정하면 해당 가격에 도달했을 때 알림을 받을 수 있습니다.
        </p>
        <PriceAlert sessionId={sessionId} currentPrices={prices} />
      </section>

      <section className="current-prices">
        <div className="section-header">
          <h2>현재 가격</h2>
          <span className="section-badge live">Live</span>
        </div>
        <div className="prices-grid">
          {prices.map(coin => (
            <div key={coin.id} className="price-item">
              <span className="coin-name">{coin.name}</span>
              <span className="coin-price">
                ${coin.current_price?.toLocaleString()}
              </span>
              <span className={`coin-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;
