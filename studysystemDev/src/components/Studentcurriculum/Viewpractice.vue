// 查看实验任务
<template>
  <div class="pdialogv">
    <el-dialog class="uploadr" title="上传实验报告" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="editReport"
        :model="editReport"
        :rules="rules"
        :inline="true"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-upload
            ref="upload"
            drag
            :data="uploadId"
            action="/report/uploadprictice"
            multiple
            :file-list="fileList"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button size="small" @click="closeDialog()">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="submitReport('editReport');">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看集中实践任务"
      :visible.sync="vshow"
      @close="dialogclose"
      width="80%"
      style="margin-left:15%; margin-right:5%;"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="140px"
        :rules="rules"
        :inline="true"
        class="demo-form-inline"
      >
        <div class="edit_left">
          <el-form-item
            class="rrc"
            label="实验题目:"
            style="float:left;text-align:left; width:250px !important; margin-left:48px;"
          >
            <el-input v-model="editForm.title" disabled size="small" clearable style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item
            class="rrc"
            label="报告提交截止日期:"
            style="float:left; text-align:left; width:300px !important; margin-top:-70px; margin-left:300px;"
          >
            <el-input
              v-model="editForm.endTimereport"
              clearable
              disabled
              size="small"
              style="width:200px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="rrc"
            label="成绩提交截止日期:"
            style="position:absoult; text-align:left; margin-left:580px;margin-top:-74px; width:300px !important;"
          >
            <el-input
              v-model="editForm.endTimegrade"
              disabled
              clearable
              style="width:200px;"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="实验要求:" prop="shiyan">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="editForm.shiyan"></el-input>
          </el-form-item>
          <el-form-item label="预习要求:" prop="yuxi">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="editForm.yuxi"></el-input>
          </el-form-item>
          <el-form-item label="参考资料:">
            <el-card class="box-card" shadow="never">
              <div class="text item" v-show="editForm.ziliao1.length>0">
                {{editForm.ziliao1}}
                <el-button type="primary" plain size="mini" @click="Down(editForm.ziliao1)">下载</el-button>
              </div>
              <div class="text item" v-show="editForm.ziliao2.length>0">
                {{editForm.ziliao2}}
                <el-button type="primary" plain size="mini" @click="Down(editForm.ziliao2)">下载</el-button>
              </div>
              <div class="text item" v-show="editForm.ziliao3.length>0">
                {{editForm.ziliao3}}
                <el-button type="primary" plain size="mini" @click="Down(editForm.ziliao3)">下载</el-button>
              </div>
            </el-card>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" size="mini" @click="Upload" style="margin-bottom:40px;">上传集中实践报告</el-button>
      <el-button type="primary" size="mini" @click="Lmessage" style="margin-bottom:40px;">留言</el-button>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "../../api/index.js";
import vurl from "../../url.js";
export default {
  data() {
    return {
      rules, //验证规则
      vurl, //后端ip端口
      vshow: false,
      dialogFormVisible: false,
      fileList: [],
      uploadId: {},
      editReport: {}
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
    touser: {
      type: Number,
      required: true
    },
    editForm: {
      type: Object,
      required: true
    },
    closeeventp: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    show(newval) {
      this.vshow = newval;
    }
  },
  methods: {
    //设置表头背景色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    //关闭事件
    dialogclose() {
      this.closeeventp(false);
    },
    //上传实验报告
    Upload() {
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
      let endD = new Date(
        Date.parse(this.editForm.endTimereport.replace(/-/g, "/"))
      );
      let days = parseInt(
        (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days < 0) {
        this.$alert("已过提交截止时间", "提示");
      } else {
        this.dialogFormVisible = true;
      }
    },
    //下载参考资料
    Down(name) {
      window.location.href = vurl + "/report/download?name=" + name; // 本窗口打开下载
    },
    //上传实验报告
    submitReport(editData) {
      //实验任务提交
      this.$refs[editData].validate(valid => {
        if (valid) {
          this.uploadId = {
            id: this.id,
            uid: parseInt(sessionStorage.getItem("uid"))
          };
          let data = {};
          let url = "/report/addprictice";
          data = {
            id: this.id,
            uid: parseInt(sessionStorage.getItem("uid"))
          };
          this.$post(url, data).then(res => {
            if (res.code === 1) {
            this.$refs.upload.submit();
          }
          this.insertFlag = "上传成功";
          this.dialogFormVisible = false;
          this.$alert(this.insertFlag, "实验报告提交结果", {
            confirmButtonText: "确定"
          });
          });
        } else {
          return false;
        }
      });
    },
    Lmessage() {
      this.$prompt("请输入留言内容", "提示", {
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
            id: this.id,
            userName: sessionStorage.getItem("userNo"),
            uid: sessionStorage.getItem("uid"),
            time: nowDate,
            touser: this.touser
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
    }
  }
};
</script>
<style lang="scss">
.pdialogv {
  .el-dialog {
    padding: 0px;
    .el-dialog__header {
      background-color: #f8f8f8;
    }
    .el-dialog__body {
      padding: 10px 3px !important;
      .edit_left {
        margin-left: 5%;
        height: 520px;
        width: 90%;
        .el-form-item {
          width: 800px;
          margin-bottom: 5px;
          .el-form-item__label {
            position: absolute;
            text-align: left;
          }
          .el-form-item__content {
            margin-top: 30px;
            width: 800px;
          }
          .el-card__body {
            padding: 5px 20px;
            min-height: 70px;
            .text {
              text-align: left;
              height: 30px;
              .el-button {
                float: right;
                height: 25px;
              }
            }
          }
        }
      }
    }
  }
}
</style>