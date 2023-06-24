import { defineStore } from 'pinia'
import { Ref, ref, UnwrapRef } from 'vue'
import { store } from '@/store'
import { resetRouter } from '@/router'
import { AxiosResponse } from 'axios'
import { LoginForm } from '@/api/auth/types'
import { login as loginApi, logout as logoutApi, getInfo as getInfoApi } from '@/api/auth'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { SysUser, UserInfo } from '@/api/system/user/types'
import defaultAvatar from '@/assets/avatar.png'

export const useUserStore = defineStore('user', () => {

  const user: Ref<UnwrapRef<SysUser>> = ref<SysUser>({} as SysUser)
  const token: Ref<UnwrapRef<String>> = ref<String>(getToken() || '')
  // 角色集合
  const roles: Ref<string[]> = ref<Array<string>>([])
  // 权限集合
  const permissions: Ref<string[]> = ref<Array<string>>([])

  // 登录
  const login = (loginForm: LoginForm): Promise<void> => {
    return new Promise<void>((resolve, reject): void => {
      loginApi(loginForm).then((response: AxiosResponse<any>): void => {
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
  const logout = (): Promise<void> => {
    return new Promise<void>((resolve, reject): void => {
      logoutApi().then((): void => {
        resetAuth()
        resetRouter()
        resolve()
      }).catch((error): void => {
        reject(error)
      })
    })
  }

  // 获取信息
  const getInfo = (): Promise<UserInfo> => {
    return new Promise<UserInfo>((resolve, reject): void => {
      getInfoApi().then(({ data }): void => {
        user.value = data.user
        user.value.avatar = user.value.avatar ? import.meta.env.VITE_APP_BASE_API + data.user.avatar : defaultAvatar
        roles.value = data.roles
        permissions.value = data.permissions
        resolve(data)
      }).catch((error): void => {
        reject(error)
      })
    })
  }

  // 重置
  const resetAuth = (): void => {
    removeToken()
    token.value = ''
    roles.value = []
    permissions.value = []
  }

  return {
    user,
    token,
    roles,
    permissions,
    login,
    logout,
    getInfo
  }
})

// 非setup
export const useUserStoreHook = () => {
  return useUserStore(store)
}
