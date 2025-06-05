const express = require('express')
const router = express.Router()
const connection = require('../config/connection.js')
const u = require('../utils/common.js')
/* 获取用户信息. */
//     ↓请求方式     ↓请求路径     request response
router.get('/api/user/info', async (req, res) => {
  //解构参数
  let { id } = req.query
  console.log(`获取用户信息：id=${id}`)
  //let id = ctx.request.query.id

  const sql = `SELECT * FROM user WHERE id = ?`

  //注意：这里的 id 是一个参数化查询的占位符，防止 SQL 注入攻击
  //使用 connection.query 执行 SQL 查询 可以不写第二个参数
  const [result] = await connection.query(sql, [id])
  console.log(result)

  //如果没有查询到用户信息，返回错误信息
  if (!result || result.length === 0) {
    //  return res.send(u.er('用户不存在',103)) 可以配端口
    return res.send(u.er('用户不存在'))
  }

  res.send(u.sc(result[0]))
})

// 修改用户信息
//     ↓请求方式     ↓请求路径
router.post(`/api/user/edit`, async (req, res) => {
  //解构参数
  let { id, name = null, password = null } = req.body
  //
  if (!id) {
    return res.send(u.ERROR.Field)
    //return res.send(u.er('用户ID不能为空', 101))
  }
  //如果没有传入 name 和 password，则不进行修改
  let sql = `UPDATE user SET `
  let params = []
  if (name) {
    sql += `name = ?`
    params.push(name)
  }
  if (password) {
    sql += ` , password = ?`
    params.push(password)
  }
  sql += ` WHERE id = ?`
  params.push(id)
  const [result] = connection.query(sql, params)

  res.send(u.sc())
})

module.exports = router
