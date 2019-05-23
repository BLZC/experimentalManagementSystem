// 集中性实践管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//设置评分表
router.post("/setscore", (req, res) => {
    let count = 0;
    req.body.arr.forEach(v => {
      count += parseInt(v.proportion);
    });
    console.log(count);
    if (count !== 10) {
      res.json({
        message: "设置失败，比例之和必须为10"
      });
    } else {
      sql.query(
        "select * from setscore where cid=" + req.body.id,
        (err, rows) => {
          if (rows.length > 0) {
            res.json({
              message: "设置失败，评分表已设置"
            });
          } else {
            req.body.arr.forEach(v => {
              sql.query(
                'insert into setscore (cid, stage, proportion) values ("' +
                  req.body.id +
                  '", "' +
                  v.stage +
                  '", "' +
                  v.proportion +
                  '")',
                (err, rows) => {
                  if (err) console.log(err);
                }
              );
            });
            res.json({
              code: 1,
              success: true,
              datalist: rows,
              message: "设置成功！"
            });
          }
        }
      );
    }
  });
  //集中实践报告评分模板
  router.post("/getpgrade", (req, res) => {
    sql.query(
      "select stage, proportion from setscore where cid =" + req.body.id,
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
  
//教师查看集中性实践成绩
router.post("/xsgrade", (req,res)=>{
	sql.query('select students.userNo,students.userName, pricticereport.grade from students, pricticereport where pricticereport.uid = students.uid and pricticereport.cid ='+req.body.id, (err, rows)=>{
		if(err) console.log(err);
		else {
			res.json({
				code: 1,
				success: true,
				dataList: rows,
				message: "查询成功！"
			})
		}
})
}),
  //集中实践报告评分
  router.post("/setpgrade", (req, res) => {
    let arr = req.body.arr;
    if (arr) {
      arr.forEach(v => {
        sql.query(
          'insert into addscore (cid,uid,stage,grade) values ("' +
            parseInt(req.body.id) +
            '","' +
            parseInt(req.body.uid) +
            '","' +
            v.stage +
            '","' +
            v.proportion +
            '")',
          (err, rows) => {
            if (err) console.log(err);
          }
        );
      });
      sql.query(
        "select setscore.cid, setscore.stage, setscore.proportion, addscore.grade from setscore, addscore where setscore.cid = addscore.cid and setscore.stage = addscore.stage",
        (err, rows) => {
          let count = 0;
          rows.forEach(v => {
            count += parseFloat(v.proportion) * parseFloat(v.grade);
          });
          count = count/10
          sql.query(
            'update pricticereport set grade = ' +
              count,
            (err, rows) => {
              if (err) console.log(err);
              res.json({
                code: 1,
                success: true,
                message: "评分成功！"
              });
            }
          );
        }
      );
    }
  });

module.exports = router;