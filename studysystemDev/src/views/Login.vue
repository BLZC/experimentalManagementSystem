<template>
  <div class="loginbody1">
    <!-- <div id="mainBody">
      <div id="cloud1" class="cloud"></div>
      <div id="cloud2" class="cloud"></div>
    </div>-->
    <div class="logintop">
      <span>欢迎登录管理界面平台</span>
      <ul>
        <li>
          <a href="#">帮助</a>
        </li>
        <li>
          <a href="#">关于</a>
        </li>
      </ul>
    </div>

    <div class="loginbody">
      <span class="systemlogo"></span>

      <div class="loginbox">
        <ul>
          <li style="margin-bottom: 15px;">
            工&nbsp;&nbsp;号&nbsp;&nbsp;
            <input
              name="login"
              type="text"
              class="loginuserinput"
              v-model="userName"
              placeholder="请输入工号"
              required
              @keyup.13="login()"
            >
          </li>
          <li style="margin-bottom: 15px;">
            密&nbsp;&nbsp;码&nbsp;&nbsp;&nbsp;
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="loginuserinput"
              placeholder="请输入密码"
              @keyup.13="login()"
            >
          </li>
          <li style="margin-bottom: 15px;">
            身&nbsp;&nbsp;份&nbsp;&nbsp;&nbsp;
            <el-radio-group v-model="type">
              <el-radio label="2">学生</el-radio>
              <el-radio label="1">教职工</el-radio>
              <el-radio label="0">管理员</el-radio>
            </el-radio-group>
            <!-- <input id="type" v-model="type" name="password" type="password" required class="loginuserinput" placeholder="请输入密码" @keyup.13="login()"/> -->
          </li>
          <!-- <li style="margin-bottom: 15px;">
            验证码&nbsp;&nbsp;
            <input
              id="verifycode"
              onfocus="clearerror();"
              name="verifycode"
              type="text"
              class="logincodeinput"
              placeholder="请输入验证码"
            >
            <img
              src="${basePath}user/verifyCode"
              id="imgCode"
              style="height:30px;vertical-align: middle;"
              onclick="javascript:reloadCode();"
            >
            <a onclick="javascript:reloadCode();">换一张</a>
          </li>-->
          <li>
            <button
              name
              type="button"
              class="loginbtn"
              value="登录"
              @click.prevent="login()"
            >登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            <label id="loginerror" style="color: red;"></label>
          </li>
          <li style="margin-top: 1px;"></li>
        </ul>
      </div>
    </div>

    <div class="loginbm">高校实验室管理系统</div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      userName: "",
      password: "",
      userNo: "",
      userToken: "",
      btns: [],
      userNa: "",
      type: "",
      uid: ""
    };
  },

  methods: {
    login() {
      let url = "/about/login";
      if (this.type) {
        let data = {
          userName: this.userName,
          password: this.password,
          type: this.type
        };
        // this.$store.commit('changetype', this.type)
        sessionStorage.setItem("type", this.type);
        this.$post(url, data).then(res => {
          this.userNo = res.userNo;
          this.userName = res.userName;
          this.uid = res.uid;
          this.professionId = res.professionId;
          if (res.code == 1) {
            //						this.userToken = res.token;
            //						sessionStorage.setItem("Authorization", this.userToken);
            sessionStorage.setItem("userNo", this.userNo);
            sessionStorage.setItem("userName", this.userName);
            sessionStorage.setItem("uid", this.uid);
            sessionStorage.setItem("professionId", this.professionId);
            this.$router.push({
              path: "/main"
            });
            //						let url = '/systemConfig-service/v2/menu/getUserBtns';
            //						let data = {};
            //						this.$post(url, data).then(res => {
            //							let btn = res.dataList;
            //							btn.forEach(v => {
            //								this.btns.push(v.id);
            //							})
            //							sessionStorage.setItem("Btns", this.btns);
            //						})
          }
          if (res.code == 0) {
            this.$notify.error({
              title: "登录提示:",
              message: res.message
            });
          }
        });
      } else {
        this.$notify.error({
          title: "登录提示:",
          message: "请选择你的登录身份！"
        });
      }
    }
  }
};
</script>
<style>
* {
  font-size: 13px;
  border: 0;
  margin: 0;
  padding: 0;
}

body {
  font-family: "微软雅黑";
  margin: 0 auto;
  min-width: 980px;
}

ul {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}

img {
  border: 0;
}

dl,
dt,
dd,
span {
  margin: 0;
  padding: 0;
  display: inline-block;
}

a,
a:focus {
  text-decoration: none;
  color: #000;
  outline: none;
  /* blr:expression(this.onFocus=this.blur()); */
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

cite {
  font-style: normal;
}

h2 {
  font-weight: normal;
}
/*cloud*/

#mainBody {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}

.cloud {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url(../assets/login/cloud.png) no-repeat;
  z-index: 1;
  opacity: 0.5;
}

#cloud2 {
  z-index: 2;
}
/*login*/

.logintop {
  height: 47px;
  position: absolute;
  top: 0;
  background: url(../assets/login/loginbg1.png) repeat-x;
  z-index: 100;
  width: 100%;
}

.logintop span {
  color: #fff;
  line-height: 47px;
  background: url(../assets/login/loginsj.png) no-repeat 21px 18px;
  text-indent: 44px;
  color: #afc5d2;
  float: left;
}

.logintop ul {
  float: right;
  padding-right: 30px;
}

.logintop ul li {
  float: left;
  margin-left: 20px;
  line-height: 47px;
}

.logintop ul li a {
  color: #afc5d2;
}

.logintop ul li a:hover {
  color: #fff;
}

.loginbody {
  background: url(../assets/login/loginbg3.png) no-repeat center center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 47px;
  margin: auto;
}

.systemlogo {
  /*background: url(../assets/login/loginlogo.png) no-repeat center;*/
  width: 100%;
  height: 70px;
  margin-top: 75px;
}

.loginbox {
  width: 692px;
  height: 400px;
  background: url(../assets/login/logininfo.png) no-repeat;
  margin-top: 30px;
  display: -webkit-flex;
  display: flex;
  margin: auto;
}

.loginbox ul {
  margin-top: 88px;
  margin-left: 285px;
}

.loginbox ul li {
  margin-bottom: 25px;
}

.loginbox ul li label {
  color: #687f92;
  padding-left: 25px;
}

.loginbox ul li label a {
  color: #687f92;
}

.loginbox ul li label a:hover {
  color: #3d96c9;
}

.loginbox ul li label input {
  margin-right: 5px;
}

.loginuser {
  width: 290px;
  height: 48px;
  background: url(../assets/login/loginuser.png) no-repeat;
  border: none;
  padding-left: 40px;
  font-size: 14px;
  font-weight: bold;
}

.loginpwd {
  width: 290px;
  height: 48px;
  background: url(../assets/login/loginpassword.png) no-repeat;
  border: none;
  padding-left: 40px;
  font-size: 14px;
  color: #90a2bc;
}

.loginimgcode {
  width: 180px;
  height: 48px;
  background: url(../assets/login/loginpassword.png) no-repeat;
  border: none;
  padding-left: 44px;
  font-size: 14px;
  color: #90a2bc;
}

.loginbtn {
  width: 111px;
  height: 35px;
  background: url(../assets/login/buttonbg.png) repeat-x;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}

.loginbm {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: url(../assets/login/loginbg2.png) repeat-x;
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #0b3a58;
}

.loginbm a {
  font-weight: bold;
  color: #0b3a58;
}

.loginbm a:hover {
  color: #fff;
}

.loginbody1 {
  background-image: url(../assets/login/light.png);
  background-color: #1c77ac;
  background-repeat: no-repeat;
  background-position: center top;
  overflow: hidden;
  position: fixed;
  /*margin-top: -60px;*/
  height: 100%;
  width: 100%;
}

.loginuserinput {
  border: 1px solid #b0e0e6;
  /*设置输入框边框，边缘线的颜色、大小、及实线虚线*/
  padding: 10px 0px;
  /*设置输入框高度，也可以用height，但是用height的话，输入框的光标会置于顶部，还要设置其他样式去固定，而且还不一定会兼容很好*/
  border-radius: 4px;
  /*这个属性石css3里面的,IE不支持*/
  padding-left: 2px;
  width: 320px;
  background-color: #f0f8ff;
  font-size: 15px;
}

.logincodeinput {
  border: 1px solid #b0e0e6;
  /*设置输入框边框，边缘线的颜色、大小、及实线虚线*/
  padding: 10px 0px;
  /*设置输入框高度，也可以用height，但是用height的话，输入框的光标会置于顶部，还要设置其他样式去固定，而且还不一定会兼容很好*/
  border-radius: 4px;
  /*这个属性石css3里面的,IE不支持*/
  padding-left: 2px;
  width: 180px;
  background-color: #f0f8ff;
  font-size: 15px;
}
/*top.html*/

.header {
  height: 88px;
}

.topleft {
  height: 88px;
  /* background: url(../assets/login/topleft.jpg) no-repeat; */
  float: left;
  width: 300px;
}

.topleft img {
  margin-top: 12px;
  margin-left: 10px;
}

.topright {
  height: 88px;
  /* background: url(../assets/login/topright.jpg) no-repeat right; */
  float: right;
}

.nav {
  float: left;
}

.nav li {
  float: left;
  width: 87px;
  height: 88px;
  text-align: center;
}

.nav li a {
  display: block;
  width: 87px;
  height: 88px;
  -moz-transition: none;
  transition: background-color 0.3s linear;
  -moz-transition: background-color 0.3s linear;
  -webkit-transition: background-color 0.3s linear;
  -o-transition: background-color 0.3s linear;
}

.nav li a.selected {
  background: url(../assets/login/navbg.png) no-repeat;
}

.nav li a:hover {
  display: block;
  background: #000;
  color: #fff;
  background: none repeat scroll 0% 0% rgb(43, 127, 181);
}

.nav li img {
  margin-top: 10px;
}

.nav li a {
  display: block;
}

.nav a h2 {
  font-size: 14px;
  color: #d6e8f1;
}

.nav a:hover h2 {
  color: #fff;
}

.topright ul {
  padding-top: 15px;
  float: right;
  padding-right: 12px;
}

.topright ul li {
  float: left;
  padding-left: 9px;
  padding-right: 9px;
  background: url(../assets/login/line.gif) no-repeat right;
}

.topright ul li:last-child {
  background: none;
}

.topright ul li a {
  font-size: 13px;
  color: #e9f2f7;
}

.topright ul li a:hover {
  color: #fff;
}

.topright ul li span {
  margin-top: 2px;
  float: left;
  padding-right: 3px;
}

.user {
  height: 30px;
  background: url(../assets/login/ub1.png) repeat-x;
  clear: both;
  margin-top: -16px;
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
  background: url(../assets/login/user.png) no-repeat 15px 10px;
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
  background: url(../assets/login/msg.png);
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
/*left.html*/

.lefttop {
  background: url(../assets/login/lefttop.gif) repeat-x;
  height: 40px;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
}

.lefttop span {
  margin-left: 8px;
  margin-top: 10px;
  margin-right: 8px;
  background: url(../assets/login/leftico.png) no-repeat;
  width: 20px;
  height: 21px;
  float: left;
}

.leftmenu {
  width: 187px;
  padding-bottom: 9999px;
  margin-bottom: -9999px;
  overflow: hidden;
  background: url(../assets/login/leftline.gif) repeat-y right;
}

.leftmenu dd {
  background: url(../assets/login/leftmenubg.gif) repeat-x;
  line-height: 35px;
  font-weight: bold;
  font-size: 14px;
  border-right: solid 1px #b7d5df;
}

.leftmenu dd span {
  float: left;
  margin: 10px 8px 0 12px;
}

.leftmenu dd .menuson {
  display: none;
}

.leftmenu dd:first-child .menuson {
  display: block;
}

.menuson {
  line-height: 30px;
  font-weight: normal;
}

.menuson li {
  cursor: pointer;
}

.menuson li.active {
  position: relative;
  background: url(../assets/login/libg.png) repeat-x;
  line-height: 30px;
  color: #fff;
}

.menuson li cite {
  display: block;
  float: left;
  margin-left: 32px;
  background: url(../assets/login/list.gif) no-repeat;
  width: 16px;
  height: 16px;
  margin-top: 7px;
}

.menuson li.active cite {
  background: url(../assets/login/list1.gif) no-repeat;
}

.menuson li.active i {
  display: block;
  background: url(../assets/login/sj.png) no-repeat;
  width: 6px;
  height: 11px;
  position: absolute;
  right: 0;
  z-index: 10000;
  top: 9px;
  right: -1px;
}

.menuson li a {
  display: block;
  *display: inline;
  *padding-top: 5px;
}

.menuson li.active a {
  color: #fff;
}

.title {
  cursor: pointer;
}
/*right.html*/

.place {
  height: 40px;
  background: url(../assets/login/righttop.gif) repeat-x;
}

.place span {
  line-height: 40px;
  font-weight: bold;
  float: left;
  margin-left: 12px;
}

.placeul li {
  float: left;
  line-height: 40px;
  padding-left: 7px;
  padding-right: 12px;
  background: url(../assets/login/rlist.gif) no-repeat right;
}

.placeul li:last-child {
  background: none;
}

.rightinfo {
  padding: 8px;
}

.tools {
  clear: both;
  height: 35px;
  margin-bottom: 8px;
}

.toolbar {
  float: left;
}

.toolbar li {
  background: url(../assets/login/toolbg.gif) repeat-x;
  line-height: 33px;
  height: 33px;
  border: solid 1px #d3dbde;
  float: left;
  padding-right: 10px;
  margin-right: 5px;
  border-radius: 3px;
  /* behavior:url(js/pie.htc);  */
  cursor: pointer;
}

.toolbar li span {
  float: left;
  margin-left: 10px;
  margin-right: 5px;
  margin-top: 5px;
}

.toolbar1 {
  float: right;
}

.toolbar1 li {
  background: url(../assets/login/toolbg.gif) repeat-x;
  line-height: 33px;
  height: 33px;
  border: solid 1px #d3dbde;
  float: left;
  padding-right: 10px;
  margin-left: 5px;
  border-radius: 3px;
  /* behavior:url(js/pie.htc); */
}

.toolbar1 li span {
  float: left;
  margin-left: 10px;
  margin-right: 5px;
  margin-top: 5px;
}

.tablelist {
  border: solid 1px #cbcbcb;
  width: 100%;
  clear: both;
}

.tablelist th {
  background: url(../assets/login/th.gif) repeat-x;
  height: 34px;
  line-height: 34px;
  border-bottom: solid 1px #b6cad2;
  text-indent: 11px;
  text-align: left;
}

.tablelist td {
  line-height: 35px;
  text-indent: 11px;
  border-right: dotted 1px #c7c7c7;
}

.tablelink {
  color: #056dae;
}

.tablelist tbody tr.odd {
  background: #f5f8fa;
}

.tablelist tbody tr:hover {
  background: #e5ebee;
}

.sort {
  padding-left: 3px;
}
/*page*/

.pagin {
  position: relative;
  margin-top: 10px;
  padding: 0 12px;
}

.pagin .blue {
  color: #056dae;
  font-style: normal;
}

.pagin .paginList {
  position: absolute;
  right: 12px;
  top: 0;
}

.pagin .paginList .paginItem {
  float: left;
}

.pagin .paginList .paginItem a {
  float: left;
  width: 31px;
  height: 28px;
  border: 1px solid #ddd;
  text-align: center;
  line-height: 30px;
  border-left: none;
  color: #3399d5;
}

.pagin .paginList .paginItem:first-child a {
  border-left: 1px solid #ddd;
}

.pagin .paginList .paginItem:first-child a {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.pagin .paginList .paginItem:last-child a {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.pagin .paginList .paginItem.current,
.pagin .paginList .paginItem.current a {
  background: #f5f5f5;
  cursor: default;
  color: #737373;
}

.pagin .paginList .paginItem:hover {
  background: #f5f5f5;
}

.pagin .paginList .paginItem.more,
.pagin .paginList .paginItem.more a:hover {
  cursor: default;
}

.pagin .paginList .paginItem.more:hover {
  background: #fff;
}

.pagin .paginList .paginItem.more a {
  color: #737373;
}

.pagepre {
  background: url(../assets/login/pre.gif) no-repeat center center;
  width: 31px;
  height: 28px;
}

.pagenxt {
  background: url(../assets/login/next.gif) no-repeat center center;
  width: 31px;
  height: 28px;
}
</style>