<template>
  <div class="Usermanagement">
    <el-dialog
      title="开课专业管理"
      class="pdialog_c"
      :visible.sync="pshow"
      width="45%"
      @close="PClose"
    >
      <el-transfer
        style="text-align: left; display: inline-block"
        ref="ctransfer"
        filterable
        :titles="['未开课专业列表', '已开课专业列表']"
        :button-texts="['删除', '添加']"
        filter-placeholder="快速搜索"
        :props="props_c"
        v-model="nprofessionlist_ed"
        :data="professionlist"
      ></el-transfer>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button size="small" @click="closeDialog()">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="submitForm_c();">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pshow: false,
      nprofessionlist_ed: [],
      props_c: {
        key: "id",
        label: "professionName"
      }
    };
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    professionlist: {
      type: Array,
      required: true
    },
    professionlist_ed: {
      type: Array,
      required: true
    },
    type: {
     type: Number
    },
    show: {
      type: Boolean,
      required: true
    },
    Close: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    show(val) {
      this.pshow = val;
    },
    professionlist_ed(val){
        this.nprofessionlist_ed = val;
    }
  },
  methods: {
    PClose() {
      this.Close(false);
      this.clearData()
    },
    closeDialog() {
      //用户添加框关闭
      this.clearData();
      this.pshow = false;
    },
     clearData() {
      this.nprofessionlist_ed = [];
    },
     //提交
    submitForm_c() {
      this.$refs.ctransfer.clearQuery("left");
      this.$refs.ctransfer.clearQuery("right");
      let url = "/profession/sjzp_pro";
      let data = {
        id: this.id,
        type: this.type,
        setprofession: this.nprofessionlist_ed,
      };
      this.$post(url, data).then(res => {
        this.insertFlag = res.message;
        this.closeDialog();
        this.$alert(this.insertFlag, "新增项目成员结果", {
          confirmButtonText: "确定"
        });
      });
    }
  }
};
</script>

