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
    // component: resolve => (require(["@/views/Login"], resolve)),
    // component: resolve => require.ensure([], () => resolve(require("@/views/Login")), 'loginhaha'), //按需加载，并命名
    component: resolve => import( /* webpackChunkName: "Login" */ '@/views/Login'), //按需加载，并命名
  },
  {
    path: '/home',
    name: 'home',
    component: () => import( /* webpackChunkName: "home" */ '@/views/home/index.vue'),
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
        component: () => import( /* webpackChunkName: "portraitManage" */ '@/views/customerPortrait/portraitManage')
      },
      {
        path: '/portraitManageAdd',
        name: 'portraitManageAdd',
        component: () => import('@/views/customerPortrait/portraitManage/add')
      },
      {
        path: '/serviceMonitor',
        name: 'serviceMonitor',
        component: () => import('@/views/portraitExternalService/serviceMonitor')
      },
      {
        path: '/serviceLog',
        name: 'serviceLog',
        component: () => import('@/views/portraitExternalService/serviceLog')
      },
      {
        path: '/serviceAuth',
        name: 'serviceAuth',
        component: () => import('@/views/portraitExternalService/serviceAuth')
      },
      {
        path: '/customerCluster',
        name: 'customerCluster',
        component: () => import('@/views/sceneAnalyService/customerCluster')
      },
    ],
  },


]

const router = new VueRouter({
  mode: 'history',
  base: '/twoll_web/',
  routes
})

export default router