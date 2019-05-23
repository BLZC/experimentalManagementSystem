<template>
  <el-dialog
    title="查看详细成绩"
    :visible.sync="vshow"
    @close="Close"
    width="30%"
    style="margin-left:15%; margin-right:5%;"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-select v-model="uid" placeholder="请选择学号查询:" style="width:200px;" size="small">
          <el-option
            v-for="item in students"
            :key="item.uid"
            :label="item.userNo"
            :value="item.uid"
          ></el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="Search">查询</el-button>
      </div>
      <div v-for="item in Alldata" :key="item.id">{{item.title+ " : " + item.grade }}</div>
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      vshow: false,
      users: [],   //所有学生
      Alldata: [],  //所有成绩
      uid: null
    };
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    students: {
      type: Array,
      required: true
    },
    show: {
    type: Boolean,
    required: true
    },
    closed: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
      show(newval){
          this.vshow = newval;
      }
  },
  methods: {
      Close(){
       this.closed(false);
       this.uid = null;
       this.Alldata = [];
      },
      Search(){
          let url = "/grade/getgrade";
          let data = {uid: this.uid, cid: this.id};
          this.$post(url, data).then(res=>{
          this.Alldata = res.dataList;
          })
      }
  }
};
</script>

