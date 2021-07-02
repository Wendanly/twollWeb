<template>
  <el-submenu :popper-append-to-body='false' :index="item.index" :key="item.index" v-if="item.children && item.children.length">
    <template slot="title">{{item.title}}</template>
    <MenuTree name="MenuTree" v-for="(menu,i) in item.children" :key="i" :item="menu"></MenuTree>
  </el-submenu>
  <el-menu-item v-else :key="item.index" :index="item.index">{{item.title}}</el-menu-item>
</template>

<script>
export default {
  name: "MenuTree",
  props: {
    item: {
      default() {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style>
</style>
