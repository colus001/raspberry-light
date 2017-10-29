const path = require('path')
const { assign } = require('lodash')

const development = require('./env/development')
const test = require('./env/test')
const production = require('./env/production')

const defaults = {
  root: path.normalize(path.join(__dirname, '/..')),
}

module.exports = {
  development: assign({}, development, defaults),
  test: assign({}, test, defaults),
  production: assign({}, production, defaults),
}[process.env.NODE_ENV || 'development']
