// 实验任务与实验报告模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");
const fs = require("fs");
const path = require("path");

//参考资料下载
router.get("/download", function(req, res) {
    const load = path.join(__dirname, "..");
    dir = load + "/source/" + req.query.name;
    res.download(dir);
  });

  //学生实验报告下载
  router.get("/downloadreport", function(req, res) {
    const load = path.join(__dirname, "..");
    dir = load + "/report/" + req.query.name;
    res.download(dir);
  });

  //集中性实践参考资料上传
router.post("/jzupload", (req, res) => {
    if (req.file) {
      const load = path.join(__dirname, "..");
      const fname = req.file.fieldname; //获取上传文件的名字
      const oname = new Date().getTime() + "_" + req.file.originalname; //获取上传文件的原始名字
      fs.renameSync(req.file.path, load + "/source/" + oname); //重命名，加后缀，不然图片会显示乱码，打不开
      sql.query(
        "select * from practice where cid = " + req.body.id,
        (err, rows) => {
          if (err) console.log(err);
          else {
            if (rows[0].ziliao1.length <= 0) {
              sql.query(
                'update practice set ziliao1 ="' +
                  oname +
                  '" where cid =' +
                  req.body.id,
                (err, rows) => {
                  if (err) console.log(err);
                  else {
                    res.json({
                      code: 1,
                      success: true,
                      message: "上传成功"
                    });
                  }
                }
              );
            } else {
              if (rows[0].ziliao2.length <= 0) {
                sql.query(
                  'update practice set ziliao2 ="' +
                    oname +
                    '" where cid =' +
                    req.body.id,
                  (err, rows) => {
                    if (err) console.log(err);
                    else {
                      res.json({
                        code: 1,
                        success: true,
                        message: "上传成功"
                      });
                    }
                  }
                );
              } else {
                if (rows[0].ziliao3.length <= 0) {
                  sql.query(
                    'update practice set ziliao3 ="' +
                      oname +
                      '" where cid =' +
                      req.body.id,
                    (err, rows) => {
                      if (err) console.log(err);
                      else {
                        res.json({
                          code: 1,
                          success: true,
                          message: "上传成功"
                        });
                      }
                    }
                  );
                } else {
                  res.json({
                    code: 0,
                    success: false,
                    message:
                      "你已上传三份参考资料，如需继续上传，请删掉以前的参考资料！"
                  });
                }
              }
            }
          }
        }
      );
    }
  });

//课内实验参考资料上传
router.post("/upload", (req, res) => {
    if (req.file) {
      const load = path.join(__dirname, "..");
      const fname = req.file.fieldname; //获取上传文件的名字
      const oname = new Date().getTime() + "_" + req.file.originalname; //获取上传文件的原始名字
      fs.renameSync(req.file.path, load + "/source/" + oname); //重命名，加后缀，不然图片会显示乱码，打不开
      sql.query(
        "select * from task where cid = " +
          req.body.id +
          " and ordertitle = " +
          req.body.ordertitle,
        (err, rows) => {
          if (err) console.log(err);
          else {
            if (rows[0].ziliao1.length <= 0) {
              sql.query(
                'update task set ziliao1 ="' +
                  oname +
                  '" where cid =' +
                  req.body.id +
                  " and ordertitle = " +
                  req.body.ordertitle,
                (err, rows) => {
                  if (err) console.log(err);
                  else {
                    res.json({
                      code: 1,
                      success: true,
                      message: "上传成功"
                    });
                  }
                }
              );
            } else {
              if (rows[0].ziliao2.length <= 0) {
                sql.query(
                  'update task set ziliao2 ="' +
                    oname +
                    '" where cid =' +
                    req.body.id +
                    " and ordertitle = " +
                    req.body.ordertitle,
                  (err, rows) => {
                    if (err) console.log(err);
                    else {
                      res.json({
                        code: 1,
                        success: true,
                        message: "上传成功"
                      });
                    }
                  }
                );
              } else {
                if (rows[0].ziliao3.length <= 0) {
                  sql.query(
                    'update task set ziliao3 ="' +
                      oname +
                      '" where cid =' +
                      req.body.id +
                      " and ordertitle = " +
                      req.body.ordertitle,
                    (err, rows) => {
                      if (err) console.log(err);
                      else {
                        res.json({
                          code: 1,
                          success: true,
                          message: "上传成功"
                        });
                      }
                    }
                  );
                } else {
                  res.json({
                    code: 0,
                    success: false,
                    message:
                      "你已上传三份参考资料，如需继续上传，请删掉以前的参考资料！"
                  });
                }
              }
            }
          }
        }
      );
    }
  });

//学生课内实验报告添加
router.post("/addreport", (req, res) => {
    sql.query(
      "select * from report where cid = " +
        req.body.id +
        " and uid = " +
        req.body.uid +
        " and ordertitle = " +
        req.body.ordertitle,
      (err, rows) => {
        if (err) console.log(err);
        if (rows.length > 0) {
          res.json({
            code: 0,
            success: false,
            message: "你已经提交过该实验的实验报告，请勿重复提交!"
          });
        } else {
          sql.query(
            'insert into report (uid, cid, ordertitle) values ("' +
              req.body.uid +
              '", "' +
              req.body.id +
              '", "' +
              req.body.ordertitle +
              '")',
            (err, rows) => {
              res.json({
                code: 1,
                success: true,
                message: "实验报告提交成功！"
              });
            }
          );
        }
      }
    );
  });
//学生课内实验报告上传
router.post("/uploadreport", (req, res) => {
    if (req.file) {
      const load = path.join(__dirname, "..");
      const fname = req.file.fieldname; //获取上传文件的名字
      const oname = new Date().getTime() + "_" + req.file.originalname; //获取上传文件的原始名字
      fs.renameSync(req.file.path, load + "/report/" + oname); //重命名，加后缀，不然图片会显示乱码，打不开
      sql.query(
        'update report set reportName = "' +
          oname +
          '" where cid =' +
          req.body.id +
          " and uid = " +
          req.body.uid,
        " and ordertitle = " + req.body.ordertitle,
        (err, rows) => {
          if (err) console.log(err);
          else {
            res.json({
              code: 1,
              success: true,
              message: "上传成功"
            });
          }
        }
      );
    }
  });

  //学生实践报告信息添加
router.post("/addprictice", (req, res) => {
    sql.query(
      "select * from pricticereport where cid = " +
        req.body.id +
        " and uid = " +
        req.body.uid,
      (err, rows) => {
        if (err) console.log(err);
        if (rows.length > 0) {
          res.json({
            code: 0,
            success: false,
            message: "你已经提交过该实验的实验报告，请勿重复提交!"
          });
        } else {
          sql.query(
            'insert into pricticereport (uid, cid) values ("' +
              req.body.uid +
              '", "' +
              req.body.id +
              '")',
            (err, rows) => {
              res.json({
                code: 1,
                success: true,
                message: "实验报告提交成功！"
              });
            }
          );
        }
      }
    );
  });
  
  //学生实践实验报告上传
  router.post("/uploadprictice", (req, res) => {
    if (req.file) {
      const load = path.join(__dirname, "..");
      const fname = req.file.fieldname; //获取上传文件的名字
      const oname = new Date().getTime() + "_" + req.file.originalname; //获取上传文件的原始名字
      fs.renameSync(req.file.path, load + "/report/" + oname); //重命名，加后缀，不然图片会显示乱码，打不开
      if(req.body){
      sql.query(
        'update pricticereport set reportName = "' +
          oname +
          '" where cid =' +
          req.body.id +
          " and uid = " +
          req.body.uid,
        (err, rows) => {
          if (err) console.log(err);
          else {
            res.json({
              code: 1,
              success: true,
              message: "上传成功"
            });
          }
        }
      );
    }
    }
  });

  //查看已提交的课内实验报告
router.post("/getAllreports", (req, res) => {
    sql.query(
      "select students.userNo, students.userName, report.uid, report.reportName, report.grade, report.ordertitle, task.endTime from students, report, task where students.uid = report.uid and task.cid = report.cid and task.ordertitle = report.ordertitle and report.cid = " +
        req.body.cid +
        " and report.ordertitle = " +
        req.body.ordertitle +
        ' and concat(students.userNo, students.userName) like "%' +
        req.body.qryContent +
        '%"',
      (err, rows) => {
        if (err) console.log(err);
        else {
          res.json({
            code: 1,
            success: true,
            dataList: rows,
            message: "查询成功！"
          });
        }
      }
    );
  });
  //查询已提交的集中性实验报告
router.post("/getSAlljzreports", (req, res) => {
    sql.query(
      "select students.uid, students.userNo, students.userName, pricticereport.reportName, pricticereport.grade from students, pricticereport where students.uid = pricticereport.uid and pricticereport.cid = " +
        req.body.id +
        ' and concat(students.userNo, students.userName) like "%' +
        req.body.qryContent +
        '%"',
      (err, rows) => {
        if (err) console.log(err);
        else {
          res.json({
            code: 1,
            success: true,
            dataList: rows,
            message: "查询成功！"
          });
        }
      }
    );
  });

  //查看已提交的集中性实验报告
router.post("/getAlljzreports", (req, res) => {
    sql.query(
      "select addscore.uid, addscore.cid, addscore.grade, addscore.stage, setscore.proportion from addscore, setscore where addscore.cid = setscore.cid and addscore.stage = setscore.stage",
      (err, rows) => {
        if (err) console.log(err);
        else {
          let nList = rows;
          nList.forEach(v => {
            v.trgrade = (v.grade * v.proportion) / 10;
            sql.query(
              "update addscore set trgrade =" +
                v.trgrade +
                " where uid=" +
                v.uid +
                " and cid=" +
                v.cid +
                ' and stage="' +
                v.stage +
                '"',
              (err, rows) => {
                if (err) console.log(err);
              }
            );
          });
        }
      }
    );
    sql.query(
      "select uid, cid, sum(trgrade) as ttgrade from addscore group by uid",
      (err, rows) => {
        if (err) console.log(err);
        else {
          let dList = rows;
          dList.forEach(v => {
            v.ttgrade = v.ttgrade.toFixed(2);
            sql.query(
              "update pricticereport set grade =" +
                v.ttgrade +
                " where uid=" +
                v.uid +
                " and cid=" +
                v.cid,
              (err, rows) => {
                if (err) console.log(err);
              }
            );
          });
        }
      }
    );
    sql.query(
      "select students.uid, students.userNo, students.userName, pricticereport.reportName, pricticereport.grade, practice.endTimegrade from students, pricticereport, practice where students.uid = pricticereport.uid and pricticereport.cid = practice.cid and pricticereport.cid = " +
        req.body.id,
      (err, rows) => {
        if (err) console.log(err);
        else {
          res.json({
            code: 1,
            success: true,
            dataList: rows,
            message: "查询成功！"
          });
        }
      }
    );
  });
module.exports = router;