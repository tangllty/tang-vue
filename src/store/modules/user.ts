import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store } from "@/store"
import { LoginForm } from "@/api/auth/types"
import { login as loginApi } from "@/api/auth"
import { getToken, setToken } from "@/utils/auth"

export const useUserStore = defineStore('user', () => {

  const token = ref<String>(getToken() ||'')

  // 登录
  function login(loginForm: LoginForm) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginForm)
        .then(response => {
          const getToken = response.data.token
          token.value = getToken
          setToken(getToken)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  return {
    token,
    login
  }

})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
