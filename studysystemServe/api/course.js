// 课程管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");
const fs = require("fs");
const path = require("path");


//返回所有集中性实践课程信息
router.post("/getjzp", function(req, res) {
  sql.query(
    "select jzpractice.id,jzpractice.hour,jzpractice.time,jzpractice.name,jzpractice.location,assessment.assessmentName,users.userNo from jzpractice, users, assessment where jzpractice.userId = users.userId  and jzpractice.assessmentId = assessment.id",
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

//选课课程查找
// router.post("/getelectivecourse", (req, res) => {
//   if (req.body.qryContent == "") {
//     sql.query(
//       "select course.hour,class.className,course.time,course.name,course.location,assessment.assessmentName,users.userNo from course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id and course.type = " +
//         req.body.electivetype,
//       function(err, rows) {
//         if (err) console.log(err);
//         else {
//           res.json({
//             code: 1,
//             success: true,
//             message: "查询成功！",
//             dataList: rows
//           });
//         }
//       }
//     );
//   } else {
//     sql.query(
//       "select course.hour,class.className,course.type,course.time,course.name,course.location,assessment.assessmentName,users.userNo from course, users, class, assessment where course.userId = users.userId and course.ownId = class.classId and course.type = " +
//         req.body.electivetype +
//         ' and course.assessmentId = assessment.id and concat(course.name, users.userNo, class.className) like "%' +
//         req.body.qryContent +
//         '%"',
//       function(err, rows) {
//         if (err) {
//           res.json({
//             code: 0,
//             success: false,
//             message: "实验课程查找失败!"
//           });
//         } else {
//           res.json({
//             code: 1,
//             message: "实验课程查找成功!",
//             dataList: rows
//           });
//         }
//       }
//     );
//   }
// });

//返回所属课程信息
router.post("/getClass", function(req, res) {
  sql.query("select * from class", function(err, rows) {
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
  });
});

//返回教职工课程课表
router.post("/getteachercurriculumc", function(req, res) {
  sql.query(
    "select course.cid,course.hour,class.className,class.classId,course.time,course.name,course.location,assessment.assessmentName,users.userNo from course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id and class.classTeacherId =" +
      req.body.uid,
    (err, rows) => {
      if (err) console.log(err);
      else {
        rows.forEach(v => {
          v.tp = 1;
        });
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          class: rows
        });
      }
    }
  );
});

//返回教职工集中性实践课表
router.post("/getteachercurriculump", function(req, res) {
  sql.query(
    "select jzpractice.id,jzpractice.hour,jzpractice.time,jzpractice.name,jzpractice.location,assessment.assessmentName,users.userNo from jzpractice, users, assessment where jzpractice.userId = users.userId  and jzpractice.assessmentId = assessment.id and jzpractice.userId =" +
      req.body.uid,
    (err, rows) => {
      if (err) console.log(err);
      else {
        rows.forEach((v, index) => {
          v.tp = 0;
        });
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          class: rows
        });
      }
    }
  );
});

//返回学生课表
router.post("/getstudentcourse", function(req, res) {
  sql.query(
    "select * from pc where profession =" + req.body.profession,
    (err, rows) => {
      if (err) console.log(err);
      else {
        let nlist = [];
        let list = rows;
        list.forEach((v, index) => {
          if (v.type === 1) {
            sql.query(
              "select course.cid,course.hour,class.className,course.time,course.name,course.location,assessment.assessmentName,users.userNo,users.userId from course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id and class.classId =" +
                v.id,
              (err, rows) => {
                if (err) console.log(err);
                else {
                  rows.forEach(k => {
                    k.tp = v.type;
                    nlist.push(k);
                    if (index === list.length - 1) {
                      res.json({
                        code: 1,
                        success: true,
                        message: "查找成功",
                        dataList: nlist
                      });
                    }
                  });
                }
              }
            );
          }
          if (v.type === 0) {
            sql.query(
              "select jzpractice.id,jzpractice.hour,jzpractice.time,jzpractice.name,jzpractice.location,assessment.assessmentName,users.userNo,users.userId from jzpractice, users, assessment where jzpractice.userId = users.userId  and jzpractice.assessmentId = assessment.id and jzpractice.id =" +
                v.id,
              (err, rows) => {
                if (err) console.log(err);
                else {
                  rows.forEach(k => {
                    k.tp = v.type;
                    nlist.push(k);
                    if (index === list.length - 1) {
                      res.json({
                        code: 1,
                        success: true,
                        message: "查找成功",
                        dataList: nlist
                      });
                    }
                  });
                }
              }
            );
          }
        });
      }
    }
  );
});

//学生课表查询
router.post("/searchstudentcourse", function(req, res) {
  sql.query(
    "select course.cid,course.hour,class.className,course.time,course.name,course.location,assessment.assessmentName,users.userNo from sc, students, course, users, class, assessment where class.classTeacherId = users.userId and course.ownId = class.classId and course.assessmentId = assessment.id and course.cid = sc.cid and sc.sid = students.uid and sc.sid = " +
      req.body.sid +
      ' and concat(course.name, users.userNo, class.className) like "%' +
      req.body.qryContent +
      '%"',
    (err, rows) => {
      if (err) console.log(err);
      else {
        res.json({
          code: 1,
          success: true,
          message: "查找成功",
          dataList: rows
        });
      }
    }
  );
});

//返回教师信息
router.post("/getUsers", function(req, res) {
  sql.query("select userId, userNo from users", function(err, rows) {
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

//返回考核信息
router.post("/getAssessment", function(req, res) {
  sql.query("select * from assessment", function(err, rows) {
    let len = rows.length;
    if (len !== 0) {
      res.json({
        code: 1,
        success: true,
        message: "查找成功",
        assessment: rows
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

module.exports = router;
