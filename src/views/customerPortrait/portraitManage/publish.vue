<template>
  <el-dialog
    :destroy-on-close="true"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <div class="dia-wrap">
      <div class="transfer">
        <div class="left" :loading="leftLoading">
          <div class="header">
            <div class="title">源数据</div>
            <!-- <div class="total">0/10</div> -->
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkLeftList">
              <el-checkbox
                v-for="(item,index) in leftList"
                :key="index"
                :label="item.SCENE_ID"
              >{{item.SCENE_NAME}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="btn">
          <el-button
            type="primary"
            @click="toLeft('search')"
            size="mini"
            :disabled="!checkRightList.length"
            class="el-icon-arrow-left"
          ></el-button>
          <el-button
            type="primary"
            @click="toRight('search')"
            size="mini"
            :disabled="!checkLeftList.length"
            class="el-icon-arrow-right"
          ></el-button>
        </div>
        <div class="right">
          <div class="header">
            <div class="title">已选数据</div>
            <!-- <div class="total">0/10</div> -->
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkRightList">
              <el-checkbox
                v-for="(item,index) in rightList"
                :key="index"
                :label="item.SCENE_ID"
              >{{item.SCENE_NAME}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <MyPagination
        textAlign="left"
        :notLayout="notLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :currentPage="page"
        :pageSize="rows"
        :total="total"
      ></MyPagination>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="doUpdateAsReleaseInfo" :loading="loading">发布</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  GetEikonForLeftSceneList,
  GetEikonForRightSceneList,
  DoUpdateAsReleaseInfo
} from "@/api/portraitManage.js";
export default {
  name: "publish",
  components: {},
  data() {
    return {
      notLayout: ["sizes"],
      dialogFormVisible: false,
      tableLoading: false,
      title: "发布",
      loading: false,
      tableData: [],
      total: 0, //总条数
      page: 1,
      rows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      value: [3],
      leftList: [],
      rightList: [],
      checkLeftList: [],
      checkRightList: [],
      leftLoading: false
    };
  },
  inject: ["getParentList"],

  methods: {
    open(rowInfo) {
      this.eikon_id = rowInfo.EIKON_ID;
      this.getList();
      this.getRightList();
      this.dialogFormVisible = true;
    },
    getList() {
      GetEikonForLeftSceneList({
        page: this.page,
        rows: this.rows,
        eikon_id: this.eikon_id
      })
        .then(res => {
          if (res.SUCCESS) {
            this.leftList = res.DATA_LIST;
            this.total = res.TOTAL;
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {});
    },
    getRightList() {
      GetEikonForRightSceneList({
        eikon_id: this.eikon_id
      })
        .then(res => {
          if (res.SUCCESS) {
            this.rightList = res.DATA_LIST;
            // this.total = res.TOTAL;
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {});
    },
    doUpdateAsReleaseInfo() {
      let list = [];
      this.rightList.map(o => list.push(o.SCENE_ID));
      let scene_ids = list.join(",");
      this.loading = true;
      DoUpdateAsReleaseInfo({
        eikon_id: this.eikon_id,
        scene_ids
      })
        .then(res => {
          this.loading = false;
          if (res.SUCCESS) {
            this.$message.success(res.MESSAGE);
            this.getParentList();
            this.close();
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    toLeft() {
      //删除右边多余的
      this.rightList = this.rightList.filter(o =>
        this.checkRightList.every(j => o.SCENE_ID != j)
      );
      this.checkRightList = [];
      this.checkLeftList = [];
    },
    toRight() {
      let tmpArr = this.checkLeftList.filter(o =>
        this.checkRightList.every(j => o != j)
      );
      let curTotalArr = this.transfer(this.checkRightList.concat(tmpArr)); //本次所有
      this.rightList = this.quchong(curTotalArr); //
      this.checkRightList = [];
      this.checkLeftList = [];
    },
    //去重
    quchong(curTotalArr) {
      let arr1 = curTotalArr.filter(o =>
        this.rightList.every(m => o.SCENE_ID != m.SCENE_ID)
      );
      return this.rightList.concat(arr1);
    },
    transfer(arr) {
      let list = [];
      //arr 是编码，得匹配出对应的名称，分别在左边和右边的列表找名称
      arr.map(o => {
        this.rightList.map(m => {
          if (o == m.SCENE_ID) {
            list.push({
              SCENE_ID: o,
              SCENE_NAME: m.SCENE_NAME
            });
          }
        });
        let flag = this.rightList.some(n => o == n.SCENE_ID);
        if (!flag) {
          this.leftList.map(m => {
            if (o == m.SCENE_ID)
              list.push({
                SCENE_ID: o,
                SCENE_NAME: m.SCENE_NAME
              });
          });
        }
      });
      return list;
    },
    close() {
      this.dialogFormVisible = false;
      this.reset();
    },
    reset() {
      this.page = 1;
      this.rows = this.$PAGE_SIZES[0];
      this.eikon_id = undefined;
      this.leftList = [];
      this.rightList = [];
      this.checkLeftList = [];
      this.checkRightList = [];
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
.dia-wrap {
  .transfer {
    display: flex;
    justify-content: space-around;
    .left,
    .right {
      width: 200px;
      height: 346px;
      border: 1px solid #ebeef5;
      border-radius: 5px;

      .header {
        height: 40px;
        background: #f5f7fa;
        padding-left: 10px;
        display: flex;
        // justify-content: space-around;
        align-items: center;
      }
      .checkbox {
        height: 275px;
        overflow: auto;
        padding: 10px;
        /deep/ .el-checkbox-group {
          display: flex;
          flex-direction: column;
          /deep/ .el-checkbox {
            margin-top: 5px;
            margin-bottom: 5px;
          }
        }
      }
    }
    .btn {
      display: flex;
      align-items: center;
    }
  }
}
</style>
