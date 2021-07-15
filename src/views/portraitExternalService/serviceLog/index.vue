<template>
  <div class="wrap">
    <div class="search">
      <el-date-picker
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        size="mini"
        v-model="serarchCondition.log_time"
        type="date"
        placeholder="日志时间"
      ></el-date-picker>
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.remark"
        placeholder="应用服务描述"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-button type="primary" @click="getList('search')" size="mini">查询</el-button>
      <!-- <div class="btn-group">
        <el-button type="primary" size="mini" @click="add">新增</el-button>
      </div>-->
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        :height="`calc(100vh - ${$TABLEHEIGHT}px)`"
      >
        <el-table-column prop="LOG_ID" show-overflow-tooltip label="日志编码"></el-table-column>
        <el-table-column prop="LOG_TIME" show-overflow-tooltip label="日志时间"></el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="应用服务描述"></el-table-column>
        <el-table-column prop="CLIENT_ID" show-overflow-tooltip label="客户端地址"></el-table-column>
        <el-table-column prop="QUERY_VAL" show-overflow-tooltip label=" 查询参数"></el-table-column>
        <el-table-column prop="MESSAGE" show-overflow-tooltip label="查询结果"></el-table-column>

        <!-- <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="updateStatus(scope)">{{getStatus(scope)}}</el-button>
            <el-button type="text" size="mini" v-if="scope.row.STATUS != '1'" @click="del(scope)">删除</el-button>
            <el-button type="text" size="mini" v-else disabled>删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <MyPagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :currentPage="page"
        :pageSize="rows"
        :total="total"
      ></MyPagination>
    </div>
  </div>
</template>
<script>
import {
  // GetQueryAuthList,
  GetQueryServeLogList
} from "@/api/portraitExternalService.js";
export default {
  name: "serviceLog",
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
        log_time: "",
        remark: ""
      }
    };
  },
  provide() {
    return {
      getParentList: this.getList
    };
  },
  created() {
    this.getList();
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
            this.getList();
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
              this.getList();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    getList(from) {
      //清空子节点
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.tableLoading = true;
      GetQueryServeLogList({
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
      this.getList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
