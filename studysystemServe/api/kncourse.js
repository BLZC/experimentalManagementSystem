// 课内实验模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//返回所有课程实验信息
router.post("/getcourse", function(req, res) {
    sql.query(
      "select course.cid,course.hour,class.className,course.time,course.name,course.location,assessment.assessmentName,users.userNo from course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id",
      function(err, rows) {
        if (err) {
          res.json({
            code: 0,
            message: "查询失败"
          });
        } else {
          res.json({
            code: 1,
            success: true,
            message: "查询成功！",
            dataList: rows
          });
        }
      }
    );
  });

//返回单个课程实验信息
router.post("/getonecourse", function(req, res) {
    sql.query('select * from course where cid = "' + req.body.id + '"', function(
      err,
      rows
    ) {
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
    });
  });

//添加/修改课程
router.post("/addCourse", function(req, res) {
    if (req.body.id) {
      sql.query("select * from course where cid = " + req.body.id, function(
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
            'update course set name ="' +
              req.body.name +
              '", hour ="' +
              req.body.hour +
              '",ownId ="' +
              req.body.ownId +
              '",time ="' +
              req.body.time +
              '",location ="' +
              req.body.location +
              '",assessmentId ="' +
              req.body.assessmentId +
              '" where cid ="' +
              req.body.id +
              '"',
            (err, rows) => {
              if (err) console.log(err)
              else{
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
        'select * from course where name = "' + req.body.name + '"',
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
              'insert into course (name,hour,ownId,time,location,assessmentId) values ("' +
                req.body.name +
                '","' +
                req.body.hour +
                '","' +
                req.body.ownId +
                '","' +
                req.body.time +
                '","' +
                req.body.location +
                '","' +
                req.body.assessmentId +
                '")',
              (err, rows) => {
                if (err) console.log(err);
                else{
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

  //删除课程
router.post("/deleteCourse", (req, res) => {
    sql.query(
      "delete from course where cid in (" + req.body.id + ")",
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
  });

  //查找课程
router.post("/searchcourse", function(req, res) {
    if (req.body.qryContent == "") {
      sql.query(
        "select course.cid, course.hour,class.className,course.time,course.name,course.location,assessment.assessmentName,users.userNo from course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id",
        function(err, rows) {
          if (err) console.log(err);
          else {
            res.json({
              code: 1,
              success: true,
              message: "查询成功！",
              dataList: rows
            });
          }
        }
      );
    } else {
      sql.query(
        'select course.cid, course.hour,class.className,course.time,course.name,course.location,assessment.assessmentName,users.userNo from course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id and concat(course.name, users.userNo, class.className) like "%' +
          req.body.qryContent +
          '%"',
        function(err, rows) {
          if (err) console.log(err);
          else {
            res.json({
              code: 1,
              message: "实验课程查找成功!",
              dataList: rows
            });
          }
        }
      );
    }
  });
module.exports = router;