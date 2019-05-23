<template>
  <el-dialog
    class="Proportion"
    title="设定比例系数"
    :visible.sync="vshow"
    @close="Close"
    width="50%"
    style="margin-left:15%; margin-right:5%;"
  >
    <el-table
      :data="alltitles.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="ordertitle" align="center" label="实验序号" width="100"></el-table-column>
      <el-table-column prop="title" align="center" label="实验名称" width="350"></el-table-column>
      <el-table-column label="比例系数(正整数且和为10)" align="center">
        <template v-slot="slotProps">
          <el-input
            v-model="slotProps.row.proportion"
            size="mini"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :currPage="currPage"
      :pageSize="pageSize"
      :totalPage="totalPage"
      :totalSize="totalSizep"
      :changepagesize="changepagesize"
      :changecurrentpage="changecurrentpage"
    ></pagination>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog()">取消</el-button>
      <el-button size="small" type="primary" class="title" @click="submitForm">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      vshow: false,
      val1: "",
      val2: "",
      users: [], //所有学生
      Alldata: [], //所有成绩
      nalltitles: [], //所有题目
      uid: null
    };
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    alltitles: {
      type: Array,
      default: () => {}
    },
    totalSizep: {
    type: Number,
    required: true
    },
    closep: {
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
    Close() {
      this.closep(false);
    },
    submitForm(){
    let url = "/grade/setproportion";
    let data = {arr: this.alltitles, id: this.id};
    this.$post(url, data).then(res=>{
     if(res.code === 1){
     	this.$alert(res.message, "提示");
     	this.vshow = false;
     }
    })
    },
    Search() {
      let url = "/grade/getgrade";
      let data = { uid: this.uid, cid: this.id };
      this.$post(url, data).then(res => {
        this.Alldata = res.dataList;
      });
    }
  }
};
</script>
<style lang="scss">
.Proportion{
.el-dialog {
  padding: 0px;
  .el-dialog__header {
    background-color: #f8f8f8;
  }
  .el-dialog__body {
    height: 300px;
    padding: 10px 20px !important;
  }
  .el-dialog__footer {
    text-align: center;
  }
}
}
</style>


