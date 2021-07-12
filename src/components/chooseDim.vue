<template>
  <el-dialog
    title="选择维层"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="500"
    class="choosedict"
    :before-close="handleClose"
  >
    <div class="content">
      <div class="search">
        <label class="label" for>维层名称</label>
        <el-input size="mini" class="dim-input" v-model="searchKey" placeholder></el-input>
        <el-button size="mini" type="primary" @click="searchData">查询</el-button>
      </div>
      <el-table
        border
        :row-style="iRowStyle"
        :header-row-style="iHeaderRowStyle"
        v-loading="loading"
        :data="dataList"
        :height="300"
        style="width: 100%"
      >
        <el-table-column prop="dimLevelId" label="维层编码"></el-table-column>
        <el-table-column prop="dimLevelName" label="维层名称"></el-table-column>
        <el-table-column prop="dimLevelType" label="维层类型"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button @click="getData(scope.row)" type="text">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import { getDimValueById } from "@/api/portraitManage.js";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      dataList: [],
      searchKey: ""
    };
  },
  methods: {
    openDialog(id) {
      this.dialogVisible = true;
      this.searchData();
    },
    //选择维层，单选
    getData(row) {
      // console.log(JSON.parse(JSON.stringify(this.ruleForm.tableData)));
      this.$emit("getData", row);
      this.handleClose();
    },

    //字典表查询
    searchData() {
      this.loading = true;
      getDimValueById({
        dimLevelName: this.searchKey
      })
        .then(res => {
          this.loading = false;
          this.dataList = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleClose() {
      this.dialogVisible = false;
      this.searchKey = "";
      this.dataList = [];
    },
    iRowStyle: function({ row, rowIndex }) {
      return "height:35px";
    },
    iHeaderRowStyle: function({ row, rowIndex }) {
      return "height:35px";
    }
  }
};
</script>
<style lang="scss" scoped>
.choosedict {
  .content {
    width: 100%;
    height: 100%;
    padding: 20px;
    .search {
      margin-bottom: 20px;
      margin-top: 20px;
      .label {
        font-weight: bold;
        margin-right: 10px;
      }
      .dim-input {
        width: 200px;
        margin-right: 30px;
      }
    }
  }
}
</style>