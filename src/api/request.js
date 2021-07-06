import Vue from 'vue'
import axios from 'axios';
import store from '@/store.js'
import router from '@/router/index.js'
import qs from 'qs'
import {
  Message
} from 'element-ui'
// 创建axios实例
const service = axios.create({
  baseURL: '/twoll/api/', //前缀
});
// request拦截器
service.interceptors.request.use(
  config => {
    store.state.userInfo && store.state.userInfo.Token ? config.headers["Authorization"] = 'Bearer ' + store.state.userInfo.Token : ''; // 请求头中添加token
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

// response拦截器
service.interceptors.response.use(
  response => {
    if (response.status == 200) {
      return response.data;
    } else {
      console.log(response);
      Promise.reject(response);
    }
  },
  error => {
    // if (JSON.stringify(error).includes("401")) {
    //   alert("登录已过期，请重新登录！");
    // } else {
    //   alert(error);
    // }

    console.log(error.response);
    let data = error.response.data;
    switch (data.code) {
      case '401':
        Message.warning(data.message);
        // debugger
        router.replace({
          path: "/"
        });

        break;

      default:
        Message.warning(data.message || data);
        break;
    }
    return Promise.reject(data);
  }
);
const request = (method, url, data, config) => {
  let flag = method == 'PUT' || method == 'POST' || method == 'PATCH' ? true : false;
  let options = {
    method,
    url,
    ...config
  };

  flag ? options.data = qs.stringify(data) : options.params = data;
  return service(options);
}
export default request