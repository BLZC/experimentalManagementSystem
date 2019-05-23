<template>
  <div class="usermanage" v-loading="loading">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入 用户名/工号 进行查询"
          clearable
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
        <el-button type="primary" size="small" @click="handleEdit">新增</el-button>
        <el-button type="primary" size="small" @click="Lessuser">删除</el-button>
      </el-form-item>

      <el-dialog title="新增" class="pdialog" :visible.sync="dialogFormVisible" width="55%">
        <el-form ref="editForm" :model="editForm" size="mini" label-width="160px" :rules="rules">
          <div class="edit_left">
            <el-form-item label="用户姓名" prop="userNo">
              <el-input size="mini" v-model="editForm.userNo"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="userName">
              <el-input size="mini" v-model="editForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="editForm.sex" size="mini">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="学院" prop="college">
              <el-select size="mini" v-model="editForm.college" filterable>
                <el-option
                  v-for="item in college"
                  :key="item.collegeId"
                  :label="item.collegeName"
                  :value="item.collegeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职日期" prop="inschool">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.inschool"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出生日期" prop="born">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.born"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button size="small" type="primary" class="title" @click="submitForm('editForm');">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改" class="pdialog" :visible.sync="dialogFormVisible_x" width="55%">
        <el-form ref="editForm" :model="editForm" size="mini" label-width="160px" :rules="rules">
          <div class="edit_left">
            <el-form-item label="用户姓名" prop="userNo">
              <el-input size="mini" v-model="editForm.userNo"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="userName">
              <el-input size="mini" v-model="editForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="editForm.sex" size="mini">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="学院" prop="college">
              <el-select size="mini" v-model="editForm.college" filterable>
                <el-option
                  v-for="item in college"
                  :key="item.collegeId"
                  :label="item.collegeName"
                  :value="item.collegeId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职日期" prop="inschool">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.inschool"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出生日期" prop="born">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="editForm.born"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button
            size="small"
            type="primary"
            class="title"
            @click="submitFormchange('editForm');"
          >保存</el-button>
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
      <el-table-column prop="userNo" align="center" label="用户名" width="180"></el-table-column>
      <el-table-column prop="userName" align="center" label="工号" width="180"></el-table-column>
      <el-table-column prop="collegeName" align="center" label="学院" width="200"></el-table-column>
      <el-table-column prop="born" align="center" label="出生日期" width="180"></el-table-column>
      <el-table-column prop="inschool" align="center" label="入职时间" width="180"></el-table-column>
      <el-table-column prop="sex" align="center" label="性别"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="hEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="Reset(scope.$index, scope.row)">重置密码</el-button>
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
export default {
  name: "usermanage",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      dialogFormVisible: false, //增加页面是否显示
      dialogFormVisible_x: false, //修改页面是否显示
      qryContent: "",
      editForm: {
        userNo: "", //姓名
        userName: "", //账号
        college: "", //学院
        sex: "", //性别
        inschool: "", //入职日期
        born: "" //出生日期
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
    Pagination
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
    //获取所有数据
    getData() {
      let url = "/about/getUsers";
      let data = {};
      this.$post(url, data).then(res => {
        this.users = res.userlist;
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
    handleEdit() {
      //添加
      this.clearData();
      this.dialogFormVisible = true;
      this.reqDataCollege();
    },
    //修改
    hEdit(index, row) {
      this.changeId = row.userId;
      this.dialogFormVisible_x = true;
      this.reqDataCollege(); //请求学院
      let url = "/about/getoneUser";
      let data = {
        userName: row.userName
      };
      this.$post(url, data).then(res => {
        this.editForm.userName = res.user[0].userName;
        this.editForm.sex = res.user[0].sex;
        this.editForm.userNo = res.user[0].userNo;
        this.editForm.college = res.user[0].collegeId;
        this.editForm.inschool = res.user[0].inschool;
        this.editForm.born = res.user[0].born;
      });
    },
    Search() {
      //查询
      let url = "/about/searchUser";
      let data = {
        qryContent: this.qryContent
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
      this.editForm.sex = "";
      this.editForm.college = "";
      this.editForm.inschool = "";
      this.editForm.born = "";
    },

    row_click(selection) {
      //复选框状态改变触发
      this.Userdeleteid = [];
      for (let i = 0; i < selection.length; i++) {
        this.Userdeleteid.push(selection[i].userId);
      }
    },
    //密码重置
    Reset(index, row) {
      this.$confirm("是否确认重置该用户密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let url = "/about/retcpassword";
          let data = { uid: row.userId };
          this.$post(url, data).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: res.message
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
            message: "已取消"
          });
        });
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
            let url = "/about/deleteUser";
            let data = { userId: this.Userdeleteid };
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
      //用户 添加 提交
      this.$refs[editData].validate(valid => {
        if (valid) {
          let url = "/about/addUser";
          let data = {
            userName: this.editForm.userName,
            userNo: this.editForm.userNo,
            sex: this.editForm.sex,
            college: this.editForm.college,
            born: this.editForm.born,
            inschool: this.editForm.inschool
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
            userId: this.changeId,
            userName: this.editForm.userName,
            userNo: this.editForm.userNo,
            sex: this.editForm.sex,
            college: this.editForm.college,
            born: this.editForm.born,
            inschool: this.editForm.inschool
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
.usermanage {
  .pdialog {
    .el-dialog {
      padding: 0px;
      height: 450px;
      width: 380px !important;
      .el-dialog__header {
        background-color: #f8f8f8;
      }
      .el-dialog__body {
        padding: 30px 3px !important;
        .edit_left {
          margin-left: -25px;
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