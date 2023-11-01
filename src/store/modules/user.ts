import { defineStore } from 'pinia'
import { Ref, ref, UnwrapRef } from 'vue'
import { store } from '@/store'
import { resetRouter } from '@/router'
import { AxiosResponse } from 'axios'
import sha256 from 'crypto-js/sha256'
import base64 from 'crypto-js/enc-base64'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { login as loginApi, logout as logoutApi, getInfo as getInfoApi } from '@/api/auth'
import { LoginForm } from '@/api/auth/types'
import { SysUser, UserInfo } from '@/api/system/user/types'
import defaultAvatar from '@/assets/avatar.png'

export const useUserStore = defineStore('user', () => {
  const user: Ref<UnwrapRef<SysUser>> = ref<SysUser>({} as SysUser)
  const token: Ref<UnwrapRef<string>> = ref<string>(getToken() ?? '')
  // 角色集合
  const roles: Ref<string[]> = ref<Array<string>>([])
  // 权限集合
  const permissions: Ref<string[]> = ref<Array<string>>([])

  // 登录
  const login = async (loginForm: LoginForm): Promise<void> => {
    try {
      // 加密后的表单
      const loginFormEncrypted: LoginForm = {
        ...loginForm,
        password: base64.stringify(sha256(loginForm.password))
      }
      const res: any = await loginApi(loginFormEncrypted)
      const getToken: string = res.data.token
      token.value = getToken
      setToken(getToken)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    try {
      await logoutApi()
      resetAuth()
      resetRouter()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // 获取信息
  const getInfo = async (): Promise<UserInfo> => {
    try {
      const res: AxiosResponse<UserInfo> = await getInfoApi()
      const data: UserInfo = res.data
      user.value = data.user
      user.value.avatar = user.value.avatar ? import.meta.env.VITE_APP_BASE_API + data.user.avatar : defaultAvatar
      roles.value = data.roles
      permissions.value = data.permissions
      return data
    } catch (error) {
      console.log(error)
      throw error
    }
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
