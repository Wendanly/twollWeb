<template>
  <div class="box">
    <div class="logic_box">
      <logicBlock
        ref="logicBlock"
        :list="list"
        :subjectId="subjectId"
        :frameId="frameId"
        :noModification="noModification"
      ></logicBlock>
      <div class="logic_title">逻辑设置</div>
    </div>
    <div class="code_line" ref="codeLine" v-html="codes"></div>
  </div>
</template>

<script>
//且 11 或 12 剔除13
import { getRandomId, generateCode, checkLogicTree } from "@/libs/tools";
// import {
//   getEdcOutDefault
// } from "@/api/cluster";
import fieldOrderPop from "./content/fieldOrderPop";

export default {
  name: "logic_step",
  props: {
    subjectId: null,
    frameId: null,
    noModification: {
      type: Boolean,
      default: false
    }
  },
  components: {
    fieldOrderPop: fieldOrderPop
  },
  data() {
    return {
      list: {
        relation: 11,
        frameId: "",
        children: [
          {
            id: getRandomId(),
            operandList: [],
            type: "A",
            expressionVal: undefined
          }
        ]
      },
      showAdvSetting: false, //高级设置
      dynamicTags: [], //输出字段
      defaultTags: [],
      inputValue: "",
      fieldOrder: false, //字段排序
      LimitOutput: false, //限制输出记录数
      LimitOutputNum: null, //结果限制值
      addOutputObj: {
        visible: false
      },
      fieldOrderObj: {
        visible: false,
        list: []
      },
      codes: "",
      codesText: ""
    };
  },
  watch: {
    list: {
      handler(newName, oldName) {
        let result = {
          bool: true
        };
        checkLogicTree(newName, result);
        if (result.bool == true) {
          this.showCode(newName);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    showCode(list) {
      list = [list];
      let code = {
        str: ""
      };
      generateCode(list, code, "且");
      this.codes = code.str;
      this.$nextTick(() => {
        this.codesText = this.$refs.codeLine.innerText.replace(/[\n\r]/g, "");
      });
      this.$forceUpdate();
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      for (let i = 0; i < this.fieldOrderObj.list.length; i++) {
        if (this.fieldOrderObj.list[i].id == tag.id) {
          this.fieldOrderObj.list.splice(i, 1);
          break;
        }
      }
    },
    handleCloseField(tag) {
      this.fieldOrderObj.list.splice(this.fieldOrderObj.list.indexOf(tag), 1);
    },
    checkDuplication(val) {
      return this.dynamicTags.every(item => {
        return item.id != val.id;
      });
    },
    saveTree() {
      var val = _.cloneDeep(this.addOutputObj.operand);
      if (this.checkDuplication(val)) {
        this.dynamicTags.push(val);
      } else {
        this.$message.warning("标签客户群重复");
      }
    },
    // 获取默认值方法
    getDefaultOutputField(dataCycle, frameId) {
      getEdcOutDefault({
        dataCycle: dataCycle,
        frameId: frameId
      }).then(res => {
        this.defaultTags = res.data;
        this.$refs.logicBlock.changeRelationship();
        this.$forceUpdate();
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.box {
  width: 100%;

  .logic_box {
    width: 100%;
    overflow-x: visible;
    overflow-y: visible;
    padding-left: 100px;
    min-height: 120px;
    position: relative;

    .op_add {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 53px 0 0;
    }

    .logic_title {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding: 51px 10px 0 0;
      font-size: 14px;
    }

    .text_add {
      color: #606266;
    }
  }

  .sp_line {
    width: 100%;
    position: relative;
    padding: 20px 20px;

    &:before {
      content: "";
      display: block;
      width: 100%;
      height: 2px;
      background: #f4f4f4;
    }

    .adv_btn {
      width: 100px;
      height: 40px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #a9a9a9;
      cursor: pointer;

      .icon {
        margin-left: 5px;
      }
    }
  }

  .adv_setting {
    width: 100%;
    overflow: hidden;
    padding-left: 100px;
    position: relative;
    min-height: 120px;

    .adv_title {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding: 12px 10px 0 0;
      font-size: 14px;
    }

    .adv_box {
      width: 100%;

      .adv_line_1 {
        width: 100%;
        padding: 5px 0 10px 7px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;

        .text_add {
          color: #606266;
        }
      }

      .adv_line_2 {
        .adv_line_2_up {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px 8px;
        }

        .adv_line_2_bottom {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px 32px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .text_add {
          color: #606266;
        }
      }

      .adv_line_3 {
        .adv_line_3_up {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px 8px;
        }

        .adv_line_3_bottom {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 5px 32px;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
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

.add_tag {
  margin-right: 10px;
  border-radius: 20px;
  line-height: 29px;
  height: 30px;
  color: #2196e7;
  background: #e4eef8;
  padding-left: 12px;
  padding-right: 8px;
  margin-bottom: 5px;
}

.add_icon {
  padding: 8px !important;
  margin-bottom: 5px;
}

.input-new-tag {
  width: 150px;
  margin-bottom: 5px;
}

.code_line {
  width: 100%;
  padding: 10px 28px;
  display: flex;
  flex-wrap: wrap;
}
</style>