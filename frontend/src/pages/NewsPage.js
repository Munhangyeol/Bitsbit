import React, { useEffect, useRef } from 'react';
import NewsFeed from '../components/NewsFeed';
import './NewsPage.css';

function NewsPage() {
  const elementsRef = useRef([]);

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
  }, []);

  return (
    <div className="news-page">
      <div className="page-container">
        <header
          className="page-header scroll-reveal"
          ref={(el) => elementsRef.current[0] = el}
        >
          <div>
            <h1>암호화폐 뉴스 피드</h1>
            <p>AI 기반 감성 분석이 포함된 최신 뉴스</p>
          </div>
        </header>

        <div
          className="info-card scroll-reveal"
          ref={(el) => elementsRef.current[1] = el}
        >
          <h3>감성 태그가 있는 뉴스</h3>
          <p>
            각 뉴스 기사는 자동으로 분석되어 감성 지표로 태그됩니다.
            비트코인, 이더리움 또는 솔라나의 관련 뉴스를 보려면 암호화폐별로 필터링하세요.
            신뢰할 수 있는 암호화폐 뉴스 소스의 실시간 업데이트로 정보를 얻으세요.
          </p>
        </div>

        <div
          className="scroll-reveal"
          ref={(el) => elementsRef.current[2] = el}
        >
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
