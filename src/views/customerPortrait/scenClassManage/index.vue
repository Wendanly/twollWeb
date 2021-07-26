<template>
  <div class="wrap">
    <div class="search">
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="class_name"
        placeholder="一级场景分类名称"
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
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="expandChange"
        :cell-class-name="'custom-cell'"
        :header-cell-class-name="'custom-header'"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.children" v-loading="childLoading" class="two-list">
              <el-table-column align="center" label="序号" width="55">
                <template slot-scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="CLASS_ID" label="二级场景分类编码"></el-table-column>
              <el-table-column prop="CLASS_NAME" label="二级场景分类名称"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="childrenEdit(scope)">编辑</el-button>
                  <el-button type="text" size="mini" @click="del(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <MyPagination
              @size-change="childHandleSizeChange"
              @current-change="childHandleCurrentChange"
              :currentPage="childrenPage"
              :pageSize="childrenRows"
              :total="childTotal"
            ></MyPagination>
          </template>
        </el-table-column>
        <el-table-column prop="CLASS_ID" label="一级场景分类编码"></el-table-column>
        <el-table-column prop="CLASS_NAME" label="一级场景分类名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="childrenAdd(scope)">新增</el-button>
            <el-button type="text" size="mini" @click="edit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="del(scope)">删除</el-button>
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
  GetSceneClassList,
  DoDelAsSceneClassInfo
} from "@/api/scenClassManage.js";
export default {
  name: "scenClassManage",
  components: {
    add: () => import(/* webpackChunkName : "scenClassManageAdd" */ "./add")
  },
  data() {
    return {
      class_name: "",
      tableData: [],
      total: 0, //总条数
      page: 1,
      rows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      serarchCondition: {},
      tableLoading: false,
      getRowKeys(row) {
        return row.CLASS_ID;
      },
      childTotal: 0, //子表格总条数
      childLoading: false,
      expands: [],
      childrenRows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      childrenPage: 1
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
      this.$refs.add.open("add");
    },
    childrenAdd(scope) {
      this.$refs.add.open("childrenAdd", scope.row);
    },
    edit(rowInfo) {
      this.$refs.add.open("edit", rowInfo.row);
    },
    childrenEdit(rowInfo) {
      this.$refs.add.open("childrenEdit", rowInfo.row);
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
          DoDelAsSceneClassInfo({
            class_id: scoped.row.CLASS_ID
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
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getList(from) {
      //清空子节点
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.clearChildrenNode();
      this.tableLoading = true;
      GetSceneClassList({
        page: this.page,
        rows: this.rows,
        class_level: 1,
        class_name: this.class_name
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
    },
    //清空子节点
    clearChildrenNode() {
      this.expands = []; //全部清空
      //全部清空
      this.tableData.map((o, j) => {
        o.children ? delete o.children : "";
        this.$set(this.tableData, j, o);
      });
    },
    expandChange(row, expandedRows) {
      //expandedRows 当前一共展开的行，为list
      // console.log(row, expandedRows);
      // console.log(row)

      var that = this;
      this.clearChildrenNode();
      if (expandedRows.length) {
        // 只展开一行//说明展开了
        if (row) {
          that.expands.push(row.CLASS_ID); // 只展开当前行id
        }
        this.filterRowkey(row.CLASS_ID);
        //  this.tablaData(row.eqId)  这里可以调用接口数据渲染
      } else {
        // 说明收起了
      }
    },
    filterRowkey(CLASS_ID) {
      this.tableData.filter((o, j) => {
        if (o.CLASS_ID == CLASS_ID) {
          this.getChildData(CLASS_ID).then(res =>
            this.$set(this.tableData[j], "children", res)
          );
        }
      });
    },
    getChildData(val) {
      return new Promise((resolve, reject) => {
        this.childLoading = true;
        GetSceneClassList({
          page: this.childrenPage,
          rows: this.childrenRows,
          class_level: 2,
          per_class_id: val
        })
          .then(res => {
            this.childLoading = false;
            if (res.SUCCESS) {
              resolve(res.DATA_LIST);
              this.childTotal = res.TOTAL;
            } else {
              this.$message.warning(res.MESSAGE);
            }
          })
          .catch(err => {
            this.childLoading = false;
          });
      });
    },
    //子表格
    childHandleSizeChange(val) {
      this.childrenRows = val;
      this.filterRowkey(this.expands[0]);
    },
    childHandleCurrentChange(val) {
      this.childrenPage = val;
      this.filterRowkey(this.expands[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
