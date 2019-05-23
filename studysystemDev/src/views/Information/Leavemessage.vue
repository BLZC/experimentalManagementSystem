<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="item in msg" :key="item.id" :timestamp="item.time" placement="top">
        <el-card>
          <div slot="header">
            <span>{{item.userName}}在<span style="font-size:14px;">{{item.name}}</span>中留言：</span>
            <el-button style="float: right;color:#fff;padding: 3px 0" type="text" @click="Resp(item.uid,item.cid)">回复</el-button>
            <el-button
              style="float: right;color:#fff;padding: 3px 0"
              type="text"
              @click="Delete(item.id)"
            >删除</el-button>
          </div>
          {{item.content}}
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  name: "Leavemessage",
  data() {
    return {
      msg: []
    };
  },
  mounted() {
    this.getmsg();
  },
  methods: {
    getmsg() {
      let url = "/lmessage/getmessage";
      let data = { uid: sessionStorage.getItem("uid") };
      this.$post(url, data).then(res => {
        this.msg = res.dataList;
      });
    },
    Resp(val1,val2){
     this.$prompt("请输入回复内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let url = "/lmessage/lmessage";
          let now = new Date();
          let nowDate = new Date(
            Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
          )
            .toISOString()
            .slice(0, 10);
            let data = {
            content: value,
            id: val2,
            userName: sessionStorage.getItem("userNo"),
            uid: sessionStorage.getItem("uid"),
            time: nowDate,
            touser: val1
          };
          this.$post(url, data).then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: res.message
              });
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
    },
    Delete(val) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/lmessage/rmessage";
          let data = {
            id: val
          };
          this.$post(url, data).then(res => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getmsg();
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
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
  }
};
</script>
<style lang="scss">
.block {
  width: 600px;
  margin-left: 10px;
  text-align: left;
  .el-card__header {
    text-align: center;
    padding: 8px 20px;
    background-color: #5e97f6;
    color: #fff;
  }
}
</style>


