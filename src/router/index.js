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
        component: () => import( /* webpackChunkName: "scenClassManage" */ '@/views/customerPortrait/scenClassManage')
      },
      {
        path: '/scenManage',
        name: 'scenManage',
        component: () => import( /* webpackChunkName: "scenManage" */ '@/views/customerPortrait/scenManage'),
      },
      {
        path: '/portraitManage',
        name: 'portraitManage',
        component: () => import( /* webpackChunkName: "portraitManage" */ '@/views/customerPortrait/portraitManage')
      },
      {
        path: '/portraitManageAdd',
        name: 'portraitManageAdd',
        component: () => import( /* webpackChunkName: "portraitManageAdd" */ '@/views/customerPortrait/portraitManage/add')
      },
      {
        path: '/serviceMonitor',
        name: 'serviceMonitor',
        component: () => import( /* webpackChunkName: "serviceMonitor" */ '@/views/portraitExternalService/serviceMonitor')
      },
      {
        path: '/serviceLog',
        name: 'serviceLog',
        component: () => import( /* webpackChunkName: "serviceLog" */ '@/views/portraitExternalService/serviceLog')
      },
      {
        path: '/serviceAuth',
        name: 'serviceAuth',
        component: () => import( /* webpackChunkName: "serviceAuth"*/ '@/views/portraitExternalService/serviceAuth')
      },
      {
        path: '/customerCluster',
        name: 'customerCluster',
        component: () => import( /*  webpackChunkName: "customerCluster" */ '@/views/sceneAnalyService/customerCluster')
      },
      {
        path: '/targetMonitor',
        name: 'targetMonitor',
        component: () => import( /*  webpackChunkName: "targetMonitor" */ '@/views/sceneAnalyService/targetMonitor')
      },
      {
        path: '/labelManage',
        name: 'labelManage',
        component: () => import( /* webpackChunkName: "labelManage" */ '@/views/labelManage')
      },
      {
        path: '/targetMonitor/analysis',
        name: 'targetMonitorAnalysis',
        component: () => import( /* webpackChunkName: "targetMonitorAnalysis" */ '@/views/sceneAnalyService/targetMonitor/analysis')
      },
      {
        path: '/customerCluster/analysis',
        name: 'customerClusterAnalysis',
        component: () => import( /* webpackChunkName: "customerClusterAnalysis" */ '@/views/sceneAnalyService/customerCluster/analysis')
      },

    ],
  },
  {
    path: '*',
    name: 'FoundNot',
    component: () => import( /* webpackChunkName: "FoundNot" */ '@/views/FoundNot')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: '/twoll_web/',
  routes
})

export default router