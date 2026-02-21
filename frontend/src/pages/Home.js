import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const sectionsRef = useRef([]);

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

    const currentSections = sectionsRef.current;

    currentSections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        {/* 동적 배경 요소들 */}
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
          <div className="hero-grid"></div>
          <svg className="hero-chart" viewBox="0 0 1440 300" preserveAspectRatio="none">
            <polyline
              className="hero-chart-line"
              points="0,280 120,240 220,260 320,200 420,220 520,160 620,180 720,110 820,140 920,90 1020,110 1150,60 1300,80 1440,30"
            />
            <polyline
              className="hero-chart-line hero-chart-line-2"
              points="0,295 100,275 200,285 300,255 400,265 500,225 600,240 700,185 800,205 900,160 1000,175 1130,130 1280,150 1440,100"
            />
          </svg>
        </div>

        {/* 어두운 오버레이 */}
        <div className="hero-overlay" aria-hidden="true"></div>

        {/* 떠다니는 시세 카드 */}
        <div className="hero-ticker ticker-btc" aria-hidden="true">
          <span className="ticker-symbol">BTC</span>
          <span className="ticker-price">$104,200</span>
          <span className="ticker-change positive">▲ 2.3%</span>
        </div>
        <div className="hero-ticker ticker-eth" aria-hidden="true">
          <span className="ticker-symbol">ETH</span>
          <span className="ticker-price">$3,850</span>
          <span className="ticker-change positive">▲ 1.1%</span>
        </div>
        <div className="hero-ticker ticker-sol" aria-hidden="true">
          <span className="ticker-symbol">SOL</span>
          <span className="ticker-price">$185</span>
          <span className="ticker-change negative">▼ 0.8%</span>
        </div>

        {/* 콘텐츠 */}
        <div className="hero-content">
          <div className="hero-live-badge">
            <span className="live-dot"></span>
            LIVE
          </div>
          <h1 className="hero-title">
            BTC · ETH · SOL
            <br />
            <span className="hero-title-gradient">실시간 시세 &amp; 시장 분석</span>
          </h1>
          <p className="hero-description">
            30초마다 자동 갱신되는 실시간 가격, 뉴스 기반 감성 분석으로 상승·하락 신호를 한눈에 확인.
            목표 가격 알림 설정으로 매수·매도 타이밍을 놓치지 마세요.
          </p>
          <div className="hero-actions">
            <Link to="/prices" className="btn-hero-primary">
              실시간 가격 보기
            </Link>
            <Link to="/trends" className="btn-hero-secondary">
              시장 트렌드 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div
            className="section-header-center scroll-reveal"
            ref={(el) => sectionsRef.current[0] = el}
          >
            <h2>종합적인 시장 분석</h2>
            <p>암호화폐 투자 결정에 필요한 모든 정보를 제공합니다</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div
              className="feature-card scroll-reveal"
              ref={(el) => sectionsRef.current[1] = el}
            >
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>실시간 가격 추적</h3>
              <p>
                비트코인, 이더리움, 솔라나의 실시간 암호화폐 가격을 모니터링하세요.
                가격 변동과 24시간 변동률을 즉시 확인할 수 있습니다.
              </p>
              <Link to="/prices" className="feature-link">
                실시간 가격 보기 →
              </Link>
            </div>

            {/* Feature 2 */}
            <div
              className="feature-card scroll-reveal"
              ref={(el) => sectionsRef.current[2] = el}
            >
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>AI 감성 분석</h3>
              <p>
                암호화폐 뉴스의 고급 키워드 기반 감성 분석을 제공합니다.
                UP, DOWN, NEUTRAL 트렌드 지표로 시장 분위기를 이해하세요.
              </p>
              <Link to="/trends" className="feature-link">
                트렌드 탐색하기 →
              </Link>
            </div>

            {/* Feature 3 */}
            <div
              className="feature-card scroll-reveal"
              ref={(el) => sectionsRef.current[3] = el}
            >
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>큐레이션된 뉴스 피드</h3>
              <p>
                신뢰할 수 있는 출처의 최신 암호화폐 뉴스를 확인하세요.
                각 기사는 감성 분석 태그로 표시되어 빠른 인사이트를 제공합니다.
              </p>
              <Link to="/news" className="feature-link">
                뉴스 읽기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works-container">
          <div
            className="section-header-center scroll-reveal"
            ref={(el) => sectionsRef.current[4] = el}
          >
            <h2>작동 원리</h2>
            <p>암호화폐 시장을 앞서가는 세 가지 간단한 단계</p>
          </div>

          <div className="steps">
            <div
              className="step scroll-reveal"
              ref={(el) => sectionsRef.current[5] = el}
            >
              <div className="step-number">01</div>
              <h3>가격 추적</h3>
              <p>
                주요 암호화폐의 실시간 가격 업데이트를 제공합니다.
                가격 변동과 시가총액 변화를 즉시 모니터링하세요.
              </p>
            </div>

            <div className="step-divider"></div>

            <div
              className="step scroll-reveal"
              ref={(el) => sectionsRef.current[6] = el}
            >
              <div className="step-number">02</div>
              <h3>감성 분석</h3>
              <p>
                AI가 수천 개의 뉴스 기사를 분석하여 시장 감성을 판단합니다.
                키워드 분석을 기반으로 명확한 UP, DOWN, NEUTRAL 신호를 제공합니다.
              </p>
            </div>

            <div className="step-divider"></div>

            <div
              className="step scroll-reveal"
              ref={(el) => sectionsRef.current[7] = el}
            >
              <div className="step-number">03</div>
              <h3>의사 결정</h3>
              <p>
                가격 데이터와 감성 분석을 결합하여 정보에 입각한 투자 결정을 내리세요.
                종합적인 시장 인텔리전스로 앞서 나가세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div
          className="cta-content scroll-reveal"
          ref={(el) => sectionsRef.current[8] = el}
        >
          <h2>지금 시작할 준비가 되셨나요?</h2>
          <p>
            실시간 시장 인텔리전스를 위해 Bitsbit을 사용하는 수천 명의 트레이더에 합류하세요.
          </p>
          <Link to="/prices" className="btn-cta">
            지금 추적 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Bitsbit</h3>
              <p>실시간 암호화폐 시장 인텔리전스 플랫폼</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>서비스</h4>
                <Link to="/prices">실시간 가격</Link>
                <Link to="/trends">시장 트렌드</Link>
                <Link to="/news">뉴스 피드</Link>
              </div>

              <div className="footer-column">
                <h4>정보</h4>
                <a href="#about">회사 소개</a>
                <a href="#contact">문의하기</a>
                <a href="#faq">자주 묻는 질문</a>
              </div>

              <div className="footer-column">
                <h4>데이터 출처</h4>
                <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer">
                  CoinGecko API
                </a>
                <a href="https://cryptopanic.com" target="_blank" rel="noopener noreferrer">
                  CryptoPanic API
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Bitsbit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
