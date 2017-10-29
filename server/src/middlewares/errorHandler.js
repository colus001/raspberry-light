const { HTTP_STATUS, CUSTOM_ERRORS } = require('../utils/errors')

module.exports = (err, req, res, next) => {
  console.error(req.originalUrl, err)

  const status = HTTP_STATUS[err.message] || HTTP_STATUS.INTERNAL_SERVER_ERROR

  const error = {
    code: status.code,
    message: CUSTOM_ERRORS[err.message] || status.message,
  }

  if (process.env.NODE_ENV !== 'production') {
    error.stack = err.stack
  }

  res.status(status.code).json(error)
  next(err)
}
