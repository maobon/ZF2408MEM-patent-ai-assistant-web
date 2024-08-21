/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import configs from "@/utils/configs";

const request = axios.create({
  baseURL: configs.getBackendServerURL(),
  timeout: 150 * 1000, // request Message
});

// http request 拦截器
request.interceptors.request.use(
  config => {
    // if (store.state.token) {
    //   config.headers.Authorization = `token ${store.state.token}`
    // }

    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error.response.data)
  },
)

export default request;

