<template>
  <div class="laboratoryResources" v-loading="loading">
          <el-dialog :title=vtitle class="pdialog" :visible.sync="dialogFormVisible" width="55%">
        <el-form ref="editForm" :model="editForm" size="mini" label-width="120px" :rules="rules">
          <div class="edit_left">
            <el-form-item label="实验室" prop="place">
              <el-input size="mini" v-model="editForm.place"></el-input>
            </el-form-item>
            <el-form-item label="设备总数" prop="device">
              <el-input size="mini" v-model="editForm.device"></el-input>
            </el-form-item>
            <el-form-item label="受损设备" prop="demanged">
              <el-input size="mini" v-model="editForm.demanged"></el-input>
            </el-form-item>
            <el-form-item label="管理员" prop="manager">
              <el-select size="mini" v-model="editForm.manager" filterable>
                <el-option
                  v-for="item in vusers"
                  :key="item.userId"
                  :label="item.userNo"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input size="mini" v-model="editForm.remark"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button size="small" type="primary" class="title" @click="submitForm('editForm');">保存</el-button>
        </div>
      </el-dialog>
      <el-form>
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入 实验室/管理员 进行查询"
          clearable
          @keyup.enter.native="Search"
          style="width: 500px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
        <el-button type="primary" size="small" @click="handleEdit">新增</el-button>
        <el-button type="primary" size="small" @click="Lessuser">删除</el-button>
        <el-button type="primary" size="small" @click="export2Excel">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="users.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
      @selection-change="row_click"
    >
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column prop="place" align="center" label="实验室" width="180"></el-table-column>
      <el-table-column prop="device" align="center" label="设备总数" width="180"></el-table-column>
      <el-table-column prop="demanged" align="center" label="受损设备" width="180"></el-table-column>
      <el-table-column prop="userNo" align="center" label="管理员" width="200"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column prop="assessment" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="hEdit(scope.$index, scope.row)">编辑</el-button>
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
  name: "laboratoryResources",
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      users: [], //所有信息
      dialogFormVisible: false, //增改页面是否显示
      vusers: [],  //老师
      vtitle: "",  //题目
      qryContent: "",
      editForm: {
        place: "", //位置
        device: null, //所有设备
        demanged: null, //受损设备
        manager: null, //管理员
        remark: ""  //备注
      },
      changeId: null,
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
      let url = "/about/searchresource";
      let data = {};
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        this.totalSize = this.users.length;
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
      this.vtitle = "新增";
      this.clearData();
      this.getUsers();
      this.dialogFormVisible = true;   
    },
    //修改
    hEdit(index, row) {
      this.vtitle = "修改";
      this.changeId = row.id;
      this.dialogFormVisible = true;
      this.getUsers(); //请求老师
      let url = "/about/getresource";
      let data = {
        id: this.changeId
      };
      this.$post(url, data).then(res => {
        this.editForm.place = res.dataList[0].place;
        this.editForm.device = res.dataList[0].device;
        this.editForm.demanged = res.dataList[0].demanged;
        this.editForm.manager = parseInt(res.dataList[0].manager);
        this.editForm.remark = res.dataList[0].remark;
      });
    },
    Search() {
      //查询
      let url = "/about/searchresource";
      let data = {
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        this.users = res.dataList;
        this.totalSize = this.users.length;
      });
    },
   // 导出表格
    export2Excel() {
      require.ensure([], () => {
        let { exportJsonToExcel } = require("../../vendor/Export2Excel");
        // 表头
        let thHeader = ["实验室","总设备数量","损坏设备数量","管理员","备注"];
        let lists = ["place","device","demanged","manager","remark"];
        let tHeader = thHeader;
        //表头对应字段名，要和下面数据key对应
        let filterVal = lists;
        // 数据来源
        // let list = this.serachData;
        //模拟数据
        let list = this.users;
        let data = this.formatJson(filterVal, list); //数据格式化
        var index1 = "实验室资源表格"; //导出时文件名
        exportJsonToExcel(tHeader, data, index1); //导出文件
      });
    },
    // 数据格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //获取教师信息
    getUsers() {
      let url = "/course/getUsers";
      let data = {};
      this.$post(url, data).then(res => {
        this.vusers = res.users;
      });
    },
    clearData() {
      //初始化弹出框数据
      this.Userdeleteid = [];
      this.editForm.place = "";
      this.editForm.device = null;
      this.editForm.demanged = null;
      this.editForm.manager = null;
      this.editForm.remark=""
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
          let url = "/about/rmresource";
          let data = { ids: this.Userdeleteid };
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
          let url = "/about/addresource";
          let data = {};
          if(this.changeId){
          data = {
            id: this.changeId,
            place: this.editForm.place,
            device: this.editForm.device,
            demanged: this.editForm.demanged,
            manager: this.editForm.manager,
            remark: this.editForm.remark
          };
          }
          else{
          data = {
            id: this.changeId,
            place: this.editForm.place,
            device: this.editForm.device,
            demanged: this.editForm.demanged,
            manager: this.editForm.manager,
            remark: this.editForm.remark
          }
          }
          this.$post(url, data).then(res => {
            this.insertFlag = res.message;
            this.dialogFormVisible = false;
            this.$alert(this.insertFlag, this.vtitle+"结果", {
              confirmButtonText: "确定"
            });
            this.getData();
            this.clearData();
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
.laboratoryResources {
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
          height: 200px;
          width: 350px;
          .el-form-item {
            margin-bottom: 15px;
            .el-input__inner {
              width: 180px !important;
              height: 35px;
              line-height: 35px;
            }
          }
        }
      }
      .el-dialog__footer {
        margin-top: 20px;
        text-align: center !important;
      }
    }
  }
  .block {
    margin-top: 20px;
  }
}
</style>