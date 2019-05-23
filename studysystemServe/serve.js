const mysql = require('mysql');
const content = {
	host: '127.0.0.1',
	user: 'root',
	password: '',
	port: '3306',
	database: 'user_db'
}
const sql = mysql.createConnection(content)
module.exports = sql;

