<template>
  <div class="Curriculummanage" v-loading="loading">
    <set-profession
      :show="show"
      :professionlist="professionlist"
      :Close="pClose"
      :id="changeId"
      :professionlist_ed="professionlist_ed"
    ></set-profession>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入 实验名称/所属课程/实验教师 进行查询"
          clearable
          @keyup.enter.native="Search"
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
        <el-button type="primary" size="small" @click="handleEdit">增加</el-button>
        <el-button type="primary" size="small" @click="Lessuser">删除</el-button>
      </el-form-item>

      <el-dialog :title="vtitle" class="pdialog" :visible.sync="dialogFormVisible" width="55%">
        <el-form ref="editForm" :model="editForm" size="mini" label-width="160px" :rules="rules">
          <div class="edit_left">
            <el-form-item label="实验名称" prop="name">
              <el-input size="mini" v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="学时" prop="hour">
              <el-input size="mini" v-model="editForm.hour"></el-input>
            </el-form-item>
            <el-form-item label="实验教师" prop="userId">
              <el-select size="mini" v-model="editForm.userId" filterable>
                <el-option
                  v-for="item in vusers"
                  :key="item.userId"
                  :label="item.userNo"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="edit_right">
            <!-- <el-form-item label="实验类型" prop="type">
              <el-radio-group v-model="editForm.type" size="mini">
                <el-radio label="0">培养计划内实验</el-radio>
                <el-radio label="1">开放性实验</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="实验时间" prop="time">
              <el-input size="mini" v-model="editForm.time"></el-input>
            </el-form-item>
            <el-form-item label="实验地点" prop="location">
              <el-input size="mini" v-model="editForm.location"></el-input>
            </el-form-item>
            <el-form-item label="考核" prop="assessmentId">
              <el-select size="mini" v-model="editForm.assessmentId" filterable>
                <el-option
                  v-for="item in assessment"
                  :key="item.id"
                  :label="item.assessmentName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button size="small" type="primary" class="title" @click="submitForm('editForm');">保存</el-button>
        </div>
      </el-dialog>
    </el-form>

    <el-table
      :data="users.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
      @selection-change="row_click"
    >
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column prop="name" align="center" label="实验名称" width="180"></el-table-column>
      <!-- <el-table-column prop="typeName" align="center" label="实验类型" width="180"></el-table-column> -->
      <el-table-column prop="hour" align="center" label="学时" width="180"></el-table-column>
      <el-table-column prop="userNo" align="center" label="实验教师" width="200"></el-table-column>
      <el-table-column prop="time" align="center" label="实验时间" width="200"></el-table-column>
      <el-table-column prop="location" align="center" label="实验地点" width="200"></el-table-column>
      <el-table-column prop="assessmentName" align="center" label="考核" width="200"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="hEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="Setp(scope.$index, scope.row)">设置开课的专业</el-button>
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
import Pagination from "../Pagination";
import SetProfession from "../Setprofession";
export default {
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 10, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      show: false, //设置专业
      dialogFormVisible: false, //增加页面是否显示
      dialogFormVisible_x: false, //修改页面是否显示
      qryContent: "",
      editForm: {
        name: "", //实验名
        hour: "", //学时
        userId: null, //教师
        time: "", //时间
        location: "", //地点
        assessmentId: null //考核
      },
      professionlist_ed: [],  //已设置专业
      professionlist: [], //所有专业
      changeId: 0,
      college: [], //学院
      vusers: [], //教师信息
      assessment: [], //考核信息
      Userdeleteid: [],
      rules, //验证规则
      vtitle: "",
      options: [],
      insertFlag: "", //提示信息
      loading: false
    };
  },
  components: {
    Pagination,
    SetProfession
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
    pClose(val){
    this.show = val;
    this.clearData();
    },
    //获取所有数据
    getData() {
      let url = "/jzcourse/searchcourse";
      let data = {qryContent: this.qryContent};
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        // nusers.forEach(v => {
        //   if (v.type === "0") {
        //     v.typeName = "培养计划内实验";
        //   }
        //   if (v.type === "1") {
        //     v.typeName = "开放性实验";
        //   }
        // });
        // this.users = nusers;
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
    //设置开课专业
    Setp(index, row){
      this.changeId = row.id;
      this.show = true;
      this.getprofessiond();
    },
    //获取以设置专业列表
    getprofessiond() {
      let url = "/profession/gjzp_pro";
      let data = { id: this.changeId};
      this.$post(url, data).then(res => {
        let list = res.dataList;
        list.forEach(v=>{
         this.professionlist_ed.push(v.profession)
        })
        this.getprofession();
      });
    },
     //获取未设置专业列表
      getprofession() {
      let url = "/profession/getprofession";
      let data = {};
      this.$post(url, data).then(res => {
        this.professionlist = res.dataList;
      });
    },
    //获取教师信息
    getUsers() {
      let url = "/course/getUsers";
      let data = {};
      this.$post(url, data).then(res => {
        this.vusers = res.users;
      });
    },
    //获取考核信息
    getAssessment() {
      let url = "/course/getAssessment";
      let data = {};
      this.$post(url, data).then(res => {
        this.assessment = res.assessment;
      });
    },
    handleEdit() {
      //添加
      this.clearData();
      this.vtitle = "添加集中性实践";
      this.dialogFormVisible = true;
      this.getUsers();
      this.getAssessment();
    },
    //修改
    hEdit(index, row) {
      this.changeId = row.id;
      this.vtitle = "修改集中性实践信息";
      this.dialogFormVisible = true;
      this.getUsers();
      this.getAssessment();
      let url = "/jzcourse/getonejzp";
      let data = {
        id: this.changeId
      };
      this.$post(url, data).then(res => {
        this.editForm.name = res.course[0].name;
        this.editForm.time = res.course[0].time;
        this.editForm.hour = res.course[0].hour;
        this.editForm.location = res.course[0].location;
        this.editForm.assessmentId = res.course[0].assessmentId;
        this.editForm.userId = res.course[0].userId;
      });
    },
    Search() {
      //查询
      let url = "/jzcourse/searchcourse";
      let data = {
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        // nusers.forEach(v => {
        //   if (v.type === "0") {
        //     v.typeName = "培养计划内实验";
        //   }
        //   if (v.type === "1") {
        //     v.typeName = "开放性实验";
        //   }
        // });
        // this.users = nusers;
        this.totalSize = res.dataList.length;
      });
    },
    //请求学院
    reqDataCollege() {
      let url = "/course/getCollege";
      let data = {};
      this.$post(url, data).then(res => {
        this.college = res.collegelist;
      });
    },
    clearData() {
      //初始化弹出框数据
      this.changeId = 0;
      this.professionlist_ed = [];
      (this.editForm.name = ""),
        (this.editForm.hour = ""),
        (this.editForm.ownId = ""),
        (this.editForm.userId = ""),
        (this.editForm.time = ""),
        (this.editForm.location = ""),
        (this.editForm.assessmentId = "");
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
      if (this.Userdeleteid.length === 0) {
        this.$alert("请选择一个需要删除的项目!", "提示");
      } else {
        this.$confirm("是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            let url = "/jzcourse/deleteCourse";
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
      }
    },
    submitForm(editData) {
      //用户 修改/添加 提交
      this.$refs[editData].validate(valid => {
        if (valid) {
          let data = {};
          let url = "/jzcourse/addjzp";
          if (this.changeId !== null) {
            data = {
              id: this.changeId,
              name: this.editForm.name,
              hour: this.editForm.hour,
              userId: this.editForm.userId,
              // type: this.editForm.type,
              time: this.editForm.time,
              location: this.editForm.location,
              assessmentId: this.editForm.assessmentId
            };
          } else {
            data = {
              name: this.editForm.name,
              hour: this.editForm.hour,
              userId: this.editForm.userId,
              // type: this.editForm.type,
              time: this.editForm.time,
              location: this.editForm.location,
              assessmentId: this.editForm.assessmentId
            };
          }
          this.$post(url, data).then(res => {
            this.insertFlag = res.message;
            this.dialogFormVisible = false;
            this.$alert(this.insertFlag, this.vtitle + "结果", {
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
    }
  }
};
</script>
<style lang="scss">
.Curriculummanage {
  .pdialog {
    .el-dialog {
      padding: 0px;
      height: 350px;
      width: 780px !important;
      .el-dialog__header {
        background-color: #f8f8f8;
      }
      .el-dialog__body {
        padding: 30px 3px !important;
        .edit_left {
          margin-left: 20px;
          height: 270px;
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
        .edit_right {
          margin-left: 340px;
          margin-top: -270px;
          height: 220px;
          width: 350px;
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
            .el-radio {
              width: 180px;
              text-align: left;
            }
            .el-radio:first-child {
              position: absolute;
            }
            .el-radio:last-child {
              margin-top: 20px;
            }
          }
        }
      }
      .el-dialog__footer {
        margin-top: -50px;
        text-align: center !important;
      }
    }
  }
  .block {
    margin-top: 20px;
  }
}
</style>