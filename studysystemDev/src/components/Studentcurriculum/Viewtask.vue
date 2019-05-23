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
        <el-form-item class="rrb" label="实验题目:" prop="selecttitle">
          <el-select
            v-model="editReport.selecttitle"
            placeholder="请选择实验题目"
            size="mini"
            style="width:200px"
            @change="getData"
          >
            <el-option
              v-for="item in alltitles"
              :key="item.ordertitle"
              :label="item.title"
              :value="item.ordertitle"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :data="uploadId"
            action="/report/uploadreport"
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
      title="查看课内实验任务"
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
            style="float:left; margin-left:50px; text-align:left; width:200px;"
            prop="title"
          >
            <el-select
              v-model="selecttitle"
              placeholder="请选择实验题目"
              size="mini"
              style="width:200px"
              @change="getData"
            >
              <el-option
                v-for="item in alltitles"
                :key="item.ordertitle"
                :label="item.title"
                :value="item.ordertitle"
              ></el-option>
            </el-select>
            <el-button type="primary" plain size="mini" @click="getshiyan">查看</el-button>
          </el-form-item>
          <el-form-item
            class="rrc"
            label="实验类型:"
            style="text-align:left; width: 120px !important; margin-left:40px; "
            prop="sytype"
          >
            <el-input
              size="mini"
              v-model="editForm.typeName"
              clearable
              disabled
              style="width:120px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="rrc"
            label="报告提交截止日期:"
            style="text-align:left; width:160px; margin-left:20px;"
            prop="beginTime"
          >
            <el-input
              size="mini"
              v-model="editForm.endTimereport"
              clearable
              disabled
              style="width:160px;"
            ></el-input>
          </el-form-item>
          <el-form-item class="rrc" label="成绩提交截止日期:" style="text-align:left;width:160px;">
            <el-input
              size="mini"
              v-model="editForm.endTimegrade"
              clearable
              disabled
              style="width:160px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="实验要求:">
            <el-input type="textarea" :rows="4" disabled v-model="editForm.shiyan"></el-input>
          </el-form-item>
          <el-form-item label="预习要求:">
            <el-input type="textarea" :rows="4" disabled v-model="editForm.yuxi"></el-input>
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
      <el-button type="primary" size="mini" @click="Upload" style="margin-bottom:40px;">上传课内实验报告</el-button>
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
      editReport: {
        selecttitle: ""
      },
      fileList: [], //待上传文件
      dialogFormVisible: false,
      uploadId: {},
      editForm: {
        title: "", //实验题目
        typeName: null, //实验类型 0--验证型实验  1--综合型实验
        endTimereport: "", //报告提交截止日期
        endTimegrade: "", //成绩提交截止日期
        shiyan: "", //实验要求
        yuxi: "", //预习要求
        ziliao1: "", //参考资料
        ziliao2: "",
        ziliao3: ""
      },
      selecttitle: null //选择的题目
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
    alltitles: {
      type: Array,
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
      let endD = new Date(Date.parse(this.editForm.endTimereport.replace(/-/g, "/")));
      let days = parseInt(
        (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
      );
      if(days<0){
      this.$alert("已过提交截止时间", "提示")
      }
      else{
      this.dialogFormVisible = true;
      }
    },
    //实验任务提交
    submitReport(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          this.uploadId = {
            id: this.id,
            ordertitle: this.editReport.selecttitle,
            uid: parseInt(sessionStorage.getItem("uid"))
          };
          let data = {};
          let url = "/report/addreport";
          data = {
            id: this.id,
            ordertitle: this.editReport.selecttitle,
            uid: parseInt(sessionStorage.getItem("uid"))
          };
          this.$post(url, data).then(res => {
            this.insertFlag = res.message;
            if (res.code === 1) {
              this.$refs.upload.submit();
            }
            this.dialogFormVisible = false;
            this.$alert(this.insertFlag, "实验报告提交结果", {
              confirmButtonText: "确定"
            });
            this.clearData();
          });
        } else {
          return false;
        }
      })
    },
    //关闭事件
    dialogclose() {
      this.clearData();
      this.closeeventv(false);
    },
    getData() {},
    //获取实验信息
    getshiyan() {
      let url = "/task/getcourseClaim";
      let data = { id: this.id, ordertitle: this.selecttitle };
      this.$post(url, data).then(res => {
        if (res.dataList.length > 0) {
          let nusers = res.dataList;
          nusers.forEach(v => {
            if (v.type === 0) {
              v.typeName = "验证型";
            }
            if (v.type === 1) {
              v.typeName = "综合型";
            }
          });
          this.editForm.typeName = res.dataList[0].typeName;
          this.editForm.endTimereport = res.dataList[0].beginTime;
          this.editForm.endTimegrade = res.dataList[0].endTime;
          this.editForm.shiyan = res.dataList[0].shiyan;
          this.editForm.yuxi = res.dataList[0].yuxi;
          this.editForm.ziliao1 = res.dataList[0].ziliao1;
          this.editForm.ziliao2 = res.dataList[0].ziliao2;
          this.editForm.ziliao3 = res.dataList[0].ziliao3;
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
    },
    clearData() {
      //初始化弹出框数据
      this.editReport.selecttitle = "";
      this.fileList = [];
      this.editForm.title = "";
      this.editForm.endTimereport = "";
      this.editForm.endTimegrade = "";
      this.editForm.shiyan = "";
      this.editForm.yuxi = "";
      this.editForm.ziliao1 = "";
      this.editForm.ziliao2 = "";
      this.editForm.ziliao3 = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.rrb {
  .el-form-item__content {
    width: 200px;
  }
}
</style>



