//应用程序的启动入口文件
//加载express模块
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 9001;
const localhost = 'localhost';
const app = express();
const users = require('./api/users');
const grade = require('./api/grade');
const students = require('./api/students');
const course = require('./api/course');
const vclass = require('./api/class');
const elective = require('./api/elective');
const kncourse = require('./api/kncourse');  //课内实验模块
const jzcourse = require('./api/jzcourse');  //集中性实践模块
const profession = require('./api/profession');  //专业及课表设置
const report = require('./api/report');  //实验任务及实验报告
const jzgrade = require('./api/jzgrade');  //集中性实践评分
const lmessage = require('./api/lmessage');  //留言
const task = require('./api/task');  //实验任务
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
app.use(bodyParser.urlencoded({extended:false}));
app.use(upload.single('file'));
app.use(bodyParser.json());
// 配置允许跨域请求；
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	res.header('X-Powered-By', ' 3.2.1')
	next()
})
app.use('/about', users); //用户管理
app.use('/students', students); //用户管理
app.use('/course', course);  //课表管理
app.use('/vclass', vclass); //课程管理
app.use('/elective', elective); //选课
app.use('/grade', grade); //成绩管理
app.use('/kncourse', kncourse);  //课内实验模块
app.use('/jzcourse', jzcourse);  //集中性实践模块
app.use('/profession', profession);  //专业及课表设置
app.use('/report', report);  //实验任务及实验报告
app.use('/jzgrade', jzgrade);  //集中性实践评分
app.use('/lmessage', lmessage);  //留言
app.use('/task', task);  //实验任务
//app.post('/register', function (req, res) {
//sql.query('select userName from users where userName="' + req.body.userName + '"', function (err, rows) {
//  console.log(rows)
//  if (err || rows.length == 0) {
//    sql.query('insert  into users set ?' , {userName: req.body.userName,password: req.body.password}, function (err, rows) {
//      if (err) {
//        res.send({code: 0,ms: ' 服务器出错 '})
//      }else {
//        res.send({code: 1})
//      }
//    })
//  }else {
//    res.send({code: 0,ms: '账户已存在'})
//  }
//})
//})
// app.post("/loadmenu", function(req, res) {

// })
//sql.end();

app.listen(port, localhost, function() {
	console.log(`服务器运行在${localhost}:${port}`)
});