import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './PriceAlert.css';

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
];

function PriceAlert({ sessionId, currentPrices }) {
  const [alerts, setAlerts] = useState([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coin: 'bitcoin',
    target_price: '',
    direction: 'ABOVE'
  });
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await api.getAlerts(sessionId);
      setAlerts(response.data.filter(a => !a.triggered));
    } catch (err) {
      console.error('알림 목록 로드 오류:', err);
    }
  }, [sessionId]);

  const checkTriggeredAlerts = useCallback(async () => {
    try {
      const response = await api.checkAlerts(sessionId);
      if (response.data.triggered.length > 0) {
        setTriggeredAlerts(prev => [...prev, ...response.data.triggered]);
        fetchAlerts();
      }
    } catch (err) {
      console.error('알림 확인 오류:', err);
    }
  }, [sessionId, fetchAlerts]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    if (currentPrices && currentPrices.length > 0) {
      checkTriggeredAlerts();
    }
  }, [currentPrices, checkTriggeredAlerts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.target_price || loading) return;

    setLoading(true);
    try {
      await api.createAlert({
        ...formData,
        target_price: parseFloat(formData.target_price),
        session_id: sessionId
      });
      setFormData({ coin: 'bitcoin', target_price: '', direction: 'ABOVE' });
      setShowForm(false);
      fetchAlerts();
    } catch (err) {
      console.error('알림 생성 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAlert(id, sessionId);
      fetchAlerts();
    } catch (err) {
      console.error('알림 삭제 오류:', err);
    }
  };

  const dismissTriggered = (id) => {
    setTriggeredAlerts(prev => prev.filter(a => a.id !== id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getCoinName = (coinId) => {
    const coin = COINS.find(c => c.id === coinId);
    return coin ? coin.symbol : coinId.toUpperCase();
  };

  const getCurrentPrice = (coinId) => {
    const price = currentPrices?.find(p => p.id === coinId);
    return price ? price.current_price : null;
  };

  return (
    <div className="price-alert">
      {/* 트리거된 알림 표시 */}
      {triggeredAlerts.length > 0 && (
        <div className="triggered-alerts">
          {triggeredAlerts.map(alert => (
            <div key={alert.id} className="triggered-alert">
              <div className="triggered-content">
                <span className="triggered-icon">
                  {alert.direction === 'ABOVE' ? '🚀' : '📉'}
                </span>
                <div className="triggered-info">
                  <strong>{getCoinName(alert.coin)}</strong>이(가)
                  {formatPrice(alert.target_price)} {alert.direction === 'ABOVE' ? '이상' : '이하'}에 도달!
                  <span className="current-price">현재: {formatPrice(alert.currentPrice)}</span>
                </div>
              </div>
              <button
                className="dismiss-btn"
                onClick={() => dismissTriggered(alert.id)}
              >
                확인
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="alert-header">
        <h3>가격 알림</h3>
        <button
          className="add-alert-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '취소' : '+ 알림 추가'}
        </button>
      </div>

      {showForm && (
        <form className="alert-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <select
              value={formData.coin}
              onChange={(e) => setFormData({ ...formData, coin: e.target.value })}
            >
              {COINS.map(coin => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>

            <select
              value={formData.direction}
              onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
            >
              <option value="ABOVE">이상</option>
              <option value="BELOW">이하</option>
            </select>
          </div>

          <div className="form-row">
            <div className="price-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                placeholder="목표 가격"
                value={formData.target_price}
                onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                step="0.01"
                min="0"
              />
            </div>
            {getCurrentPrice(formData.coin) && (
              <span className="current-hint">
                현재: {formatPrice(getCurrentPrice(formData.coin))}
              </span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '생성 중...' : '알림 설정'}
          </button>
        </form>
      )}

      <div className="alert-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">설정된 알림이 없습니다</div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <div className="alert-info">
                <span className={`alert-direction ${alert.direction.toLowerCase()}`}>
                  {alert.direction === 'ABOVE' ? '▲' : '▼'}
                </span>
                <span className="alert-coin">{getCoinName(alert.coin)}</span>
                <span className="alert-target">
                  {formatPrice(alert.target_price)} {alert.direction === 'ABOVE' ? '이상' : '이하'}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(alert.id)}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PriceAlert;
