<template>
  <div class="wrap">
    <div class="search">
      <!-- <el-select
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.iop_type"
        placeholder="建设主体"
        clearable
        @change="getList('search')"
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
        @change="getList('search')"
      >
        <el-option
          v-for="(item,index) in sceneStatusList"
          :key="index"
          :label="item.DIM_NAME"
          :value="item.DIM_ID"
        ></el-option>
      </el-select>
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.scene_id"
        placeholder="场景编码"
        clearable
        :maxlength="maxlength"
      ></el-input>-->
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.remark"
        placeholder="服务描述"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-button type="primary" @click="getList('search')" size="mini">查询</el-button>
      <!-- <div class="btn-group">
        <el-button  type="primary" size="mini" @click="add">新增</el-button>
      </div>-->
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        :height="`calc(100vh - ${$TABLEHEIGHT}px)`"
      >
        <el-table-column prop="APP_ID" label="服务编码"></el-table-column>
        <el-table-column prop="STATUS_NAME">
          <template slot-scope="scope">
            <span :class="[scope.row.STATUS != '1'?'':'run']">{{scope.row.STATUS_NAME}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="服务描述"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="updateStatus(scope)"
              :class="[scope.row.STATUS == '1'?'stop':'run']"
            >{{scope.row.STATUS == '1'?'停用':'启用'}}</el-button>
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
  </div>
</template>
<script>
import {
  GetQueryAuthList,
  DoUpdateAsAuthStatus
} from "@/api/portraitExternalService.js";
export default {
  name: "serviceAuth",
  components: {},
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
      let message = status == "1" ? "停用" : "启用";
      if (status == "0") {
        tmpStatus = "1";
      } else if (status == "1") {
        tmpStatus = "0";
      }
      this.$confirm(`[${scope.row.APP_ID}]该服务确定是否${message}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          DoUpdateAsAuthStatus({
            app_id: scope.row.APP_ID,
            status: tmpStatus
          }).then(res => {
            if (res.SUCCESS) {
              this.$message.success(res.MESSAGE);
              this.getList();
            } else {
              this.$message.warning(res.MESSAGE);
            }
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
      GetQueryAuthList({
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
.stop {
  color: red;
}
.run {
  color: #27e227;
}
</style>
