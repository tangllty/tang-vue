import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { routes as constantRoutes, dynamicRoutes as allDynamicRoutes } from '@/router'
import { store } from '@/store'
import { getRoutes as getRoutesApi } from '@/api/auth'
import { useUserStore } from './user'

const modules = import.meta.glob('../../views/**/**.vue')
export const Layout = () => import('@/layout/index.vue')

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])

  const userStore = useUserStore()

  const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
    const res: RouteRecordRaw[] = []
    routes.forEach(route  => {
      const temp = { ...route } as any;
      if (temp.component == 'Layout') {
        temp.component = Layout
      } else {
        temp.component = modules[`../../views/${route.component}.vue`] as any;
      }
      res.push(temp)

      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children)
      }
    })
    return res
  }

  const filterDynamicRoutes = (routes: RouteRecordRaw[]) => {
    const res: RouteRecordRaw[] = []
    routes.forEach(route  => {
      const adminRole: string = 'admin'
      const adminPermission: string = '*:*:*'
      const userRoles: Array<string> = userStore.roles
      const userPermissions: Array<string> = userStore.permissions

      const roles: string[] = []
      const role = route.meta?.role
      const permissions: string[] = []
      const permission = route.meta?.permission

      if (typeof role === 'string') {
        roles.push(role)
      }
      if (role instanceof Array) {
        role.forEach(r => roles.push(r))
      }
      if (typeof permission === 'string') {
        permissions.push(permission)
      }
      if (permission instanceof Array) {
        permission.forEach(p => permissions.push(p))
      }

      const hasRole = userRoles.some(r => adminRole === r || roles.includes(r))
      const hasPermission = userPermissions.some(p => adminPermission === p || permissions.includes(p))
      if (hasRole || hasPermission) {
        res.push(route)
      }
    })
    return res
  }

  function getRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      getRoutesApi().then((response) => {
        const asyncRoutes = response.data
        const accessedRoutes = filterAsyncRoutes(asyncRoutes)
        const dynamicRoutes = filterDynamicRoutes(allDynamicRoutes)
        routes.value = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes.concat(dynamicRoutes))
      }).catch((error) => {
        reject(error)
      })
    })
  }

  return {
    routes,
    getRoutes
  }
})

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
