<template>
  <div class="Classmanage" v-loading="loading">
        <set-profession
      :show="show"
      :type="1"
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
          placeholder="请输入 课程编号/课程名称/实验教师 进行查询"
          clearable
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
            <el-form-item label="课程编号" prop="classNum">
              <el-input size="mini" v-model="editForm.classNum"></el-input>
            </el-form-item>
            <el-form-item label="课程名称" prop="className">
              <el-input size="mini" v-model="editForm.className"></el-input>
            </el-form-item>
            <el-form-item label="任课教师" prop="classTeacherId">
              <el-select size="mini" v-model="editForm.classTeacherId" filterable>
                <el-option
                  v-for="item in vusers"
                  :key="item.userId"
                  :label="item.userNo"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属学院" prop="ownCollegeId">
              <el-select size="mini" v-model="editForm.ownCollegeId" filterable>
                <el-option
                  v-for="item in college"
                  :key="item.collegeId"
                  :label="item.collegeName"
                  :value="item.collegeId"
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
      <el-table-column prop="classNum" align="center" label="课程编号" width="180"></el-table-column>
      <el-table-column prop="className" align="center" label="课程名称" width="180"></el-table-column>
      <el-table-column prop="userNo" align="center" label="任课教师" width="200"></el-table-column>
      <el-table-column prop="collegeName" align="center" label="所属学院" width="200"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
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
import Pagination from "../../components/Pagination";
import SetProfession from "../../components/Setprofession";
export default {
  name: "Classmanage",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      dialogFormVisible: false, //增加页面是否显示
      qryContent: "",
      editForm: {
        className: "", //课程名
        classNum: "", //课程编号
        classTeacherId: null, //任课教师
        ownCollegeId: null //所属学院
      },
      show: false, //设置专业
      professionlist_ed: [],  //已设置专业
      professionlist: [], //所有专业
      changeId: 0,
      college: [], //学院
      vusers: [], //教师信息
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
    },
    //获取所有数据
    getData() {
      let url = "/vclass/getAllclass";
      let data = {};
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        this.totalSize = this.users.length;
        this.loading = false;
      });
    },
        //设置开课专业
    Setp(index, row){
      this.changeId = row.classId;
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
    //设置表头背景色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    //请求学院
    getCollege() {
      let url = "/about/getCollege";
      let data = {};
      this.$post(url, data).then(res => {
        this.college = res.collegelist;
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
    handleEdit() {
      //添加
      this.clearData();
      this.vtitle = "添加课程";
      this.dialogFormVisible = true;
      this.getUsers();
      this.getCollege();
    },
    //修改
    hEdit(index, row) {
      this.changeId = row.classId;
      this.vtitle = "修改实验课程";
      this.dialogFormVisible = true;
      this.getUsers();
      this.getCollege();
      let url = "/vclass/getoneclass";
      let data = {
        classId: this.changeId
      };
      this.$post(url, data).then(res => {
        this.editForm.className = res.class[0].className;
        this.editForm.classTeacherId = res.class[0].classTeacherId;
        this.editForm.classNum = res.class[0].classNum;
        this.editForm.ownCollegeId = res.class[0].ownCollegeId;
      });
    },
    Search() {
      //查询
      let url = "/vclass/searchClass";
      let data = {
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        if (res.code === 1) {
          this.users = res.dataList;
          this.totalSize = res.dataList.length;
        }
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
      (this.editForm.className = ""),
        (this.editForm.classNum = ""),
        (this.editForm.classTeacherId = ""),
        (this.editForm.ownCollegeId = "");
    },

    row_click(selection) {
      //复选框状态改变触发
      this.Userdeleteid = [];
      for (let i = 0; i < selection.length; i++) {
        this.Userdeleteid.push(selection[i].classId);
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
            let url = "/vclass/deleteClass";
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
          let url = "/vclass/addClass";
          if (this.changeId !== null) {
            data = {
              classId: this.changeId,
              className: this.editForm.className,
              classTeacherId: this.editForm.classTeacherId,
              ownCollegeId: this.editForm.ownCollegeId,
              classNum: this.editForm.classNum
            };
          } else {
            data = {
              className: this.editForm.className,
              classTeacherId: this.editForm.classTeacherId,
              ownCollegeId: this.editForm.ownCollegeId,
              classNum: this.editForm.classNum
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
.Classmanage {
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