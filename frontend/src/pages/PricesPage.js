import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import PriceCard from '../components/PriceCard';
import './PricesPage.css';

function PricesPage() {
  const [prices, setPrices] = useState([]);
  const [trends, setTrends] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const elementsRef = useRef([]);

  const fetchPrices = async (retryCount = 0) => {
    try {
      const response = await api.getPrices();

      // 백엔드 API가 객체를 반환하므로 배열로 변환
      const pricesData = response.data;

      // 데이터 유효성 검사
      if (!pricesData || typeof pricesData !== 'object') {
        throw new Error('Invalid data format');
      }

      const pricesArray = Object.entries(pricesData).map(([coinId, data]) => ({
        id: coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId === 'bitcoin' ? 'BTC' : coinId === 'ethereum' ? 'ETH' : 'SOL',
        current_price: data.price,
        price_change_percentage_24h: data.change_24h
      }));

      // 가격이 0이 아닌 경우에만 업데이트 (초기 로딩 제외)
      if (pricesArray.some(p => p.current_price > 0)) {
        setPrices(pricesArray);
        setLastUpdate(new Date());
        setError(null);
      } else if (prices.length === 0) {
        // 초기 로딩 시에는 0이어도 설정
        setPrices(pricesArray);
      }
    } catch (err) {
      console.error('가격 로딩 오류:', err);

      // 최대 3번까지 재시도
      if (retryCount < 3) {
        console.log(`재시도 중... (${retryCount + 1}/3)`);
        setTimeout(() => {
          fetchPrices(retryCount + 1);
        }, 2000); // 2초 후 재시도
      } else {
        setError('가격 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
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
      console.error('트렌드 로딩 오류:', err);
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

  const formatUpdateTime = () => {
    if (!lastUpdate) return '';
    return lastUpdate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>가격 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="prices-page">
      <div className="page-container">
        <header
          className="page-header scroll-reveal"
          ref={(el) => elementsRef.current[0] = el}
        >
          <div>
            <h1>실시간 암호화폐 가격</h1>
            <p>주요 암호화폐의 실시간 가격 추적</p>
          </div>
          {lastUpdate && (
            <div className="update-badge">
              <span className="update-dot"></span>
              <span>마지막 업데이트: {formatUpdateTime()}</span>
            </div>
          )}
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchPrices} className="retry-btn">
              재시도
            </button>
          </div>
        )}

        <div className="price-grid">
          {prices.map((coin, index) => (
            <div
              key={coin.id}
              className="scroll-reveal"
              ref={(el) => elementsRef.current[1 + index] = el}
            >
              <PriceCard
                name={coin.name}
                symbol={coin.symbol}
                price={coin.current_price}
                change24h={coin.price_change_percentage_24h}
                trend={trends[coin.id]?.trend}
              />
            </div>
          ))}
        </div>

        <div
          className="page-info scroll-reveal"
          ref={(el) => elementsRef.current[4] = el}
        >
          <p>
            가격은 30초마다 자동으로 업데이트됩니다. CoinGecko API에서 데이터를 제공합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PricesPage;
