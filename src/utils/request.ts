import axios, { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus';

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  const { code, msg } = response.data
  if (code === 200) {
    return response.data
  }
  if (code === 500) {
    ElMessage({
      message: msg,
      type: 'error'
    })
    return Promise.reject(new Error(msg))
  }
}, (error: any) => {
  ElMessage({
    message: error,
    type: 'error'
  })
  return Promise.reject(error);
});

export default service
