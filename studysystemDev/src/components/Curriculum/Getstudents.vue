// 选课学生
<template>
  <el-dialog
    title="选课学生"
    class="pyreport"
    :visible.sync="vshow"
    @close="Close"
    width="60%"
    style="margin-left:15%; margin-right:5%;"
  >
    <el-form :inline="true" class="demo-form-inline">
      <!-- <el-form-item style="float: left;">
        <el-input
          size="small"
          v-model="qryContent"
          placeholder="请输入姓名/学号进行查询"
          clearable
          style="width: 250px; float: left; margin-right: 5px;"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item style="float: left;">
        <el-button type="primary" size="small" @click="Search">查询</el-button>
      </el-form-item> -->
      <el-table
        :data="Allstudents.slice((currPage-1)*pageSize,currPage*pageSize)"
        border
        style="width:100%"
        :header-cell-style="getRowClass"
      >
        <el-table-column prop="userName" align="center" label="学号" width="160"></el-table-column>
        <el-table-column prop="userNo" align="center" label="姓名" width="160"></el-table-column>
        <el-table-column prop="sex" align="center" label="性别" width="160"></el-table-column>
        <el-table-column prop="collegeName" align="center" label="学院"></el-table-column>
      </el-table>
      <pagination
        :currPage="currPage"
        :pageSize="pageSize"
        :totalPage="totalPage"
        :totalSize="stotalSize"
        :changepagesize="changepagesize"
        :changecurrentpage="changecurrentpage"
      ></pagination>
    </el-form>
  </el-dialog>
</template>
<script>
import Pagination from "../Pagination";
export default {
  data() {
    return {
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      vshow: false, //页面显示
      qryContent: ""
    };
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    Allstudents: {
      type: Array,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    stotalSize: {
      type: Number,
      required: true
    },
    closeevents: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    show(newval) {
      this.vshow = newval;
    }
  },
  components: {
    Pagination
  },
  mounted() {},
  methods: {
    changepagesize(val) {
      this.pageSize = val;
    },
    changecurrentpage(val) {
      this.currPage = val;
    },
    Close() {
      this.closeevents(false);
    },
    //设置表头背景色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    Search() {}
  }
};
</script>
<style lang="scss" scoped>
</style>



