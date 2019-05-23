<template>
  <div class="Curriculum" v-loading="loading">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          v-model="qryContent"
          placeholder="请输入 实验名称/教师 进行查询"
          clearable
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" @click="Search" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="users.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="name" align="center" label="实验名称" width="250"></el-table-column>
      <el-table-column prop="userNo" align="center" label="实验教师" width="300"></el-table-column>
      <el-table-column prop="grade" align="center" label="实验成绩(分)"></el-table-column>
    </el-table>
    <pagination
      :currPage="currPage"
      :pageSize="pageSize"
      :totalPage="totalPage"
      :totalSize="totalSize"
      :changepagesize="changepagesize"
      :changecurrentpage="changecurrentpage"
    ></pagination>
  </div>
</template>

<script>
import Pagination from "../../components/Pagination";
export default {
  name: "electivecourse",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      qryContent: "",
      loading: false
    };
  },
  mounted() {
    this.getData();
  },
  components: {
    Pagination
  },
  methods: {
    changepagesize(val) {
      this.pageSize = val;
    },
    changecurrentpage(val) {
      this.currPage = val;
    },
    //获取所有数据
    getData() {
      let url = "/grade/xsgrade";
      let data = {uid: parseInt(sessionStorage.getItem("uid"))};
      this.$post(url, data).then(res => {
        this.usersjz = res.dataList;
        this.getDatakn();
      });
    },
    getDatakn(){
      let url = "/grade/getTotalgtade";
      let data = {uid: parseInt(sessionStorage.getItem("uid")), professionId: parseInt(sessionStorage.getItem("professionId"))};
      this.$post(url, data).then(res => {
        this.userskn = res.dataList;
        this.usersjz.forEach(v=>{
          this.users.push(v)
        })
        this.userskn.forEach(v=>{
          this.users.push(v)
        })
        this.totalSize = this.users.length;
        this.loading = false;
      });
    },
    //设置表头背景色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
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
    }
  }
};
</script>
<style lang="scss">
.Curriculum {
  .pdialog {
    .el-dialog {
      padding: 0px;
      height: 400px;
      width: 380px !important;
      .el-dialog__header {
        background-color: #f8f8f8;
      }
      .el-dialog__body {
        padding: 30px 3px !important;
        .edit_left {
          margin-left: -25px;
          height: 200px;
          width: 300px;
          .el-form-item {
            margin-bottom: 15px;
            .el-form-item__label {
              position: absolute;
            }
            .el-input__inner {
              width: 180px !important;
              height: 35px;
              line-height: 35px;
            }
          }
        }
      }
      .el-dialog__footer {
        text-align: center !important;
      }
    }
  }
  .block {
    margin-top: 20px;
  }
}
</style>