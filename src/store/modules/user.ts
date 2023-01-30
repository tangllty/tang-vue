import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store } from "@/store"
import { LoginForm } from "@/api/auth/types"
import { login as loginApi, logout as logoutApi } from "@/api/auth"
import { getToken, removeToken, setToken } from "@/utils/auth"

export const useUserStore = defineStore('user', () => {

  const token = ref<String>(getToken() ||'')

  // 登录
  function login(loginForm: LoginForm) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginForm).then(response => {
        const getToken = response.data.token
        token.value = getToken
        setToken(getToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  // 登出
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi().then(() => {
        resetToken()
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  // 重置
  function resetToken() {
    removeToken()
    token.value = ''
  }

  return {
    token,
    login,
    logout
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
