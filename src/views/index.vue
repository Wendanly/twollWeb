<template>
  <div class="home-wrap">
    <div class="left">
      <el-menu
        background-color="#f1f1f1"
        router
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        @select="select"
      >
        <el-menu-item :index="item.index" v-for="(item,index) in list" :key="index">
          <!-- <i class="el-icon-menu"></i> -->
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  components: {},
  data() {
    
    return {
      defaultActive: "/projectManage",
      list: [
        {
          title: "项目管理",
          index: "/projectManage"
        },
        {
          title: "页面跳转",
          index: "/pageJump"
        },
        {
          title: "表单设计",
          index: ""
        }
      ]
    };
  },
  computed: {
    ...mapState(["currentActive"])
  },
  methods: {
    ...mapMutations(["setCurrentActive"]),
    select(key, indexPath) {
      // console.log(key, indexPath);
      // this.setCurrentActive(key);
      if (key == "") {
        window.open("http://localhost:8081", "lowcode");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.home-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 200px;
    background: #f1f1f1;
  }
  .right {
    flex: 1;
    padding: 10px;
    // border: 1px solid red;
  }
}
</style>
