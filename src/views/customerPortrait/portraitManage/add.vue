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
      <el-form
        v-loading="formLoading"
        label-position="center"
        label-width="100px"
        :model="formData"
        :rules="formRules"
        ref="formRules"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="分析对象" prop="eikon_name">
              <el-select size="mini" v-model="formData.eikon_name" placeholder>
                <el-option
                  v-for="(item,index) in analyList"
                  :key="index"
                  :label="item.sf"
                  :value="item.sdg"
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
            <el-form-item label="周期类型" prop="eikon_name">
              <el-select size="mini" v-model="formData.eikon_name" placeholder>
                <el-option
                  v-for="(item,index) in cycTypeList"
                  :key="index"
                  :label="item.sf"
                  :value="item.sdg"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="有效期" prop="eikon_name">
              <el-row>
                <el-col :span="11">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    size="mini"
                    v-model="formData.start"
                    type="date"
                    placeholder="选择起始日期"
                  ></el-date-picker>
                </el-col>
                <el-col :span="2">
                  <div>-</div>
                </el-col>
                <el-col :span="11">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    size="mini"
                    v-model="formData.end"
                    type="date"
                    placeholder="选择起始日期"
                  ></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="画像描述" prop="remark">
              <el-input
                size="mini"
                placeholder="画像描述"
                :maxlength="maxlength"
                v-model.trim="formData.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="doSaveAsEikonInfo" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { DoSaveAsEikonInfo } from "@/api/portraitManage.js";
export default {
  name: "add",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      title: "新增",
      formLoading: false,
      cycTypeList: [],
      analyList: [],
      formData: {
        eikon_name: "",
        remark: "",
        start: "",
        end: ""
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
        remark: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["blur"]
          }
        ]
      },
      maxlength: 50,
      loading: false
    };
  },
  inject: ["getParentList"],
  created() {
    console.log("created");
  },
  methods: {
    open(param, rowInfo) {
      console.log(rowInfo);
      if (param == "add") {
        this.formData.eikon_id = null;
        this.formData.eikon_name = "";
        this.formData.remark = "";
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.formData.eikon_id = rowInfo.EIKON_ID;
        this.formData.eikon_name = rowInfo.EIKON_NAME;
        this.formData.remark = rowInfo.REMARK;
      }
      this.dialogFormVisible = true;
    },
    doSaveAsEikonInfo() {
      this.$refs["formRules"].validate(formValid => {
        if (formValid) {
          this.loading = true;
          DoSaveAsEikonInfo(this.formData)
            .then(res => {
              this.loading = false;
              if (res.SUCCESS) {
                this.close();
                this.getParentList();
                this.$message.success(res.MESSAGE);
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
    close() {
      this.dialogFormVisible = false;
      this.reset();
    },
    reset() {
      this.formData = {
        eikon_name: "",
        remark: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  .dia-wrap {
    .el-select {
      width: 100%;
    }
  }
}
</style>
