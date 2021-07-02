<template>
  <div class="project-manage">
    <div class="search">
      <el-row>
        <el-col :span="8">
          <el-input class="input" size="mini" v-model="name" placeholder="关键字"></el-input>
        </el-col>
        <el-col :span="12">
          <el-button size="mini">查询</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="table">
      <el-table :data="pManTableData" style="width: 100%" border>
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="id" label="项目ID"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="publish" type="text" size="small">预览</el-button>
            <el-button @click="preview" type="text" size="small">发布</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "projectManage",
  components: {},
  data() {
    return {
      name: ""
    };
  },
  computed: {
    ...mapState(["pManTableData"])
  },
  methods: {
    publish() {},
    preview() {}
  }
};
</script>

<style lang="scss" scoped>
.project-manage {
  width: 100%;
  height: 100%;
  .search {
    margin-bottom: 20px;
    .input {
      width: 220px;
    }
  }
}
</style>
