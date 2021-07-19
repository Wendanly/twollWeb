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
        label-position="center"
        label-width="120px"
        :model="formData"
        ref="formRules"
        disabled
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="场景编码" prop="SCENE_ID">
              <el-input
                size="mini"
                placeholder="场景编码"
                :maxlength="maxlength"
                v-model.trim="formData.SCENE_ID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场景名称" prop="SCENE_NAME">
              <el-input
                size="mini"
                placeholder="场景名称"
                :maxlength="maxlength"
                v-model.trim="formData.SCENE_NAME"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="STATUS_NAME">
              <el-input
                size="mini"
                placeholder="状态"
                :maxlength="maxlength"
                v-model.trim="formData.STATUS_NAME"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="建设主体" prop="IOP_TYPE_NAME">
              <el-input
                size="mini"
                placeholder="建设主体"
                :maxlength="maxlength"
                v-model.trim="formData.IOP_TYPE_NAME"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级分类" prop="CLASS_NAME">
              <el-input
                size="mini"
                placeholder="一级分类"
                :maxlength="maxlength"
                v-model.trim="formData.CLASS_NAME"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" prop="CLASS_NAME2">
              <el-input
                size="mini"
                placeholder="二级分类"
                :maxlength="maxlength"
                v-model.trim="formData.CLASS_NAME2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" max-height="240">
          <el-table-column prop="EIKON_ID" show-overflow-tooltip label="画像编码"></el-table-column>
          <el-table-column prop="EIKON_NAME" show-overflow-tooltip label="画像名称"></el-table-column>
          <el-table-column prop="REMARK" show-overflow-tooltip label="备注"></el-table-column>
          <el-table-column prop="OPER_ID" show-overflow-tooltip label="创建人"></el-table-column>
          <el-table-column prop="创建时间" show-overflow-tooltip label="创建时间"></el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { GetViewSceneInfo } from "@/api/scenManage.js";
export default {
  name: "show",
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      title: "查看",
      formLoading: false,
      formData: {
        SCENE_ID: "",
        SCENE_NAME: "",
        STATUS_NAME: "",
        IOP_TYPE_NAME: "",
        CLASS_NAME: "",
        CLASS_NAME2: ""
      },
      tableData: [],
      maxlength: 50,
      loading: false,
      rows: this.$PAGE_SIZES[0], // 初始化每页展示多少条
      tableLoading: false
    };
  },
  methods: {
    open(rowInfo) {
      this.getList({
        scene_id: rowInfo.SCENE_ID
      });
      this.dialogFormVisible = true;
    },
    getList(param) {
      //清空子节点
      this.tableLoading = true;
      GetViewSceneInfo(param)
        .then(res => {
          this.tableLoading = false;
          if (res.SUCCESS) {
            this.tableData = res.DATA_LIST;
            for (let i in this.formData) {
              this.formData[i] = res.DATA_INFO[i];
            }
          } else {
            this.$message.warning(res.MESSAGE);
          }
        })
        .catch(err => {
          this.tableLoading = false;
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
.wrap {
}
</style>
