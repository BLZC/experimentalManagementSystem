<template>
  <el-header class="nav_top">
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
    	<el-form ref="form" :model="form" label-width="160px">
      <el-form-item label="新的登录密码: " prop="password" validate="required" required-message="请输入密码">
        <el-input v-model="form.password" size="large" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新的登录密码: " prop="rpassword" validate="required" required-message="请输入确认密码">
        <el-input v-model="form.rpassword" size="large" class="form_input" show-password></el-input>
        <span class="warnmessage">{{warnmessage}}</span>
      </el-form-item>
     </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitp(form)">确 定</el-button>
  </div>
</el-dialog>
    <div class="topleft">
      <div class="collapse-btn" @click="collapseChage">
        <el-tooltip class="item" effect="dark" :content="tooltip" placement="bottom">
          <i class="el-icon-menu"></i>
        </el-tooltip>
      </div>
      <a target="_parent">
        <img src="../assets/logo.png" title="系统首页">
      </a>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float:right;">
        <div class="change" @click="toUpdatePwd()">修改密码</div>
      </el-form-item>
      <el-form-item style="float:right;">
        <div class="logout" @click="open2()">退出</div>
      </el-form-item>
      <el-form-item style="float:right;">
        <div class="user">
          <span>用户:{{userNon}}</span>
        </div>
      </el-form-item>
    </el-form>
  </el-header>
</template>
<script>
import bus from "../api/bus.js";
export default {
  name: "Navtop",
  data() {
    return {
      userNon: sessionStorage.getItem("userNo"),
      collapse: false,
      tooltip: "向左收起",
      dialogFormVisible: false,
      form: {
      	password: "",
      	rpassword: ""
      },
      warnmessage: ""   //提醒消息
    };
  },
  created() {},
  mounted() {},
  methods: {
	//修改密码
	toUpdatePwd(){
  this.dialogFormVisible = true;
	},
	//修改密码提交
	submitp(form){
		    this.$refs.form.validate(valid => {
        if (valid) {
        	if(this.form.password === this.form.rpassword){
        		let url = "/about/changepassword";
        		let data = {uid: parseInt(sessionStorage.getItem("uid")), type: parseInt(sessionStorage.getItem("type")), password: this.form.password};
        		this.$post(url, data).then(res=>{
        			if(res.code === 1){
        				this.$alert("密码修改成功！", "提示");
        				this.dialogFormVisible = false;
        				this.$notify.error({
          		  	title: '提示',
         				 	message: '您的密码已修改,请重新登录'
       			 });
       			  this.$router.push("/login");
        			}
        		})
        	}
        	else{
        		this.warnmessage = "两次密码不一致，请重新输入"
        	}
        }
      })
	},
	//退出
    open2() {
      this.$confirm("是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功"
          });
          this.logout();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },
    logout() {
      //				var url = "/systemConfig-service/v2/user/logout";
      //				var data = {
      //					userNo: this.userNon
      //				};
      //				this.$post(url, data).then(res => {
      //					if(res.resultCode === 1000) {
      this.$router.push({
        path: "/login"
      });
      //					} else {
      //						alert(res.message);
      //					}
      //				});
    },
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
      if (this.collapse) {
        this.tooltip = "向右展开";
      } else {
        this.tooltip = "向左收起";
      }
    }
  }
};
</script>
<style scoped>
.nav_top {
  width: 100%;
  background-color: #437bc4;
  color: #333;
  text-align: center;
  height: 70px !important;
}
.warnmessage {
	color:red;
}
.topleft {
  width: 220px;
  height: 70px;
}

.topright {
  height: 70px;
}
.user {
  height: 30px;
  /* background: url(../assets/ub1.png) repeat-x; */
  clear: both;
  margin-top: 18px;
  float: right;
  margin-right: 12px;
  border-radius: 30px;
  /* behavior:url(js/pie.htc);  */
  white-space: nowrap;
  position: relative;
  display: -webkit-flex;
  display: flex;
}
.user span {
  display: inline-block;
  padding-right: 10px;
  /* background: url(../assets/login/user.png) no-repeat 15px 10px; */
  line-height: 33px;
  font-size: 14px;
  color: #b8ceda;
  padding-left: 20px;
  padding-left: 35px;
  margin: auto;
}
.user b {
  display: inline-block;
  width: 20px;
  height: 18px;
  /* background: url(../assets/login/msg.png); */
  text-align: center;
  font-weight: normal;
  color: #fff;
  font-size: 14px;
  margin-right: 13px;
  margin-top: 7px;
  line-height: 18px;
}
.user i {
  display: inline-block;
  margin-right: 5px;
  font-style: normal;
  line-height: 30px;
  font-size: 14px;
  color: #b8ceda;
}


.change {
  display: inline-block;
  color: #fff;
  font-size: 15px;
  margin-right: 0px;
  height: 30px;
  width: 60px;
  margin-top: 16px;
  cursor: pointer;
}

.logout {
  display: inline-block;
  color: #fff;
  font-size: 15px;
  width: 40px;
  cursor: pointer;
  margin-top: 16px;
}

.topleft img {
  margin-left: 45px;
  float: left;
  width: 150px;
  line-height: 70px;
}

.collapse-btn {
  position: absolute;
  float: left;
  cursor: pointer;
  line-height: 70px;
  color: #fff;
}

.collapse-btn i {
  font-size: 25px;
  height: 26px;
  width: 26px;
}
</style>