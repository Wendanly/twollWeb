import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => (require(["@/views/Login"], resolve))
  }, {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    redirect: {
      path: '/scenClassManage',
    },
    children: [{
        path: '/scenClassManage',
        name: 'scenClassManage',
        component: () => import('@/views/customerPortrait/scenClassManage')
      },
      {
        path: '/scenManage',
        name: 'scenManage',
        component: () => import('@/views/customerPortrait/scenManage')
      },
      {
        path: '/portraitManage',
        name: 'portraitManage',
        component: () => import('@/views/customerPortrait/portraitManage')
      },
    ],
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router