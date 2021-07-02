<template>
  <div class="pagination">
    <el-pagination
      class="pagination"
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="$PAGE_SIZES"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    pageSize: {
      default: 10,
      type: Number
    },
    total: {
      default: 10,
      type: Number
    },
    currentPage: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    currentChange(val) {
      this.$emit("current-change", val);
    },
    sizeChange(val) {
      this.$emit("size-change", val);
    }
  }
};
</script>

<style lang='scss' scoped>
.pagination {
  text-align: right;
  margin-top: 20px;
}
</style>
