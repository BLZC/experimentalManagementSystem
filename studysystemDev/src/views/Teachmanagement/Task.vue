<template>
  <div class="Task" v-loading="loading">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">选择课程:</el-form-item>
      <el-form-item style="float: left;">
        <el-select size="mini" v-model="editForm.college" filterable>
          <el-option
            v-for="item in college"
            :key="item.collegeId"
            :label="item.collegeName"
            :value="item.collegeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" @click="Search" size="mini">确认</el-button>
        <el-button type="primary" @click="Search" size="mini">下载实验报告模板</el-button>
      </el-form-item>
    </el-form>
    <div class="main">
      <div class="title1">
        实验要求：
        <span>{{claim}}</span>
      </div>
      <div class="title2">
        预习要求：
        <span>{{claim}}</span>
      </div>
      <div class="title2">
        预习内容填写：
        {{content}}
      </div>
      <vue-ueditor-wrap v-model="content"/>
    </div>
  </div>
</template>

<script>
import { rules } from "../../api/index.js";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  name: "electivecourse",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      content: '',
      claim: "aaaaaaaaaaaaaaaa",
      dialogFormVisible: false, //增加页面是否显示
      dialogFormVisible_x: false, //修改页面是否显示
      qryContent: "",
      editForm: {
        userNo: "", //姓名
        userName: "", //账号
        password: null, //密码
        college: [] //学院
      },
      myConfig: {
        // autoHeightEnabled: false,
        initialFrameHeight: 500,
        // initialFrameWidth: "50%",

        serverUrl: "",
        UEDITOR_HOME_URL: "/static/UEditor/",
        maximumWords: 1000
      },
      changeId: null,
      college: [], //学院
      Userdeleteid: [],
      rules, //验证规则
      options: [],
      insertFlag: "", //提示信息
      loading: false
    };
  },
  components: {
    VueUeditorWrap
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取所有数据
    getData() {
      let url = "/course/getcourse";
      let data = {};
      this.$post(url, data).then(res => {
        this.users = res.userlist;
        this.totalSize = this.users.length;
        this.loading = false;
      });
    },
    //改变每页显示条目数方法
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    //上一页、下一页、页数跳转方法
    handleCurrentChange(currPage) {
      this.currPage = currPage;
    },
    //设置表头背景色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    handleEdit() {
      //添加
      this.clearData();
      this.dialogFormVisible = true;
      this.reqDataCollege();
    },
    //修改
    hEdit(index, row) {
      this.changeId = row.id;
      this.dialogFormVisible_x = true;
      this.reqDataCollege(); //请求学院
      let url = "/about/getoneUser";
      let data = {
        userName: row.userName
      };
      this.$post(url, data).then(res => {
        this.editForm.userName = res.user[0].userName;
        this.editForm.password = res.user[0].password;
        this.editForm.userNo = res.user[0].userNo;
        this.editForm.college = res.user[0].college;
      });
    },
    Search() {
      //查询
      let url = "/about/searchUser";
      let data = {
        userName: this.qryContent
      };
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        this.totalSize = this.users.length;
      });
    },
    //请求学院
    reqDataCollege() {
      let url = "/about/getCollege";
      let data = {};
      this.$post(url, data).then(res => {
        this.college = res.collegelist;
      });
    },
    clearData() {
      //初始化弹出框数据
      this.editForm.userName = "";
      this.editForm.userNo = "";
      this.editForm.password = "";
      this.editForm.college = "";
    },

    row_click(selection) {
      //复选框状态改变触发
      this.Userdeleteid = [];
      for (let i = 0; i < selection.length; i++) {
        this.Userdeleteid.push(selection[i].id);
      }
    },
    Lessuser() {
      // 删除
      this.$confirm("是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let url = "/about/deleteUser";
          let data = { id: this.Userdeleteid };
          this.$post(url, data).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.getData();
            } else {
              this.$message({
                type: "info",
                message: "删除失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm(editData) {
      //用户 添加 提交
      this.$refs[editData].validate(valid => {
        if (valid) {
          let url = "/about/addUser";
          let data = {
            userName: this.editForm.userName,
            userNo: this.editForm.userNo,
            password: this.editForm.password,
            college: this.editForm.college
          };
          this.$post(url, data).then(res => {
            this.insertFlag = res.message;
            this.dialogFormVisible = false;
            this.$alert(this.insertFlag, "新增用户结果", {
              confirmButtonText: "确定"
            });
            this.clearData();
            this.getData();
          });
        } else {
          return false;
        }
      });
    },
    submitFormchange(editData) {
      //用户 修改 提交
      this.$refs[editData].validate(valid => {
        if (valid) {
          let url = "/about/changeUser";
          let data = {
            id: this.changeId,
            userName: this.editForm.userName,
            userNo: this.editForm.userNo,
            password: this.editForm.password,
            college: this.editForm.college
          };
          this.$post(url, data).then(res => {
            this.insertFlag = res.message;
            this.dialogFormVisible_x = false;
            this.$alert(this.insertFlag, "修改用户结果", {
              confirmButtonText: "确定"
            });
            this.clearData();
            this.getData();
          });
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      //用户添加框关闭
      this.clearData();
      this.dialogFormVisible = false;
      this.dialogFormVisible_x = false;
      this.dialogFormVisible_y = false;
    }
  }
};
</script>
<style lang="scss">
.Task {
  .main {
    width: 100%;
    padding-top: 70px;
    .title1 {
      text-align: left;
      font-size: 18px;
      span {
        font-size: 14px;
      }
    }
    .title2 {
      text-align: left;
      padding-top: 20px;
      font-size: 16px;
      span {
        font-size: 14px;
      }
    }
    .title2 {
      text-align: left;
      padding-top: 20px;
      font-size: 16px;
      span {
        font-size: 14px;
      }
    }
  }
}
</style>