import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 가격 조회
export const getPrices = () => api.get('/prices');

// 뉴스 조회
export const getNews = (coin = 'btc', limit = 10) =>
  api.get('/news', { params: { coin, limit } });

// 트렌드 조회
export const getTrends = () => api.get('/trends');

// 뉴스 수동 갱신
export const refreshNews = () => api.post('/news/refresh');

const apiClient = {
  getPrices,
  getNews,
  getTrends,
  refreshNews,
};

export default apiClient;
