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
        label-width="150px"
        :model="formData"
        :rules="formRules"
        ref="formRules"
      >
        <el-form-item :label="label" prop="class_name">
          <el-input size="mini" :maxlength="maxlength" v-model.trim="formData.class_name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="doSaveAsSceneClassInfo" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { DoSaveAsSceneClassInfo } from "@/api/scenClassManage.js";
export default {
  name: "add",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      title: "新增",
      formLoading: false,
      formData: {
        class_name: ""
      },
      //表单校验
      formRules: {
        class_name: [
          {
            required: true,
            message: "此为必填项！",
            trigger: ["blur"]
          }
        ]
      },
      maxlength: 30,
      loading: false,
      label: "一级场景分类名称"
    };
  },
  created() {},
  inject: ["getParentList"],
  methods: {
    open(param, rowInfo) {
      console.log(rowInfo);
      this.label = "一级场景分类名称";
      //一级新增
      if (param == "add") {
        this.formData.class_id = null;
        this.formData.per_class_id = 0;
        this.formData.class_level = 1;
        this.title = "新增";
      } else {
        this.title = "编辑";
        this.formData.class_id = rowInfo.CLASS_ID;
        if (param == "edit") {
          //一级编辑
          this.formData.class_level = 1;
        } else {
           //二级新增与编辑
          this.formData.class_level = 2;
        }
        this.formData.per_class_id = rowInfo.CLASS_ID;
        //二级编辑
        if (param == "childrenEdit") {
          this.formData.per_class_id = rowInfo.PER_CLASS_ID;
          this.label = "二级场景分类名称";
        }
        //二级级新增
        if (param == "childrenAdd") {
          this.formData.class_name = "";
          this.formData.class_id = null;
          this.title = "新增";
          this.label = "二级场景分类名称";
        } else {
          this.formData.class_name = rowInfo.CLASS_NAME;
        }
      }
      this.dialogFormVisible = true;
    },
    doSaveAsSceneClassInfo() {
      this.$refs["formRules"].validate(formValid => {
        if (formValid) {
          this.loading = true;
          DoSaveAsSceneClassInfo(this.formData)
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
        class_name: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
}
</style>
