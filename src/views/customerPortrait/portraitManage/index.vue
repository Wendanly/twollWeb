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
        <el-table-column prop="EIKON_ID" show-overflow-tooltip label="画像编码"></el-table-column>
        <el-table-column prop="EIKON_NAME" show-overflow-tooltip label="画像名称"></el-table-column>
        <el-table-column prop="EIKON_STATUS_NAME" label="画像状态"></el-table-column>
        <el-table-column prop="IOP_TYPE_NAME" label="建设主体"></el-table-column>
        <el-table-column prop="RELEASE_NAME" label="发布状态"></el-table-column>
        <el-table-column width="130" prop="COL23" sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="正序倒序" placement="right">
              <span>营销接触率</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="130" prop="COL29" sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="正序倒序" placement="right">
              <span>营销成功率</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="COL5" sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="正序倒序" placement="right">
              <span>调用次数</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="CNT" sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="正序倒序" placement="right">
              <span>画像规模</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="ES_REL_LIST" label="分类体系">
          <template slot-scope="scope">
            <el-tooltip popper-class="classify" effect="dark" placement="left">
              <div slot="content">
                <el-table :data="scope.row.ES_REL_LIST" style="width: 100%">
                  <el-table-column
                    :disabled="true"
                    width="130"
                    show-overflow-tooltip
                    prop="SCENE_ID"
                    label="场景编码"
                  ></el-table-column>
                  <el-table-column
                    :disabled="true"
                    width="130"
                    show-overflow-tooltip
                    prop="SCENE_NAME"
                    label="场景名称"
                  ></el-table-column>
                </el-table>
              </div>
              <span
                style="font-weight: bold;"
              >{{scope.row.ES_REL_LIST &&scope.row.ES_REL_LIST.length? scope.row.ES_REL_LIST[0].SCENE_NAME:''}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column prop="OPER_ID" label="操作人"></el-table-column>
        <el-table-column prop="OPER_DATE" width="150" label="操作时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="370">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="getStatus(scope,'审批_show')"
              :disabled="getStatus(scope,'审批_dis')"
              @click="goTo(scope,'审批')"
            >审批</el-button>
            <el-button
              type="text"
              size="mini"
              v-else-if="getStatus(scope,'上线_show')"
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
            <el-button type="text" size="mini" @click="goTo(scope,'查看')">查看</el-button>
            <el-button type="text" size="mini" @click="goTo(scope,'版本')">版本</el-button>
            <el-button
              type="text"
              size="mini"
              v-for="(item,index) in btn"
              :key="index"
              :disabled="getStatus(scope,index)"
              @click="goTo(scope,index)"
            >{{index}}</el-button>

            <el-button
              type="text"
              size="mini"
              :disabled="getStatus(scope,'申请_dis')"
              v-if="getStatus(scope,'申请_show')"
              @click="goTo(scope,'申请')"
            >申请</el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="getStatus(scope,'上报_dis')"
              v-else-if="getStatus(scope,'上报_show')"
              @click="goTo(scope,'上报')"
            >上报</el-button>
            <el-button
              type="text"
              size="mini"
              :disabled="getStatus(scope,'互动审批')"
              v-else
              @click="goTo(scope,'互动审批')"
            >互动审批</el-button>
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
    <check ref="check"></check>
  </div>
</template>
<script>
import {
  GetEikonList,
  DoUpdateAsEikonStatus,
  DoDelAsEikonInfo,
  DoSaveAsP2GPortrait,
  DoSaveAsP2GPortraitUp
} from "@/api/portraitManage.js";
import myMixins from "@/mixins/myMixins";
export default {
  name: "portraitManage",
  components: {
    version: () => import(/* webpackChunkName: "version" */ "./version"),
    publish: () => import(/* webpackChunkName: "publish" */ "./publish"),
    check: () => import(/* webpackChunkName: "check" */ "./check")
  },
  mixins: [myMixins],
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
        // 审批: ["002"],
        // 上线: ["502"],
        // 下线: ["102", "112"],
        停用: ["102", "112"],
        编辑: ["002", "112", "012", "102"],
        // 规则: ["102", "002"],
        发布: ["102", "112"],
        删除: ["002", "202", "302", "312"]

        // 申请: ["101"],
        // 上报: ["102", "132"],
        // 互动审批: ["112"]
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
      let row = scope.row;
      let status = row.STATUS + "" + row.IS_RELEASE + "" + row.IOP_TYPE;
      let status1 = row.STATUS + "" + row.CROSS_STATUS + "" + row.IOP_TYPE;
      //因为上线、下线用一个按钮显示，所以单独判断
      if (name == "审批_show") {
        return status == "002" ? true : false;
      }
      if (name == "审批_dis") {
        return status == "002" ? false : true;
      }
      if (name == "上线_show") {
        return status == "502" ? true : false;
      }
      if (name == "上线_dis") {
        return status == "502" ? false : true;
      }
      if (name == "下线") {
        return status == "102" || status == "112" ? false : true;
      }
      //因为申请、上报以及审批用一个按钮显示，所以单独判断
      if (name == "申请_show") {
        return status1 == "101" ? true : false;
      }
      if (name == "申请_dis") {
        return status1 == "101" ? false : true;
      }
      if (name == "上报_show") {
        return status1 == "102" || status1 == "132" ? true : false;
      }
      if (name == "上报_dis") {
        return status1 == "102" || status1 == "132" ? false : true;
      }

      if (name == "互动审批") {
        return status1 == "112" ? false : true;
      }
      return this.btn[name].indexOf(status) > -1 ? false : true;
    },
    goTo(scope, name) {
      let rowInfo = scope.row;
      if (name == "编辑") {
        this.edit(rowInfo);
      } else if (name == "审批") {
        this.$refs.check.open(rowInfo, "5"); //审批时传5，让其上线
        // this.updateStatus(scope, "5", name);
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
      } else if (name == "申请") {
        this.callback(scope, name, DoSaveAsP2GPortrait);
      } else if (name == "上报") {
        this.callback(scope, name, DoSaveAsP2GPortraitUp);
      } else if (name == "互动审批") {
        this.$refs.check.open(rowInfo);
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
            if (res.SUCCESS) {
              this.$message.success(res.MESSAGE);
              return this.getList();
            } else return this.$message.warning(res.MESSAGE);
          });
        })
        .catch(() => {});
    },
    callback(scope, name, funName) {
      this.$confirm(`[${scope.row.EIKON_ID}]该画像确定是否${name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          funName({
            eikon_id: scope.row.EIKON_ID
          }).then(res => {
            if (res.SUCCESS) {
              this.$message.success(res.MESSAGE);
              return this.getList();
            } else return this.$message.warning(res.MESSAGE);
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
    }
    // handleSizeChange(val) {
    //   // console.log(`每页 ${val} 条`);
    //   this.rows = val;
    //   this.getList();
    // },
    // handleCurrentChange(val) {
    //   // console.log(`当前页: ${val}`);
    //   this.page = val;
    //   this.getList();
    // }
  }
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark.classify {
  padding: 0px;
  border: 2px solid #9e9e9e;
}
</style>
