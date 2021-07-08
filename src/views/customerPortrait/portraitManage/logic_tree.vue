<template>
  <div class="container">
    <div class="dialog-content">
      <div class="search">
        <el-select
          size="mini"
          ref="remoteSel"
          style="width:500px"
          v-model="result"
          filterable
          remote
          placeholder="请选择标签名"
          @change="SearchChange"
          :remote-method="remoteMethod"
          :loading="loading"
          value-key="seq"
          :popper-class="'sf-remote-dropdown'"
        >
          <el-option v-for="item in LabelOptions" :key="item.seq" :label="item.name" :value="item">
            <span class="suffix_name">{{ item.treeName }}</span>
            <span class="name">{{ item.name }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="content_tree">
        <vue-magic-tree ref="zTree" :setting="setting" :nodes="nodes" />
        <div
          @mouseenter="tipMouseEnter"
          @mouseleave="tipMouseLeave"
          class="tips"
          v-show="showTips"
          :style="{ top: SusMenuPos.top, left: SusMenuPos.left }"
        >
          <template v-if="content.length<20">
            <span>{{content}}</span>
          </template>
          <template v-else>
            <span class="tips_more">
              {{dealContent(content)}}
              <i
                class="more_up"
                v-show="!showMore"
                v-iconfont="'iconzhankai1'"
                @click="showMore=true"
              ></i>
              <i
                class="more_down"
                v-show="showMore"
                v-iconfont="'iconzhankai1-copy'"
                @click="showMore=false"
              ></i>
            </span>
          </template>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button size="mini" type="primary" @click="conform">保 存</el-button>
      <el-button size="mini" type="info" @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getRequiredRule,
  getCheckLimitMinMax,
  checkCN6
} from "@/libs/validate";
import * as _ from "lodash";
import {
  getEdcAttrTree,
  getEdcAttrList
  // getEdcAttrListByName,
} from "@/api/portraitManage.js";

import { getRandomId, isNullOrEmpty, transHump } from "@/libs/tools";
import $ from "jquery";
export default {
  name: "logic_tree",
  props: {
    father: null,
    subjectId: null,
    frameId: null
  },
  data() {
    return {
      LabelOptions: [],
      result: null,
      loading: false,
      setting: {
        check: {
          //树是否带复选框或者单选框
          enable: false
        },
        data: {
          // 设置图标库(采用iconfont class形式)
          iconMap: {
            0: "iconwenjianjia-",
            original: "iconbiaoqian-6", //原始标签
            subject: "iconyonghuzu", //分群
            derived: "iconxinzeng", //派生标签
            import: "icondaoru", //导入标签
            imports: "iconuserprev04" //导入分群
          },
          // 设置对应每个节点的节点类型，与数据中customType属性对应
          key: {
            nodeType: "customType",
            children: "children",
            name: "className",
            isParent: "isLeaf",
            title: "''"
          }
        },
        view: {
          // 开启图标显示功能
          showIcon: true,
          showLine: false,
          showTitle: false
        },
        async: {
          // 属性配置
          enable: true,
          url: "../../twoll/api/eikon/getEdcAttrList",
          autoParam: ["id=tree_id"],
          headers: {
            Authorization: "Bearer " + this.$store.state.userInfo.Token
          },
          type: "post",
          // contentType: "application/json",
          otherParam: {
            // type: this.ParamType,
            id: this.subjectId
            // frameId: this.frameId
          },
          dataFilter: this.filter
        },
        callback: {
          // 回调函数配置
          beforeAsync: this.beforeAsync,
          beforeClick: this.beforeClick,
          onClick: this.onTreeNodeClick
        }
      },
      nodes: [
        {
          id: 1,
          pid: 0,
          name: "",
          open: true,
          customType: 0,
          isLeaf: 0
        }
      ],
      SusMenuPos: {
        top: 0,
        left: 0
      },
      showTips: false,
      content: "",
      showMore: false,
      timeoutId: null,
      time: 2000
    };
  },
  methods: {
    tipMouseEnter() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    },
    tipMouseLeave() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.showTips = false;
      }, this.time);
    },
    dealContent(content) {
      if (this.showMore) {
        return content;
      } else {
        return content.slice(0, 20) + "...";
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        getEdcAttrList({
          name: query,
          // type: this.ParamType,
          // tree_id: this.subjectId,
          tree_id: ""
          // frameId: this.frameId
        }).then(res => {
          this.loading = false;
          let list = [],
            data = transHump(res.DATA_LIST);
          for (let i = 0; i < data.length; i++) {
            list.push({
              id: data[i].id,
              seq: data[i].seq,
              treeName: data[i].treeName,
              name: data[i].name,
              type: data[i].type,
              dtype: data[i].dtype,
              dimLevelId: data[i].dimLevelId,
              colType: data[i].colType,
              dataType: data[i].dataType,
              dataCycle: data[i].dataCycle, //周期类型
              frameId: data[i].frameId //frameId
            });
          }
          this.LabelOptions = list;
        });
      } else {
        this.LabelOptions = [];
      }
    },
    SearchChange($event) {
      this.$refs.zTree.ztreeObj.cancelSelectedNode();
    },
    conform() {
      if (this.result == null) {
        this.warningMes("请选择标签名");
        return;
      }
      this.father.operand = this.result;
      this.father.operandList = [this.result];
      this.father.visible = false;
      this.$emit("saveTree");
    },
    cancel() {
      this.father.visible = false;
    },

    filter(treeId, parentNode, childNodes) {
      console.log(childNodes);
      childNodes = transHump(childNodes.DATA_LIST);
      if (typeof childNodes == "string") {
        childNodes = JSON.parse(childNodes);
      }
      for (let i = 0; i < childNodes.length; i++) {
        if (!isNullOrEmpty(childNodes[i].sourceName)) {
          childNodes[i].className =
            childNodes[i].name + "（" + childNodes[i].sourceName + "）";
        } else {
          childNodes[i].className = childNodes[i].name;
        }
        childNodes[i].isLeaf = 0;
        childNodes[i].customType = childNodes[i].dtype;
      }
      return childNodes;
    },
    beforeAsync(treeId, treeNode) {
      return true;
    },
    beforeClick(treeId, treeNode, clickFlag) {
      if (treeNode.type != null) {
        return true;
      } else {
        return false;
      }
    },
    onTreeNodeClick(event, treeId, treeNode, clickFlag) {
      let node = {
        seq: getRandomId(),
        id: treeNode.id,
        treeName: "",
        name: treeNode.className,
        type: treeNode.type,
        dtype: treeNode.dtype,
        dimLevelId: treeNode.dimLevelId,
        colType: treeNode.colType,
        dataType: treeNode.dataType,
        dataCycle: treeNode.dataCycle, //周期类型
        frameId: treeNode.frameId //frameId
      };
      this.result = node;
      this.LabelOptions = [node];
    }
  },
  created() {
    getEdcAttrTree({
      // type: this.ParamType
    }).then(res => {
      if (res.SUCCESS) {
        this.nodes = res.DATA_LIST;
      } else {
        this.$message.warning(res.MESSAGE);
      }
    });
  },
  mounted() {
    this.$refs.remoteSel.focus();
    $(".content_tree").data("greeting", "Hello World");
    $(".content_tree>.ztree").on("mouseenter", "a", $event => {
      if ($event.currentTarget.tagName == "A") {
        let TagId = $event.currentTarget.id;
        let idx = TagId.lastIndexOf("_");
        let id = TagId.slice(0, idx);
        let node = this.$refs.zTree.ztreeObj.getNodeByTId(id);
        if (isNullOrEmpty(node.busInfo)) {
          return;
        }
        this.showMore = false;
        this.showTips = true;
        this.SusMenuPos.top = $event.clientY + "px";
        this.SusMenuPos.left = $event.clientX + 50 + "px";
        this.content = node.busInfo;
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.showTips = false;
        }, this.time);
        this.$forceUpdate();
      }
    });
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dialog-content {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 20px 20px 10px 20px;

  .search {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .content_tree {
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;
    height: auto;
    max-height: 330px;
    overflow: auto;
    position: relative;

    .tips {
      position: fixed;
      z-index: 1000;
      max-width: 320px;
      padding: 5px 5px;
      background: #fff;
      border: 1px solid #ddd;
      transition: all 0.1s;
      border-radius: 2px;

      .tips_more {
        .more_up {
          cursor: pointer;
          margin-left: 5px;
        }

        .more_down {
          cursor: pointer;
          margin-left: 5px;
        }
      }
    }
  }
}

.suffix_name {
  font-weight: normal;
  font-size: 12px;
}

.name {
  font-weight: bolder;
  font-size: 12px;
}
</style>