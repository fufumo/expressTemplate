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

router.get('/api/user/list', async (req, res) => {
  //解构参数
  let { page = 1, page_size = 10 } = req.query
  //let page = ctx.request.query.page || 1
  //let size = ctx.request.query.size || 10
  page = parseInt(page)
  page_size = parseInt(page_size)

  if (page < 1 || page_size < 1) {
    return res.send(u.er('页码或页大小错误', 101))
  }

  const sql = `SELECT * FROM user order by createTime DESC, id DESC LIMIT ?,?`
  const [result] = await connection.query(sql, [(page - 1) * page_size, page_size])
  res.send(u.sc(result, result.length))
})

//后台登录
router.post('/api/user/admin/login', async (req, res) => {
  let { phone, password } = req.body
  if (!phone || !password) {
    return res.send(u.er('手机号和密码不能为空', 101))
  }
  const sql = `SELECT * FROM user WHERE phone = ? AND password = ? AND status = 1 AND is_admin = 1`
  const [result] = await connection.query(sql, [phone, password])
  if (!result || result.length === 0) {
    return res.send(u.er('用户不存在'))
  }
  res.send(u.sc(result[0]))
})

//后台登录
router.post('/api/user/front/login', async (req, res) => {
  let { phone, password } = req.body
  if (!phone || !password) {
    return res.send(u.er('手机号和密码不能为空', 101))
  }
  const sql = `SELECT * FROM user WHERE phone = ? AND password = ? AND status = 1`
  const [result] = await connection.query(sql, [phone, password])
  if (!result || result.length === 0) {
    return res.send(u.er('用户不存在'))
  }
  res.send(u.sc(result[0]))
})

router.post('/api/user/article/create', async (req, res) => {
  //解构参数
  let { user_id, title, content } = req.body
  if (!user_id || !title || !content) {
    return res.send(u.er('用户ID、标题和内容不能为空', 101))
  }
  const [user] = await connection.query(`SELECT * FROM user WHERE phone = ? AND password = ? AND status = 1`, [
    phone,
    password,
  ])
  if (!user || user.length === 0) {
    return res.send(u.er('用户不存在'))
  }
  //let user_id = ctx.request.body.user_id
  //let title = ctx.request.body.title
  //let content = ctx.request.body.content
  const [result] = await connection.query(`INSERT INTO article (user_id, title, content,read_count) VALUES (?, ?, ?)`, [
    user_id,
    title,
    content,
    0,
  ])
  console.log(result)

  const sql = `INSERT INTO integral_record (user_id, article_id, change) VALUES (?, ?, ?)`
  await connection.query(sql, [user_id, result.id, 10])
  res.send(u.sc())
})

router.get('/api/user/article/list', async (req, res) => {
  //解构参数
  let { id, page = 1, page_size = 10 } = req.query

  //let id = ctx.request.query.id
  page = parseInt(page)
  page_size = parseInt(page_size)

  if (page < 1 || page_size < 1) {
    return res.send(u.er('页码或页大小错误', 101))
  }
  if (!id) {
    return res.send(u.er('用户ID不能为空', 101))
  }
  const sql = `SELECT * FROM article WHERE user_id = ?  order by createTime DESC, id DESC  LIMIT ?,?`
  const [result] = await connection.query(sql, [id, (page - 1) * page_size, page_size])
  res.send(u.sc(result, result.length))
})

module.exports = router
