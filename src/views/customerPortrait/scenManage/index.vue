<template>
  <div class="wrap">
    <div class="search">
      <el-select
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.iop_type"
        placeholder="分析主体"
        clearable
        @change="getSceneList('search')"
      >
        <el-option
          v-for="(item,index) in iopTypeList"
          :key="index"
          :label="item.DIM_NAME"
          :value="item.DIM_ID"
        ></el-option>
      </el-select>
      <el-select
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.status"
        placeholder="场景状态"
        clearable
        @change="getSceneList('search')"
      >
        <el-option
          v-for="(item,index) in sceneStatusList"
          :key="index"
          :label="item.DIM_NAME"
          :value="item.DIM_ID"
        ></el-option>
      </el-select>
      <el-input
        @keyup.enter.native="getSceneList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.scene_id"
        placeholder="场景编码"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-input
        @keyup.enter.native="getSceneList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.scene_name"
        placeholder="场景名称"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-button type="primary" @click="getSceneList('search')" size="mini">查询</el-button>
      <div class="btn-group">
        <el-button class="margin-r" type="primary" size="mini" @click="add">新增</el-button>
      </div>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        :height="`calc(100vh - ${$TABLEHEIGHT}px)`"
      >
        <el-table-column prop="SCENE_ID" label="场景编码"></el-table-column>
        <el-table-column prop="SCENE_NAME" show-overflow-tooltip label="场景名称"></el-table-column>
        <el-table-column prop="STATUS_NAME" label="场景状态"></el-table-column>
        <el-table-column prop="SCENE_HEAT" label="场景热度"></el-table-column>
        <el-table-column prop="IOP_TYPE_NAME" label="建设主体"></el-table-column>
        <el-table-column prop="CLASS_NAME" width="150" show-overflow-tooltip label="一级场景分类"></el-table-column>
        <el-table-column prop="CLASS_NAME2" width="150" show-overflow-tooltip label="二级场景分类"></el-table-column>
        <el-table-column prop="OPER_DATE" width="150" label="创建时间"></el-table-column>
        <el-table-column prop="OPER_ID" label="操作人"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="updateStatus(scope)">{{getStatus(scope)}}</el-button>
            <el-button type="text" size="mini" v-if="scope.row.STATUS != '1'" @click="del(scope)">删除</el-button>
            <el-button type="text" size="mini" v-else disabled>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <MyPagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :currentPage="page"
        :pageSize="rows"
        :total="total"
      ></MyPagination>
    </div>
    <add ref="add"></add>
  </div>
</template>
<script>
import {
  GetSceneList,
  DoSaveAsSceneStatusInfo,
  DoDelAsSceneInfo
} from "@/api/scenManage.js";
import { GetDicInfo } from "@/api/commonApi.js";
import add from "@/views/customerPortrait/scenManage/add";
export default {
  name: "scenClassManage",
  components: { add },
  data() {
    return {
      maxlength: 50,
      tableData: [],
      total: 0, //总条数
      page: 1,
      rows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      tableLoading: false,
      sceneStatusList: [], //场景状态
      iopTypeList: [], // 建设主体
      serarchCondition: {
        iop_type: "",
        status: "",
        scene_id: "",
        scene_name: ""
      }
    };
  },
  created() {
    this.getSceneList();
    GetDicInfo({
      dic_type: "IOP_TYPE#SCENE_STATUS"
    })
      .then(res => {
        if (res.SUCCESS == "true") {
          this.sceneStatusList = res.SCENE_STATUS;
          this.iopTypeList = res.IOP_TYPE;
        } else {
        }
      })
      .catch(err => {});
  },
  methods: {
    add() {
      // console.log(this.$options.data().serarchCondition);
      this.$refs.add.open("add");
    },
    edit(rowInfo) {
      this.$refs.add.open("edit", rowInfo.row);
    },
    getStatus(scope) {
      if (scope.row.STATUS == "0") {
        return "上线";
      } else if (scope.row.STATUS == "1") {
        return "下线";
      }
    },
    updateStatus(scope) {
      let status = scope.row.STATUS;
      let tmpStatus = "";
      let message = status == "0" ? "上线" : "下线";
      if (status == "0") {
        tmpStatus = "1";
      } else if (status == "1") {
        tmpStatus = "2";
      }
      this.$confirm(
        `[${scope.row.SCENE_ID}]该场景确定是否${message}？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        }
      )
        .then(() => {
          DoSaveAsSceneStatusInfo({
            scene_id: scope.row.SCENE_ID,
            status: tmpStatus
          }).then(res => {
            this.getSceneList();
          });
        })
        .catch(() => {});
    },
    del(scoped) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          DoDelAsSceneInfo({
            scene_id: scoped.row.SCENE_ID
          })
            .then(res => {
              this.getSceneList();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    getSceneList(from) {
      //清空子节点
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.tableLoading = true;
      GetSceneList({
        page: this.page,
        rows: this.rows,
        ...this.serarchCondition
      })
        .then(res => {
          this.tableLoading = false;
          if (res.SUCCESS) {
            this.tableData = res.DATA_LIST;
            this.total = res.TOTAL;
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.rows = val;
      this.getSceneList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getSceneList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
