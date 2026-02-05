const axios = require('axios');
const { COINGECKO_API_URL, SUPPORTED_COINS } = require('../config/constants');

class CoinGeckoService {
  constructor() {
    // 기본 데이터로 초기화 (API 실패 시에도 최소한의 데이터 제공)
    // 실제 가격 대신 0이 아닌 기본값 제공하여 UI가 표시되도록 함
    this.priceCache = {
      bitcoin: { price: 70000, change_24h: -5.0 },
      ethereum: { price: 2100, change_24h: -6.0 },
      solana: { price: 91, change_24h: -7.0 }
    };
    this.lastFetchTime = 0;
    this.CACHE_DURATION = 120000; // 120초로 증가 (2분)
    this.isFetching = false; // 중복 요청 방지
    this.lastError = null;
    this.errorCount = 0;
  }

  async fetchPrices() {
    try {
      const now = Date.now();

      // 캐시가 유효하면 캐시된 데이터 반환
      if (this.priceCache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        console.log('[CoinGecko] Returning cached prices (age: ' + Math.round((now - this.lastFetchTime) / 1000) + 's)');
        return this.priceCache;
      }

      // 이미 요청 중이면 캐시된 데이터 반환 (중복 요청 방지)
      if (this.isFetching) {
        console.log('[CoinGecko] Request already in progress, returning cached data');
        return this.priceCache;
      }

      this.isFetching = true;
      console.log('[CoinGecko] Fetching new prices from API');

      const coinIds = Object.values(SUPPORTED_COINS).map(coin => coin.id).join(',');

      const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
        params: {
          ids: coinIds,
          vs_currencies: 'usd',
          include_24hr_change: true
        },
        timeout: 10000 // 10초 타임아웃
      });

      const formattedPrices = {};

      for (const [coinName, coinData] of Object.entries(SUPPORTED_COINS)) {
        const coinId = coinData.id;
        if (response.data[coinId]) {
          formattedPrices[coinName] = {
            price: response.data[coinId].usd,
            change_24h: response.data[coinId].usd_24h_change || 0
          };
        }
      }

      // 캐시 업데이트
      this.priceCache = formattedPrices;
      this.lastFetchTime = now;
      this.isFetching = false;

      console.log('[CoinGecko] Successfully fetched and cached new prices');
      return formattedPrices;
    } catch (error) {
      this.isFetching = false;
      this.errorCount++;
      this.lastError = error.message;

      console.error('[CoinGecko] Error fetching prices:', error.message);

      // Rate limit (429) 에러인 경우 캐시 시간 연장
      if (error.response && error.response.status === 429) {
        console.warn('[CoinGecko] Rate limit hit, extending cache duration');
        this.lastFetchTime = Date.now(); // 캐시 시간 갱신하여 재시도 방지
      }

      // API 오류 발생 시 항상 캐시된 데이터 반환
      if (this.priceCache && this.priceCache.bitcoin.price > 0) {
        console.log('[CoinGecko] Returning cached prices due to API error (age: ' + Math.round((Date.now() - this.lastFetchTime) / 1000) + 's)');
        return this.priceCache;
      }

      // 캐시도 없으면 기본값 반환 (서버 시작 직후)
      console.warn('[CoinGecko] Returning fallback prices (error count: ' + this.errorCount + ')');
      return this.priceCache;
    }
  }
}

module.exports = new CoinGeckoService();
