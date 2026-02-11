import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import PriceCard from './PriceCard';
import TrendIndicator from './TrendIndicator';
import NewsFeed from './NewsFeed';
import VotingCard from './VotingCard';
import PriceAlert from './PriceAlert';
import './Dashboard.css';

function Dashboard() {
  const [prices, setPrices] = useState([]);
  const [trends, setTrends] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('crypto_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => {
      localStorage.setItem('crypto_dark_mode', String(!prev));
      return !prev;
    });
  };

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
      setPrices(response.data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError('가격 정보를 불러오는데 실패했습니다.');
      console.error('가격 로드 오류:', err);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await api.getTrends();
      const trendsMap = {};
      response.data.forEach(t => {
        trendsMap[t.coin] = t;
      });
      setTrends(trendsMap);
    } catch (err) {
      console.error('트렌드 로드 오류:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPrices(), fetchTrends()]);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrices();
      fetchTrends();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatUpdateTime = () => {
    if (!lastUpdate) return '';
    return lastUpdate.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>대시보드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <span>📈</span>
            </div>
            <div className="header-title">
              <h1>Crypto Dashboard</h1>
              <p>실시간 암호화폐 트렌드 분석</p>
            </div>
          </div>
          <div className="header-right">
            {lastUpdate && (
              <div className="last-update">
                <span className="update-indicator"></span>
                <span className="update-time">{formatUpdateTime()}</span>
              </div>
            )}
            <button
              onClick={fetchPrices}
              className="header-btn"
              title="새로고침"
              aria-label="새로고침"
            >
              ↻
            </button>
            <button
              onClick={toggleDarkMode}
              className="header-btn"
              title="테마 전환"
              aria-label="테마 전환"
            >
              {isDark ? '☀' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchPrices} className="error-retry">
            재시도
          </button>
        </div>
      )}

      <section className="price-section">
        <div className="section-header">
          <h2>실시간 가격</h2>
          <span className="section-badge">Live</span>
        </div>
        <div className="price-grid">
          {prices.map(coin => (
            <PriceCard
              key={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              price={coin.current_price}
              change24h={coin.price_change_percentage_24h}
              trend={trends[coin.id]?.trend}
            />
          ))}
        </div>
      </section>

      <section className="trend-section">
        <div className="section-header">
          <h2>시장 트렌드</h2>
          <span className="section-subtitle">뉴스 기반 감성 분석</span>
        </div>
        <div className="trend-grid">
          {Object.values(trends).map(trend => (
            <TrendIndicator
              key={trend.coin}
              coin={trend.coin}
              trend={trend.trend}
              score={trend.score}
              positive={trend.positive_count}
              negative={trend.negative_count}
              neutral={trend.neutral_count}
            />
          ))}
        </div>
      </section>

      <section className="voting-section">
        <div className="section-header">
          <h2>가격 예측 투표</h2>
          <span className="section-subtitle">커뮤니티 예측</span>
        </div>
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
          <h2>가격 알림</h2>
          <span className="section-subtitle">목표 가격 도달 시 알림</span>
        </div>
        <PriceAlert sessionId={sessionId} currentPrices={prices} />
      </section>

      <section className="news-section">
        <div className="section-header">
          <h2>최신 뉴스</h2>
          <span className="section-subtitle">감성 분석 포함</span>
        </div>
        <NewsFeed />
      </section>

      <footer className="dashboard-footer">
        <p>
          데이터 제공: CoinGecko & CryptoPanic |
          자동 갱신: 30초마다 |
          감성 분석: 키워드 기반
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
