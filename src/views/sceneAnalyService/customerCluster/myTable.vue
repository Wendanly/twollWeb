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
};
</script>

<style lang="scss" scoped>
</style>
