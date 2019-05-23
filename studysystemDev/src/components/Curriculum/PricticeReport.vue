// 批阅实验报告
<template>
  <div class="mainplan">
    <el-dialog title="评分表(所占比例为整数，相加之和为10)" class="pfreport" :visible.sync="pfshow" width="20%">
      <div class="header">
        <el-button size="mini" type="primary" class="title" @click="addline();">新增评分项</el-button>
        <el-button size="mini" type="primary" class="title" @click="deleteline();">删除评分项</el-button>
      </div>
      <el-table :data="tableData" style="width: 100% margin-top:0px;" :header-cell-style="getRowClass">
        <el-table-column label="内容" width="150px" align="center">
          <template v-slot="slotProps">
            <el-input size="mini" v-model="slotProps.row.stage"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="所占比例" align="center">
          <template v-slot="slotProps">
            <el-input size="mini" v-model="slotProps.row.proportion"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button size="small" type="primary" class="title" @click="submit">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="评分" class="pfreport" :visible.sync="sfshow" width="20%">
      <el-table :data="tableData" style="width: 100% margin-top:0px;" :header-cell-style="getRowClass">
        <el-table-column label="内容" width="150px" align="center">
          <template v-slot="slotProps">
            {{slotProps.row.stage}}
            <!-- <el-input size="mini" v-model="slotProps.row.stage"></el-input> -->
          </template>
        </el-table-column>
        <el-table-column label="分数(分)" align="center">
          <template v-slot="slotProps">
            <el-input size="mini" v-model="slotProps.row.proportion"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog()">取消</el-button>
          <el-button size="small" type="primary" class="title" @click="submitaddscore">保存</el-button>
      </div>
    </el-dialog>
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
          <el-button type="primary" size="small" @click="Search">查询</el-button>
        </el-form-item>
        <el-form-item style="float: left; margin-left:80px;">
          <el-button type="primary" size="small" @click="Setg">设置评分表</el-button>
        </el-form-item>
        <el-table
          :data="data.slice((currPage-1)*pageSize,currPage*pageSize)"
          border
          style="width:100%"
          :header-cell-style="getRowClass"
        >
          <el-table-column prop="userName" align="center" label="学号" width="120"></el-table-column>
          <el-table-column prop="userNo" align="center" label="姓名" width="120"></el-table-column>
          <el-table-column prop="reportName" align="center" label="实验报告"></el-table-column>
          <el-table-column prop="grade" align="center" label="分数" width="100"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="200px">
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
  </div>
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
      pfshow: false,   //评分表显示
      sfshow: false,    //评分
      uid: 0,  //用户
      vurl,
      tableData: [
        {
          stage: "",
          proportion: ""
        },
        {
          stage: "",
          proportion: ""
        },
        {
          stage: "",
          proportion: ""
        }
      ],
      copytableData: [
      {
          stage: "",
          proportion: ""
        },
        {
          stage: "",
          proportion: ""
        },
        {
          stage: "",
          proportion: ""
        }
      ],
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
    Allreports: {
      type: Array,
      required: true
    },
    endTime: {
    type: String,
    required: true
    },
    jztotalSize: {
      type: Number,
      required: true
    },
    closeeventjz: {
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
    },
    Allreports(val) {
      this.data = val;
    },
    jztotalSize(val) {
      this.totalSize = val;
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
      this.closeeventjz(false);
    },
    //表格行数动态添加
    addline() {
      let newline = {
        stage: "",
        proportion: ""
      };
      this.tableData.push(newline);
    },
     deleteline() {
      this.tableData.pop();
    },
    //查询
    Search() {
      let url = "/report/getSAlljzreports";
      let data = {
        id: this.id,
        qryContent: this.qryContent
      };
      this.$post(url, data).then(res => {
        this.data = res.dataList;
        this.totalSize = res.dataList.length;
      });
    },
    //设置评分表
    Setg() {
      this.clearData();
      this.pfshow = true;
    },
    //评分表提交
    submit(){
    let url = "/jzgrade/setscore";
    let data = { id: this.id, arr:this.tableData};
    this.$post(url, data).then(res=>{
     this.$alert(res.message, "提示");
     this.pfshow = false;
    })
    },
    //打分
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
      this.uid = row.uid;
      let url = "/jzgrade/getpgrade";
      let data = {id: this.id};
      this.$post(url, data).then(res=>{
      let ntableData = res.dataList;
      ntableData.forEach(v=>{
        v.proportion = "";
      })
      this.tableData = ntableData;
      })
      this.sfshow = true;
      }
    },
    submitaddscore(){
    let url = "/jzgrade/setpgrade";
    let data = {id: this.id, uid: this.uid, arr: this.tableData};
    this.$post(url, data).then(res=>{
    this.$alert(res.message, "提示");
    this.sfshow = false;
    this.Search();
    })
    },
    //用户添加框关闭
    closeDialog() {
      this.clearData();
      this.sfshow = false;
      this.pfshow = false;
    },
    //文件下载
    downreport(index, row) {
      window.location.href =
        vurl + "/report/downloadreport?name=" + row.reportName; // 本窗口打开下载
    },
    clearData() {
      //初始化弹出框数据
      this.tableData = []
      this.copytableData.forEach(v=>{
      this.tableData.push(v)
      })
    }
  }
};
</script>
<style lang="scss">
.mainplan {
  .el-dialog__body{
    padding: 5px 30px;
    .header {
    height: 40px;
  }
  }
  .el-dialog__footer {
        text-align: center !important;
}
}
</style>


