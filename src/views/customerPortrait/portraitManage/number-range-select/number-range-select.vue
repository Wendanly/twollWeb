<template>
  <div class="range_select">
    <div class="num_symbol lf" @click="leftSyChange">
      <span>{{ sym_relation[queryParam.leftSymbol] }}</span>
    </div>
    <el-input-number
      size="mini"
      style="width: 110px"
      v-model="queryParam.min"
      :controls="false"
      @change="NumLeftChange"
      controls-position="right"
      placeholder="最小值"
      :disabled="disabled"
    ></el-input-number>
    <div class="split">-</div>
    <el-input-number
      size="mini"
      style="width: 110px"
      v-model="queryParam.max"
      :controls="false"
      @change="NumRightChange"
      controls-position="right"
      placeholder="最大值"
      :disabled="disabled"
    ></el-input-number>
    <div class="num_symbol rt" @click="rightSyChange">
      <span>{{ sym_relation[queryParam.rightSymbol] }}</span>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import { isNullOrEmpty } from "@/libs/tools";

export default {
  name: "number-range-select",
  props: {
    value: null,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (isNullOrEmpty(newVal)) {
          this.queryParam.min = undefined;
          this.queryParam.max = undefined;
          return;
        }
        this.queryParam.min = newVal.min;
        this.queryParam.max = newVal.max;
        this.queryParam.leftSymbol = newVal.leftSymbol;
        this.queryParam.rightSymbol = newVal.rightSymbol;
      },
      immediate: true
    }
  },
  data() {
    return {
      sym_relation: {
        0: "[",
        1: "("
      },
      queryParam: {
        min: undefined,
        max: undefined,
        leftSymbol: 0,
        rightSymbol: 0
      }
    };
  },
  methods: {
    NumLeftChange($event) {
      if (this.queryParam.max == null) {
        this.queryParam.max = 0;
      }
      if ($event > this.queryParam.max) {
        this.queryParam.max = $event;
      }
      this.$emit("input", _.cloneDeep(this.queryParam));
      this.$emit("change", _.cloneDeep(this.queryParam));
    },
    NumRightChange($event) {
      if (this.queryParam.min == null) {
        this.queryParam.min = 0;
      }
      if ($event < this.queryParam.min) {
        this.queryParam.min = $event;
      }
      this.$emit("input", _.cloneDeep(this.queryParam));
      this.$emit("change", _.cloneDeep(this.queryParam));
    },
    leftSyChange() {
      if (this.disabled) return;
      this.queryParam.leftSymbol = this.queryParam.leftSymbol == 0 ? 1 : 0;
      this.$emit("input", _.cloneDeep(this.queryParam));
      this.$emit("change", _.cloneDeep(this.queryParam));
    },
    rightSyChange() {
      if (this.disabled) return;
      this.queryParam.rightSymbol = this.queryParam.rightSymbol == 0 ? 1 : 0;
      this.$emit("input", _.cloneDeep(this.queryParam));
      this.$emit("change", _.cloneDeep(this.queryParam));
    }
  },
  mounted() {},
  destroyed() {}
};
</script>

<style lang="scss" type="text/scss" scoped>
.range_select {
  width: 300px;
  display: inline-flex;
  align-items: center;
  .num_symbol {
    width: 30px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    background: #f5f7fa;
    color: #60627f;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .num_symbol.lf {
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    span {
    }
  }
  .num_symbol.rt {
    border-left: none;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    span {
      transform: rotate(180deg) translateY(-2.5px);
    }
  }
  .split {
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>