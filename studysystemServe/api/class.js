// 课程管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//返回所有课程信息
router.post("/getAllclass", function(req, res) {
  sql.query(
    "select class.className, class.classId, class.classNum, users.userNo, college.collegeName from users, class, college where class.classTeacherId = users.userId and class.ownCollegeId = college.collegeId",
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

//查找课程
router.post("/searchClass", function(req, res) {
  if (req.body.qryContent == "") {
    sql.query(
      "select class.className, class.classId, class.classNum, users.userNo, college.collegeName from users, class, college where class.classTeacherId = users.userId and class.ownCollegeId = college.collegeId",
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
  } else {
    sql.query(
      'select class.className, class.classId, class.classNum, users.userNo, college.collegeName from class, users, college where class.classTeacherId = users.userId and class.ownCollegeId = college.collegeId and concat(class.classNum, class.className, users.userNo) like "%' +
        req.body.qryContent +
        '%"',
      function(err, rows) {
        if (err) {
            console.log(err)
          res.json({
            code: 0,
            success: false,
            message: "课程查找失败!"
          });
        } else {
          res.json({
            code: 1,
            message: "课程查找成功!",
            dataList: rows
          });
        }
      }
    );
  }
});
//添加/修改课程
router.post("/addClass", function(req, res) {
  if (req.body.classId) {
    sql.query(
      "select * from class where classId = " + req.body.classId,
      function(err, rows) {
        let len = rows.length;
        if (err || len === 0) {
          res.json({
            code: 0,
            success: false,
            message: "该课程不存在！"
          });
        } else {
          sql.query(
            'update class set className ="' +
              req.body.className +
              '", classNum ="' +
              req.body.classNum +
              '",ownCollegeId ="' +
              req.body.ownCollegeId +
              '",classTeacherId ="' +
              req.body.classTeacherId +
              '" where classId ="' +
              req.body.classId +
              '"',
            (err, rows) => {
              if (err) {
                res.json({
                  code: 0,
                  message: "课程修改失败!"
                });
              }
              res.json({
                code: 1,
                message: "课程修改成功!"
              });
            }
          );
        }
      }
    );
  } else {
    sql.query(
      'select * from class where classNum = "' + req.body.classNum + '"',
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
            'insert into class (className,classTeacherId,ownCollegeId,classNum) values ("' +
              req.body.className +
              '","' +
              req.body.classTeacherId +
              '","' +
              req.body.ownCollegeId +
              '","' +
              req.body.classNum +
              '")',
            (err, rows) => {
              if (err) {
                res.json({
                  code: 0,
                  message: "课程添加失败!"
                });
              }
              res.json({
                code: 1,
                message: "课程添加成功!"
              });
            }
          );
        }
      }
    );
  }
});

//返回请求课程信息
router.post("/getoneclass", function(req, res) {
  sql.query(
    'select * from class where classId = "' + req.body.classId + '"',
    function(err, rows) {
      let len = rows.length;
      if (len !== 0) {
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          class: rows
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
//返回教师信息
router.post("/getUsers", function(req, res) {
  sql.query("select userId, userNo from users where isteacher = 1", function(
    err,
    rows
  ) {
    let len = rows.length;
    if (len !== 0) {
      res.json({
        code: 1,
        success: true,
        message: "查找成功",
        users: rows
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

//删除课程
router.post("/deleteClass", (req, res) => {
  sql.query(
    "delete from class where classId in (" + req.body.id + ")",
    (err, rows) => {
      if (err) {
        throw (err,
        res.json({
          code: 0,
          success: false,
          message: "删除失败!"
        }));
      } else {
        res.json({
          code: 1,
          success: true,
          message: "删除成功!"
        });
      }
    }
  );
});
module.exports = router;
