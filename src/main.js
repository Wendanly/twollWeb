import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store'
import '@/libs/global.js'

import ElementUI from 'element-ui';
import {
  Message
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/element-variables.scss';
import MyPagination from '@/components/MyPagination'
import BackTip from '@/components/BackTip'
import "@/assets/iconfont/iconfont.css"; //引入阿里矢量图标库
//
import vueMagicTree from "vue-magic-tree";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import logic_block from "@/views/customerPortrait/portraitManage/logic_block";
import logic_tree from "@/views/customerPortrait/portraitManage/logic_tree";
import numberRangeSelect from "@/views/customerPortrait/portraitManage/number-range-select"
import '@/sass/index.scss';
import '@/styles/common.scss'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.component('MyPagination', MyPagination);
Vue.component('BackTip', BackTip);
//

Vue.component('Treeselect', Treeselect)
Vue.component('logicBlock', logic_block)
Vue.component('vue-magic-tree', vueMagicTree)
Vue.component('logicTree', logic_tree)
Vue.component('number-range-select', numberRangeSelect)
//路由导航守卫
router.beforeEach((to, from, next) => {
  //to 要去的路由配置
  //from 当前的路由配置
  //next 一定要调用，让to的路由配置继续生效，比如如果去登陆直接next(),否则判断token是否存在，如果存在就next()

  if (to.path === '/login') return next(); //使用return，不需要写else

  //判断其他页面是否有token
  const token = store.state.userInfo.Token;
  //存在继续往后走
  if (token) return next();


  // this.$router.push({name:'login'}) #没有this,无法使用
  Message.warning('未登录或token失效，请先登录！')
  router.push({
    name: 'login'
  })


});
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')