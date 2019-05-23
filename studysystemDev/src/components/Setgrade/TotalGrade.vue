te<template>
  <el-dialog
    class="TotalGrade"
    title="成绩"
    :visible.sync="vshow"
    @close="Close"
    width="40%"
    style="margin-left:15%; margin-right:5%;"
  >
    <el-table
      :data="data.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:100%"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="userName" align="center" label="学号" width="120"></el-table-column>
      <el-table-column prop="userNo" align="center" label="姓名" width="120"></el-table-column>
      <el-table-column prop="grade" align="center"  label="实验分数"></el-table-column>
    </el-table>
    <pagination
      :currPage="currPage"
      :pageSize="pageSize"
      :totalPage="totalPage"
      :totalSize="totalSize"
      :changepagesize="changepagesize"
      :changecurrentpage="changecurrentpage"
    ></pagination>
  </el-dialog>
</template>
<script>
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 10, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0,  //总信息数
      vshow: false
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
    data: {
      type: Array,
      required: true
    },
    totalSizet: {
    type: Number,
    required: true
    },
    closet: {
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
    totalSizet(val) {
     this.totalSize = val;
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
      this.closet(false);
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
.TotalGrade{
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


