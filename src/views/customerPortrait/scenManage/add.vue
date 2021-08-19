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
        <el-form-item label="场景名称" prop="scene_name">
          <el-input
            size="mini"
            placeholder="场景名称"
            :maxlength="maxlength"
            v-model.trim="formData.scene_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="一级场景分类" prop="class_id">
          <el-select
            @change="getSClassList2($event,true)"
            class="fuzzy-query"
            style="width:100%"
            size="mini"
            v-model="formData.class_id"
            placeholder="一级场景分类"
          >
            <el-option
              v-for="(item,index) in sceneClassList"
              :key="index"
              :label="item.CLASS_NAME"
              :value="item.CLASS_ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级场景分类" prop="class_id2">
          <el-select
            class="fuzzy-query"
            style="width:100%"
            size="mini"
            v-model="formData.class_id2"
            placeholder="二级场景分类"
            clearable
          >
            <el-option
              v-for="(item,index) in sceneClassList2"
              :key="index"
              :label="item.CLASS_NAME"
              :value="item.CLASS_ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            placeholder="备注"
            :autosize="{ minRows: 2, maxRows: 6}"
            :maxlength="200"
            v-model.trim="formData.remark"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="doSaveAsSceneInfo" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  GetSClassList,
  GetSClassList2,
  DoSaveAsSceneInfo
} from "@/api/scenManage.js";
export default {
  name: "scenManageAdd",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      title: "新增",
      formLoading: false,
      formData: {
        scene_name: "",
        class_id: "",
        class_id2: "",
        remark: ""
      },
      //表单校验
      formRules: {
        scene_name: [
          {
            required: true,
            message: "此为必填项！",
            trigger: ["blur"]
          }
        ],
        class_id: [
          {
            required: true,
            message: "此为必选项！",
            trigger: ["change"]
          }
        ],
        remark: [
          {
            required: true,
            message: "此为必填项！",
            trigger: ["blur"]
          }
        ]
      },
      maxlength: 50,
      loading: false,
      //  rows: this.$PAGE_SIZES[0],
      sceneClassList: [],
      sceneClassList2: []
    };
  },
  inject: ["getParentList"],
  created() {},
  methods: {
    open(param, rowInfo) {
      this.rowInfo = rowInfo;
      this.isAdd = param;
      if (param == "add") {
        this.formData.scene_id = null;
        this.formData.scene_name = "";
        this.formData.scene_type = "";
        this.formData.remark = "";
        this.title = "新增";
      } else if (param == "copy") {
        this.title = "复制";
        this.formData.scene_id = null;
        this.formData.scene_name = rowInfo.SCENE_NAME;
        this.formData.scene_type = rowInfo.SCENE_TYPE_NAME;
        this.formData.remark = rowInfo.REMARK;
      } else {
        this.title = "编辑";
        this.formData.scene_id = rowInfo.SCENE_ID;
        this.formData.scene_name = rowInfo.SCENE_NAME;
        this.formData.scene_type = rowInfo.SCENE_TYPE_NAME;
        this.formData.remark = rowInfo.REMARK;
      }
      this.getSClassList();
      this.dialogFormVisible = true;
    },
    getSClassList() {
      GetSClassList({})
        .then(res => {
          if (res.SUCCESS) {
            if (res.DATA_LIST.length) {
              this.sceneClassList = res.DATA_LIST;
              this.isAdd == "add"
                ? (this.formData.class_id = this.sceneClassList[0].CLASS_ID)
                : (this.formData.class_id = this.rowInfo.CLASS_ID);
              this.getSClassList2(this.formData.class_id);
            } else {
              this.$message.warning("数据为空！");
            }
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {});
    },
    getSClassList2(classid, fromChange) {
      GetSClassList2({
        per_class_id: classid
      })
        .then(res => {
          if (res.SUCCESS) {
            if (res.DATA_LIST.length) {
              this.sceneClassList2 = res.DATA_LIST;
              this.isAdd == "add" || fromChange == true
                ? (this.formData.class_id2 = this.sceneClassList2[0].CLASS_ID)
                : (this.formData.class_id2 = this.rowInfo.CLASS_ID2);
            } else {
              this.formData.class_id2 = "";
              this.$message.warning("二级场景分类为空！");
            }
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {});
    },
    doSaveAsSceneInfo() {
      this.$refs["formRules"].validate(formValid => {
        if (formValid) {
          this.loading = true;
          DoSaveAsSceneInfo(this.formData)
            .then(res => {
              this.loading = false;
              if (res.SUCCESS) {
                this.$message.success(res.MESSAGE);
                this.close();
                this.getParentList();
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
        scene_name: "",
        class_id: "",
        class_id2: "",
        remark: ""
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
}
</style>
