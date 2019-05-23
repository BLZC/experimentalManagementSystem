<template>
  <div class="block">
	  首页
    <!-- <el-timeline>
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
    </el-timeline> -->
  </div>
</template>

<script>
	export default {
		name: 'Index',
		data(){
			return {
				
			}
		},
		mounted() {
			// this.getmessage();
		},
		methods: {
			getmessage(){
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
            let url = "";
            let data = {nowTime: ymd};
            this.$post(url, data).then(res=>{
              
            })
			}
		}
	}
	
</script>

<style>
</style>