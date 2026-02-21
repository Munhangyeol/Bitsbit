import React, { useEffect, useRef } from 'react';
import PriceCard from '../components/PriceCard';
import PriceChart from '../components/PriceChart';
import { useAppContext } from '../context/AppContext';
import './PricesPage.css';

function PricesPage() {
  const { prices, trends, pricesLoading } = useAppContext();
  const elementsRef = useRef([]);

  const formatUpdateTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

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
  }, [pricesLoading]);

  if (pricesLoading) {
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
          <div className="update-badge">
            <span className="update-dot"></span>
            <span>마지막 업데이트: {formatUpdateTime()}</span>
          </div>
        </header>

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
              <PriceChart coin={coin.id} />
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
