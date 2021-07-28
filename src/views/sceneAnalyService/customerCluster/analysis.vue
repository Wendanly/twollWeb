<template>
  <div class="edit-page">
    <BackTip content="分析"></BackTip>
    <div class="wrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="构成分析" name="1">
          <cell v-if="activeName == '1'" value="1" :subject_id="subject_id"></cell>
        </el-tab-pane>
        <el-tab-pane label="矩阵分析" name="2">
          <cell v-if="activeName == '2'" value="2" :subject_id="subject_id"></cell>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: "customerClusterAnalysis",
  components: {
    cell: () => import(/*webpackChunkName:'cell'*/ "./cell")
  },
  data() {
    return {
      activeName: "1",
      subject_id: ""
    };
  },
  created() {
    this.subject_id = this.$route.query.subject_id; //,
  }
};
</script>

<style lang="scss" scoped>
$height: 30px;
.edit-page {
  height: 100%;
  .wrap {
    height: calc(100% - #{$height});
    display: flex;
    padding: 10px !important;
  }
}
</style>
