import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import TrendIndicator from '../components/TrendIndicator';
import './TrendsPage.css';

function TrendsPage() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const elementsRef = useRef([]);

  const fetchTrends = async () => {
    try {
      const response = await api.getTrends();
      setTrends(response.data);
      setError(null);
    } catch (err) {
      setError('트렌드 데이터를 불러오는데 실패했습니다.');
      console.error('트렌드 로딩 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(fetchTrends, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          entry.target.classList.remove('animate-in');
        }
      });
    }, observerOptions);

    const currentElements = elementsRef.current;

    currentElements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      currentElements.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>시장 트렌드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="trends-page">
      <div className="page-container">
        <header
          className="page-header scroll-reveal"
          ref={(el) => elementsRef.current[0] = el}
        >
          <div>
            <h1>시장 트렌드 분석</h1>
            <p>암호화폐 뉴스의 AI 기반 감성 분석</p>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchTrends} className="retry-btn">
              재시도
            </button>
          </div>
        )}

        <div
          className="info-card scroll-reveal"
          ref={(el) => elementsRef.current[1] = el}
        >
          <h3>감성 분석 작동 원리</h3>
          <p>
            AI가 고급 키워드 감지를 사용하여 수천 개의 암호화폐 뉴스 기사를 분석합니다.
            각 기사는 시장 관련 용어를 기반으로 긍정, 부정 또는 중립으로 분류됩니다.
            전체 트렌드(UP, DOWN 또는 NEUTRAL)는 최근 뉴스 기사의 감성 분포에서 계산됩니다.
          </p>
        </div>

        <div className="trend-grid">
          {trends.map((trend, index) => (
            <div
              key={trend.coin}
              className="scroll-reveal"
              ref={(el) => elementsRef.current[2 + index] = el}
            >
              <TrendIndicator
                coin={trend.coin}
                trend={trend.trend}
                score={trend.score}
                positive={trend.positive_count}
                negative={trend.negative_count}
                neutral={trend.neutral_count}
              />
            </div>
          ))}
        </div>

        <div
          className="page-info scroll-reveal"
          ref={(el) => elementsRef.current[5] = el}
        >
          <p>
            트렌드 데이터는 5분마다 업데이트됩니다. CryptoPanic API의 최신 뉴스를 기반으로 분석합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrendsPage;
