<template>
  <div class="Kfelectivecourse" v-loading="loading">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入 实验名称/所属课程/实验教室 进行查询"
          clearable
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="kfcourse.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
      @selection-change="row_click"
    >
      <el-table-column prop="name" align="center" label="实验名称" width="180"></el-table-column>
      <el-table-column prop="typeName" align="center" label="实验类型" width="180"></el-table-column>
      <el-table-column prop="hour" align="center" label="学时" width="180"></el-table-column>
      <el-table-column prop="className" align="center" label="所属课程" width="200"></el-table-column>
      <el-table-column prop="userNo" align="center" label="实验教师" width="200"></el-table-column>
      <el-table-column prop="time" align="center" label="试验时间" width="200"></el-table-column>
      <el-table-column prop="location" align="center" label="试验地点" width="200"></el-table-column>
      <el-table-column prop="assessmentName" align="center" label="考核" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="Xuanke(scope.$index, scope.row)">选课</el-button>
          <el-button type="primary" plain size="mini" @click="Tuixuan(scope.$index, scope.row)">退选</el-button>
        </template>
      </el-table-column>
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
import { rules } from "../api/index.js";
import Pagination from "./Pagination";
export default {
  name: "Kfelectivecourse",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      kfcourse: [], //开放性实验
      qryContent: "",
      changeId: null,
      rules, //验证规则
      insertFlag: "", //提示信息
      loading: true,
      uid: null,
      electivetype: 1
    };
  },
  components: {
    Pagination
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
        let nusers = res.dataList;
        nusers.forEach(v => {
          if (v.type === "1") {
            v.typeName = "开放性实验";
            this.kfcourse.push(v);
          }
        });
        this.totalSize = this.kfcourse.length;
        this.loading = false;
      });
    },
    changepagesize(val) {
      this.pageSize = val;
    },
    changecurrentpage(val) {
      this.currPage = val;
    },
    //设置表头背景色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    Xuanke(index, row) {
      //选课
      this.changeId = row.cid;
      this.uid = parseInt(sessionStorage.getItem("uid"));
      this.$confirm("是否确认选课, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/elective/electivecourse";
          let data = {
            uid: this.uid,
            cid: this.changeId
          };
          this.$post(url, data).then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "选课成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消选课"
          });
        });
    },
    Tuixuan(index, row) {
      //退课
      this.changeId = row.cid;
      this.uid = parseInt(sessionStorage.getItem("uid"));
      this.$confirm("是否确认退选, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/elective/noelectivecourse";
          let data = {
            uid: this.uid,
            cid: this.changeId
          };
          this.$post(url, data).then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "退选成功!"
              });
            } else {
              this.$message({
                type: "info",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退选"
          });
        });
    },
    Search() {
      this.clearData();
      let url = "/course/getelectivecourse";
      let data = {
        electivetype: this.electivetype,
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        let nusers = res.dataList;
        nusers.forEach(v => {
          if (v.type === "1") {
            v.typeName = "培养计划内实验";
            this.kfcourse.push(v);
          }
        });
        console.log(this.pycourse)
        this.totalSize = this.kfcourse.length;
      });
    },
    clearData() {
      //初始化弹出框数据
      this.changeId = "";
      this.kfcourse = [];
    },

    row_click(selection) {
      //复选框状态改变触发
      this.Userdeleteid = [];
      for (let i = 0; i < selection.length; i++) {
        this.Userdeleteid.push(selection[i].id);
      }
    }
  }
};
</script>

<style lang="scss">
.Kfelectivecourse {
  .block {
    margin-top: 20px;
  }
}
</style>