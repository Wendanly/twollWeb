<template>
  <div class="edit-page">
    <BackTip content="分析"></BackTip>
    <div class="wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="构成分析" name="1">
          <cell v-if="activeName == '1'" value="1" :subject_id="subject_id"></cell>
        </el-tab-pane>
        <el-tab-pane label="矩阵分析" name="2">
          <cell v-if="activeName == '2'" value="2" :subject_id="subject_id"></cell>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <div class="foot">
      <el-button size="mini" @click="close">取消</el-button>
    </div>-->
  </div>
</template>
<script>
import { groupByType } from "@/libs/tools.js";
import * as echarts from "echarts";
export default {
  name: "customerClusterAnalysis",
  components: {
    cell: () => import(/*webpackChunkName:'cell'*/ "./cell")
  },
  data() {
    return {
      loading: false,
      loading2: false,
      activeName: "1",
      subject_id: ""
    };
  },
  created() {
    this.subject_id = this.$route.query.subject_id; //,
    this.symbol = this.$route.query.symbol; //,
    this.whitchBox = 1;
    // this.getRtaPicInfo({
    //   pic_type: "1",
    //   rta_id: this.rta_id
    // });
  },
  methods: {
    handleClick(val) {},
    getRtaPicInfo(params) {
      this.setLoading(true);
      GetRtaPicInfo(params)
        .then(res => {
          this.setLoading(false);
          if (res.SUCCESS) {
            if (res.DATA_INFO.length) {
              this.chart(res.DATA_INFO, res.TH_INFO.THRESHOLD_VAL);
            } else {
              this.$message.warning("数据错误！");
            }
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.setLoading(false);
        });
    },
    setLoading(flag) {
      this.whitchBox == 1 ? (this.loading = flag) : (this.loading2 = flag);
    },
    box(list, threshold) {
      let legendData = list.map(o => o.SUBJECT_ID);
      let xAxisData = [list[0].STAT_DATE];
      let seriesData = [];
      let max = 0;
      list.map(o => {
        Number(o.CNT) > max ? (max = Number(o.CNT)) : "";
        let show = eval(
          ` ${o.CNT}  ${this.symbolMap(this.symbol)}${threshold}`
        );
        seriesData.push({
          name: o.SUBJECT_ID,
          type: "bar",
          data: [
            {
              value: o.CNT,
              label: {
                show,
                position: "top",
                formatter: ["{a|●}"].join("\n"),
                rich: {
                  a: {
                    color: "red",
                    fontSize: 18

                    // lineHeight: 10
                  }
                },
                tooltip: {
                  formatter: "告警"
                }
              }
            }
          ]
        });
      });
      return {
        legendData,
        xAxisData,
        seriesData,
        max
      };
    },
    box2(list, threshold) {
      let legendData = [list[0].SUBJECT_ID];
      let xAxisData = list.map(o => o.STAT_DATE);
      let seriesData = [];
      let max = 0;
      let data = [];
      list.map(o => {
        Number(o.CNT) > max ? (max = Number(o.CNT)) : "";
        let show = eval(
          ` ${o.CNT}  ${this.symbolMap(this.symbol)}${threshold}`
        );
        data.push({
          value: o.CNT,
          label: {
            show,
            position: "top",
            formatter: ["{a|●}"].join("\n"),
            rich: {
              a: {
                color: "red",
                fontSize: 18
                // lineHeight: 10
              }
            }
          }
        });
      });
      seriesData.push({
        name: legendData[0],
        type: "bar",
        data
      });
      return {
        legendData,
        xAxisData,
        seriesData,
        max
      };
    },
    chart(list, threshold) {
      threshold = Number(threshold);
      let idName = "box";
      if (this.whitchBox == 1) {
        idName = "box";
        var { legendData, xAxisData, seriesData, max } = this.box(
          list,
          threshold
        );
      } else {
        idName = "box2";
        var { legendData, xAxisData, seriesData, max } = this.box2(
          list,
          threshold
        );
      }
      //初始化ehcharts实例
      var myChart = echarts.init(document.getElementById(idName));
      let markLine = {
        data: [{ yAxis: threshold }],
        label: {
          // position: "start",
          formatter: () => "阈值 " + threshold
        }
      };
      seriesData[0].markLine = markLine;
      //指定图表的配置项和数据
      var option = {
        title: {
          text: " "
          // show: false
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legendData
        },
        xAxis: {
          type: "category",
          data: xAxisData
        },
        yAxis: {
          type: "value",
          max: max > threshold ? max : threshold + 5 //最大值是否比阈值大，若大则依据最大值为准
        },
        series: seriesData
      };
      if (this.whitchBox == 2 && this.color) option.color = [this.color];
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option, true);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
      myChart.on("click", params => {
        console.log(params);
        this.color = params.color;
        if (params.seriesName) {
          this.whitchBox = 2;
          this.getRtaPicInfo2(params.seriesName);
        }
      });
      if (this.whitchBox == 1) {
        this.whitchBox = 2;
        this.getRtaPicInfo2(legendData[0]);
      }
    },
    getRtaPicInfo2(subject_id) {
      this.getRtaPicInfo({
        pic_type: "2",
        rta_id: this.rta_id,
        subject_id
      });
    },
    close() {
      this.$router.go(-1);
    },
    symbolMap(key) {
      switch (key) {
        case "1":
          return ">";
        case "4":
          return ">=";
        case "5":
          return "<=";
        case "2":
          return "<";
        case "3":
          return "==";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$height: 30px;
.edit-page {
  height: 100%;
  .wrap {
    height: calc(100% - #{$height});
    display: flex;
    padding: 10px !important;
  }
  .foot {
    text-align: center;
  }
}
</style>
