const { assign } = require('lodash')

const HTTP_STATUS = {
  OK: {
    code: 200,
    message: '올바른 요청입니다.',
  },
  BAD_REQUEST: {
    code: 400,
    message: '잘못된 요청입니다.',
  },
  UNAUTHORIZED: {
    code: 401,
    message: '권한이 없습니다.',
  },
  FORBIDDEN: {
    code: 403,
    message: '권한이 없습니다.',
  },
  NOT_FOUND: {
    code: 404,
    message: '알수 없는 요청입니다.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: '알수 없는 문제가 발생하였습니다.',
  },
}

const CUSTOM_ERRORS = (() => {
  const USER = {
    USER_NOT_FOUND: '해당하는 사용자가 없습니다.',
  }

  return assign({}, USER)
})()

module.exports = {
  HTTP_STATUS,
  CUSTOM_ERRORS,
}
