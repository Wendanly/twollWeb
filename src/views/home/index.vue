<template>
  <div class="home-wrap">
    <div class="top">
      <el-menu
        mode="horizontal"
        router
        :default-active="$route.path"
        class="el-menu-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <MenuTree v-for="(menu,i) in list" :key="i" :item="menu"></MenuTree>
      </el-menu>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import MenuTree from "@/components/MenuTree";
export default {
  name: "App",
  components: { MenuTree },
  data() {
    return {
      activeIndex: "1",
      defaultActive: "/scenManService",
      list: [
        {
          title: "客户画像",
          index: "/customerPortrait",
          children: [
            {
              title: "场景分类管理",
              index: "/scenClassManage"
            },
            {
              title: "场景管理",
              index: "/scenManage"
            },
            {
              title: "画像管理",
              index: "/portraitManage"
            }
          ]
        },
        {
          title: "画像对外服务",
          index: "/portraitExternalService",
          children: [
            {
              title: "服务权限",
              index: "/serviceAuth"
            },
            {
              title: "服务记录",
              index: "/serviceLog"
            },
            {
              title: "服务监控",
              index: "/serviceMonitor"
            }
          ]
        },
        {
          title: "场景化分析服务",
          index: "/sceneAnalyService",
          children: [
            {
              title: "我的客户群",
              index: "/customerCluster"
            }
          ]
        },
        {
          title: "标签管理",
          index: "/labelManage",
        }
      ]
    };
  },
  computed: {
    ...mapState(["currentActive"])
  },
  methods: {
    ...mapMutations(["setCurrentActive"]),
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
$height: 50px;
.home-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .top {
    width: 100%;
    height: $height;
    position: absolute;
    top: 0px;
  }
  .content {
    height: calc(100% - #{$height});
    padding: 10px;
    background: #f7f7f7;
    box-sizing: border-box;
    position: absolute;
    top: $height;
    width: 100%;
  }
}
</style>
