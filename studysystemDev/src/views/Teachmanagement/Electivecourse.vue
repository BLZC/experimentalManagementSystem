<template>
  <div class="electivecourse">
    <el-tabs v-model="activeName" type="border-card">
      <!-- <el-tab-pane label="培养计划内实验" name="first">
        <pyelective-course></pyelective-course>
      </el-tab-pane> -->
      <el-tab-pane label="开放性实验" name="second">
        <kfelective-course></kfelective-course>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import PyelectiveCourse from "../../components/Pyelectivecourse.vue";
import KfelectiveCourse from "../../components/Kfelectivecourse.vue";
export default {
  name: "electivecourse",
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    // PyelectiveCourse,
    KfelectiveCourse
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
</style>