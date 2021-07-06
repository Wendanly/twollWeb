<template>
  <div class="pagination" :class="getDirection">
    <el-pagination
      class="pagination"
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="$PAGE_SIZES"
      :page-size="pageSize"
      :layout="layoutStr"
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
    },
    textAlign: {
      default: "right",
      type: String
    },
    notLayout: {
      default: () => {
        return [];
      },
      type: Array
    }
  },
  data() {
    return {
      layout: "total,sizes,prev,pager,next,jumper"
    };
  },
  created() {},
  computed: {
    getDirection() {
      if (this.textAlign == "left") {
        return "left";
      } else if (this.textAlign == "right") {
        return "right";
      } else if (this.textAlign == "center") {
        return "center";
      } else {
        return "right";
      }
    },
    layoutStr() {
      let layoutList = this.layout.split(",");
      let result = layoutList.filter(o => this.notLayout.every(j => o != j));
      console.log(result);
      return result.join(",");
    }
  },
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
  // text-align: right;
  margin-top: 20px;
}
.right {
  text-align: right;
}
.left {
  text-align: left;
}
.center {
  text-align: center;
}
</style>
