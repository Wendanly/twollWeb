<template>
  <el-dialog
    :destroy-on-close="true"
    :title="title"
    :visible.sync="dialogFormVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="close"
  >
    <div class="dia-wrap">
      <el-form
        v-loading="formLoading"
        label-position="center"
        label-width="120px"
        :model="formData"
        :rules="formRules"
        ref="formRules"
      >
        <el-form-item label="是否符合条件" prop="res_code">
          <el-select size="mini" v-model="formData.res_code">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="res_desc">
          <el-input
            type="textarea"
            :min="3"
            :max="6"
            size="mini"
            :maxlength="200"
            v-model.trim="formData.res_desc"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="doSaveAsP2GPortraitCheck" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
console.log("check");
import { DoSaveAsP2GPortraitCheck } from "@/api/portraitManage.js";
export default {
  name: "check",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      title: "审批",
      formLoading: false,
      formData: {
        res_code: "1",
        res_desc: ""
      },
      //表单校验
      formRules: {
        res_code: [
          {
            required: true,
            message: "此为必填项！",
            trigger: ["chanage"]
          }
        ]
      },
      maxlength: 30,
      loading: false
    };
  },
  created() {},
  inject: ["getParentList"],
  methods: {
    open(rowInfo) {
      // console.log(rowInfo);
      this.formData.eikon_id = rowInfo.EIKON_ID;
      this.dialogFormVisible = true;
    },
    doSaveAsP2GPortraitCheck() {
      this.$refs["formRules"].validate(formValid => {
        if (formValid) {
          this.loading = true;
          DoSaveAsP2GPortraitCheck(this.formData)
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
      for (let i in this.formData) {
        this.formData[i] = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-select {
  width: 100%;
}
</style>
