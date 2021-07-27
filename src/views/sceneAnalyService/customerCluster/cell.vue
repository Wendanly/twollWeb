<template>
  <div class="pane">
    <label style="margin-right:10px">标签类型</label>
    <el-radio-group v-if="value == '1'" v-model="model" @change="getSubjectAnalyzeGCList">
      <el-radio
        :label="item.GROUP_NAME"
        v-for="(item,index) in list"
        :key="index"
      >{{item.GROUP_NAME}}</el-radio>
    </el-radio-group>
    <el-checkbox-group
      style="display: inline-block;"
      :max="2"
      v-else
      v-model="checkList"
      @change="getSubjectAnalyzeJZList"
    >
      <el-checkbox
        :label="item.GROUP_NAME"
        v-for="(item,index) in list"
        :key="index"
      >{{item.GROUP_NAME}}</el-checkbox>
    </el-checkbox-group>
    <div class="content">
      <div v-loading="loading1" id="box1" class="box"></div>
      <div v-loading="loading2" id="box2" class="box"></div>
    </div>
    <el-table height="100%" class="mytable" ref="table" :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item,index) in colList"
        :key="index"
        :prop="item.prop"
        show-overflow-tooltip
        :width="item.label.length >4?'140':''"
        :label="item.label"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  GetAnalyzeIndexInfo,
  GetSubjectAnalyzeGCList,
  GetSubjectAnalyzeJZList
} from "@/api/customerCluster.js";
import { groupByType } from "@/libs/tools.js";
import * as echarts from "echarts";
export default {
  name: "cell",
  components: {},
  props: {
    value: {
      default: "1",
      type: String
    },
    subject_id: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      tableData: [],
      colList: [],
      loading1: false,
      loading2: false,
      list: [],
      model: "",
      checkList: []
    };
  },

  watch: {
    value: {
      handler(val) {
        this.getAnalyzeIndexInfo(val);
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    getAnalyzeIndexInfo(val) {
      GetAnalyzeIndexInfo({
        m_id: this.value
      })
        .then(res => {
          if (res.SUCCESS) {
            this.list = res.DATA_INFO;
            if (res.DATA_INFO.length) {
              //构成
              if (val == "1") {
                this.model = this.list[0].GROUP_NAME;
                this.getSubjectAnalyzeGCList(this.model);
              } else {
                //矩阵
                if (res.DATA_INFO.length >= 2) {
                  this.checkList[0] = this.list[0].GROUP_NAME;
                  this.checkList[1] = this.list[1].GROUP_NAME;
                  this.getSubjectAnalyzeJZList(this.checkList);
                } else {
                  this.$message.warning("数据错误！");
                }
              }
            } else {
              this.$message.warning("数据错误！");
            }
          }
        })
        .catch(err => {});
    },
    setLoading(flag) {
      this.loading1 = flag;
      this.loading2 = flag;
    },
    getSubjectAnalyzeGCList(group_name) {
      this.setLoading(true);
      GetSubjectAnalyzeGCList({
        group_name,
        subject_id: this.subject_id
      })
        .then(res => {
          this.setLoading(false);
          if (res.SUCCESS) {
            if (res.DATA_INFO.length) {
              this.chart1("box1", res.DATA_INFO);
              this.chart1("box2", res.DATA_INFO);
            } else {
              this.$message.warning("数据错误！");
            }
          }
        })
        .catch(err => {
          this.setLoading(false);
        });
    },
    getSubjectAnalyzeJZList(group_name) {
      if (group_name.length != 2) return;
      this.setLoading(true);
      GetSubjectAnalyzeJZList({
        group_name1: group_name[0],
        group_name2: group_name[1],
        subject_id: this.subject_id
      })
        .then(res => {
          this.setLoading(false);
          if (res.SUCCESS) {
            if (res.DATA_INFO.length) {
              this.chart2("box1", res.DATA_INFO);
              this.chart2("box2", res.DATA_INFO);
            } else {
              this.$message.warning("数据错误！");
            }
          }
        })
        .catch(err => {
          this.setLoading(false);
        });
    },
    chart1(id, list) {
      //初始化ehcharts实例
      var myChart = echarts.init(document.getElementById(id));
      let option = id == "box1" ? this.getOption1(list) : this.getOption2(list);
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option, true);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    chart2(id, list) {
      //初始化ehcharts实例
      var myChart = echarts.init(document.getElementById(id));
      list = groupByType(list, "B_NAME");
      // console.log(list);
      let legendData = list.map(o => o.name);
      let xAxisData = list[0].data.map(o => o.A_NAME);
      let seriesData = [];
      list.map(o => {
        let data = [];
        o.data.map(m => data.push(m.CNT));
        seriesData.push({
          name: o.name,
          type: id == "box1" ? "bar" : "line",
          data
        });
      });
      let _this = this;
      var option = {
        title: {
          // text: ""
          // show: false
        },
        toolbox: {
          show: id == "box1" ? true : false,
          top: 20,
          right: 20,
          feature: {
            // dataZoom: {
            //   yAxisIndex: "none"
            // },
            dataView: {
              readOnly: true,
              lang: ["数据视图", "关闭", ""],
              optionToContent: opt => {
                _this.transData(opt);
                return _this.$refs.table.$el;
              }
            }
          }
        },
        grid: {
          bottom: "1%",
          containLabel: true
        },
        legend: {
          data: legendData,
          type: "scroll"
        },
        tooltip: {
          trigger: "axis",
          appendToBody: true,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          name: this.checkList[0],
          type: "category",
          axisLabel: { interval: 0, rotate: 40 },
          data: xAxisData
        },
        yAxis: {
          // name: this.checkList[0],
          type: "value"
        },
        series: seriesData
      };
      console.log(option);
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option, true);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    transData(opt) {
      var axisData = opt.xAxis[0].data; //维度
      let axisName = opt.xAxis[0].name; //第一列
      var series = opt.series; //第二列及之后
      let colList = [];
      let tableData = [];
      colList.push({
        prop: axisName,
        label: axisName
      });
      series.map(o => colList.push({ prop: o.name, label: o.name }));
      console.log(colList); //列头
      axisData.map((o, j) => {
        let obj = {};
        colList.map((m, n) =>
          n == 0 ? (obj[m.prop] = o) : (obj[m.prop] = series[n - 1].data[j])
        );
        tableData.push(obj);
      });
      this.colList = colList;
      this.tableData = tableData;
      console.log(tableData); //数据
    },
    getOption1(list) {
      let xAxisData = [];
      let seriesData = [];
      let data = [];
      list.map(o => {
        xAxisData.push(o.NAME);
        data.push(o.VAL);
      });
      seriesData.push({
        type: "bar",
        data
      });
      //指定图表的配置项和数据
      var option = {
        title: {
          // text: ""
          // show: false
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          axisLabel: { interval: 0, rotate: 40 },
          data: xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: seriesData
      };
      return option;
    },
    getOption2(list) {
      let seriesData = [];
      let data = [];
      list.map(o => {
        data.push({
          value: o.VAL,
          name: o.NAME
        });
      });
      seriesData.push({
        // name: "访问来源",
        type: "pie",
        radius: "50%",
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }); //指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "horizontal"
          // right: "right"
        },
        series: seriesData
      };
      return option;
    }
  }
};
</script>

<style lang="scss" scoped>
.pane {
  height: 100%;
  width: 100%;
  padding-top: 10px;
  .content {
    height: calc(100% - 16px);
    display: flex;
    .box {
      height: 100%;
      flex: 1;
    }
  }
}
</style>
