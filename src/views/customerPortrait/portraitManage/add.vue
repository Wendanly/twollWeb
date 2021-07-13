<template>
  <div class="edit-page">
    <BackTip content="新增分群"></BackTip>
    <div class="wrap">
      <div class="content">
        <el-form
          v-show="!isNext"
          v-loading="formLoading"
          label-position="center"
          label-width="100px"
          :model="formData"
          :rules="isShow?{}:formRules"
          ref="formRules"
          :disabled="isShow"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="分析对象" prop="frame_id">
                <el-select size="mini" v-model="formData.frame_id" placeholder>
                  <el-option
                    v-for="(item,index) in analyList"
                    :key="index"
                    :label="item.DIM_NAME"
                    :value="item.DIM_ID"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="画像名称" prop="eikon_name">
                <el-input
                  size="mini"
                  placeholder="画像名称"
                  :maxlength="maxlength"
                  v-model.trim="formData.eikon_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="周期类型" prop="data_cycle">
                <el-select
                  @change="changeCycle"
                  size="mini"
                  v-model="formData.data_cycle"
                  placeholder
                >
                  <el-option
                    v-for="(item,index) in cycTypeList"
                    :key="index"
                    :label="item.DIM_NAME"
                    :value="item.DIM_ID"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="有效期" prop="begin_date">
                <el-date-picker
                  v-if="cycleType"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  size="mini"
                  v-model="formData.begin_date"
                  type="date"
                  placeholder="选择起始日期"
                  :picker-options="pickerOptions0"
                ></el-date-picker>
                <el-date-picker
                  v-else
                  size="mini"
                  v-model="formData.begin_date"
                  type="month"
                  placeholder="选择起始日期"
                  value-format="yyyyMM"
                  :picker-options="pickerOptions3"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="2">-</el-col> -->
            <el-col :span="12">
              <el-form-item prop="end_date">
                <el-date-picker
                  v-if="cycleType"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  size="mini"
                  v-model="formData.end_date"
                  type="date"
                  placeholder="选择结束日期"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
                <el-date-picker
                  v-else
                  size="mini"
                  v-model="formData.end_date"
                  type="month"
                  placeholder="选择结束日期"
                  value-format="yyyyMM"
                  :picker-options="pickerOptions4"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="画像描述" prop="remark">
                <el-input
                  type="textarea"
                  placeholder="画像描述"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  :maxlength="200"
                  v-model.trim="formData.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="content" style="width:100%;">
        <logicStep ref="logicStep" v-show="isNext" :noModification="isShow" :frameId="frameId"></logicStep>
      </div>
      <div class="foot">
        <el-button size="mini" v-if="!isNext || isShow" @click="close">取消</el-button>
        <el-button size="mini" type="primary" v-if="isNext" @click="back">上一步</el-button>
        <el-button size="mini" type="primary" v-if="!isNext" @click="next">下一步</el-button>
        <el-button
          :loading="btnLoding"
          :disabled="isShow"
          size="mini"
          type="primary"
          v-if="isNext && !isShow"
          @click="save"
        >保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { DoSaveAsEikonInfo, getEikonInfo } from "@/api/portraitManage.js";
import { isNullOrEmpty, checkLogicTree, dealDateStr } from "@/libs/tools";
import * as dfs from "date-fns";
import { GetDicInfo } from "@/api/commonApi.js";
import * as _ from "lodash";
export default {
  name: "add",
  components: {
    logicStep: () => import("./logic_step")
  },
  data() {
    let _this = this;
    return {
      cycleType: true,
      pickerOptions0: {
        disabledDate: time => {
          if (time.getTime() < dfs.subDays(new Date(), 3).getTime()) {
            return true;
          }
          if (time.getTime() > dfs.addDays(new Date(), 92).getTime()) {
            return true;
          }
          if (!isNullOrEmpty(this.formData.end_date)) {
            if (
              time.getTime() >
              new Date(dealDateStr(this.formData.end_date)).getTime()
            ) {
              return true;
            }
          }
          return false;
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (time.getTime() < dfs.startOfDay(new Date()).getTime()) {
            return true;
          }
          if (time.getTime() < dfs.subDays(new Date(), 3).getTime()) {
            return true;
          }
          if (time.getTime() > dfs.addDays(new Date(), 92).getTime()) {
            return true;
          }
          if (!isNullOrEmpty(this.formData.begin_date)) {
            if (
              time.getTime() <
              new Date(dealDateStr(this.formData.begin_date)).getTime()
            ) {
              return true;
            }
          }
          return false;
        }
      },
      pickerOptions3: {
        disabledDate: time => {
          if (time.getTime() < dfs.subMonths(new Date(), 2).getTime()) {
            return true;
          }
          if (time.getTime() > dfs.addMonths(new Date(), 60).getTime()) {
            return true;
          }
          if (!isNullOrEmpty(this.formData.end_date)) {
            if (
              time.getTime() >
              new Date(dealDateStr(this.formData.end_date)).getTime()
            ) {
              return true;
            }
          }
          return false;
        }
      },
      pickerOptions4: {
        disabledDate: time => {
          if (time.getTime() < dfs.startOfMonth(new Date()).getTime()) {
            return true;
          }
          if (time.getTime() < dfs.subMonths(new Date(), 2).getTime()) {
            return true;
          }
          if (time.getTime() > dfs.addMonths(new Date(), 60).getTime()) {
            return true;
          }
          //dfs.endOfMonth(new Date(dealDateStr(this.ruleForm.beginDate))).getTime()
          if (!isNullOrEmpty(this.formData.begin_date)) {
            if (
              time.getTime() <
              new Date(dealDateStr(this.formData.begin_date)).getTime()
            ) {
              return true;
            }
          }
          return false;
        }
      },
      formLoading: false,
      btnLoding: false,
      cycTypeList: [],
      analyList: [],
      formData: {
        eikon_name: "",
        frame_id: "",
        remark: "",
        data_cycle: "",
        begin_date: "",
        end_date: ""
      },
      //表单校验
      formRules: {
        eikon_name: [
          {
            required: true,
            message: "此为必填项！",
            trigger: ["blur"]
          }
        ],
        data_cycle: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["change"]
          }
        ],
        frame_id: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["change"]
          }
        ],
        remark: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["blur"]
          }
        ],
        begin_date: [
          {
            required: true,
            message: "选择起始日期",
            trigger: ["blur", "change"]
          }
        ],
        end_date: [
          {
            required: true,
            message: "选择结束日期",
            trigger: ["blur", "change"]
          }
        ]
      },
      maxlength: 50,
      loading: false,
      isNext: false,
      frameId: null,
      tempFrameId: null,
      isShow: false
    };
  },
  created() {
    this.eikon_id = this.$route.query.eikon_id; // getEikonInfo,
    this.isShow = this.$route.query.isShow == "isShow" ? true : false; //为真 则查看
    this.init();
  },
  methods: {
    init() {
      this.formLoading = true;
      GetDicInfo({
        dic_type: "CYCLE_TYPE#FRAME_ID"
      })
        .then(res => {
          this.formLoading = false;
          if (res.SUCCESS == "true") {
            this.cycTypeList = res.CYCLE_TYPE;
            this.analyList = res.FRAME_ID;
            if (res.CYCLE_TYPE.length && this.eikon_id == "") {
              this.formData.frame_id = res.FRAME_ID[0].DIM_ID;
            }
            if (res.FRAME_ID.length && this.eikon_id == "") {
              this.formData.data_cycle = res.CYCLE_TYPE[0].DIM_ID;
            }
            if (this.eikon_id != "") {
              this.getEikonInfo();
            }
          }
        })
        .catch(err => {
          this.formLoading = false;
        });
    },
    getEikonInfo() {
      let _this = this;
      this.formLoading = true;
      getEikonInfo({
        eikon_id: this.eikon_id
      })
        .then(res => {
          this.formLoading = false;
          if (res.SUCCESS) {
            let tmpObj = res.DATA_INFO.RULE_INFO;
            tmpObj = JSON.parse(tmpObj);
            console.log(tmpObj);
            for (let i in this.formData) {
              this.formData[i] = tmpObj[i];
            }
            this.$refs.logicStep.list = JSON.parse(tmpObj.ruleJson);
            console.log(this.$refs.logicStep.list);
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.formLoading = false;
        });
    },
    changeCycle(val) {
      if (val == "1") {
        this.cycleType = true;
      } else {
        this.cycleType = false;
      }
    },
    close() {
      this.$router.go(-1);
    },
    back() {
      this.isNext = false;
    },
    next() {
      this.$refs["formRules"].validate(formValid => {
        if (formValid) {
          this.isNext = true;
        }
      });
    },
    save() {
      // console.log(this.$refs.basicStep.ruleForm);
      // let ruleForm = this.$refs.basicStep.ruleForm;
      //console.log(this.$refs.logicStep.list);
      // console.log(this.$refs.logicStep.showAdvSetting); //高级设置
      // console.log(this.$refs.logicStep.dynamicTags); //输出字段
      // console.log(this.$refs.logicStep.fieldOrder); //字段排序 bool
      // console.log(this.$refs.logicStep.fieldOrderObj.list); //字段排序列表
      // console.log(this.$refs.logicStep.LimitOutput); //限制输出记录数 bool
      // console.log(this.$refs.logicStep.LimitOutputNum); //结果限制值
      if (this.$refs.logicStep.list.children.length == 0) {
        this.$message.warning("至少设置一条逻辑设置");
        return;
      }

      let result = {
        bool: true
      };
      console.log(this.$refs.logicStep.list);
      checkLogicTree(this.$refs.logicStep.list, result);
      if (result.bool == false) {
        this.$message.warning("请填写正确的逻辑设置值");
        return;
      }
      let temp = {
        edcSubject: {
          eikon_name: this.formData.eikon_name,
          frame_id: this.formData.frame_id,
          remark: this.formData.remark,
          data_cycle: this.formData.data_cycle,
          begin_date: this.formData.begin_date,
          end_date: this.formData.end_date,
          ruleJson: JSON.stringify(this.$refs.logicStep.list), //json
          subjectRule: this.$refs.logicStep.codesText //下面显示的公式
        },
        eikon_id: this.$route.query.eikon_id
      };
      temp.edcSubject = JSON.stringify(temp.edcSubject);
      console.log(111, this.$refs.logicStep.codesText);
      console.log(temp);
      if (this.formData.dataCycle === 1) {
        if (
          new Date(dealDateStr(this.formData.beginDate)).getTime() <
          dfs.subDays(new Date(), 1).getTime()
        ) {
          this.$message.warning("分群结果预计在数十分钟内计算完成");
        } else {
          let showResultDate = dfs.format(
            dfs.addDays(new Date(dealDateStr(this.formData.beginDate)), 1),
            "yyyy-MM-dd"
          );
          this.$message.warning(`分群结果预计在${showResultDate}前计算完成`);
        }
      } else if (this.formData.dataCycle === 2) {
        if (
          new Date(dealMonthStr(this.formData.beginDate)).getTime() <
          dfs.subMonths(new Date(), 1).getTime()
        ) {
          this.$message.warning("分群结果预计在数十分钟计算完成");
        } else {
          let showResultDate = dfs.format(
            dfs.addDays(new Date(dealDateStr(this.formData.beginDate)), 1),
            "yyyy-MM"
          );
          this.$message.warning(`分群结果预计在${showResultDate}-10前计算完成`);
        }
      }
      this.doSaveAsEikonInfo(temp);
    },
    doSaveAsEikonInfo(param) {
      this.btnLoding = true;
      DoSaveAsEikonInfo(param)
        .then(res => {
          this.btnLoding = false;
          if (res.SUCCESS) {
            this.close();
            this.$message.success(res.MESSAGE);
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.btnLoding = false;
        });
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
    .content {
      width: 50%;
      margin: 0 auto;
      > form {
        /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-form-item__content {
          /deep/ .el-date-editor {
            width: 100%;
          }
        }
      }
    }
  }
  .foot {
    text-align: center;
  }
}
</style>
