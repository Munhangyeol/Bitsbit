const { SUPPORTED_COINS } = require('../config/constants');

const COIN_IDS = Object.keys(SUPPORTED_COINS);

/**
 * req.body.coin 또는 req.params.coin이 지원하는 코인 목록에 있는지 검증
 */
function validateCoin(source = 'body') {
  return (req, res, next) => {
    const coin = source === 'body' ? req.body.coin : req.params.coin;
    if (!coin || !COIN_IDS.includes(coin)) {
      return res.status(400).json({
        error: `coin must be one of: ${COIN_IDS.join(', ')}`
      });
    }
    next();
  };
}

/**
 * req.body.target_price가 양수인지 검증
 */
function validateTargetPrice(req, res, next) {
  const price = parseFloat(req.body.target_price);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: 'target_price must be a positive number' });
  }
  next();
}

module.exports = { validateCoin, validateTargetPrice };
