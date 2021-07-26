<template>
  <el-dialog
    :destroy-on-close="true"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <div class="dia-wrap">
      <el-form
        v-loading="formLoading"
        label-width="90px"
        :model="formData"
        ref="formRules"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="指标名称" prop="RTA_NAME">
              <MyInput placeholder="指标名称" :maxlength="maxlength" v-model="formData.RTA_NAME"></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="符号" prop="SYMBOL">
              <el-select size="mini" v-model="formData.SYMBOL">
                <el-option
                  v-for="(item,index) in symbolList"
                  :key="index"
                  :label="item.DIM_NAME"
                  :value="item.DIM_ID"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="阈值" prop="THRESHOLD_VAL">
              <el-input
                size="mini"
                placeholder="阈值"
                :maxlength="10"
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model="formData.THRESHOLD_VAL"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="REMARK">
              <MyInput
                type="textarea"
                :maxlength="maxlength"
                placeholder="备注"
                v-model="formData.REMARK"
              ></MyInput>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
                :label="item.SUBJECT_ID"
              >{{item.SUBJECT_NAME}}</el-checkbox>
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
                :label="item.SUBJECT_ID"
              >{{item.SUBJECT_NAME}}</el-checkbox>
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
      <el-button
        size="mini"
        :disabled="!rightList.length"
        type="primary"
        @click="doSaveAsRtaSubject"
        :loading="loading"
      >保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  DoSaveAsRtaSubject,
  GetRtaSubjectInfo,
  GetSelSubjectRelList,
  GetSubjectList
} from "@/api/targetMonitor.js";
import { GetDicInfo } from "@/api/commonApi.js";
const primaryKey = "SUBJECT_ID"; //唯一标识
const primaryValue = "SUBJECT_NAME"; //唯一标识
export default {
  name: "add",
  components: {},
  data() {
    return {
      notLayout: ["sizes"],
      dialogFormVisible: false,
      tableLoading: false,
      title: "新增",
      loading: false,
      tableData: [],
      total: 0, //总条数
      page: 1,
      rows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      leftList: [],
      rightList: [],
      checkLeftList: [],
      checkRightList: [],
      leftLoading: false,
      formLoading: false,
      maxlength: 50,
      formData: {
        RTA_NAME: "",
        SYMBOL: "",
        THRESHOLD_VAL: "",
        REMARK: ""
      },
      symbolList: [],
      //表单校验
      formRules: {
        RTA_NAME: [
          {
            required: true,
            message: "此为必填项！",
            trigger: ["blur"]
          }
        ],
        SYMBOL: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["blur"]
          }
        ],
        THRESHOLD_VAL: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["blur"]
          }
        ]
      }
    };
  },
  inject: ["getParentList"],
  methods: {
    open(name, rowInfo) {
      this.rta_id = undefined;
      if (name == "edit") {
        this.title = "编辑";
        this.rta_id = rowInfo.RTA_ID;
        this.getRightList();
        this.getRtaSubjectInfo();
      } else {
        this.title = "新增";
      }
      this.init();
      this.getList();
      this.dialogFormVisible = true;
    },
    init() {
      GetDicInfo({
        dic_type: "SYMBOL"
      })
        .then(res => {
          if (res.SUCCESS == "true") {
            this.symbolList = res.SYMBOL;
            res.SYMBOL.length
              ? (this.formData.SYMBOL = res.SYMBOL[0].DIM_ID)
              : "";
          }
        })
        .catch(err => {});
    },
    getRtaSubjectInfo() {
      GetRtaSubjectInfo({
        rta_id: this.rta_id
      })
        .then(res => {
          if (res.SUCCESS) {
            for (let i in this.formData) {
              this.formData[i] = res.DATA_INFO[i];
            }
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {});
    },
    getList() {
      GetSubjectList({
        page: this.page,
        rows: this.rows
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
      GetSelSubjectRelList({
        rta_id: this.rta_id
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
    doSaveAsRtaSubject() {
      this.$refs["formRules"].validate(formValid => {
        if (formValid) {
          let list = [];
          if (!this.rightList.length)
            return this.$message.warning("请选择数据！");
          this.rightList.map(o => list.push(o.SUBJECT_ID));
          let rta_rel_json = list.join(",");
          this.loading = true;
          DoSaveAsRtaSubject({
            rta_id: this.rta_id,
            ...this.toLowerCase(this.formData),
            rta_rel_json
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
        }
      });
    },
    toLowerCase(obj) {
      let tmpObj = {};
      for (let i in obj) {
        tmpObj[i.toLowerCase()] = obj[i];
      }
      return tmpObj;
    },
    toLeft() {
      //删除右边多余的
      this.rightList = this.rightList.filter(o =>
        this.checkRightList.every(j => o[primaryKey] != j)
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
        this.rightList.every(m => o[primaryKey] != m[primaryKey])
      );
      return this.rightList.concat(arr1);
    },
    transfer(arr) {
      let list = [];
      //arr 是编码，得匹配出对应的名称，分别在左边和右边的列表找名称
      arr.map(o => {
        this.rightList.map(m => {
          if (o == m[primaryKey]) {
            let obj = {};
            obj[primaryKey] = o;
            obj[primaryValue] = m[primaryValue];
            list.push(obj);
          }
        });
        let flag = this.rightList.some(n => o == n[primaryKey]);
        if (!flag) {
          this.leftList.map(m => {
            if (o == m[primaryKey]) {
              let obj1 = {};
              obj1[primaryKey] = o;
              obj1[primaryValue] = m[primaryValue];
              list.push(obj1);
            }
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
      this.rta_id = undefined;
      this.leftList = [];
      this.rightList = [];
      this.checkLeftList = [];
      this.checkRightList = [];
      for (let i in this.formData) {
        this.formData[i] = "";
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.rows = val;
      this.getList(this.rta_id);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getList(this.rta_id);
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
  /deep/.el-select {
    width: 100%;
  }
}
</style>
