<template>
  <div class="wrap">
    <div class="search">
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.subject_id"
        placeholder="客户群编码"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.subject_name"
        placeholder="客户群名称"
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
        <el-table-column prop="SUBJECT_ID" show-overflow-tooltip label="客户群编码"></el-table-column>
        <el-table-column prop="SUBJECT_NAME" show-overflow-tooltip label="客户群名称"></el-table-column>
        <el-table-column prop="FRAME_NAME" show-overflow-tooltip label="分析主体"></el-table-column>
        <el-table-column prop="CYCLE_NAME" show-overflow-tooltip label=" 周期"></el-table-column>
        <el-table-column prop="BEGIN_DATE" show-overflow-tooltip label="开始时间"></el-table-column>
        <el-table-column prop="END_DATE" show-overflow-tooltip label="结束时间"></el-table-column>
        <el-table-column prop="CNT" show-overflow-tooltip label="规模"></el-table-column>
        <el-table-column prop="BUS_INFO" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="OPER_ID" show-overflow-tooltip label="操作人"></el-table-column>
        <el-table-column prop="CREATE_TIME" show-overflow-tooltip label="创建时间"></el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="view(scope)">查看</el-button>
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
import { GetMySubjectList } from "@/api/customerCluster.js";
export default {
  name: "customerCluster",
  components: {
    add: () => import("./add")
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
        subject_id: "",
        subject_name: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    view(rowInfo) {
      this.$refs.add.open(rowInfo.row);
    },
    getList(from) {
      //清空子节点
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.tableLoading = true;
      GetMySubjectList({
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
