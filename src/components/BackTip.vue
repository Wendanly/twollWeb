<template>
  <div class="back-wrap">
    <span @click="goBack" style="cursor:pointer">
      <span class="iconfont icon-fanhui"></span>
      <span class="text">返回</span>
    </span>
    <span class="content">| {{content}}</span>
  </div>
</template>

<script>
export default {
  name: "backTip",
  props: {
    content: {
      default: "",
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang='scss' scoped>
$height: 30px; //返回按钮高度
.back-wrap {
  height: $height;
  .text {
    color: #03a9f4;
    font-size: 12px;
    margin-right: 5px;
  }
  .content {
    color: #a5a1a1;
    font-size: 12px;
    margin-right: 5px;
  }
}
</style>
