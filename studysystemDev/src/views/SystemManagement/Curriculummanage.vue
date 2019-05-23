<template>
  <div class="electivecourse">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="课内实验" name="first">
        <ke-nei></ke-nei>
      </el-tab-pane>
      <el-tab-pane label="集中性实践" name="second">
        <jz-practice></jz-practice>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import KeNei from "../../components/Cmanage/Kenei.vue";
import JzPractice from "../../components/Cmanage/JZpractice.vue";
export default {
  name: "Curriculummanage",
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    KeNei,
    JzPractice
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
</style>