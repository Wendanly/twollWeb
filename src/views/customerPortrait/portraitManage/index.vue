<template>
  <div class="wrap">
    <div class="search">
      <el-input
        @keyup.enter.native="getSceneList('search')"
        class="fuzzy-query"
        size="mini"
        v-model="serarchCondition.eikon_name"
        placeholder="画像名称"
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
        <el-table-column prop="EIKON_ID" label="画像编码"></el-table-column>
        <el-table-column prop="EIKON_NAME" label="画像名称"></el-table-column>
        <el-table-column prop="EIKON_STATUS_NAME" label="画像状态"></el-table-column>
        <el-table-column prop="IOP_TYPE_NAME" label="建设主体"></el-table-column>
        <el-table-column prop="RELEASE_NAME" label="发布状态"></el-table-column>
        <el-table-column prop="REMARK" label="备注"></el-table-column>
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
    <add ref="add"></add>
  </div>
</template>
<script>
import { GetEikonList } from "@/api/portraitManage.js";
import add from "@/views/customerPortrait/scenManage/add";
export default {
  name: "portraitManage",
  components: { add },
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
        规则: ["00", "10"],
        发布: ["10", "11"],
        删除: ["00", "20", "30", "31"],
        详情: ["00", "10", "20", "30", "11", "21", "31"]
      }
    };
  },
  created() {
    this.getEikonList();
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
      //

      return this.btn[name].indexOf(status) > -1 ? false : true;
    },
    goTo(scope, name) {
      console.log(scope.row, name);
    },
    add() {
      // console.log(this.$options.data().serarchCondition);
      this.$refs.add.open("add");
    },
    edit(rowInfo) {
      this.$refs.add.open("edit", rowInfo.row);
    },
    updateStatus(scope) {
      DoSaveAsSceneStatusInfo({
        scene_id: scope.row.SCENE_ID,
        status: scope.row.STATUS
      }).then(res => {
        this.getSceneList();
      });
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
    getEikonList(from) {
      //清空子节点
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
            this.tableData = [
              {
                EIKON_ID: "00",
                STATUS: "0",
                IS_RELEASE: "0"
              },
              {
                EIKON_ID: "11",
                STATUS: "1",
                IS_RELEASE: "0"
              },
              {
                EIKON_ID: "22",
                STATUS: "2",
                IS_RELEASE: "0"
              },
              {
                EIKON_ID: "33",
                STATUS: "3",
                IS_RELEASE: "0"
              },
              {
                EIKON_ID: "111",
                STATUS: "1",
                IS_RELEASE: "1"
              },
              {
                EIKON_ID: "222",
                STATUS: "2",
                IS_RELEASE: "1"
              },
              {
                EIKON_ID: "333",
                STATUS: "3",
                IS_RELEASE: "1"
              },
              {
                EIKON_ID: "2222222",
                STATUS: "0",
                IS_RELEASE: "1"
              }
            ];
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
