// DEPENDENCIES
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// BOOTSTRAP
require('./routes')(app)

// BLE
require('./services/bluetooth')

if (process.env.NODE_ENV !== 'production') {
  app.get('/throw/:code', (req) => {
    throw new Error(req.params.code)
  })

  // Testing
  // require('./services/light').rainbow()
}

app.use(require('./middlewares/errorHandler'))
app.use(require('./middlewares/notFound'))

module.exports = {
  app,
}
