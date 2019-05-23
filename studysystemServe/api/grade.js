// 课内实验管理模块
const express = require("express");
const router = express.Router();
const sql = require("../serve");

//课内实验报告评分
router.post("/setgrade", (req, res) => {
	if (0 <= parseFloat(req.body.grade) <= 100) {
	  sql.query(
		'update report set grade = "' +
		  req.body.grade +
		  '" where cid = ' +
		  req.body.cid +
		  " and uid = " +
		  req.body.uid +
		  " and ordertitle = " +
		  req.body.ordertitle,
		(err, rows) => {
		  if (err) console.log(err);
		  else {
			res.json({
			  code: 1,
			  success: true,
			  message: "评分成功"
			});
		  }
		}
	  );
	} else {
	  res.json({
		code: 0,
		success: false,
		message: "分数范围0-100"
	  });
	}
  });

//查询课内实验详细成绩
router.post("/getgrade", (req, res)=>{
    sql.query('select task.title, report.id, report.grade from report, task, class where report.cid = class.classId and task.cid=report.cid and task.ordertitle=report.ordertitle and report.cid = '+req.body.cid+' and report.uid = '+req.body.uid, (err, rows)=>{
    if(err)  console.log(err);
    res.json({
        code: 1,
        dataList: rows,
        message: "查询成功"
    })
    })
})

//设置课内实验比例系数
router.post("/setproportion", (req, res) => {
	let count = 0;
	req.body.arr.forEach(v => {
		count += parseInt(v.proportion)
	});
	console.log(count)
	if(count !== 10) {
		res.json({
			message: "设置失败，比例之和必须为10"
		})
	} else {
		sql.query('select * from taskproportion where cid=' + req.body.id, (err, rows) => {
				if(rows.length > 0) {
					res.json({
						message: "设置失败，评分表已设置"
					})
				} else {
					req.body.arr.forEach(v => {
							sql.query('insert into taskproportion (cid, ordertitle, proportion) values ("' + req.body.id + '", "' + v.ordertitle + '", "' + v.proportion + '")', (err, rows) => {
									if(err) console.log(err);
							})
						})
				res.json({
					code: 1,
					success: true,
					datalist: rows,
					message: "设置成功！"
				})
			}
		})
}
})

//统计课内实验总成绩
router.post("/getTotalgtade", (req, res) => {
sql.query('select * from pc where type = 1 and profession ='+req.body.professionId, (err, rows)=>{
	if(err) console.log(err)
	else{
	rows.forEach(v=>{
		sql.query('select * from course where ownId ='+v.id, (err, rows)=>{
			if(err) console.log(err)
			else{
				rows.forEach(k=>{
					sql.query('select * from report where cid ='+k.cid, (err, rows)=>{
						if(err) console.log(err);
						else{
						sql.query('select * from sc where sid ='+req.body.uid+' and cid ='+k.cid, (err, rows)=>{
							if(err) console.log(err);
							else{
								if(rows == false){
									let count = 0;
									rows.forEach(u=>{
									count += u.dgrade;
									})
									sql.query('insert into sc (sid,cid,grade) values("'+req.body.uid+'","'+k.cid+'","'+count+'")', (err, rows)=>{
										if(err) console.log(err);
									})
								}
							}
						})
					}
					})
				})
			}

		})
	})
}
})
sql.query('select course.name, users.userNo, sc.grade from course, users, class, sc where sc.cid = course.cid and course.ownId = class.classId and class.classTeacherId = users.userId and sc.sid ='+req.body.uid, (err, rows)=>{
	if(err) console.log(err);
	else{
		res.json({
			code: 1,
			message: "查询成功",
			dataList: rows
		})
	}
})
}),



// router.post("/getTotalgtade", (req, res) => {
// 	sql.query('select report.uid, report.cid, report.grade, report.ordertitle, taskproportion.proportion from report, taskproportion where report.cid = taskproportion.cid and report.ordertitle = taskproportion.ordertitle', (err, rows)=>{
// 		if(err) console.log(err); 
// 		else{
// 		let nList = rows;
// 		nList.forEach(v=>{
// 			v.dgrade = (v.grade*v.proportion)/10;
// 			sql.query('update report set dgrade ='+v.dgrade+' where uid='+v.uid+' and cid='+v.cid+' and ordertitle="'+v.ordertitle+'"', (err, rows)=>{
// 				if(err) console.log(err);
// 			})
// 		})
// 		}
// 	})
// 	sql.query('select uid, cid, sum(dgrade) as ttgrade from report group by uid', (err, rows)=>{
// 		if(err) console.log(err);
// 		else{
// 			let dList = rows;
// 			dList.forEach(v=>{
// 				v.ttgrade = v.ttgrade.toFixed(2)
// 				sql.query('update sc set grade ='+v.ttgrade+' where sid='+v.uid+' and cid='+v.cid, (err, rows)=>{
// 				if(err) console.log(err);
// 			})
// 			})
// 		}
// 	})
// 	sql.query('select students.userNo, students.userName, sc.grade, pricticereport.grade as pgrade, sc.grade  from students, pricticereport, sc where students.uid = sc.sid and sc.sid = pricticereport.uid and sc.cid = pricticereport.cid', (err, rows) => {
// 		if(err) console.log(err);
// 		else {
// 			res.json({
// 				code: 1,
// 				success: true,
// 				dataList: rows,
// 				message: "查询成功！"
// 			})
// 		}
// 	})
// })

//查看课内实验学生
router.post("/getAllstudents", (req, res)=>{
	sql.query('select * from pc where type = 1 and id ='+req.body.id, (err,rows)=>{
		console.log(rows)
		if(err) console.log(err);
		else{
		let list = [];
		let len = rows.length;
		rows.forEach((v, index)=>{
			sql.query('select * from students where professionId ='+v.profession, (err, rows)=>{
				if(err) console.log(err);
				else {
					rows.forEach(k=>{
						list.push(k)
					})
                 if(index === len-1){
					 res.json({
						 code: 1,
						 dataList: list
					 })
				 }
				}
			})
		})
	}
	})
})


//学生查看成绩
router.post("/xsgrade", (req,res)=>{
	sql.query('select users.userNo, pricticereport.grade, jzpractice.name from users, pricticereport, jzpractice where jzpractice.userId = users.userId and pricticereport.cid = jzpractice.id and pricticereport.uid ='+req.body.uid, (err, rows)=>{
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
	// sql.query('select users.userNo, sc.grade, pricticereport.grade as pgrade, course.name, sc.grade  from users, course, students, pricticereport, sc where users.userId = course.userId and course.cid = sc.cid and students.uid = sc.sid and sc.sid = pricticereport.uid and sc.cid = pricticereport.cid and sc.sid ='+req.body.uid, (err, rows) => {
		// if(err) console.log(err);
		// else {
		// 	res.json({
		// 		code: 1,
		// 		success: true,
		// 		dataList: rows,
		// 		message: "查询成功！"
		// 	})
		// }
	// })
})

//练习
// router.post("/test", (req, res)=>{
// 	sql.query('SELECT * FROM `test4` WHERE 1', (err, rows)=>{
// 		if(err) console.log(err);
// 		else{
// 			let bb = rows;
// 			let list = [];
// 			bb.forEach(v=>{
//             list.push(v.number)
// 			})
// 			let rr = Array.from(new Set(list));
// 			let nnlist = [];
// 			let flag = {};
// 			rr.forEach((k, index)=>{
// 				sql.query('SELECT shunxu FROM `test4` WHERE number = "'+k+'"', (err, rows)=>{
// 					if(err) console.log(err);
// 					else{
// 						let arr = [];
						
// 						rows.forEach(u=>{
//                            arr.push(parseInt(u.shunxu))
// 						})
//                         for(let i=0;i<arr.length;i++){
// 						   if(i>0&&arr[i]<arr[i-1]){
// 							   flag = {"number": k, "pi": 0 }
// 							   nnlist.push(flag)
// 							   break;
// 						   }
// 						   if(i===arr.length-1){
// 							flag = {"number": k, "pi": 1 }
// 							nnlist.push(flag)
							
// 						   }
// 					   }
// 					   if(index === rr.length-1){
// 						res.json({
// 							code: 1,
// 			               dataList: nnlist
// 						})
// 					   }	   
// 					}
// 				})
// 			})

// 		}

// 	})
// })
module.exports = router;