const ERROR = {
  Field: { code: 3, message: '字段缺失' },
  Authorition: { code: 2, message: '权限不足' },
}


module.exports = {
  sc : (data, total) => {
    return {
      code: 0,
      data: data,
      message: '成功',
      total: total,
    }
  },
   er : (msg, code = 103) => {
    return {
      code: code,
      message: msg,
    }
  },
  ERROR,
}
