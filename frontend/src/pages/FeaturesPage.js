import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import VotingCard from '../components/VotingCard';
import PriceAlert from '../components/PriceAlert';
import './FeaturesPage.css';

function FeaturesPage() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 세션 ID 생성 (브라우저별 고유)
  const sessionId = useMemo(() => {
    let id = localStorage.getItem('crypto_session_id');
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('crypto_session_id', id);
    }
    return id;
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await api.getPrices();
      // 배열인지 확인, 아니면 객체를 배열로 변환
      if (Array.isArray(response.data)) {
        setPrices(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // 객체를 배열로 변환 { bitcoin: {...}, ethereum: {...} } -> [{id: 'bitcoin', ...}, ...]
        const pricesArray = Object.entries(response.data).map(([id, data]) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          symbol: id === 'bitcoin' ? 'BTC' : id === 'ethereum' ? 'ETH' : 'SOL',
          current_price: data.price,
          price_change_percentage_24h: data.change_24h
        }));
        setPrices(pricesArray);
      } else {
        console.error('가격 데이터 형식 오류:', response.data);
        setPrices([]);
      }
    } catch (err) {
      console.error('가격 로드 오류:', err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
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
          {Array.isArray(prices) && prices.map(coin => (
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
          {Array.isArray(prices) && prices.map(coin => (
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
