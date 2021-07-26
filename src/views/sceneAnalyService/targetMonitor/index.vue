<template>
  <div class="wrap">
    <div class="search">
      <MyInput
        @keyup.enter.native="getList('search')"
        placeholder="指标编码"
        v-model="serarchCondition.rta_id"
      ></MyInput>
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.rta_name"
        placeholder="指标名称"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-button type="primary" @click="getList('search')" size="mini">查询</el-button>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="add">新增</el-button>
      </div>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        :height="`calc(100vh - ${$TABLEHEIGHT}px)`"
      >
        <el-table-column prop="RTA_ID" show-overflow-tooltip label="指标编码"></el-table-column>
        <el-table-column prop="RTA_NAME" show-overflow-tooltip label="指标名称"></el-table-column>
        <el-table-column prop="SYMBOL_NAME" show-overflow-tooltip label="符号"></el-table-column>
        <el-table-column prop="THRESHOLD_VAL" show-overflow-tooltip label=" 阈值"></el-table-column>
        <el-table-column prop="RTA_CNT" show-overflow-tooltip label="客群数量"></el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="OPER_DATE" show-overflow-tooltip label="创建时间"></el-table-column>
        <el-table-column prop="OPER_ID" show-overflow-tooltip label="创建人"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="del(scope)">删除</el-button>
            <el-button type="text" size="mini" @click="edit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="analysis(scope)">分析</el-button>
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
import { GetRtaSubjectList, DoDelAsRtaSubject } from "@/api/targetMonitor.js";
export default {
  name: "targetMonitor",
  components: {
    add: () => import(/* webpackChunkName : 'targetMonitorAdd'*/ "./add")
  },
  data() {
    return {
      maxlength: 50,
      tableData: [],
      total: 0, //总条数
      page: 1,
      rows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      tableLoading: false,
      serarchCondition: {
        rta_id: "",
        rta_name: ""
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
    analysis(scope) {
      this.$router.push({
        path: "/targetMonitor/analysis",
        query: {
          rta_id: scope.row.RTA_ID,
          symbol: scope.row.SYMBOL,
        }
      });
    },
    add() {
      this.$refs.add.open("add");
    },
    edit(rowInfo) {
      this.$refs.add.open("edit", rowInfo.row);
    },
    getList(from) {
      //清空子节点
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.tableLoading = true;
      GetRtaSubjectList({
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
    del(scoped) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      }).then(() => {
        DoDelAsRtaSubject({
          rta_id: scoped.row.RTA_ID
        })
          .then(res => {
            if (res.SUCCESS) {
              this.$message.success(res.MESSAGE);
              this.getList();
            } else {
              this.$message.warning(res.MESSAGE);
            }
          })
          .catch(err => {});
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
