// 登录注册用户管理模块
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sql = require("../serve");

//所有学生信息
router.post("/getUsers", function(req, res) {
  sql.query(
    "select students.uid, students.userName, students.userNo,students.sex,students.born, students.class,students.inschool,profession.professionName, college.collegeName from students, profession, college where students.collegeId = college.collegeId and students.professionId = profession.id",
    function(err, rows) {
      if (err) {
        res.json({
          code: 0,
          message: "查询失败",
        });
      } else {
        res.json({
          code: 1,
          success: true,
          message: "查询成功！",
          userlist: rows
        });
      }
    }
  );
});

//添加/修改学生
router.post("/addUsers", function(req, res) {
  if (req.body.id) {
    sql.query(
      'select * from students where uid = ' + req.body.id,
      function(err, rows) {
        let len = rows.length;
        if (err || len === 0) {
          res.json({
            code: 0,
            success: false,
            message: "该用户不存在！"
          });
        } else {
          sql.query(
            'update students set userName ="' +
              req.body.userName +
              '", userNo ="' +
              req.body.userNo +
              '",class ="' +
              req.body.class +
              '",collegeId ="' +
              req.body.college +
              '",professionId ="' +
              req.body.professionId +
              '",sex ="' +
              req.body.sex +
              '",inschool ="' +
              req.body.inschool +
              '",born ="' +
              req.body.born +
              '" where uid ="' +
              req.body.id +
              '"',
            (err, rows) => {
              if (err) {
                res.json({
                  code: 0,
                  message: "用户修改失败!"
                });
              }
              res.json({
                code: 1,
                message: "用户修改成功!"
              });
            }
          );
        }
      }
    );
  } else {
    sql.query(
      'select * from students where uid = "' + req.body.id + '"',
      function(err, rows) {
        let len = rows.length;
        if (err || len !== 0) {
          res.json({
            code: 0,
            success: false,
            message: "该用户已经存在！"
          });
        } else {
          sql.query(
            'insert into students (userName,userNo,class,sex,inschool,born,collegeId,professionId,password) values ("' +
              req.body.userName +
              '","' +
              req.body.userNo +
              '","' +
              req.body.class +
              '","' +
              req.body.sex +
              '","' +
              req.body.inschool +
              '","' +
              req.body.born +
              '","' +
              req.body.college +
              '","' +
              req.body.professionId +
              '", "123456")',
            (err, rows) => {
              if (err) {
                res.json({
                  code: 0,
                  message: "用户添加失败!"
                });
              }
              res.json({
                code: 1,
                message: "用户添加成功!"
              });
            }
          );
        }
      }
    );
  }
});

//学生密码重置
router.post("/repassword", (req, res)=>{
  sql.query('update students set password = "123456" where uid ='+req.body.uid, (err, rows)=>{
    if(err) console.log(err);
    else{
      res.json({
        code: 1,
        message: "密码重置成功！"
      })
    }
  })
})

//返回某个学生信息
router.post("/getoneUser", function(req, res) {
  sql.query(
    'select students.uid, students.userName, students.userNo,students.sex,students.born, students.class,students.inschool,profession.id, college.collegeId from students, profession, college where students.collegeId = college.collegeId and students.professionId = profession.id and uid = "' + req.body.id + '"',
    function(err, rows) {
      let len = rows.length;
      if (len !== 0) {
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          user: rows
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
//查找学生
router.post("/searchUser", function(req, res) {
  if(req.body.userName == ""){
    sql.query(
      'select students.uid, students.userName, students.userNo,students.sex,students.born, students.class,students.inschool,profession.professionName, college.collegeName from students, profession, college where students.collegeId = college.collegeId and students.professionId = profession.id',
      function(err, rows) {
        console.log(rows)
        if (err) {
          res.json({
            code: 0,
            success: false,
            message: "用户查找失败!"
          });
        } else {
          res.json({
            code: 1,
            message: "用户查找成功!",
            dataList: rows
          });
        }
      }
    );
  }
  else{
    sql.query(
      'select students.uid, students.userName, students.userNo,students.sex,students.born, students.class,students.inschool, college.collegeName, profession.professionName from students, college, profession where students.collegeId = college.collegeId and students.professionId = profession.id and concat(userName,userNo)  like "%' +
      req.body.qryContent + '%"',
      function(err, rows) {
        if (err) {
          res.json({
            code: 0,
            success: false,
            message: "用户查找失败!"
          });
        } else {
          res.json({
            code: 1,
            message: "用户查找成功!",
            dataList: rows
          });
        }
      }
    );
  }
});

//删除学生
router.post("/deleteUser", (req, res) => {
  sql.query('delete from students where uid in ('+req.body.id+')', (err, rows) => {
    if (err) {
      throw err,
      res.json({
        code: 0,
        success: false,
        message: "删除失败!"
      });
    } else {
      res.json({
        code: 1,
        success: true,
        message: "删除成功!"
      });
    }
  });
});

module.exports = router;
