const Tokenizer = require('../utils/tokenizer')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
    return
  }

  const authToken = req.get('X-Authorization')
  if (!authToken) throw new Error('BAD_REQUEST')

  try {
    req.user = Tokenizer.verify(authToken)
    next()
  } catch (e) {
    throw new Error('UNAUTHORIZED')
  }
}
