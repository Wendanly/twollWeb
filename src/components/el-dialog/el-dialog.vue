<template>
  <el-dialog
    ref="dialog"
    :visible.sync="DialogVisible"
    :width="width"
    :top="top"
    :center="true"
    :modal="true"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
  >
    <div slot="title" class="dialog-header-title">
      <span v-show="title" class="title-name">{{title}}</span>
    </div>
    <div ref="slots" id="DCont"></div>
  </el-dialog>
</template>
<script>
export default {
  name: "ElfDialog",
  props: {},
  data() {
    return {
      DialogVisible: true,
      title: "",
      width: "520px",
      top: "15vh",
    };
  },
  methods: {
    closeDialog() {
      this.DialogVisible = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
