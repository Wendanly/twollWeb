<template>
  <div class="container">
    <div class="dialog-content">
      <div class="left">
        <div class="query-list">
          <div class="form_item">
            <el-input
              size="mini"
              v-model="queryParam.dimValueDesc"
              placeholder="请输入维值名称"
              :clearable="true"
            >
              <span slot="append" class="query-icon" @click="clickQuery()">
                <i class="el-icon-search"></i>
              </span>
            </el-input>
          </div>
        </div>
        <div class="table-list">
          <sf-table
            ref="sfTable"
            :current="current"
            :pageSize="pageSize"
            :columns="columns"
            :data="data"
            :total="total"
            :fixedTable="true"
            :selection="selection"
            @on-change="onchange($event)"
            v-model="selectedItem"
            @select="tableSelect"
            @select-all="tableSelectAll"
            @on-page-size-change="onpagesizechange($event)"
          ></sf-table>
        </div>
      </div>
      <div class="right">
        <div class="title">已选列表({{dynamicTags.length}})</div>
        <div class="sel-list">
          <template v-if="dynamicTags!=null">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              :disable-transitions="false"
              closable
              @close="handleClose(tag)"
            >{{tag.dimValueDesc}}</el-tag>
          </template>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="conform">保 存</el-button>
      <el-button type="info" @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import * as _ from "lodash";
import { isNullOrEmpty, transHump } from "@/libs/tools";
import { getDimValueById } from "@/api/portraitManage.js";

export default {
  name: "dimLevelSel",
  props: {
    dismiss: {
      type: Object,
      default: null
    },
    context: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      current: 1,
      pageSize: 10,
      columns: [],
      data: [],
      total: 0,
      selection: true,
      queryParam: {
        dimValueDesc: null
      },
      selectedItem: [],
      dynamicTags: []
    };
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].dimValue == tag.dimValue) {
          this.$refs.sfTable
            .getElTable()
            .toggleRowSelection(this.data[i], false);
          break;
        }
      }
    },
    tableSelect(rows, row) {
      let selected = rows.length != 0 && rows.indexOf(row) !== -1;
      if (selected) {
        this.dynamicTags.push(row);
      } else {
        for (let i = 0; i < this.dynamicTags.length; i++) {
          if (this.dynamicTags[i].dimValue == row.dimValue) {
            this.dynamicTags.splice(i, 1);
            break;
          }
        }
      }
    },
    tableSelectAll(rows) {
      if (rows.length == 0) {
        // 全删
        let ids = [];
        for (let i = 0; i < this.data.length; i++) {
          ids.push(this.data[i].dimValue);
        }
        for (let i = 0; i < this.dynamicTags.length; i++) {
          if (ids.indexOf(this.dynamicTags[i].dimValue) > -1) {
            this.dynamicTags.splice(i, 1);
            i--;
          }
        }
      } else {
        //全选
        let ids = [];
        for (let i = 0; i < this.dynamicTags.length; i++) {
          ids.push(this.dynamicTags[i].dimValue);
        }
        for (let i = 0; i < this.data.length; i++) {
          if (ids.indexOf(this.data[i].dimValue) == -1) {
            this.dynamicTags.push(this.data[i]);
          }
        }
      }
    },
    conform() {
      if (this.dynamicTags.length > 50) {
        this.$message.warning("最多选择50个维值,请用或配置多个");
        return;
      }
      if (this.dynamicTags == null) {
        this.dismiss.next([]);
      } else {
        this.dismiss.next(this.dynamicTags);
      }
    },
    cancel() {
      this.dismiss.error();
    },
    onchange($event) {
      this.current = $event;
      this.query();
    },
    onpagesizechange($event) {
      this.current = 1;
      this.pageSize = $event;
      this.query();
    },
    clickQuery() {
      this.current = 1;
      this.query();
    },
    query() {
      const tmp = {
        dim_level_id: this.context.data.operand.dimLevelId,
        type: "page",
        page: this.current,
        rows: this.pageSize,
        dim_name: this.queryParam.dimValueDesc
      };
      getDimValueById(tmp).then(res => {
        if (res.SUCCESS) {
          this.data = transHump(res.DATA_LIST);
          this.total = res.TOTAL;
        }

        setTimeout(() => {
          this.setSelectedItem();
        });
      });
    },
    setSelectedItem() {
      let ids = [];
      for (let i = 0; i < this.dynamicTags.length; i++) {
        ids.push(this.dynamicTags[i].dimValue);
      }
      for (let i = 0; i < this.data.length; i++) {
        if (ids.indexOf(this.data[i].dimValue) > -1) {
          this.$refs.sfTable
            .getElTable()
            .toggleRowSelection(this.data[i], true);
        }
      }
    }
  },
  created() {},
  mounted() {
    let dimLevelExcessList = this.context.data.dimLevelExcessList;
    if (dimLevelExcessList != null) {
      this.dynamicTags = dimLevelExcessList;
    }
    this.columns = [
      {
        label: "维值编码",
        prop: "dimValue",
        minWidth: 120
      },
      {
        label: "维值名称",
        prop: "dimValueDesc",
        minWidth: 120
      }
    ];
    this.query();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dialog-content {
  width: 100%;
  height: 500px;
  overflow: hidden;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .left {
    width: 0;
    flex: 1 1 auto;
    height: 100%;

    .query-list {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 20px;

      .form_item {
        margin: 0 5px;
      }
    }

    .table-list {
      width: 100%;
      height: 450px;
    }
  }

  .right {
    width: 0;
    flex: 0 0 300px;
    height: 100%;
    border-left: 1px solid #f1f1f1;

    .title {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 20px;
    }

    .sel-list {
      width: 100%;
      height: 450px;
      padding: 10px 5px;
      overflow: auto;

      /deep/.el-tag + .el-tag {
        margin-left: 10px;
      }

      /deep/.el-tag {
        margin-bottom: 10px;
      }
    }
  }
}
</style>