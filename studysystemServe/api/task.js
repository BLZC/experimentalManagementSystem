// 实验任务管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");
//返回实验题目
router.post("/getAlltitles", function(req, res) {
    sql.query(
      "select ordertitle, title from task where cid = " + req.body.id,
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
//课内实验任务
router.post("/courseClaim", function(req, res) {
    sql.query("select * from course where cid = " + req.body.id, (err, rows) => {
      let len = rows.length;
      if (err || len === 0) {
        res.json({
          code: 0,
          success: false,
          message: "该课程不存在！"
        });
      } else {
        sql.query(
          "select * from task where cid = " +
            req.body.id +
            " and ordertitle = " +
            req.body.ordertitle +
            ' or title = "' +
            req.body.title +
            '"',
          (err, rows) => {
            if (err) console.log(err);
            if (rows.length > 0) {
              res.json({
                message: "该实验任务已存在"
              });
            } else {
              sql.query(
                'insert into task (cid,ordertitle,type,title,beginTime,endTime,shiyan,yuxi) values ("' +
                  req.body.id +
                  '","' +
                  req.body.ordertitle +
                  '","' +
                  req.body.type +
                  '","' +
                  req.body.title +
                  '","' +
                  req.body.beginTime +
                  '","' +
                  req.body.endTime +
                  '","' +
                  req.body.shiyan +
                  '","' +
                  req.body.yuxi +
                  '")',
                (err, rows) => {
                  if (err) console.log(err);
                  res.json({
                    code: 1,
                    message: "实验任务添加成功!"
                  });
                }
              );
            }
          }
        );
      }
    });
  });

//返回课内实验任务
router.post("/getcourseClaim", function(req, res) {
    sql.query(
      "select * from task where cid = " +
        req.body.id +
        " and ordertitle = " +
        req.body.ordertitle,
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

//返回集中性实践任务
router.post("/getcoursejzClaim", function(req, res) {
    sql.query(
      "select * from practice where cid = " + req.body.id,
      (err, rows) => {
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

//集中实践任务
router.post("/coursejzClaim", function(req, res) {
    sql.query("select * from jzpractice where id = " + req.body.id, (err, rows) => {
      let len = rows.length;
      if (err || len === 0) {
        res.json({
          code: 0,
          success: false,
          message: "该课程不存在！"
        });
      } else {
        sql.query(
          "select * from practice where cid = " +
            req.body.id +
            ' and title = "' +
            req.body.title +
            '"',
          (err, rows) => {
            if (err) console.log(err);
            if (rows.length > 0) {
              res.json({
                message: "该实验任务已存在"
              });
            } else {
              sql.query(
                'insert into practice (cid,title,endTimereport,endTimegrade,shiyan,yuxi) values ("' +
                  req.body.id +
                  '","' +
                  req.body.title +
                  '","' +
                  req.body.endTimereport +
                  '","' +
                  req.body.endTimegrade +
                  '","' +
                  req.body.shiyan +
                  '","' +
                  req.body.yuxi +
                  '")',
                (err, rows) => {
                  if (err) console.log(err);
                  res.json({
                    code: 1,
                    message: "实验任务添加成功!"
                  });
                }
              );
            }
          }
        );
      }
    });
  });
module.exports = router;