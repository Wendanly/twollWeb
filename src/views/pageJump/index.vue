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
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="name" label="页面名称"></el-table-column>
        <el-table-column prop="id" label="页面ID"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="config" type="text" size="small">页面配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "pageJump",
  components: {},
  data() {
    return {
      name: "",
      tableData: []
    };
  },
  computed: {},
  methods: {
    config() {}
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
