<template>
  <div>
    <div style="margin-top:100px;">
      <el-button type="primary" @click="test">判断是否有序</el-button>
      <el-button type="primary" @click="export2Excel">导出为Excel</el-button>
    </div>

    <el-table
      :data="data.slice((currPage-1)*pageSize,currPage*pageSize)"
      border
      style="width:30%;margin-left:570px;margin-top:30px;"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="number" align="center" label="学堂号" width="180"></el-table-column>
      <el-table-column prop="pi" align="center" label="是否按顺序观看"></el-table-column>
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
import Pagination from "./components/Pagination";
export default {
  data() {
    return {
      data: [],
      currPage: 1, //当前页面
      pageSize: 5, //每页显示的信息条数
      totalPage: 0, //总页面数
      totalSize: 0 //总信息数
    };
  },
  components: {
    Pagination
  },
  methods: {
    // 数据格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 导出表格
    export2Excel() {
      require.ensure([], () => {
        let { exportJsonToExcel } = require("./vendor/Export2Excel");
        // 表头
        let thHeader = ["学堂号", "是否按顺序观看"];
        let lists = ["number", "pi"];
        let tHeader = thHeader;
        //表头对应字段名，要和下面数据key对应
        let filterVal = lists;
        // 数据来源
        // let list = this.data;
        //模拟数据
        let list = this.data;
        let data = this.formatJson(filterVal, list); //数据格式化
        var index1 = "视频观看顺序是否有序"; //导出时文件名
        exportJsonToExcel(tHeader, data, index1); //导出文件
      });
    },
    test() {
      let url = "/grade/test";
      let data = {};
      this.$post(url, data).then(res => {
        this.data = res.dataList;
        this.totalSize = res.dataList.length;
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
    changepagesize(val) {
      this.pageSize = val;
    },
    changecurrentpage(val) {
      this.currPage = val;
    }
  }
};
</script>

