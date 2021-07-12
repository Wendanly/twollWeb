<template>
  <div class="tableBox" ref="tableBox">
    <div class="sf-query-btn" ref="btns">
      <slot name="sel-query"></slot>
    </div>
    <div class="tableInner" ref="tableInner" :style="{'height':height==null?'auto':height+'px'}">
      <el-table ref="elTable" :data="data" :border="border" :height="height" stripe fit style="width: 100%"
        @select="tableSelect" @select-all="tableSelectAll" :cell-class-name="'custom-cell'"
        :header-cell-class-name="'custom-header'" @selection-change="RowSelectChange">
        <el-table-column v-if="selection && !radio" type="selection" width="55" :align="'center'"></el-table-column>
        <el-table-column v-if="radio && !selection" label width="55" :align="'center'">
          <template slot-scope="scope">
            <el-radio :label="scope.row" v-model="value" @change.native="RowSelectChange(scope.row)"><span></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" width="70" :fixed="isFixed" :label="'No.'" :align="'center'" :resizable="false"
          :index="indexMethod" :class-name="'indexNo'" v-if="showNo"></el-table-column>
        <template v-for="item in Columns">
          <el-table-column v-if="!item.slot" :prop="item.prop" :label="item.label" :width="item.width"
            :min-width="item.minWidth ? item.minWidth : 100" :align="item.align" :fixed="item.fixed"
            :show-overflow-tooltip="true"></el-table-column>
          <el-table-column v-else :prop="item.prop" :label="item.label" :width="item.width"
            :min-width="item.minWidth ? item.minWidth : 100" :align="item.align" :fixed="item.fixed"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <slot :name="item.slot" :scope="scope" :row="scope.row" :index="scope.$index"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div v-if="showPagination" class="pager">
      <el-pagination background @size-change="onpagesizechange($event)" @current-change="onchange($event)"
        :current-page="current" :page-sizes="pageSizeOptions" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import * as _ from "lodash";

  export default {
    name: "SfTable",
    props: {
      value: "",
      border: {
        type: Boolean,
        default: false,
      },
      total: {
        type: Number,
        default: 0,
      },
      current: {
        type: Number,
        default: 1,
      },
      pageSize: {
        type: Number,
        default: 10,
      },
      showNo: {
        type: Boolean,
        default: false,
      },
      selection: {
        type: Boolean,
        default: false,
      },
      radio: {
        type: Boolean,
        default: false,
      },
      showPagination: {
        type: Boolean,
        default: true,
      },
      fixedTable: {
        type: Boolean,
        default: false,
      },
      columns: {
        type: Array,
        default: () => {
          return [];
        },
      },
      data: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    data() {
      return {
        height: null,
        slotColumn: [],
        isFixed: false,
        pageSizeOptions: [10, 15, 30, 50, 100, 500, 1000],
        cacheOptions: [10, 15, 30, 50, 100, 500, 1000],
      };
    },
    computed: {
      Columns() {
        this.isFixed = this.columns.some((item) => {
          if ("fixed" in item) {
            return true;
          }
          return false;
        });
        this.slotColumn = this.columns.filter((item) => item.slot);
        let temp = this.columns.slice(0);
        temp.forEach((item) => {
          if ("width" in item) {
            item.resizable = true;
          }
          if (!item.align) {
            item.align = "left";
          }
          if (!item.fixed) {
            item.fixed = false;
          }
        });
        return temp;
      },
      FromPager() {
        return (this.current - 1) * this.pageSize + 1;
      },
      EndPager() {
        let page = (this.current - 1) * this.pageSize + this.pageSize;
        return page > this.total ? this.total : page;
      },
    },
    watch: {
      data: function (newVal, oldVal) {
        this.$emit("input", null);
        if (this.fixedTable) {
          setTimeout(() => {
            this.getHeight();
          });
        }
      },
      pageSize: {
        handler: function (newVal, oldVal) {
          if (newVal != null && this.pageSizeOptions.indexOf(newVal) == -1) {
            let arr = _.cloneDeep(this.cacheOptions);
            arr.push(newVal);
            this.pageSizeOptions = arr;
          }
        },
        immediate: true,
      },
    },
    methods: {
      onchange($event) {
        this.$emit("on-change", $event);
      },
      onpagesizechange($event) {
        this.$emit("on-page-size-change", $event);
      },
      RowSelectChange($event) {
        this.$emit("input", $event);
      },
      indexMethod(index) {
        return index + 1 + this.pageSize * (this.current - 1);
      },
      getHeight() {
        setTimeout(() => {
          this.height =
            this.$refs.tableBox.offsetHeight - this.$refs.btns.offsetHeight - 50;
        },10);
      },
      getElTable() {
        return this.$refs.elTable;
      },
      tableSelect(selection, row) {
        this.$emit("select", selection,row);
      },
      tableSelectAll(selection) {
        this.$emit("select-all", selection);
      }
    },
    mounted() {
      if (this.fixedTable) window.addEventListener("resize", this.getHeight);
    },
    destroyed() {
      if (this.fixedTable) window.removeEventListener("resize", this.getHeight);
    },
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .tableBox {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  &:before {
    content: "";
    display: table;
  }
}

.sf-query-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.tableInner {
  width: 100%;
  flex: 1 1 auto;
  /deep/ .el-radio__label {
    padding: 0;
  }
}

.pager {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  /deep/ .el-pagination__total {
    font-size: 14px;
  }
  /deep/ .el-pagination__sizes .el-input .el-input__inner {
    height: 25px;
    line-height: 25px;
    font-size: 14px;
  }

  /deep/ .el-pager li {
    font-size: 14px;
    height: 25px;
    line-height: 25px;
  }

  /deep/ .el-pagination button {
    height: 25px;
    line-height: 25px;
  }

  /deep/ .el-input--small {
    font-size: 12px;
  }

  /deep/ .el-input--small .el-input__inner {
    height: 25px;
    line-height: 25px;
    font-size: 14px;
  }
  /deep/ .el-pagination {
    color: #606266;
    font-weight: normal;
  }
  /deep/ .el-pagination__jump{
    font-size: 14px;
  }
}
</style>