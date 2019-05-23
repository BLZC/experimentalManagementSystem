// 集中性实践模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");


//添加/修改集中性实践课程
router.post("/addjzp", function(req, res) {
    if (req.body.id) {
      sql.query("select * from jzpractice where id = " + req.body.id, function(
        err,
        rows
      ) {
        let len = rows.length;
        if (err || len === 0) {
          res.json({
            code: 0,
            success: false,
            message: "该课程不存在！"
          });
        } else {
          sql.query(
            'update jzpractice set name ="' +
              req.body.name +
              '", hour ="' +
              req.body.hour +
              '",time ="' +
              req.body.time +
              '",location ="' +
              req.body.location +
              '",assessmentId ="' +
              req.body.assessmentId +
              '",userId ="' +
              req.body.userId +
              '" where id ="' +
              req.body.id +
              '"',
            (err, rows) => {
              if (err) console.log(err);
              else {
                res.json({
                  code: 1,
                  message: "课程修改成功!"
                });
              }
            }
          );
        }
      });
    } else {
      sql.query(
        'select * from jzpractice where name = "' + req.body.name + '"',
        function(err, rows) {
          let len = rows.length;
          if (err || len !== 0) {
            res.json({
              code: 0,
              success: false,
              message: "该课程已经存在！"
            });
          } else {
            sql.query(
              'insert into jzpractice (name,hour,userId,time,location,assessmentId) values ("' +
                req.body.name +
                '","' +
                req.body.hour +
                '","' +
                req.body.userId +
                '","' +
                req.body.time +
                '","' +
                req.body.location +
                '","' +
                req.body.assessmentId +
                '")',
              (err, rows) => {
                if (err) console.log(err);
                else {
                  res.json({
                    code: 1,
                    message: "课程添加成功!"
                  });
                }
              }
            );
          }
        }
      );
    }
  });

  //返回单个集中性实践信息
router.post("/getonejzp", function(req, res) {
    sql.query(
      'select * from jzpractice where id = "' + req.body.id + '"',
      function(err, rows) {
        let len = rows.length;
        if (len !== 0) {
          res.json({
            code: 1,
            success: true,
            message: "查找成功",
            course: rows
          });
        } else {
          res.json({
            code: 0,
            success: false,
            message: "查找失败"
          });
        }
      }
    );
  });
  //查询
router.post('/searchcourse', (req, res)=>{
    if(req.body.qryContent){
    if(req.body.qryContent === ""){
    sql.query('select jzpractice.id, jzpractice.name, jzpractice.hour, jzpractice.time, jzpractice.location, users.userNo, assessment.assessmentName from jzpractice, users, assessment where jzpractice.userId = users.userId and jzpractice.assessmentId = assessment.id', (err, rows)=>{
    if(err) console.log(err);
    else{
        res.json({
            code: 1,
            message: "查询成功",
            dataList: rows
        })
    }
    })
    }
    else {
        sql.query('select jzpractice.id, jzpractice.name, jzpractice.hour, jzpractice.time, jzpractice.location, users.userNo, assessment.assessmentName from jzpractice, users, assessment where jzpractice.userId = users.userId and jzpractice.assessmentId = assessment.id and concat(jzpractice.name, users.userNo) like "%'+req.body.qryContent+'%"', (err, rows)=>{
            if(err) console.log(err);
            else{
                console.log("2222")
                res.json({
                    code: 1,
                    message: "查询成功",
                    dataList: rows
                })
            }
            })
    }
}
else{
    sql.query('select jzpractice.id, jzpractice.name, jzpractice.hour, jzpractice.time, jzpractice.location, users.userNo, assessment.assessmentName from jzpractice, users, assessment where jzpractice.userId = users.userId and jzpractice.assessmentId = assessment.id', (err, rows)=>{
        if(err) console.log(err);
        else{
            console.log("1111")
            res.json({
                code: 1,
                message: "查询成功",
                dataList: rows
            })
        }
        })
}
})

  //删除
router.post('/deleteCourse', (req, res)=>{
    sql.query(
        "delete from jzpractice where id in (" + req.body.id + ")",
        (err, rows) => {
          if (err) console.log(err);
          else {
            res.json({
              code: 1,
              success: true,
              message: "删除成功!"
            });
          }
        }
      );
})
module.exports = router;