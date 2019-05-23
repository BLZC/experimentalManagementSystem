<template>
  <div class="Studentcurriculum" v-loading="loading">
    <view-practice
      :show="dialogFormVisiblep"
      :id="changeId"
      :touser="touser"
      :editForm="editFormp"
      :closeeventp="closeeventp"
    ></view-practice>
    <view-task
      :show="dialogFormVisiblev"
      :id="changeId"
      :touser="touser"
      :closeeventv="closeeventv"
      :alltitles="alltitles"
    ></view-task>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入 实验名称/所属课程/实验教师 进行查询"
          clearable
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
      </el-form-item>
      <!-- <el-dialog class="uploadr" title="上传实验报告" :visible.sync="dialogFormVisible" width="30%">
        <el-form
          ref="editReport"
          :model="editReport"
          :rules="rules"
          :inline="true"
          class="demo-form-inline"
        >
          <el-form-item label="实验题目:" prop="selecttitle">
            <el-select
              v-model="editReport.selecttitle"
              placeholder="请选择实验题目"
              style="width:280px;"
              size="mini"
              @change="getordertitle(editReport.selecttitle)"
            >
              <el-option
                v-for="item in alltitles"
                :key="item.ordertitle"
                :label="item.title"
                :value="item.ordertitle"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              :data="uploadId"
              action="/course/uploadreport"
              multiple
              :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button
            size="small"
            type="primary"
            class="title"
            @click="submitReport('editReport');"
          >保存</el-button>
        </div>
      </el-dialog>-->
    </el-form>

    <el-table
      :data="users.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="name" align="center" label="实验名称" width="180"></el-table-column>
      <el-table-column prop="typeName" align="center" label="实验类型" width="180"></el-table-column>
      <el-table-column prop="hour" align="center" label="学时" width="180"></el-table-column>
      <el-table-column prop="className" align="center" label="所属课程" width="200"></el-table-column>
      <el-table-column prop="userNo" align="center" label="实验教师" width="200"></el-table-column>
      <el-table-column prop="time" align="center" label="试验时间" width="200"></el-table-column>
      <el-table-column prop="location" align="center" label="试验地点" width="200"></el-table-column>
      <el-table-column prop="assessmentName" align="center" label="考核" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="180px" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.tp === 0">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="hEditlookt(scope.$index, scope.row)"
          >查看集中性实践任务</el-button>
          </template>
          <template v-else>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="hEditlook(scope.$index, scope.row)"
          >查看课内实验任务</el-button>
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
import ViewPractice from "../../components/Studentcurriculum/Viewpractice";
import ViewTask from "../../components/Studentcurriculum/Viewtask";
export default {
  name: "Studentcurriculum",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      dialogFormVisiblep: false, //查看集中性实践任务是否显示
      dialogFormVisiblev: false, //查看课内实验任务是否显示
      qryContent: "",
      changeId: 0,  //课程号
      touser: 0,    //接收人
      alltitles: [],
      uploadId: {},
      editReport: {
        selecttitle: "" //选择实验题目
      },
      editForm: {
        //课内实验
        title: "", //实验题目
        ordertitle: "", //实验序号
        sytype: null, //实验类型 0--验证型实验  1--综合型实验
        endTimereport: "", //实验报告提交截止日期
        endTimegrade: "", //实验分数提交截止日期
        shiyan: "", //实验要求
        yuxi: "", //预习要求
        ziliao1: "", //参考资料
        ziliao2: "",
        ziliao3: ""
      },
      editFormp: {
        //集中性实践
        title: "", //实验题目
        endTimereport: "", //实验报告提交截止日期
        endTimegrade: "", //实验分数提交截止日期
        shiyan: "", //实验要求
        yuxi: "", //预习要求
        ziliao1: "", //参考资料
        ziliao2: "",
        ziliao3: ""
      },
      rules, //验证规则
      insertFlag: "", //提示信息
      loading: false
    };
  },
  mounted() {
    this.getData();
  },
  components: {
    Pagination,
    ViewPractice,
    ViewTask
  },
  methods: {
    getordertitle(value) {
      this.uploadId = {
        id: this.changeId,
        uid: parseInt(sessionStorage.getItem("uid")),
        ordertitle: value
      };
    },
    //获取所有数据
    getData() {
      let url = "/course/getstudentcourse";
      let data = {
        uid: parseInt(sessionStorage.getItem("uid")),
        profession: parseInt(sessionStorage.getItem("professionId"))
      };
      this.$post(url, data).then(res => {
        let nusers = res.dataList;
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
    //查看集中性实践任务
    closeeventp(val) {
      this.dialogFormVisiblep = val;
    },
    //查看课内实验任务
    closeeventv(val) {
      this.dialogFormVisiblev = val;
    },
    //查看课内实验任务
    hEditlook(index, row) {
      this.clearData();
      this.changeId = row.cid;
      this.touser = row.userId;
      this.getAlltitltes();
      this.dialogFormVisiblev = true;
    },
    //查看集中性实践任务
    hEditlookt(index, row) {
      this.clearData();
      this.changeId = row.id;
      this.touser = row.userId;
      let url = "/task/getcoursejzClaim";
      let data = { id: this.changeId };
      this.$post(url, data).then(res => {
        if (res.dataList.length > 0) {
          this.editFormp.title = res.dataList[0].title;
          this.editFormp.endTimereport = res.dataList[0].endTimereport;
          this.editFormp.endTimegrade = res.dataList[0].endTimegrade;
          this.editFormp.shiyan = res.dataList[0].shiyan;
          this.editFormp.yuxi = res.dataList[0].yuxi;
          this.editFormp.ziliao1 = res.dataList[0].ziliao1;
          this.editFormp.ziliao2 = res.dataList[0].ziliao2;
          this.editFormp.ziliao3 = res.dataList[0].ziliao3;
        }
        this.dialogFormVisiblep = true;
      });
    },
    Search() {
      //查询
      this.clearData();
      let url = "/course/searchstudentcourse";
      let data = {
        qryContent: this.qryContent,
        sid: parseInt(sessionStorage.getItem("uid"))
      };
      this.$post(url, data).then(res => {
        let nusers = res.dataList;
        nusers.forEach(v => {
          if (v.type === "0") {
            v.typeName = "培养计划内实验";
          }
          if (v.type === "1") {
            v.typeName = "培养计划内实验";
          }
        });
        this.users = nusers;
        this.totalSize = res.dataList.length;
      });
    },
    clearData() {
      //初始化弹出框数据
      this.touser = 0;
      this.changeId = 0;
      this.editFormp.title = "";
      this.editFormp.endTimereport = "";
      this.editFormp.endTimegrade = "";
      this.editFormp.yuxi = "";
      this.editFormp.shiyan = "";
      this.editFormp.ziliao1 = "";
      this.editFormp.ziliao2 = "";
      this.editFormp.ziliao3 = "";
    }
  }
};
</script>
<style lang="scss">
.Studentcurriculum {
  .pdialogp {
    .el-dialog {
      padding: 0px;
      .el-dialog__header {
        background-color: #f8f8f8;
      }
      .el-dialog__body {
        padding: 10px 3px !important;
        .edit_left {
          margin-left: 5%;
          height: 480px;
          width: 90%;
          .el-form-item {
            width: 800px;
            margin-bottom: 5px;
            .el-form-item__label {
              position: absolute;
              text-align: left;
            }
            .el-form-item__content {
              margin-top: 30px;
              width: 800px;
            }
            .el-row {
              width: 800px;
              margin-top: -30px;
              .el-card {
                .el-card__header {
                  padding: 0 5px;
                  text-align: left;
                  height: 35px;
                }
                .el-card__body {
                  height: 90px;
                  padding: 0 5px;
                  text-align: left;
                }
              }
            }
            .el-upload--text {
              position: absolute;
            }
            .el-upload__tip {
              text-align: left;
              padding-left: 200px;
            }
            .el-upload-list__item {
              text-align: left;
              padding-left: 100px;
            }
          }
        }
      }
    }
  }
  .block {
    margin-top: 20px;
  }
}
</style>