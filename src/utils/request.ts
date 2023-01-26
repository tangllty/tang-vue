import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStoreHook } from '@/store/modules/user';
import { getToken, removeToken } from '@/utils/auth';

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
service.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {}
  }

  const userStore = useUserStoreHook()
  if (userStore.token) {
    config.headers.Authorization = getToken()
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  const { code, msg } = response.data
  if (code === 200) {
    return response.data
  }
  if (code === 401) {
    ElMessageBox.confirm('登陆已失效，请重新登录', '提示', {
      type: 'warning'
    }).then(() => {
      removeToken()
      location.href = '/'
      console.log('confirm');
    }).catch(() => {
    })
    return Promise.reject(msg)
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
  return Promise.reject(error)
})

export default service
