// 查看实验任务
<template>
  <el-dialog
    title="发布集中性实践任务"
    class="pdialogjz"
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
          prop="title"
        >
          <el-input placeholder="请输入实验题目" v-model="editForm.title" clearable style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item
          class="rrc"
          label="报告提交截止日期:"
          style="float:left; text-align:left; width:300px !important; margin-top:-70px; margin-left:300px;"
          prop="endTimereport"
        >
          <el-date-picker
            v-model="editForm.endTimereport"
            clearable
            value-format="yyyy-MM-dd"
            style="width:250px;"
            type="date"
            placeholder="请选择报告提交截止日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          class="rrc"
          label="成绩提交截止日期:"
          style="position:absoult; text-align:left; margin-left:580px;margin-top:-74px; width:300px !important;"
          prop="endTimegrade"
        >
          <el-date-picker
            v-model="editForm.endTimegrade"
            clearable
            value-format="yyyy-MM-dd"
            style="width:250px;"
            type="date"
            placeholder="请选择报告提交截止日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="实验要求:" prop="shiyan">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="editForm.shiyan"></el-input>
        </el-form-item>
        <el-form-item label="预习要求:" prop="yuxi">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="editForm.yuxi"></el-input>
        </el-form-item>
        <el-form-item label="参考资料:">
          <el-upload
            class="upload-demo"
            style="width:800px;"
            ref="upload"
            :data="uploadId"
            action="/report/jzupload"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary">选取参考资料</el-button>
            <div slot="tip" class="el-upload__tip">只能上传Word，txt，Excel表格文件，且不超过三篇</div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog()">取消</el-button>
      <el-button size="small" type="primary" class="title" @click="submitForm('editForm');">保存</el-button>
    </div>
  </el-dialog>
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
      fileList: [],
      editForm: {
        title: "", //实验题目
        endTimereport: "",  //报告提交截止日期
        endTimegrade: "",   //成绩提交截止日期
        shiyan: "", //实验要求
        yuxi: "", //预习要求
        ziliao1: "", //参考资料
        ziliao2: "",
        ziliao3: ""
      }
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
    uploadId: {
    type: Object,
    required: true
    },
    closeeventv: {
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
        handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
        //实验任务提交
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          let data = {};
          let url = "/task/coursejzClaim";
          data = {
            id: this.id,
            title: this.editForm.title,
            endTimereport: this.editForm.endTimereport,
            endTimegrade: this.editForm.endTimegrade,
            shiyan: this.editForm.shiyan,
            yuxi: this.editForm.yuxi,
            beginTime: this.editForm.beginTime,
            endTime: this.editForm.endTime
          };
          this.$post(url, data).then(res => {
            this.insertFlag = res.message;
            if (res.code === 1) {
              this.$refs.upload.submit();
            }
            this.vshow = false;
            this.clearData();
            this.$alert(this.insertFlag, this.vtitle + "结果", {
              confirmButtonText: "确定"
            });
          });
        } else {
          return false;
        }
      });
    },
    //关闭事件
    dialogclose() {
      this.clearData();
      this.closeeventv(false);
    },
      clearData() {
      //初始化弹出框数据
      this.fileList = [];
      this.editForm.ordertitle = "";
      this.editForm.endTimereport = "";
      this.editForm.endTimegrade = "";
      this.editForm.title = "";
      this.editForm.shiyan = "";
      this.editForm.yuxi = "";
      this.editForm.ziliao1 = "";
      this.editForm.ziliao2 = "";
      this.editForm.ziliao3 = "";
    },
  }
};
</script>
<style lang="scss"> 
  .pdialogjz {
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
            .el-row {
              width: 800px;
              margin-top: -30px;
              .el-card {
                .el-card__header {
                  padding: 0 5px;
                  text-align: left;
                  height: 35px;
                }
                .el-card__body {
                  height: 90px;
                  padding: 0 5px;
                  text-align: left;
                }
              }
            }
            .el-upload--text {
              position: absolute;
            }
            .el-upload__tip {
              color: red;
              text-align: left;
              padding-left: 100px;
            }
            .el-upload-list__item {
              text-align: left;
              padding-left: 100px;
            }
          }
        }
      }
      .dialog-footer {
        text-align: center;
      }
    }
  }
</style>


