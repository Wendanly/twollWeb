<template>
  <div class="form_block">
    <div class="form_item">
      <el-popover
        :disabled="noModification"
        placement="left-end"
        width="550"
        v-model="father.visible"
        :popper-class="'sf-el-popper'"
      >
        <logicTree
          v-if="father.visible"
          :father="father"
          @saveTree="saveTree"
          :subjectId="subjectId"
          :frameId="frameId"
        ></logicTree>
        <el-tooltip
          effect="light"
          :disabled="father.operand==null"
          :content="father.operand?father.operand.name:''"
          placement="top"
          slot="reference"
          :open-delay="800"
        >
          <el-select
            size="mini"
            style="width: 100%"
            v-model="father.operand"
            placeholder="标签客户群"
            value-key="id"
            :disabled="noModification"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item, index) in father.operandList"
              :key="item.id"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
        </el-tooltip>
      </el-popover>
    </div>
    <div class="form_item" v-if="father.type=='B'">
      <el-select
        size="mini"
        style="width: 150px;"
        v-model="father.changeTimeControlVal"
        :disabled="noModification"
        @change="changeTimeRange"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="(item, index) in timeRangeList"
          :key="index"
          :label="item.value"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <div class="form_item" v-if="father.operand==null||(father.operand&&father.operand.type==1)">
      <el-select
        size="mini"
        style="width: 110px"
        v-model="queryParam.symbol"
        placeholder="关系符号"
        filterable
        clearable
        @change="changeSymbol"
        :disabled="noModification"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="(item, index) in symbolList"
          :key="index"
          :label="item.dictName"
          :value="item.dictCode"
        ></el-option>
      </el-select>
    </div>
    <div class="form_item" v-if="father.operand==null||(father.operand&&father.operand.type==1)">
      <el-select
        size="mini"
        v-if="father.type=='A'"
        style="width: 199px"
        v-model="queryParam.expressionVal"
        multiple
        :popper-append-to-body="false"
        :popper-class="'dimLevelSel'"
        :collapse-tags="!noModification"
        placeholder="请选择内容"
        filterable
        :clearable="!father.dimLevelExcess"
        :class="{'tagClose':father.dimLevelExcess}"
        @change="change"
        :disabled="noModification"
        @visible-change="dimLevelClick"
      >
        <el-option
          v-for="(item, index) in contentList"
          :key="index"
          :label="item.dimValueDesc"
          :value="item.dimValue"
        ></el-option>
      </el-select>
      <template v-else-if="father.type=='B'">
        <template v-if="father.changeTimeControlVal==null||father.changeTimeControlVal=='0'">
          <template v-if="queryParam.symbol==6||queryParam.symbol==7">
            <el-date-picker
              size="mini"
              v-if="father.operand&&father.operand.dataCycle==1"
              style="width: 405px"
              v-model="queryParam.expressionVal"
              type="daterange"
              @change="change"
              range-separator="至"
              start-placeholder="开始日期"
              :key="'a'"
              value-format="yyyyMMdd"
              end-placeholder="结束日期"
              :disabled="noModification"
            ></el-date-picker>
            <el-date-picker
              size="mini"
              v-else
              style="width: 405px"
              v-model="queryParam.expressionVal"
              type="monthrange"
              @change="change"
              range-separator="至"
              start-placeholder="开始月份"
              :key="'b'"
              value-format="yyyyMM"
              end-placeholder="结束月份"
              :disabled="noModification"
            ></el-date-picker>
          </template>
          <template v-else>
            <el-date-picker
              size="mini"
              v-if="father.operand&&father.operand.dataCycle==1"
              v-model="queryParam.expressionVal"
              type="date"
              placeholder="选择日期"
              :key="'c'"
              value-format="yyyyMMdd"
              @change="change"
              style="width: 199px"
              :disabled="noModification"
            ></el-date-picker>
            <el-date-picker
              size="mini"
              v-else
              v-model="queryParam.expressionVal"
              type="month"
              placeholder="选择月份"
              :key="'d'"
              value-format="yyyyMM"
              @change="change"
              style="width: 199px"
              :disabled="noModification"
            ></el-date-picker>
          </template>
        </template>
        <template v-else>
          <span class="past_text">在过去</span>
          <el-input
            size="mini"
            style="width: 230px"
            v-model.trim="queryParam.expressionVal"
            placeholder="请输入内容"
            @input="change"
            :disabled="noModification"
          ></el-input>
          <el-popover
            class="wenhao_icon"
            placement="top"
            title="函数用法说明"
            width="350"
            trigger="hover"
            v-model="popOnOff"
          >
            <ul class="function_use">
              <template v-for="(rule, index) in functionRules">
                <li class="use_title">{{rule.title}}</li>
                <li class="use_content">
                  <span>{{rule.value}}</span>
                  <i
                    v-if="!noModification"
                    class="copy_icon"
                    v-iconfont="'iconcopy'"
                    @click="copy_rule(rule.value)"
                  ></i>
                </li>
              </template>
            </ul>
            <i slot="reference" v-iconfont="'iconyiwen'"></i>
          </el-popover>
        </template>
      </template>
      <template v-else-if="father.type=='C'">
        <number-range-select
          v-if="queryParam.symbol==6||queryParam.symbol==7"
          v-model="queryParam.expressionVal"
          @change="change"
          :disabled="noModification"
        ></number-range-select>
        <el-input-number
          size="mini"
          v-else
          style="width: 199px"
          v-model="queryParam.expressionVal"
          :controls="false"
          @change="change"
          controls-position="right"
          placeholder="请输入数量"
          :disabled="noModification"
        ></el-input-number>
      </template>
      <el-input
        size="mini"
        v-else
        style="width: 199px"
        v-model.trim="queryParam.expressionVal"
        placeholder="请输入内容"
        @input="change"
        :disabled="noModification"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS, lodash } from "@riophae/vue-treeselect";
// import {
//     getDimValueById
// } from "@/api/cluster";
import * as _ from "lodash";

import { symbolListObj, functionRules } from "@/libs/util";
import { isNullOrEmpty } from "@/libs/tools";
import dimLevelSel from "./dimLevelSel";

export default {
  name: "logic_form",
  props: {
    father: null,
    subjectId: null,
    frameId: null,
    noModification: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryParam: {
        symbol: null,
        expressionVal: undefined
      },
      symbolList: [],
      contentList: [],
      timeRangeList: [
        {
          id: "0",
          value: "绝对时间"
        },
        {
          id: "1",
          value: "相对当前时间点"
        }
      ],
      functionRules: functionRules,
      popOnOff: false
    };
  },
  methods: {
    copy_rule(value) {
      if (
        value.indexOf(",") > -1 &&
        this.queryParam.symbol != 6 &&
        this.queryParam.symbol != 7
      ) {
        //区间 6，7
        this.warningMes("请选择非区间函数");
        return;
      }
      if (
        value.indexOf(",") == -1 &&
        (this.queryParam.symbol == 6 || this.queryParam.symbol == 7)
      ) {
        //非区间
        this.warningMes("请选择区间函数");
        return;
      }
      this.queryParam.expressionVal = value;
      this.father.expressionVal = value;
      this.father.symbol = this.queryParam.symbol;
      this.popOnOff = false;
    },
    changeTimeRange($event) {
      this.queryParam.symbol = null;
      this.queryParam.expressionVal = undefined;
      this.father.symbol = null;
      this.father.expressionVal = undefined;
      this.symbolList = _.cloneDeep(symbolListObj.symbolList_B);
    },
    // 维值点击
    dimLevelClick($event) {
      //dimLevelExcessList
      if (!this.father.dimLevelExcess) return;
      if ($event) {
        this.$OpenDialog({
          component: dimLevelSel,
          param: {
            data: this.father
          },
          title: "维值选择",
          width: 950,
          top: "10vh",
          ok: res => {
            let list = _.cloneDeep(res),
              ids = [];
            for (let i = 0; i < list.length; i++) {
              ids.push(list[i].dimValue);
            }
            this.$set(this.father, "dimLevelExcess", true);
            this.$set(this.father, "expressionVal", ids);
            this.$set(this.father, "dimLevelExcessList", list);
            this.queryParam.expressionVal = ids;
            this.contentList = list;
          },
          cancel: () => {}
        });
      }
    },
    saveTree() {
      // console.log(this.father.operand.colType);
      // console.log(this.father.operand.dataType);
      delete this.father.advancedVal; //删除高级设置
      this.queryParam.symbol = null;
      this.queryParam.expressionVal = undefined;
      this.$set(this.father, "symbol", null);
      this.$set(this.father, "expressionVal", undefined);
      // this.father.symbol = null;
      // this.father.expressionVal = undefined;
      this.symbolList = [];
      this.contentList = [];
      this.$set(this.father, "dimLevelExcess", false);
      this.$set(this.father, "dimLevelExcessList", null);
      let data = _.cloneDeep(this.father.operand);
      console.log(data);
      if (data.colType == null) data.colType = "";
      let colType = data.colType.toLowerCase();
      if (!isNullOrEmpty(data.dimLevelId)) {
        //[8,9] //下拉
        this.symbolList = _.cloneDeep(symbolListObj.symbolList_A);
        this.father.type = "A";
        // 获取维值下拉
        getDimValueById({
          dimLevelId: data.dimLevelId,
          type: "all"
        }).then(res => {
          if (!res.data.flag) {
            this.contentList = res.data.list;
          } else {
            this.$set(this.father, "dimLevelExcess", true);
            this.$set(this.father, "dimLevelExcessList", []);
          }
        });
      } else {
        if (
          colType.indexOf("date") != -1 ||
          data.dataType == 2 ||
          data.dataType == 10
        ) {
          // [1,2,3,4,5,6,7,12] //日期
          this.symbolList = _.cloneDeep(symbolListObj.symbolList_B);
          this.father.type = "B";
          this.father.changeTimeControlVal = "0";
        } else if (colType.indexOf("number") != -1) {
          //[1,2,3,4,5,6,7,12] //输入
          this.symbolList = _.cloneDeep(symbolListObj.symbolList_B);
          this.father.type = "C";
        } else if (colType.indexOf("varchar") != -1) {
          //[10,11,3,12] //输入
          this.symbolList = _.cloneDeep(symbolListObj.symbolList_C);
          this.father.type = "D";
        } else {
          //[10,11,3,12] //输入
          this.symbolList = _.cloneDeep(symbolListObj.symbolList_C);
          this.father.type = "E";
        }
      }
      this.$forceUpdate();
    },
    diGuiTree(item) {
      //递归便利树结构
      item.forEach(item => {
        item.isLeaf == 1 &&
        (item.children == "" ||
          item.children == null ||
          item.children.length == 0)
          ? delete item.children
          : this.diGuiTree(item.children);
      });
    },
    changeSymbol($event) {
      this.queryParam.expressionVal = undefined;
      this.father.symbol = this.queryParam.symbol;
      this.father.expressionVal = this.queryParam.expressionVal;
      this.$set(this.father, "dimLevelExcessList", []);
    },
    change($event) {
      this.father.symbol = this.queryParam.symbol;
      this.father.expressionVal = this.queryParam.expressionVal;
    }
  },
  mounted() {
    if (this.father == null) return;
    this.queryParam.symbol = this.father.symbol;
    this.queryParam.expressionVal = this.father.expressionVal;
    if (this.father.type == "A") {
      this.symbolList = _.cloneDeep(symbolListObj.symbolList_A);
    } else if (this.father.type == "B") {
      this.symbolList = _.cloneDeep(symbolListObj.symbolList_B);
    } else if (this.father.type == "C") {
      this.symbolList = _.cloneDeep(symbolListObj.symbolList_B);
    } else if (this.father.type == "D") {
      this.symbolList = _.cloneDeep(symbolListObj.symbolList_C);
    } else if (this.father.type == "E") {
      this.symbolList = _.cloneDeep(symbolListObj.symbolList_C);
    }
    // 获取维值下拉框
    if (this.father.operand && !isNullOrEmpty(this.father.operand.dimLevelId)) {
      getDimValueById({
        dimLevelId: this.father.operand.dimLevelId,
        type: "all"
      }).then(res => {
        if (!res.data.flag) {
          this.contentList = res.data.list;
          let ids = [];
          for (let i = 0; i < this.contentList.length; i++) {
            ids.push(this.contentList[i].dimValue);
          }
          var filterVal = this.father.expressionVal.filter(function(v) {
            return ids.indexOf(v) > -1;
          });
          this.queryParam.expressionVal = filterVal;
          this.$set(this.father, "expressionVal", filterVal);
          this.$set(this.father, "dimLevelExcess", false);
          this.$set(this.father, "dimLevelExcessList", null);
        } else {
          if (this.father.dimLevelExcess == false) {
            this.father.expressionVal = undefined;
          }
          this.$set(this.father, "dimLevelExcess", true);
          this.contentList =
            this.father.dimLevelExcessList == null
              ? []
              : this.father.dimLevelExcessList;
          this.queryParam.expressionVal = this.father.expressionVal;
        }
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.form_block {
  width: auto;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 5px 0;

  .form_item {
    // margin: 3px 5px;
    margin: 0 5px;
  }
}

.label_title {
  font-size: 14px;
}

.icon_1 {
  color: #c2cbd8;
  font-size: 15px;
}

.icon_0 {
  color: #9aa9be;
  font-size: 15px;
}

.past_text {
  font-size: 14px;
  margin: 0 5px;
  font-weight: normal;
  color: #333333;
}

.wenhao_icon {
  cursor: pointer;
  margin-left: 10px;

  /deep/ .el-popover__reference-wrapper {
    display: inline-block;
    vertical-align: middle;
    color: #9caabf;
  }
}

.function_use {
  width: 100%;

  .use_title {
    font-weight: bolder;
  }
  .use_content {
    margin-bottom: 6px;
  }

  li {
    list-style: none;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .copy_icon {
      cursor: pointer;
    }
  }
}
</style>