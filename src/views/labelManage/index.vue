<template>
  <div class="wrap">
    <div class="search">
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.label_id"
        placeholder="标签编码"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.label_name"
        placeholder="标签名称"
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
        <el-table-column prop="LABEL_ID" show-overflow-tooltip label="标签编码"></el-table-column>
        <el-table-column prop="LABEL_NAME" show-overflow-tooltip label="标签名称"></el-table-column>
        <el-table-column prop="LABEL_TYPE" show-overflow-tooltip label="标签类型"></el-table-column>
        <el-table-column prop="CLASS_ID" show-overflow-tooltip label="分类编码"></el-table-column>
        <el-table-column prop="LABEL_RATE" show-overflow-tooltip label="更新频率"></el-table-column>
        <el-table-column prop="CREATE_DATE" show-overflow-tooltip label="创建时间"></el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="标签描述"></el-table-column>
        <el-table-column prop="RULE_INFO" show-overflow-tooltip label="标签规则"></el-table-column>
        <el-table-column prop="STAT_DATE" show-overflow-tooltip label="最新周期"></el-table-column>
        <el-table-column prop="LABEL_RES" show-overflow-tooltip label="数据来源"></el-table-column>
        <el-table-column prop="STATUS_NAME" show-overflow-tooltip label="标签状态"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="apply(scope)">申请</el-button>
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
    <!-- <add ref="add"></add> -->
  </div>
</template>
<script>
import { DoSaveAsp2GPortraitResult, GetLabelList } from "@/api/labelManage.js";
export default {
  name: "labelManage",
  components: {
    // add: () => import("./add")
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
        label_id: "",
        label_name: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    apply(scope) {
      let rowInfo = scope.row;
      this.$confirm(`[${rowInfo.LABEL_ID}]该服务确定是否申请？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          DoSaveAsp2GPortraitResult({
            label_id: rowInfo.LABEL_ID
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
    getList(from) {
      //清空子节点
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.tableLoading = true;
      GetLabelList({
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
