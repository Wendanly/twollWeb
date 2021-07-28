<template>
  <el-table height="100%" class="mytable" ref="table" :data="tableData" style="width: 100%">
    <el-table-column
      v-for="(item,index) in colList"
      :key="index"
      :prop="item.prop"
      show-overflow-tooltip
      :width="item.label.length >4?'140':''"
      :label="item.label"
    ></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "myTable",
  props: {
    tableData: {
      default() {
        return [];
      },
      type: Array
    },
    colList: {
      default() {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>
