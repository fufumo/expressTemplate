const express = require('express')
const router = express.Router()
const connection = require('../config/connection.js')
const u = require('../utils/common.js')

router.get(`/api/article/list`, async (req, res) => {
  //解构参数
  let { page = 1, page_size = 10 } = req.query
  //let page = ctx.request.query.page || 1
  //let size = ctx.request.query.size || 10
  page = parseInt(page)
  page_size = parseInt(page_size)

  if (page < 1 || page_size < 1) {
    return res.send(u.er('页码或页大小错误', 101))
  }

  const sql = `SELECT * FROM article order by createTime DESC, id DESC LIMIT ?,?`
  const [result] = await connection.query(sql, [(page - 1) * page_size, page_size])
  res.send(u.sc(result, result.length))
})

module.exports = router
