const express = require('express')

const authorization = require('../middlewares/authorization')

const controls = require('./controls')

module.exports = (app) => {
  const router = express.Router()

  app.use('/controls', controls(router))
}
