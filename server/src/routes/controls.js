const lightService = require('../services/light')

const types = [
  'SHOW',
  'HIDE',
  'RAINBOW',
  'BREATH',
]

module.exports = (router) => {
  router.post('/', (req, res, next) => {
    const { type } = req.body
    const interval = parseInt(req.body.interval, 10)

    if (!types.includes(type) || typeof lightService[type.toLowerCase()] !== 'function') {
      next(new Error('NOT_IMPLEMENTED'))
    }

    const serviceMethod = lightService[type.toLowerCase()]
    if (serviceMethod) {
      serviceMethod(parseInt(interval, 10))
    }

    res.json({
      status: serviceMethod ? 'success' : 'failed',
    })
  })

  router.get('/status', (req, res, next) => {
    res.json({
      status: lightService.getColor(),
    })
  })

  router.post('/colors', (req, res, next) => {
    const { red, blue, green, alpha } = req.body
    if (!red || !blue || !green) next(new Error('BAD_REQUEST'))

    lightService.setColor({
      red: parseInt(red, 10),
      blue: parseInt(blue, 10),
      green: parseInt(green, 10),
    })

    if (alpha) {
      lightService.setBrightness(
        parseInt(alpha, 10)
      )
    }

    res.json({
      status: lightService.getColor(),
    })
  })

  return router
}
