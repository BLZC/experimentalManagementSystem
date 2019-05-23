// 登录注册用户管理模块
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sql = require("../serve");

//登录
router.post("/login", function(req, res) {
  if (req.body.type === "0") {
    if (req.body.userName === "admin" && req.body.password === "admin") {
      const rules = {
        userName: req.body.userName
      };
      jwt.sign(
        rules,
        "secret",
        {
          expiresIn: "1h"
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            code: 1,
            success: true,
            token: "lzc:" + token,
            message: "登录成功！",
            userNo: "管理员"
          });
        }
      );
    } else {
      res.json({
        code: 0,
        message: "账号或密码错误！"
      });
    }
  }
  if (req.body.type === "1") {
    sql.query(
      'select userName, userId, userNo from users where userName = "' +
        req.body.userName +
        '" and password="' +
        req.body.password +
        '"',
      function(err, rows) {
        if (err || rows.length == 0) {
          res.json({
            code: 0,
            message: "账号或密码错误！"
          });
        } else {
          const rules = {
            userId: rows[0].userId
          };
          jwt.sign(
            rules,
            "secret",
            {
              expiresIn: "1h"
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                code: 1,
                success: true,
                token: "lzc:" + token,
                message: "登录成功！",
                userName: rows[0].userName,
                userNo: rows[0].userNo,
                uid: rows[0].userId
              });
            }
          );
        }
      }
    );
  }
  if (req.body.type === "2") {
    sql.query(
      'select userName, uid, professionId, userNo from students where userName = "' +
        req.body.userName +
        '" and password="' +
        req.body.password +
        '"',
      function(err, rows) {
        if (err || rows.length == 0) {
          res.json({
            code: 0,
            message: "账号或密码错误！"
          });
        } else {
          const rules = {
            userId: rows[0].userId
          };
          jwt.sign(
            rules,
            "secret",
            {
              expiresIn: "1h"
            },
            (err, token) => {
              if (err) throw err;
              res.json({
                code: 1,
                success: true,
                token: "lzc:" + token,
                message: "登录成功！",
                userName: rows[0].userName,
                userNo: rows[0].userNo,
                uid: rows[0].uid,
                professionId: rows[0].professionId
              });
            }
          );
        }
      }
    );
  }
});

//菜单加载
router.post("/getLoad", (req, res) => {
  if (req.body.type === "0") {
    let loadlist = [
      {
        id: 5,
        icon: "iconfont icon-xueshengguanli", //图标
        menuName: "学生管理",
        title: "学生管理",
        url: "/studentmanage" //跳转路径
      },
      {
        id: 6,
        icon: "iconfont icon-laoshiguanli", //图标
        menuName: "教职工管理",
        title: "教职工管理",
        url: "/usermanage" //跳转路径
      },
      {
        id: 17,
        icon: "iconfont icon-kecheng", //图标
        menuName: "课程管理",
        title: "课程管理",
        url: "/classmanage" //跳转路径
      },
      {
        id: 18,
        icon: "iconfont icon-kechengguanli", //图标
        menuName: "实验管理",
        title: "实验管理",
        url: "/curriculummanage" //跳转路径
      },
      {
        id: 19,
        icon: "iconfont icon-resource", //图标
        menuName: "实验室资源管理",
        title: "实验室资源管理",
        url: "/laboratoryResources" //跳转路径
      }
    ];
    res.json({
      code: 1,
      success: true,
      dataList: loadlist,
      message: "菜单加载成功"
    });
  }
  if (req.body.type === "1") {
    let loadlist = [
      {
        id: 3,
        menuName: "查看留言",
        title: "查看留言",
        icon: "iconfont icon-xiaoxitixing", //图标
        url: "/leavemessage" //跳转路径
      },
      {
        id: 12,
        menuName: "教职工课表",
        title: "教职工课表",
        icon: "iconfont icon-paikebiao", //图标
        url: "/curriculum" //跳转路径
      },
      {
        id: 15,
        menuName: "统计成绩",
        title: "统计成绩",
        icon: "iconfont icon-chengji", //图标
        url: "/setgrade" //跳转路径
      }
    ];
    res.json({
      code: 1,
      success: true,
      dataList: loadlist,
      message: "菜单加载成功"
    });
  }
  if (req.body.type === "2") {
    let loadlist = [
      {
        id: 3,
        menuName: "查看留言",
        title: "查看留言",
        icon: "iconfont icon-xiaoxitixing", //图标
        url: "/leavemessage" //跳转路径
      },
      // {
      //   id: 8,
      //   menuName: "学生选课",
      //   title: "学生选课",
      //   icon: "iconfont icon-xuanke-xian", //图标
      //   url: "/electivecourse" //跳转路径
      // },
      {
        id: 11,
        menuName: "学生课表",
        title: "学生课表",
        icon: "iconfont icon-paikebiao", //图标
        url: "/studentcurriculum" //跳转路径
      },
      {
        id: 14,
        menuName: "查看成绩",
        title: "查看成绩",
        icon: "iconfont icon-chengji", //图标
        url: "/grade" //跳转路径
      }
    ];
    res.json({
      code: 1,
      success: true,
      dataList: loadlist,
      message: "菜单加载成功"
    });
  }
});

//提醒消息
router.post("/warnmessage", (req, res) => {});

//密码修改
router.post("/changepassword", (req, res) => {
  if (req.body.type === 2) {
    sql.query(
      'update students set password = "' +
        req.body.password +
        '" where uid =' +
        req.body.uid,
      (err, rows) => {
        if (err) console.log(err);
        else {
          res.json({
            code: 1,
            message: "密码修改成功"
          });
        }
      }
    );
  }
  if (req.body.type === 1) {
    sql.query(
      'update users set password = "' +
        req.body.password +
        '" where userId =' +
        req.body.uid,
      (err, rows) => {
        if (err) console.log(err);
        else {
          res.json({
            code: 1,
            message: "密码修改成功"
          });
        }
      }
    );
  }
});

//所有教职工信息
router.post("/getUsers", function(req, res) {
  sql.query(
    "select users.userId, users.userName, users.userNo,  users.sex, users.born, users.inschool, college.collegeName from users, college where users.collegeId = college.collegeId",
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

//添加教职工
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
          'insert into users (userName,sex,userNo,collegeId,born,inschool,password) values ("' +
            req.body.userName +
            '","' +
            req.body.sex +
            '","' +
            req.body.userNo +
            '","' +
            req.body.college +
            '","' +
            req.body.born +
            '","' +
            req.body.inschool +
            '","123456")',
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
//返回某个教职工
router.post("/getoneUser", function(req, res) {
  sql.query(
    'select * from users where userName = "' + req.body.userName + '"',
    (err, rows) => {
      if (err) console.log(err);
      else {
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          user: rows
        });
      }
    }
  );
});
//查找教职工
router.post("/searchUser", function(req, res) {
  if (req.body.userName == "") {
    sql.query(
      "select users.userId, users.userName, users.userNo, users.sex, users.born, users.inschool, college.collegeName from users,college  where users.collegeId = college.collegeId",
      function(err, rows) {
        console.log(rows);
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
  } else {
    sql.query(
      'select users.userId, users.userName, users.userNo,  users.sex, users.born, users.inschool, college.collegeName from users,college  where users.collegeId = college.collegeId and concat(userName,userNo)  like "%' +
        req.body.qryContent +
        '%"',
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
  console.log(req.body);
  sql.query(
    'update users set userName ="' +
      req.body.userName +
      '", sex ="' +
      req.body.sex +
      '",userNo ="' +
	  req.body.userNo +
	  '",collegeId ="' +
	  req.body.college +
	  '",inschool ="' +
      req.body.inschool +
      '",born ="' +
      req.body.born +
      '" where userId ="' +
      req.body.userId +
      '"',
    (err, rows) => {
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
  sql.query(
    "delete from users where userId in (" + req.body.userId + ")",
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

//教师密码重置
router.post("/retcpassword", (req, res)=>{
	sql.query('update users set password = "123456" where userId ='+req.body.uid, (err, rows)=>{
	  if(err) console.log(err);
	  else{
		res.json({
		  code: 1,
		  message: "密码重置成功！"
		})
	  }
	})
  })


//实验室资源
router.post("/addresource", (req, res) => {
  if (req.body.id) {
    sql.query(
      'update resource set place = "' +
        req.body.place +
        '", device = ' +
        parseInt(req.body.device) +
        ", demanged =" +
        parseInt(req.body.demanged) +
        ",manager=" +
        req.body.manager +
        ', remark="' +
        req.body.remark +
        '" where id =' +
        req.body.id,
      (err, rows) => {
        if (err) console.log(err);
        res.json({
          code: 1,
          success: true,
          message: "修改成功！"
        });
      }
    );
  } else {
    sql.query(
      'insert into resource (place,device,demanged,manager,remark) values("' +
        req.body.place +
        '", "' +
        parseInt(req.body.device) +
        '","' +
        parseInt(req.body.demanged) +
        '","' +
        req.body.manager +
        '","' +
        req.body.remark +
        '")',
      (err, rows) => {
        if (err) console.log(err);
        res.json({
          code: 1,
          success: true,
          message: "添加成功"
        });
      }
    );
  }
});

//获取当前资源
router.post("/getresource", (req, res) => {
  sql.query(
    "select * from resource where resource.id =" + req.body.id,
    (err, rows) => {
      if (err) console.log(err);
      res.json({
        code: 1,
        success: true,
        dataList: rows,
        message: "查询成功！"
      });
    }
  );
});

//删除实验室资源
router.post("/rmresource", (req, res) => {
  sql.query(
    "delete from resource where id in (" + req.body.ids + ")",
    (err, rows) => {
      if (err) console.log(err);
      res.json({
        code: 1,
        success: true,
        message: "删除成功"
      });
    }
  );
});

//查找实验室资源
router.post("/searchresource", (req, res) => {
  if (req.body.qryContent) {
    sql.query(
      'select resource.id, resource.place,resource.device,resource.demanged,users.userNo, resource.remark from resource, users where users.userId = resource.manager and concat(resource.place, users.userNo) like "%' +
        req.body.qryContent +
        '%"',
      (err, rows) => {
        if (err) console.log(err);
        res.json({
          dataList: rows,
          message: "查询成功"
        });
      }
    );
  } else {
    sql.query(
      "select resource.id, resource.place,resource.device,resource.demanged,users.userNo, resource.remark from resource, users where users.userId = resource.manager",
      (err, rows) => {
        if (err) console.log(err);
        res.json({
          dataList: rows,
          message: "查询成功"
        });
      }
    );
  }
});

module.exports = router;
