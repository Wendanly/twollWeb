<template>
  <div class="block" :class="father==null?'block_first_level':''">
    <div
      class="relationship"
      v-show="showRelationship"
      :class="['relationType_'+list.relation,father==null?'relationship_first_level':'']"
    >
      <span @click="changeSymbol">{{RelationshipMap[list.relation]}}</span>
    </div>
    <div class="ruleContainer">
      <template v-if="list.children!=null">
        <div
          class="rule_item"
          v-for="(item) in list.children"
          :key="item.id"
          :class="father==null?'rule_first_level':''"
        >
          <template v-if="item.relation==null">
            <div class="rule_item_l">
              <logicForm
                :father="item"
                :subjectId="subjectId"
                :frameId="frameId"
                :noModification="noModification"
              ></logicForm>
              <!-- <span class="rule_icon" @click="advance(item)">
                <i v-iconfont="'iconShape1'"></i>
              </span>-->
              <span class="rule_icon" @click="remove(item)" v-if="!noModification">
                <i class="iconfont icon-quxiao"></i>
              </span>
            </div>
            <div class="rule_item_r"></div>
          </template>
          <template v-else>
            <logicBlock
              :list="item"
              :father="item"
              @reset="reset"
              :subjectId="subjectId"
              :frameId="frameId"
              :noModification="noModification"
            ></logicBlock>
          </template>
        </div>
      </template>
    </div>
    <div class="btn-group" :class="{'first_btn':father==null}" v-if="!noModification">
      <el-dropdown @command="handleAdd">
        <span class="el-dropdown-link">
          <i class="iconfont icon-xinzeng"></i> 新增
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="beforeHandleAdd('same')">新增子条件</el-dropdown-item>
          <!-- <el-dropdown-item :command="beforeHandleAdd('logic',item)">新增逻辑</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import logic_form from "./logic_form.vue";
import { getRandomId } from "@/libs/tools";
import * as _ from "lodash";
import logic_block_adv from "./logic_block_adv";

export default {
  name: "logic_block",
  props: {
    list: {
      type: Object,
      default: () => {
        return {};
      }
    },
    father: null,
    ParamType: "edc",
    subjectId: null,
    frameId: null,
    noModification: {
      type: Boolean,
      default: false
    }
  },
  components: {
    logicForm: logic_form
  },
  data() {
    return {
      showRelationship: false,
      RelationshipMap: {
        11: "且",
        12: "或",
        13: "剔除"
      }
    };
  },
  watch: {
    list: {
      handler(newName, oldName) {
        // console.log(newName);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeRelationship() {
      if (this.list.children != null && this.list.children.length > 1)
        this.showRelationship = true;
      else this.showRelationship = false;
    },
    add() {
      this.$set(this.list.children, this.list.children.length, {
        id: getRandomId(),
        operandList: [],
        type: "A",
        expressionVal: undefined
      });
      this.changeRelationship();
      this.$forceUpdate();
    },
    addChild(item) {
      let temp = _.cloneDeep(item);
      this.clearObject(item);
      this.$set(item, "relation", 11);
      this.$set(item, "frameId", "");
      this.$set(item, "children", [
        temp,
        {
          id: getRandomId(),
          operandList: [],
          type: "A",
          expressionVal: undefined
        }
      ]);
      this.$forceUpdate();
    },
    addLogic() {
      let item = {};
      this.$set(this.list.children, this.list.children.length, item);
      this.$set(item, "relation", 11);
      this.$set(item, "frameId", "");
      this.$set(item, "children", [
        {
          id: getRandomId(),
          operandList: [],
          type: "A",
          expressionVal: undefined
        },
        {
          id: getRandomId() + 1,
          operandList: [],
          type: "A",
          expressionVal: undefined
        }
      ]);
      this.changeRelationship();
      this.$forceUpdate();
    },
    remove(item) {
      this.list.children.splice(this.list.children.indexOf(item), 1);
      if (this.list.children.length == 1 && this.father != null) {
        let temp = _.cloneDeep(this.list.children[0]);
        this.clearObject(this.father);
        if (temp.hasOwnProperty("relation")) {
          this.$set(this.father, "relation", temp.relation);
          this.$set(this.father, "frameId", temp.frameId);
          this.$set(this.father, "children", temp.children);
        } else {
          this.$set(this.father, "operand", temp.operand);
          this.$set(this.father, "symbol", temp.symbol);
          this.$set(this.father, "expressionVal", temp.expressionVal);
          this.$set(this.father, "operandList", temp.operandList);
          this.$set(this.father, "type", temp.type);
          this.$set(this.father, "id", temp.id);
          if (temp.hasOwnProperty("dimLevelExcess")) {
            this.$set(this.father, "dimLevelExcess", temp.dimLevelExcess);
            this.$set(
              this.father,
              "dimLevelExcessList",
              temp.dimLevelExcessList
            );
          }
          if (temp.hasOwnProperty("advancedVal")) {
            this.$set(this.father, "advancedVal", temp.advancedVal);
          }
          if (temp.hasOwnProperty("changeTimeControlVal")) {
            this.$set(
              this.father,
              "changeTimeControlVal",
              temp.changeTimeControlVal
            );
          }
        }

        this.$emit("reset");
      }
      this.changeRelationship();
      this.$forceUpdate();
    },
    advance(item) {
      if (item.operand == null) {
        this.warningMes("请先选择标签客户群");
        return;
      }
      this.$OpenDialog({
        component: logic_block_adv,
        param: {
          data: item,
          noModification: this.noModification
        },
        title: "高级设置",
        width: 550,
        top: "25vh",
        ok: () => {},
        cancel: () => {}
      });
    },
    reset() {
      this.$forceUpdate();
    },
    beforeHandleAdd(item) {
      return {
        command: item
      };
    },
    handleAdd(command) {
      if (command.command == "same") {
        this.add();
      } else {
        this.addLogic();
      }
    },
    clearObject(obj) {
      for (var key in obj) {
        delete obj[key];
      }
    },
    changeSymbol() {
      if (this.noModification) return;
      this.list.relation++;
      this.list.relation =
        this.list.relation % 14 == 0 ? 11 : this.list.relation;
      this.$forceUpdate();
    }
  },
  mounted() {
    this.changeRelationship();
    this.$forceUpdate();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/sass/base.scss";

.block {
  width: 100%;
  display: flex;
  padding: 18px 0;
  position: relative;

  & > .btn-group {
    position: absolute;
    top: 0;
    right: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > .btn-group.first_btn {
    top: 0;
    right: 53px;
  }

  .relationship {
    width: 30px;
    flex: 0 0 30px;
    height: auto;
    position: relative;

    &:before {
      content: "";
      display: inline-block;
      width: 2px;
      position: absolute;
      top: 5px;
      left: 50%;
      bottom: 5px;
      background: #c4e3f8;
    }

    & > span {
      width: 22px;
      height: auto;
      padding: 3px 4px;
      border-radius: 3px;
      display: inline-flex;
      font-size: 14px;
      background: #bcdff7;
      color: #3da2e9;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      word-wrap: break-word;
      word-break: break-all;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }

  .relationship.relationship_first_level {
    &:before {
      top: 1px;
      bottom: 1px;
    }
  }

  .ruleContainer {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    .rule_item {
      width: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .rule_item_l {
        width: 945px;
        flex: 0 0 945px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .rule_icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9caabf;
          font-size: 12px;
          margin: 0 5px;
        }
      }

      .rule_item_r {
        width: 90px;
        flex: 0 0 90px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.block.block_first_level {
  padding-top: 30px;
}

.el-dropdown-link {
  font-size: 14px;
  cursor: pointer;

  i {
    color: #2196e7;
  }

  &:hover {
    color: #2196e7;
  }
}

.ruleContainer {
  & > .rule_first_level {
    padding: 10px 0 10px 10px;
    margin-right: 30px;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    flex-wrap: wrap;
  }

  & > .rule_first_level:not(:last-child) {
    margin-bottom: 20px;
  }
}

.first_level_title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  color: #3e3e3e;
  font-size: 14px;
  font-weight: bolder;
  padding: 0 0 7px 9px;
}

.block > .relationship.relationType_11 {
  &:before {
    background: #bcdff7;
  }

  & > span {
    background: #bcdff7;
    color: #329ee8;
  }
}

.block > .relationship.relationType_12 {
  &:before {
    background: #b2efdc;
  }

  & > span {
    background: #b2efdc;
    color: #19d197;
  }
}

.block > .relationship.relationType_13 {
  &:before {
    background: #fdedd3;
  }

  & > span {
    background: #fdedd3;
    color: #f6b03d;
  }
}
</style>