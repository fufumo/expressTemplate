const mysql = require('mysql2')
const config = require('./db.json').mysql

const connection = mysql.createConnection(config)

module.exports = connection.promise()
