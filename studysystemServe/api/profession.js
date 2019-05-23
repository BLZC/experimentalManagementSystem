// 专业及课表设置
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//获取专业
router.post("/getprofession", (req, res) => {
  if (req.body.collegeId) {
    sql.query(
      'select * from profession where collegeId ="' + req.body.collegeId + '"',
      (err, rows) => {
        if (err) console.log(err);
        else {
          res.json({
            code: 1,
            dataList: rows
          });
        }
      }
    );
  } else {
    sql.query("select * from profession", (err, rows) => {
      if (err) console.log(err);
      else {
        res.json({
          code: 1,
          dataList: rows
        });
      }
    });
  }
});

//获取已设置集中性实践的专业
router.post("/gjzp_pro", (req, res) => {
  sql.query(
    "select profession from pc where id =" + req.body.id,
    (err, rows) => {
      if (err) console.log(err);
      else {
        res.json({
          code: 1,
          dataList: rows
        });
      }
    }
  );
});

//设置开课专业
router.post("/sjzp_pro", (req, res) => {
  if (req.body.type) {
    sql.query(
      "delete from pc where id =" + req.body.id + " and type = 1",
      (err, rows) => {
        if (err) console.log(err);
        else {
          let profession = req.body.setprofession;
          profession.forEach(v => {
            sql.query(
              'insert into pc (id, profession, type) values("' +
                req.body.id +
                '","' +
                v +
                '","1")',
              (err, rows) => {
                if (err) console.log(err);
              }
            );
          });
          res.json({
            code: 1,
            message: "设置成功"
          });
        }
      }
    );
  } else {
    sql.query(
      "delete from pc where id =" + req.body.id + " and type = 0",
      (err, rows) => {
        if (err) console.log(err);
        else {
          let profession = req.body.setprofession;
          profession.forEach(v => {
            sql.query(
              'insert into pc (id, profession, type) values("' +
                req.body.id +
                '","' +
                v +
                '","0")',
              (err, rows) => {
                if (err) console.log(err);
              }
            );
          });
          res.json({
            code: 1,
            message: "设置成功"
          });
        }
      }
    );
  }
});

module.exports = router;
