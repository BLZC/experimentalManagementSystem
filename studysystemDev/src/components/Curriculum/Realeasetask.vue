<template>
  <el-dialog
    title="发布课内实验任务"
    class="pdialog_contact"
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
          label="实验序号:"
          style=" position: absolute; text-align:left; width: 150px !important; margin-left:-150px;"
          prop="ordertitle"
        >
          <el-select
            v-model="editForm.ordertitle"
            placeholder="请选择"
            size="mini"
            style="width:100px"
            @change="getordertitle(editForm.ordertitle)"
          >
            <el-option v-for="item in orders" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="实验类型:"
          style=" position: absolute; text-align:left; width: 150px !important; margin-left:-30px;"
          prop="sytype"
        >
          <el-select v-model="editForm.sytype" placeholder="请选择" size="mini" style="width:100px">
            <el-option
              v-for="item in sytypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="rrc"
          label="实验题目:"
          style="position:absoult; text-align:left; margin-left:100px; width:400px !important;"
          prop="title"
        >
          <el-input placeholder="请输入实验题目" v-model="editForm.title" clearable style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item
          class="rrc"
          label="报告提交截止日期:"
          style="float:left; text-align:left; width:400px !important; margin-left:50px;"
          prop="beginTime"
        >
          <el-date-picker
            v-model="editForm.beginTime"
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
          style="position:absoult; text-align:left; margin-left:200px;margin-top:-75px; width:400px !important;"
          prop="endTime"
        >
          <el-date-picker
            v-model="editForm.endTime"
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
            action="/course/upload"
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
export default {
  data() {
    return {
      rules, //验证规则
      uploadId: {},
      fileList: [],
      vshow: false,
      editForm: {
        ordertitle: "", //实验序号
        title: "", //实验题目
        sytype: null, //实验类型 0--验证型实验  1--综合型实验
        beginTime: "",   //实验报告提交截止日期
        endTime: "", //实验成绩提交截止日期
        shiyan: "", //实验要求
        yuxi: "", //预习要求
        ziliao1: "", //参考资料
        ziliao2: "",
        ziliao3: ""
      },
      sytypes: [
        {
          label: "验证型",
          value: 0
        },
        {
          label: "综合型",
          value: 1
        }
      ],
      sytypeName: "", //  类型名
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
    orders: {
      type: Number,
      required: true
    },
    closeevent: {
      type: Function,
      default: () => {}
    }
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
      this.closeevent(false);
    },
    getordertitle(value) {
      this.corder = value;
      this.uploadId = { id: this.id, ordertitle: this.corder };
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
          let url = "/task/courseClaim";
          data = {
            id: this.id,
            ordertitle: this.editForm.ordertitle,
            type: this.editForm.sytype,
            title: this.editForm.title,
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
    //用户添加框关闭
    closeDialog() {
      this.clearData();
      this.vshow = false;
    },
    clearData() {
      //初始化弹出框数据
      this.uploadId = {};
      this.fileList = [];
      this.selecttitle = "";
      this.editForm.ordertitle = "";
      this.editForm.sytype = null;
      this.editForm.beginTime = "";
      this.editForm.endTime = "";
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
<style lang="scss">
.rrc {
  .el-form-item__content {
    margin-top: 30px;
    width: 400px !important;
  }
}
.pdialog_contact {
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
          width: 800px !important;
          margin-bottom: 5px;
          .el-form-item__label {
            position: absolute;
            text-align: left;
          }
          .el-form-item__content {
            margin-top: 30px;
            width: 800px;
          }
          .el-textarea__inner {
            width: 800px !important;
          }
          .el-upload--text {
            position: absolute;
            margin-top: -25px;
            margin-left: -300px;
          }
          .el-upload__tip {
            color: red;
            position: absolute;
            margin-top: -25px;
            text-align: left;
            margin-left: 250px;
          }
          .el-upload-list {
            padding-top: 10px;
            .el-upload-list__item {
              text-align: left;
              padding-left: 100px;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
}
</style>



         