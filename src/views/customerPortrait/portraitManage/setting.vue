<template>
  <div>
    <logicStep ref="logicStep" :frameId="frameId"></logicStep>
  </div>
</template>
<script>
import {
  GetEikonForLeftSceneList,
  GetEikonForRightSceneList,
  DoUpdateAsReleaseInfo
} from "@/api/portraitManage.js";
export default {
  name: "setting",
  components: {
    logicStep: () => import("./logic_step")
  },
  props: {
    frameId: {
      default: "",
      type: String
    }
  },
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
.wrap {
}
</style>
