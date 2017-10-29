const { HTTP_STATUS } = require('../utils/errors')

module.exports = (req, res) => {
  res.status(404).json(HTTP_STATUS.NOT_FOUND)
}
