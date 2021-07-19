<template>
  <div class="wrap">
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        :max-height="`calc(100vh - ${$TABLEHEIGHT}px)`"
      >
        <el-table-column width="60">
          <template slot-scope="scope">
            <div :class="[scope.row.STATUS != '1'?'warning':'']"></div>
          </template>
        </el-table-column>
        <el-table-column prop="APP_ID" label="服务编码"></el-table-column>
        <el-table-column prop="STATUS_NAME">
          <template slot-scope="scope">
            <span :class="[scope.row.STATUS != '1'?'':'run']">{{scope.row.STATUS_NAME}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="REMARK" show-overflow-tooltip label="服务描述"></el-table-column>
        <!-- <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="updateStatus(scope)">{{getStatus(scope)}}</el-button>
            <el-button type="text" size="mini" v-if="scope.row.STATUS != '1'" @click="del(scope)">删除</el-button>
            <el-button type="text" size="mini" v-else disabled>删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <!-- <MyPagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :currentPage="page"
        :pageSize="rows"
        :total="total"
      ></MyPagination>-->
    </div>
    <div id="box" class="box"></div>
    <div class="headerBox"></div>
  </div>
</template>
<script>
import {
  GetQueryServeMonitorList
} from "@/api/portraitExternalService.js";
import { groupByType } from "@/libs/tools.js";
import * as echarts from "echarts";
export default {
  name: "serviceMonitor",
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
        log_time: "",
        remark: ""
      },
      index: null
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
      let message = status == "0" ? "上线" : "下线";
      if (status == "0") {
        tmpStatus = "1";
      } else if (status == "1") {
        tmpStatus = "2";
      }
      this.$confirm(
        `[${scope.row.SCENE_ID}]该场景确定是否${message}？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        }
      )
        .then(() => {
          DoSaveAsSceneStatusInfo({
            scene_id: scope.row.SCENE_ID,
            status: tmpStatus
          }).then(res => {
            this.getList();
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
      GetQueryServeMonitorList({
        // page: this.page,
        // rows: this.rows,
        // ...this.serarchCondition
      })
        .then(res => {
          this.tableLoading = false;
          if (res.SUCCESS) {
            this.tableData = res.DATA_LIST;
            this.chart(groupByType(res.PIC_LIST, "APP_ID"));
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    chart(list) {
      //初始化ehcharts实例
      var myChart = echarts.init(document.getElementById("box"));
      let legendData = list.map(o => o.name);
      let xAxisData = list[0].data.map(o => o.STAT_DATE);
      let seriesData = [];
      list.map(o => {
        let data = [];
        o.data.map(m => data.push(m.CNT));
        seriesData.push({
          name: o.name,
          type: "line",
          stack: "总量",
          data
        });
      });

      //指定图表的配置项和数据
      var option = {
        title: {
          // text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legendData
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: seriesData
      };
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option);
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
.box {
  margin-top: 20px;
  height: 400px;
  width: 100%;
}
.run {
  color: #27e227;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  15% {
    opacity: 0.8;
  }
  25% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  75% {
    opacity: 0.7;
  }
  85% {
    opacity: 0.8;
  }
  to {
    opacity: 1;
  }
}
.warning {
  background: #e67575;
  height: 40px;
  border-radius: 50%;
  animation: fade 600ms infinite;
  width: 20px;
  height: 20px;
}
</style>
