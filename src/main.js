import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store'
import '@/utils/global.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/element-variables.scss';
import '@/styles/common.scss'
import MyPagination from '@/components/MyPagination'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.component('MyPagination', MyPagination)
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')