// 登录注册用户管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//学生选课
router.post("/electivecourse", (req, res)=>{
    sql.query(
        'select * from sc where sid = '+req.body.uid+' and cid = '+req.body.cid, (err, rows)=>{
            if(err) throw err;
            else{
                if(rows.length > 0){
                    res.json({
                        code: 0,
                        success: false,
                        message: "你已经选过这门课程，请不要重复选课!"
                    })
                }
                else{
                    sql.query(
                        'insert into sc (sid, cid) values ('+
                        req.body.uid+','+req.body.cid+')', (err,rows)=>{
                            if(err) throw err;
                            else{
                                res.json({
                                    code: 1,
                                    success: true,
                                    message: "选课成功!"
                                })
                            }
                        }
                    )
                }
            }
        }
    )
})

//课程退选
router.post("/noelectivecourse", (req, res)=>{
    console.log(req.body)
    sql.query(
        'select * from sc where sid = '+req.body.uid+' and cid = '+req.body.cid, (err, rows)=>{
            if(err) throw err;
            else{
                if(rows.length <= 0){
                    res.json({
                        code: 0,
                        success: false,
                        message: "你尚无选过这门课程"
                    })
                }
                else{
                    sql.query(
                        'delete from sc where sid = '+
                        req.body.uid+' and cid = '+req.body.cid, (err,rows)=>{
                            if(err) throw err;
                            else{
                                res.json({
                                    code: 1,
                                    success: true,
                                    message: "退选成功"
                                })
                            }
                        }
                    )
                }
            }
        }
    )
})

//所有用户信息
router.post("/getUsers", function(req, res) {
  sql.query(
    "select users.userId, users.userName, users.userNo, users.password, college.collegeName from users, college where users.collegeId = college.collegeId",
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

//学院信息
router.post("/getCollege", function(req, res) {
  sql.query("select * from college", function(err, rows) {
    if (err || rows.length == 0) {
      res.json({
        code: 0,
        message: "尚无数据"
      });
    } else {
      res.json({
        code: 1,
        success: true,
        message: "查询成功！",
        collegelist: rows
      });
    }
  });
});

//添加/修改用户
router.post("/addUser", function(req, res) {
  sql.query(
    'select * from users where userName = "' + req.body.userName + '"',
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
          'insert into users (userName,password,userNo,collegeId) values ("' +
            req.body.userName +
            '","' +
            req.body.password +
            '","' +
            req.body.userNo +
            '","' +
            req.body.college +
            '")',
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
});
//返回用户信息
router.post("/getoneUser", function(req, res) {
  sql.query(
    'select * from users where userName = "' + req.body.userName + '"',
    function(err, rows) {
      let len = rows.length;
      if (len !== 0) {
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          user: [
            {
              userName: rows[0].userName,
              password: rows[0].password,
              userNo: rows[0].userNo,
              college: rows[0].collegeId
            }
          ]
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
//查找用户
router.post("/searchUser", function(req, res) {
  if(req.body.userName == ""){
    sql.query(
      'select users.userId, users.userName, users.userNo, users.password, college.collegeName from users,college  where users.collegeId = college.collegeId',
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
      'select users.userId, users.userName, users.userNo, users.password, college.collegeName from users,college  where users.collegeId = college.collegeId and concat(userName,userNo)  like "%' +
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
//修改用户
router.post("/changeUser", function(req, res) {
  console.log(req.body)
  sql.query(
    'update users set userName ="' +
      req.body.userName +
      '", password ="' +
      req.body.password +
      '",userNo ="' +
      req.body.userNo +
      '",collegeId ="' +
      req.body.college +
      '" where userId ="' +
      req.body.userId +
      '"',
    (err, rows)=>{
      console.log(rows);
      if (err) {
        res.json({
          code: 0,
          success: false,
          message: "用户修改失败!"
        });
      } else {
        res.json({
          code: 1,
          message: "用户修改成功!"
        });
      }
    }
  );
});
//删除用户
router.post("/deleteUser", (req, res) => {
  sql.query('delete from users where userId in ('+req.body.userId+')', (err, rows) => {
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
