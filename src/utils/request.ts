import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStoreHook } from '@/store/modules/user'
import { getToken, removeToken } from '@/utils/auth'

let reLoginFlag: boolean = true

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
  if (response.headers['content-type'] === 'application/octet-stream') {
    return response
  }
  const { code, msg } = response.data
  if (code === 200) {
    return response.data
  }
  if (code === 401) {
    if (reLoginFlag) {
      reLoginFlag = false
      ElMessageBox.confirm('登陆已失效，请重新登录', '提示', {
        type: 'warning'
      }).then((): void => {
        removeToken()
        location.href = '/'
      }).catch((): void => {
        reLoginFlag = true
      })
    }
    return Promise.reject(msg)
  }
  ElMessage({
    message: msg,
    type: 'error'
  })
  return Promise.reject(new Error(msg))
}, (error: any) => {
  ElMessage({
    message: error,
    type: 'error'
  })
  return Promise.reject(error)
})

export default service
