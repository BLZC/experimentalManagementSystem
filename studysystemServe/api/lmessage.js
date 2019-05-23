// 留言管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//学生留言
router.post("/lmessage", (req, res) => {
    sql.query(
      'insert into lmessage (uid,cid,userName,content,time,touser) values ("' +
        req.body.uid +
        '","' +
        req.body.id +
        '","' +
        req.body.userName +
        '","' +
        req.body.content +
        '","' +
        req.body.time +
        '","' +
        req.body.touser +
        '")',
      (err, rows) => {
        if (err) console.log(err);
        res.json({
          code: 1,
          success: true,
          message: "留言成功"
        });
      }
    );
  });
  
  //查看留言
  router.post("/getmessage", (req, res) => {
    sql.query(
      "select lmessage.id,lmessage.cid, lmessage.uid, lmessage.userName, lmessage.time, lmessage.content, course.name from lmessage, course where lmessage.cid = course.cid and lmessage.touser = " +
        req.body.uid,
      (err, rows) => {
        if (err) console.log(err);
        res.json({
          code: 1,
          success: true,
          dataList: rows,
          message: "查询成功"
        });
      }
    );
  });
  
  //删除留言
  router.post("/rmessage", (req, res) => {
    sql.query("delete from lmessage where id=" + req.body.id, (err, rows) => {
      if (err) console.log(err);
      res.json({
        code: 1,
        success: true,
        message: "删除成功"
      });
    });
  });

  module.exports = router;
  