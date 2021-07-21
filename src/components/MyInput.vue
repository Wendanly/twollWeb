<template>
  <el-input
    class="fuzzy-query"
    :size="size"
    :type="type"
    :maxlength="maxlength"
    :clearable="clearable"
    @input="$emit('input',$event)"
    @keyup.enter.native="$emit('keyup.enter.native')"
    v-bind="$attrs"
  ></el-input>
</template>

<script>
export default {
  name: "MyInput",
  props: {
    size: {
      default: "mini",
      type: String
    },
    type: {
      default: "text",
      type: String
    },
    clearable: {
      default: true,
      type: Boolean
    },
    maxlength: {
      default: 30,
      type: [Number, String]
    }
  },
  computed: {},
  mounted() {
    // console.log(this.$slots);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>