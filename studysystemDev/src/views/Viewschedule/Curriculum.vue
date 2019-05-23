<template>
  <div class="Curriculum" v-loading="loading">
    <realease-practice
      :show="dialogFormVisiblev"
      :id="changeId"
      :uploadId="uploadId"
      :closeeventv="closeeventv"
    ></realease-practice>
    <realease-task
      :show="dialogFormVisible"
      :id="changeId"
      :orders="orders"
      :closeevent="closeevent"
    ></realease-task>
    <!-- <get-students
      :show="dialogFormVisibles"
      :id="changeId"
      :Allstudents="Allstudents"
      :closeevents="closeevents"
      :stotalSize="stotalSize"
    ></get-students> -->
    <review-report
      :show="dialogFormVisiblep"
      :id="changeId"
      :alltitles="alltitles"
      :closeeventp="closeeventp"
      :ptotalSize="ptotalSize"
    ></review-report>
    <prictice-report
      :show="dialogFormVisiblejz"
      :id="changeId"
      :Allreports="Allreports"
      :endTime="endTime"
      :closeeventjz="closeeventjz"
      :jztotalSize="jztotalSize"
    ></prictice-report>
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
      <el-table-column prop="hour" align="center" label="学时" width="50"></el-table-column>
      <el-table-column prop="className" align="center" label="所属课程" width="150"></el-table-column>
      <el-table-column prop="userNo" align="center" label="实验教师" width="120"></el-table-column>
      <el-table-column prop="time" align="center" label="试验时间" ></el-table-column>
      <el-table-column prop="location" align="center" label="试验地点" width="100"></el-table-column>
      <el-table-column prop="assessmentName" align="center" label="考核"  width="100"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="350px">
        <template slot-scope="scope">
          <!-- <el-button
            type="primary"
            plain
            size="mini"
            @click="getStudents(scope.$index, scope.row)"
          >查看所选学生</el-button> -->
          <template v-if="scope.row.tp === 0">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="hEditpractice(scope.$index, scope.row)"
          >发布集中性实践任务</el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="pyjzreport(scope.$index, scope.row)"
          >集中性实验报告批阅</el-button>
          </template>
          <template v-else>
          <el-button type="primary" plain size="mini" @click="hEdit(scope.$index, scope.row)">发布课内实验任务</el-button>

          <el-button
            type="primary"
            plain
            size="mini"
            @click="pyreport(scope.$index, scope.row)"
          >课内实验报告批阅</el-button>
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
import vurl from "../../url.js";
import Pagination from "../../components/Pagination";
// import GetStudents from "../../components/Curriculum/Getstudents";
import RealeaseTask from "../../components/Curriculum/Realeasetask";
import ReviewReport from "../../components/Curriculum/Reviewreport";
import RealeasePractice from "../../components/Curriculum/Realeasepractice";
import PricticeReport from "../../components/Curriculum/PricticeReport"
export default {
  name: "Curriculum",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      jztotalSize: 0,  //课内实践报告总信息数
      users: [], //所有信息
      usersp: [],
      usersc: [],
      endTime: "", //教师评分截止时间
      dialogFormVisible: false, //发布实验任务
      dialogFormVisiblev: false, //查看实验任务
      dialogFormVisiblep: false, //批阅课内实验报告
      dialogFormVisiblejz: false,  //批阅集中性实验报告
      dialogFormVisibles: false, //选课学生
      Allstudents: [], //该课程选课学生
      Allreports: [], //批阅实验报告
      qryContent: "", //查询条件
      stotalSize: 0, //学生列表总条数
      ptotalSize: 0, //实验报告总条数
      vurl,
      uploadId: {},   //实验报告上传
      alltitles: [], //已发布的所有实验题目
      changeId: 0, //课程id
      orders: 0, //实验题目总数
      rules, //验证规则
      insertFlag: "", //提示信息
      loading: true
    };
  },
  components: {
    Pagination,
    // GetStudents,
    RealeaseTask,
    ReviewReport,
    RealeasePractice,
    PricticeReport
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
    //文件下载
    download(name) {
      window.location.href = vurl + "/report/download?name=" + name; // 本窗口打开下载
    },
    //集中性实践实验任务
    closeeventv(val) {
      this.dialogFormVisiblev = val;
    },
    //课内实验任务
    closeevent(val) {
      this.dialogFormVisible = val;
    },
    //查看选课学生
    // closeevents(val) {
    //   this.dialogFormVisibles = val;
    // },
    //批阅课内实验报告
    closeeventp(val) {
      this.dialogFormVisiblep = val;
    },
    //批阅集中性实验报告
    closeeventjz(val) {
      this.dialogFormVisiblejz = val;
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
    //发布课内实验任务
    hEdit(index, row) {
      this.orders = row.hour / 2;
      this.changeId = row.cid;
      this.dialogFormVisible = true;
    },
    //获取该实验的所有实验题目
    getAlltitltes() {
      let url = "/task/getAlltitles";
      let data = {
        id: this.changeId
      };
      this.$post(url, data).then(res => {
        this.alltitles = res.dataList;
      });
    },
    //查看选课学生
    getStudents(index, row) {
      this.changeId = row.id;
      this.dialogFormVisibles = true;
      this.getAllstudents();
    },
    getAllstudents() {
      let url = "/course/getAllstudents";
      let data = { id: this.changeId };
      this.$post(url, data).then(res => {
        this.Allstudents = res.dataList;
        this.stotalSize = res.dataList.length;
      });
    },
    //发布集中性实践任务
      hEditpractice(index, row) {
      this.changeId = row.id;
      this.uploadId = {id: this.changeId};
      this.dialogFormVisiblev = true;
    },
    //批阅课内实验报告
    pyreport(index, row) {
      this.changeId = row.cid;
      this.dialogFormVisiblep = true;
      this.getAlltitltes();
    },
    //批阅集中性实验报告
    pyjzreport(index, row){
      this.changeId = row.id;
      this.dialogFormVisiblejz = true;
      this.getReports();
    },
    //获取集中性实践报告
    getReports(){
    let url = "/report/getAlljzreports";
    let data = { id: this.changeId };
    this.$post(url, data).then(res=>{
    this.Allreports = res.dataList;
    this.jztotalSize = res.dataList.length;
    if(this.jztotalSize){
    this.endTime = res.dataList[0].endTimegrade;
    }
    })
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
.Curriculum {
  .pyreport {
    .el-dialog {
      .el-dialog__header {
        background-color: #f8f8f8;
      }
    }
  }
  .block {
    margin-top: 20px;
  }
}
</style>