<template>
  <div class="wrap">
    <div class="search">
      <el-input
        @keyup.enter.native="getList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.eikon_name"
        placeholder="画像名称"
        clearable
        :maxlength="maxlength"
      ></el-input>
      <el-button type="primary" @click="getList('search')" size="mini">查询</el-button>
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
        <el-table-column prop="EIKON_ID" label="画像编码"></el-table-column>
        <el-table-column prop="EIKON_NAME" label="画像名称"></el-table-column>
        <el-table-column prop="EIKON_STATUS_NAME" label="画像状态"></el-table-column>
        <el-table-column prop="IOP_TYPE_NAME" label="建设主体"></el-table-column>
        <el-table-column prop="RELEASE_NAME" label="发布状态"></el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="OPER_ID" label="操作人"></el-table-column>
        <el-table-column prop="OPER_DATE" label="操作时间"></el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="getStatus(scope,'上线_show')"
              :disabled="getStatus(scope,'上线_dis')"
              @click="goTo(scope,'上线')"
            >上线</el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="getStatus(scope,'下线')"
              v-else
              @click="goTo(scope,'下线')"
            >下线</el-button>
            <el-button
              type="text"
              size="mini"
              v-for="(item,index) in btn"
              :key="index"
              :disabled="getStatus(scope,index)"
              @click="goTo(scope,index)"
            >{{index}}</el-button>
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
    <version ref="version"></version>
    <publish ref="publish"></publish>
  </div>
</template>
<script>
import {
  GetEikonList,
  DoUpdateAsEikonStatus,
  DoDelAsEikonInfo
} from "@/api/portraitManage.js";
export default {
  name: "portraitManage",
  components: {
    version: () => import("./version"),
    publish: () => import("./publish")
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
        eikon_name: ""
      },
      btn: {
        // 上线: ["00"],
        // 下线: ["10", "11"],
        停用: ["10", "11"],
        编辑: ["00", "10", "11"],
        查看: ["00", "10", "20", "30", "11", "21", "31"],
        版本: ["00", "10"],
        发布: ["10", "11"],
        删除: ["00", "20", "30", "31"]
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
    getStatus(scope, name) {
      let status = scope.row.STATUS + "" + scope.row.IS_RELEASE;
      //因为上线下线用一个按钮显示，所以单独判断
      if (name == "上线_show") {
        return status == "00" ? true : false;
      }
      if (name == "上线_dis") {
        return status == "00" ? false : true;
      }
      if (name == "下线") {
        return status == "10" || status == "11" ? false : true;
      }
      return this.btn[name].indexOf(status) > -1 ? false : true;
    },
    goTo(scope, name) {
      let rowInfo = scope.row;
      if (name == "编辑") {
        this.edit(rowInfo);
      } else if (name == "上线") {
        this.updateStatus(scope, "1", name);
      } else if (name == "下线") {
        this.updateStatus(scope, "3", name);
      } else if (name == "停用") {
        this.updateStatus(scope, "2", name);
      } else if (name == "版本") {
        this.$refs.version.open(rowInfo);
      } else if (name == "发布") {
        this.$refs.publish.open(rowInfo);
      } else if (name == "删除") {
        this.del(rowInfo);
      } else if (name == "查看") {
        this.edit(rowInfo, "isShow");
      }
    },
    add() {
      this.$router.push({
        path: "/portraitManageAdd",
        query: {
          eikon_id: ""
        }
      });
    },
    edit(rowInfo, flag) {
      this.$router.push({
        path: "/portraitManageAdd",
        query: {
          eikon_id: rowInfo.EIKON_ID,
          isShow: flag == "isShow" ? "isShow" : ""
        }
      });
      // this.$refs.add.open("edit", rowInfo);
    },
    updateStatus(scope, status, name) {
      this.$confirm(`[${scope.row.EIKON_ID}]该画像确定是否${name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          DoUpdateAsEikonStatus({
            eikon_id: scope.row.EIKON_ID,
            status
          }).then(res => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    del(rowInfo) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          DoDelAsEikonInfo({
            eikon_id: rowInfo.EIKON_ID
          })
            .then(res => {
              this.getList();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    getList(from) {
      if (from == "search") {
        this.page = 1;
        this.rows = this.$PAGE_SIZES[0];
      }
      this.tableLoading = true;
      GetEikonList({
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
