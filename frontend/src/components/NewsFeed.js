import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './NewsFeed.css';

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState('btc');
  const limit = 10; // Fixed limit

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getNews(selectedCoin, limit);
      setNews(response.data);
    } catch (err) {
      setError('뉴스를 불러오는데 실패했습니다.');
      console.error('뉴스 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin]);

  const handleRefresh = async () => {
    try {
      await api.refreshNews();
      await fetchNews();
    } catch (err) {
      console.error('뉴스 갱신 오류:', err);
    }
  };

  const getSentimentConfig = (sentiment) => {
    const configs = {
      positive: { icon: '▲', color: 'success', label: '긍정' },
      negative: { icon: '▼', color: 'danger', label: '부정' },
      neutral: { icon: '−', color: 'neutral', label: '중립' },
    };
    return configs[sentiment] || configs.neutral;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="news-feed">
        <div className="news-loading" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>뉴스를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-feed">
        <div className="news-error" role="alert">
          <p>{error}</p>
          <button onClick={fetchNews} className="retry-button" aria-label="뉴스 다시 불러오기">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <div className="news-controls">
        <div className="coin-selector" role="group" aria-label="암호화폐 선택">
          <button
            className={`coin-button ${selectedCoin === 'btc' ? 'active' : ''}`}
            onClick={() => setSelectedCoin('btc')}
            aria-pressed={selectedCoin === 'btc'}
            aria-label="Bitcoin 뉴스 보기"
          >
            Bitcoin
          </button>
          <button
            className={`coin-button ${selectedCoin === 'eth' ? 'active' : ''}`}
            onClick={() => setSelectedCoin('eth')}
            aria-pressed={selectedCoin === 'eth'}
            aria-label="Ethereum 뉴스 보기"
          >
            Ethereum
          </button>
          <button
            className={`coin-button ${selectedCoin === 'sol' ? 'active' : ''}`}
            onClick={() => setSelectedCoin('sol')}
            aria-pressed={selectedCoin === 'sol'}
            aria-label="Solana 뉴스 보기"
          >
            Solana
          </button>
        </div>

        <button onClick={handleRefresh} className="refresh-button" aria-label="뉴스 새로고침">
          새로고침
        </button>
      </div>

      <div className="news-list">
        {news.length === 0 ? (
          <div className="news-empty">
            <p>표시할 뉴스가 없습니다.</p>
          </div>
        ) : (
          news.map((item) => {
            const sentimentConfig = getSentimentConfig(item.sentiment);

            return (
              <article key={item.id} className="news-item">
                <div className="news-item-header">
                  <span className="news-date">{formatDate(item.published_at)}</span>
                  <span className={`sentiment-badge sentiment-${sentimentConfig.color}`}>
                    {sentimentConfig.icon} {sentimentConfig.label}
                  </span>
                </div>

                <h3 className="news-title">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>

                <div className="news-item-footer">
                  {item.source && (
                    <span className="news-source">{item.source}</span>
                  )}
                  {item.coins && typeof item.coins === 'string' && (
                    <div className="news-coins">
                      {JSON.parse(item.coins).map((coin, idx) => (
                        <span key={idx} className="coin-tag">
                          {coin}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

export default NewsFeed;
