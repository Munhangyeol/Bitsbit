import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';
import { COIN_META } from '../utils/coinUtils';
import './PriceChart.css';

const RANGES = [
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
];

function formatTimestamp(dateStr, range) {
  const date = new Date(dateStr);
  if (range === '1d') {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function formatPrice(value) {
  if (value >= 1000) {
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-time">{label}</p>
      <p className="tooltip-price">{formatPrice(payload[0].value)}</p>
    </div>
  );
}

function PriceChart({ coin }) {
  const [range, setRange] = useState('1d');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const meta = COIN_META[coin] || { color: '#888', name: coin };

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPriceHistory(coin, range);
      const formatted = response.data.map(row => ({
        time: formatTimestamp(row.recorded_at, range),
        price: row.price,
      }));
      setData(formatted);
    } catch (err) {
      console.error('가격 이력 로드 오류:', err);
      setError('가격 차트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [coin, range]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="price-chart">
      <div className="chart-header">
        <span className="chart-title">{meta.name} 가격 추이</span>
        <div className="range-buttons">
          {RANGES.map(r => (
            <button
              key={r.value}
              className={`range-btn ${range === r.value ? 'active' : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="chart-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}

      {!loading && error && (
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchHistory}>재시도</button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="chart-empty">
          <p>아직 수집된 가격 데이터가 없습니다. 잠시 후 다시 확인해주세요.</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatPrice}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              width={80}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={meta.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: meta.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default PriceChart;
