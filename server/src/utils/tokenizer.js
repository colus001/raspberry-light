const jwt = require('jsonwebtoken')

const config = require('../config')

module.exports = {
  sign(data, options = { expiresIn: '30d', algorithm: 'HS512' }) {
    return jwt.sign(data, config.jwtPrivateKey, options)
  },

  verify(token, options = {}) {
    return jwt.verify(token, config.jwtPrivateKey, options)
  },
}
