// 批阅实验报告
<template>
  <el-dialog
    title="批阅实验报告"
    class="pyreport"
    :visible.sync="vshow"
    @close="Close"
    width="70%"
    style="margin-left:15%; margin-right:5%;"
  >
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入姓名/学号进行查询"
          clearable
          style="width: 200px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        style=" position: absolute; text-align:left; width: 380px !important; margin-left:-310px;"
        prop="ordertitle"
      >
        <el-select v-model="selecttitle" placeholder="请选择实验题目" style="width:300px;" size="small">
          <el-option
            v-for="item in alltitles"
            :key="item.ordertitle"
            :label="item.title"
            :value="item.ordertitle"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: left; margin-left:300px;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
      </el-form-item>
      <el-table
        :data="data.slice((currPage-1)*pageSize,currPage*pageSize)"
        border
        style="width:100%"
        :header-cell-style="getRowClass"
      >
        <el-table-column prop="userName" align="center" label="学号" width="120"></el-table-column>
        <el-table-column prop="userNo" align="center" label="姓名" width="120"></el-table-column>
        <el-table-column prop="reportName" align="center" label="实验报告" width="350"></el-table-column>
        <el-table-column prop="grade" align="center" label="分数" width="50"></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="downreport(scope.$index, scope.row)"
            >下载实验报告</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="Setgrade(scope.$index, scope.row)"
            >打分</el-button>
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
    </el-form>
  </el-dialog>
</template>
<script>
import { rules } from "../../api/index.js";
import Pagination from "../../components/Pagination";
import vurl from "../../url.js";
export default {
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0, //总信息数
      rules, //验证规则
      data: [],
      fileList: [],
      vshow: false,
      endTime: "",  //评分截止时间
      vurl,
      qryContent: "", //查询条件
      selecttitle: "" //选择的题目
    };
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    // Allreports: {
    //   type: Array,
    //   required: true
    // },
    alltitles: {
      type: Array,
      required: true
    },
    closeeventp: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Pagination
  },
  watch: {
    show(newval) {
      this.vshow = newval;
    }
  },
  mounted() {
    // this.getAlltitltes();
  },
  methods: {
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
    //关闭事件
    Close() {
      this.closeeventp(false);
    },
    Search() {
      let url = "/report/getAllreports";
      let data = {
        cid: this.id,
        ordertitle: this.selecttitle,
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        this.data = res.dataList;
        this.totalSize = res.dataList.length;
        if(this.totalSize){
          this.endTime = res.dataList[0].endTime;
        }
      });
    },
    Setgrade(index, row) {
     //获取当前日期
      let date = new Date();
      let y = date.getFullYear().toString();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      if (parseInt(m) < 10) {
        m = "0" + m;
      }
      if (parseInt(d) < 10) {
        d = "0" + d;
      }
      let ymd = y + "-" + m + "-" + d;
      let startD = new Date(Date.parse(ymd.replace(/-/g, "/")));
      let endD = new Date(Date.parse(this.endTime.replace(/-/g, "/")));
      let days = parseInt(
        (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
      );
      if(days<0){
      this.$alert("已过提交截止时间", "提示")
      }
      else{
      this.$prompt("请输入分数", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[0-9]+/,
        inputErrorMessage: '分数格式不正确'
      })
        .then(({ value }) => {
          let url = "/grade/setgrade";
          let data = { 
          grade: value,
          cid: this.id,
          uid: row.uid,
          ordertitle: row.ordertitle
          };
          this.$post(url, data).then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: res.message
              });
            this.Search();
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
      }
    },
    //用户添加框关闭
    closeDialog() {
      this.clearData();
      this.vshow = false;
    },
    //文件下载
    downreport(index, row) {
      window.location.href =
        vurl + "/report/downloadreport?name=" + row.reportName; // 本窗口打开下载
    },
    clearData() {
      //初始化弹出框数据
      this.uploadId = {};
      this.fileList = [];
      this.selecttitle = "";
      this.editForm.ordertitle = "";
      this.editForm.title = "";
      this.editForm.shiyan = "";
      this.editForm.yuxi = "";
      this.editForm.ziliao1 = "";
      this.editForm.ziliao2 = "";
      this.editForm.ziliao3 = "";
    }
  }
};
</script>

