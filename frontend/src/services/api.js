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

// 예측 투표 관련
export const getPredictions = () => api.get('/predictions');
export const getPredictionStats = (coin) => api.get(`/predictions/${coin}`);
export const createPrediction = (data) => api.post('/predictions', data);
export const checkVote = (coin, session_id) => api.get(`/predictions/check/${coin}/${session_id}`);

// 가격 알림 관련
export const getAlerts = (session_id) => api.get(`/alerts/${session_id}`);
export const checkAlerts = (session_id) => api.get(`/alerts/check/${session_id}`);
export const createAlert = (data) => api.post('/alerts', data);
export const deleteAlert = (id, session_id) => api.delete(`/alerts/${id}`, { data: { session_id } });

const apiClient = {
  getPrices,
  getNews,
  getTrends,
  refreshNews,
  getPredictions,
  getPredictionStats,
  createPrediction,
  checkVote,
  getAlerts,
  checkAlerts,
  createAlert,
  deleteAlert,
};

export default apiClient;
