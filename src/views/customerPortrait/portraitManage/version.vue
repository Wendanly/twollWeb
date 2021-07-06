<template>
  <el-dialog
    :destroy-on-close="true"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <div class="dia-wrap">
      <div class="table">
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="EIKON_ID" label="画像编码"></el-table-column>
          <el-table-column prop="EIKON_NAME" show-overflow-tooltip label="画像名称"></el-table-column>
          <el-table-column prop="EIKON_STATUS_NAME" width="80" label="画像状态"></el-table-column>
          <el-table-column prop="IOP_TYPE_NAME" width="80" label="建设主体"></el-table-column>
          <el-table-column prop="RELEASE_NAME" width="80" label="发布状态"></el-table-column>
          <el-table-column prop="REMARK" show-overflow-tooltip label="备注"></el-table-column>
          <el-table-column prop="OPER_ID" width="80" label="操作人"></el-table-column>
          <el-table-column prop="OPER_DATE" width="170" label="操作时间"></el-table-column>
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
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { GetEikonVersionList } from "@/api/portraitManage.js";
export default {
  name: "version",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      tableLoading: false,
      title: "版本",
      formLoading: false,
      formData: {
        eikon_name: "",
        remark: ""
      },
      loading: false,
      tableData: [],
      total: 0, //总条数
      page: 1,
      rows: this.$PAGE_SIZES[0] // 初始化每页展示多少条
    };
  },
  inject: ["getParentList"],
  methods: {
    open(rowInfo) {
      this.eikon_id = rowInfo.EIKON_ID;
      this.getList(this.eikon_id);
      this.dialogFormVisible = true;
    },
    getList(eikon_id) {
      this.tableLoading = true;
      GetEikonVersionList({
        page: this.page,
        rows: this.rows,
        eikon_id
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
    close() {
      this.dialogFormVisible = false;
      this.reset();
    },
    reset() {
      this.page = 1;
      this.rows = this.$PAGE_SIZES[0];
      this.eikon_id = undefined;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.rows = val;
      this.getList(this.eikon_id);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getList(this.eikon_id);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
}
</style>
