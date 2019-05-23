<template>
  <div class="Setgrade" v-loading="loading">
    <detail-grade :id="changeId" :show="dialogFormVisibled" :students="students" :closed="closed"></detail-grade>
    <total-grade :id="changeId" :show="dialogFormVisiblet" :data="Alldata" :closet="closet" :totalSizet="totalSizet"></total-grade>
    <proportion
      :id="changeId"
      :show="dialogFormVisiblep"
      :alltitles="alltitles"
      :closep="closep"
      :totalSizep="totalSizep"
    ></proportion>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入 实验名称 进行查询"
          clearable
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="users.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="name" align="center" label="实验名称" width="180"></el-table-column>
      <el-table-column prop="typeName" align="center" label="实验类型" width="160"></el-table-column>
      <el-table-column prop="hour" align="center" label="学时" width="150"></el-table-column>
      <el-table-column prop="className" align="center" label="所属课程" width="180"></el-table-column>
      <el-table-column prop="userNo" align="center" label="实验教师"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="360px">
        <template slot-scope="scope">
          <template v-if="scope.row.tp === 0">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="Pyreport(scope.$index, scope.row)"
          >查看成绩</el-button>
          </template>
          <template v-else>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="getDetail(scope.$index, scope.row)"
          >查看课内实验详细成绩</el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="Setproportion(scope.$index, scope.row)"
          >设定课内实验比例系数</el-button>
          </template>
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
import { rules } from "../../api/index.js";
import Pagination from "../../components/Pagination";
import DetailGrade from "../../components/Setgrade/DetailGrade";
import Proportion from "../../components/Setgrade/Proportion";
import TotalGrade from "../../components/Setgrade/TotalGrade";
export default {
  name: "Setgrade",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      totalSizep: 0, //比例系数页面总信息数
      totalSizet: 0, //总成绩信息数
      users: [], //所有信息
      usersp: [],
      usersc: [],
      Alldata: [], //所有成绩
      dialogFormVisible: false, //发布实验任务
      dialogFormVisibled: false, //查看详细成绩
      dialogFormVisiblep: false, //比例系数
      dialogFormVisibles: false, //选课学生
      dialogFormVisiblet: false, //查看总成绩
      Allstudents: [], //该课程选课学生
      alltitles: [], //实验题目
      qryContent: "", //查询条件
      changeId: 0, //实验id
      classId: 0, //课程id
      students: [], //实验题目总数
      rules, //验证规则
      insertFlag: "", //提示信息
      loading: true
    };
  },
  components: {
    Pagination,
    DetailGrade,
    TotalGrade,
    Proportion
  },
  mounted() {
    this.getData();
  },
  methods: {
    changepagesize(val) {
      this.pageSize = val;
    },
    changecurrentpage(val) {
      this.currPage = val;
    },
    //详细成绩关闭
    closed(val) {
      this.dialogFormVisibled = val;
    },
    //比例系数关闭
    closep(val) {
      this.dialogFormVisiblep = val;
    },
    //查看总成绩关闭
    closet(val){
    this.dialogFormVisiblet = val;
    },
        //获取所有数据
    getData() {
      let url = "/course/getteachercurriculumc";
      let data = {
        uid: parseInt(sessionStorage.getItem("uid"))
      };
      this.$post(url, data).then(res => {
        this.usersc = res.class;
        if(res.code === 1){
          this.getDatap()
        }
      });
    },
    //获取所有数据
    getDatap() {
      let url = "/course/getteachercurriculump";
      let data = {
        uid: parseInt(sessionStorage.getItem("uid"))
      };
      this.$post(url, data).then(res => {
        this.usersp = res.class;
        let nusers = [];
        this.usersc.forEach(v=>{
          nusers.push(v);
        })
       this.usersp.forEach(v=>{
          nusers.push(v);
        })
        nusers.forEach(v => {
          if (v.tp === 0) {
            v.typeName = "集中性实践";
          }
          if (v.tp === 1) {
            v.typeName = "课内实验";
          }
        });
        this.users = nusers;
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
    // 获取选课同学
    getStudents() {
      let url = "/grade/getAllstudents";
      let data = { id: this.classId };
      this.$post(url, data).then(res => {
        this.students = res.dataList;
      });
    },
    //查看课内实验详细成绩
    getDetail(index, row) {
      this.changeId = row.cid;
      this.classId = row.classId;
      this.getStudents();
      this.dialogFormVisibled = true;
    },
    //查看集中性实践成绩
    Pyreport(index, row) {
      this.changeId = row.id;
      let url = "/jzgrade/xsgrade";
      let data = { id: this.changeId };
      this.$post(url, data).then(res => {
        this.Alldata = res.dataList;
        this.totalSizet = res.dataList.length;
        this.dialogFormVisiblet = true;
      })
    },
    //设定课内实验比例系数
    Setproportion(index, row) {
      this.changeId = row.cid;
      let url = "/task/getAlltitles";
      let data = {
        id: this.changeId
      };
      this.$post(url, data).then(res => {
        this.alltitles = res.dataList;
        this.totalSizep = res.dataList.length;
        this.dialogFormVisiblep = true;
      });
    },
    Search() {
      //查询
      let url = "/course/searchcourse";
      let data = {
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        this.totalSize = res.dataList.length;
      });
    }
  }
};
</script>
<style lang="scss">
.Setgrade {
  .el-dialog {
    .el-dialog__header {
      background-color: #f8f8f8;
    }
  }
  .block {
    margin-top: 20px;
  }
}
</style>
