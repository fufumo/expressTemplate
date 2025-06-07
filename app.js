const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

// 设置视图引擎为 EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

const routesPath = path.join(__dirname, 'routes')
// 自动挂载 routes 文件夹下的所有路由
fs.readdirSync(routesPath).forEach((file) => {
  const route = require(path.join(routesPath, file))
  app.use(route)
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('Global Error:', err) // 可选：日志
  res.status(500).json({ code: 500, message: '服务器内部错误', error: err.message })
})

module.exports = app
