const express = require('express')
const path = require('path')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

// json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// 主路由
app.use(indexRouter)
app.use(usersRouter)

// 错误处理
app.use((err, req, res, next) => {
  console.error('Global Error:', err) // 可选：日志
  res.status(500).json({ code: 500, message: '服务器内部错误', error: err.message })
})

module.exports = app
