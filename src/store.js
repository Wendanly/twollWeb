import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// import {
//   UserInfo,
//   GetMenuList
// } from "@/api/login.js";
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    userInfo: {},

  },
  mutations: {
    setUserInfo(state, val) {
      console.log(val);
      state.userInfo = val;
    },
    setCurrentActive(state, val) {
      state.currentActive = val;
    },
  },
  actions: {
    //获取用户信息
    getUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        UserInfo({}).then(res => {
          // console.log(res);
          commit('setUserInfo', res)
          resolve(res);
        });
      });
    },
    //获取菜单信息
    getMenuList({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        GetMenuList(params).then(res => {
          // console.log(res);
          resolve(res);
        });
      });
    },
  },

  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        // 指定需要持久化的state
        userInfo: val.userInfo,
      }
    }
  })]
})