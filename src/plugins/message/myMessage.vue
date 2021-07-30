<template>
  <!-- 自定义确认弹窗样式 -->
  <div class="mycomfirm" v-if="isShow">
    <span>{{ content.message }}</span>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 弹窗内容
      isShow: false,
      content: {
        title: "",
        message: ""
      }
    };
  },
  mounted() {
    console.log("myMessage.vue");
  },
  methods: {
    close() {
      this.$emit("fail", "关闭");
      this.destory();
    },
    ok() {
      this.$emit("comfir", "确认");
      this.destory();
    },
    destory() {
      document.body.contains(this.$el)
        ? document.body.removeChild(this.$el)
        : "";
    }
  }
};
</script>

<style lang='scss' scoped>
.mycomfirm {
  position: fixed;
  left: 50%;
  top: 40px;
  z-index: 10000;
  transform: translate(-50%, -50%); /* 50%为自身尺寸的一半 */
  border: 1px solid red;
}
</style>