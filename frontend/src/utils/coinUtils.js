export const COIN_META = {
  bitcoin: { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  ethereum: { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  solana: { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#9945FF' },
};

/**
 * 백엔드 /api/prices 응답(객체)을 프론트엔드 배열 형태로 변환
 * @param {Object} data - { bitcoin: { price, change_24h }, ... }
 * @returns {Array} - [{ id, name, symbol, color, current_price, price_change_percentage_24h }, ...]
 */
export function formatPricesResponse(data) {
  if (!data || typeof data !== 'object') return [];
  return Object.entries(data).map(([coinId, coinData]) => {
    const meta = COIN_META[coinId] || {
      id: coinId,
      symbol: coinId.toUpperCase(),
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      color: '#888888',
    };
    return {
      id: meta.id,
      name: meta.name,
      symbol: meta.symbol,
      color: meta.color,
      current_price: coinData.price,
      price_change_percentage_24h: coinData.change_24h,
    };
  });
}
