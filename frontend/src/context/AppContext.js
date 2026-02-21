import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatPricesResponse } from '../utils/coinUtils';
import { useSessionId } from '../hooks/useSessionId';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [prices, setPrices] = useState([]);
  const [trends, setTrends] = useState({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const sessionId = useSessionId();

  const fetchPrices = useCallback(async () => {
    try {
      const response = await api.getPrices();
      const pricesArray = formatPricesResponse(response.data);
      if (pricesArray.length > 0) {
        setPrices(pricesArray);
      }
    } catch (err) {
      console.error('[AppContext] 가격 로드 오류:', err);
    }
  }, []);

  const fetchTrends = useCallback(async () => {
    try {
      const response = await api.getTrends();
      const trendsMap = {};
      response.data.forEach(t => {
        trendsMap[t.coin] = t;
      });
      setTrends(trendsMap);
    } catch (err) {
      console.error('[AppContext] 트렌드 로드 오류:', err);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    Promise.all([fetchPrices(), fetchTrends()]).finally(() => {
      setPricesLoading(false);
    });
  }, [fetchPrices, fetchTrends]);

  // 30초 자동 갱신
  useAutoRefresh(() => {
    fetchPrices();
    fetchTrends();
  }, 30000);

  return (
    <AppContext.Provider value={{ prices, trends, pricesLoading, sessionId, fetchPrices, fetchTrends }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
