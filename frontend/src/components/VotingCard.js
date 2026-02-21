import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './VotingCard.css';

function VotingCard({ coin, coinName, sessionId }) {
  const [stats, setStats] = useState({ up: 0, down: 0, total: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getPredictionStats(coin);
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('투표 통계 로드 오류:', err);
      setError('투표 통계를 불러오는데 실패했습니다.');
    }
  }, [coin]);

  const checkVoteStatus = useCallback(async () => {
    try {
      const response = await api.checkVote(coin, sessionId);
      setHasVoted(response.data.hasVoted);
      if (response.data.vote) {
        setUserVote(response.data.vote.direction);
      }
    } catch (err) {
      console.error('투표 상태 확인 오류:', err);
    }
  }, [coin, sessionId]);

  useEffect(() => {
    fetchStats();
    checkVoteStatus();
  }, [fetchStats, checkVoteStatus]);

  const handleVote = async (direction) => {
    if (hasVoted || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.createPrediction({
        coin,
        direction,
        session_id: sessionId
      });
      setStats(response.data.stats);
      setHasVoted(true);
      setUserVote(direction);
    } catch (err) {
      console.error('투표 오류:', err);
      if (err.response?.data?.error === 'Already voted for this coin today') {
        setHasVoted(true);
      } else {
        setError('투표 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (count) => {
    if (stats.total === 0) return 50;
    return Math.round((count / stats.total) * 100);
  };

  const upPercent = getPercentage(stats.up);
  const downPercent = getPercentage(stats.down);

  return (
    <div className="voting-card">
      <div className="voting-header">
        <h3>{coinName}</h3>
        <span className="voting-subtitle">24시간 가격 예측</span>
      </div>

      <div className="voting-bar">
        <div
          className="voting-bar-up"
          style={{ width: `${upPercent}%` }}
        >
          {upPercent > 15 && `${upPercent}%`}
        </div>
        <div
          className="voting-bar-down"
          style={{ width: `${downPercent}%` }}
        >
          {downPercent > 15 && `${downPercent}%`}
        </div>
      </div>

      <div className="voting-stats">
        <span className="stat-up">상승 {stats.up}표</span>
        <span className="stat-total">총 {stats.total}표</span>
        <span className="stat-down">하락 {stats.down}표</span>
      </div>

      <div className="voting-buttons">
        <button
          className={`vote-btn vote-up ${hasVoted && userVote === 'UP' ? 'voted' : ''}`}
          onClick={() => handleVote('UP')}
          disabled={hasVoted || loading}
        >
          {loading ? '...' : '상승'}
        </button>
        <button
          className={`vote-btn vote-down ${hasVoted && userVote === 'DOWN' ? 'voted' : ''}`}
          onClick={() => handleVote('DOWN')}
          disabled={hasVoted || loading}
        >
          {loading ? '...' : '하락'}
        </button>
      </div>

      {hasVoted && (
        <div className="voting-message">
          {userVote === 'UP' ? '상승' : '하락'}에 투표하셨습니다
        </div>
      )}

      {error && (
        <div className="voting-error">
          <span>{error}</span>
          <button className="retry-link" onClick={fetchStats}>재시도</button>
        </div>
      )}
    </div>
  );
}

export default VotingCard;
