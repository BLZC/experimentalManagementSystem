// 表格底部分页
<template>
  <div class="pblock">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      :total="totalSize"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    currPage: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    totalPage: {
      type: Number,
      required: true
    },
    totalSize: {
      type: Number,
      required: true
    },
    changepagesize: {
      type: Function,
      default: () => {}
    },
    changecurrentpage: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    //改变每页显示条目数方法
    handleSizeChange(pageSize) {
      this.changepagesize(pageSize);
    },
    //上一页、下一页、页数跳转方法
    handleCurrentChange(currPage) {
      this.changecurrentpage(currPage);
    }
  }
};
</script>
<style lang="scss">
.pblock{
  text-align: center;
}
</style>

