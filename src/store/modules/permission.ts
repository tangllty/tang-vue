import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { store } from '@/store'
import { routes as constantRoutes, dynamicRoutes as allDynamicRoutes } from '@/router'
import { useUserStore } from '@/store/modules/user'
import { getRoutes as getRoutesApi } from '@/api/auth'

const modules = import.meta.glob('../../views/**/**.vue')
const Layout = () => import('@/layout/index.vue')

export const usePermissionStore = defineStore('permission', () => {
  const userStore = useUserStore()

  const routes = ref<RouteRecordRaw[]>([])

  /**
   * 过滤异步路由
   *
   * @param routes 路由
   * @returns 过滤后的路由
   */
  const filterAsyncRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    return routes.map((route) => {
      const tempRoute: any = { ...route }
      if (tempRoute.root) {
        if (tempRoute.type === 'MENU') {
          const children = {
            path: tempRoute.path,
            meta: tempRoute.meta,
            component: tempRoute.component,
          }
          tempRoute.children = [children]
        }
        tempRoute.component = Layout
      } else {
        tempRoute.component = modules[`../../views/${route.component}.vue`] as any
      }
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children)
      }
      return tempRoute
    })
  }

  /**
   * 过滤动态路由
   *
   * @param routes 路由
   * @returns 过滤后的路由
   */
  const filterDynamicRoutes = (routes: RouteRecordRaw[]) => {
    const adminRole: string = 'admin'
    const adminPermission: string = '*:*:*'
    const userRoles: string[] = userStore.roles
    const userPermissions: string[] = userStore.permissions

    return routes.filter((route: RouteRecordRaw) => {
      const { role, permission } = route.meta ?? {}
      const roles: string[] = Array.isArray(role) ? role : [role].filter(Boolean)
      const permissions: string[] = Array.isArray(permission) ? permission : [permission].filter(Boolean)

      const hasRole: boolean = userRoles.includes(adminRole) || roles.some((role: string) => userRoles.includes(role))
      const hasPermission: boolean = userPermissions.includes(adminPermission) || permissions.some((permission: string) => userPermissions.includes(permission))

      if (hasRole || hasPermission) {
        if (route.children) {
          route.children = filterDynamicRoutes(route.children)
        }
        return true
      }
      return false
    })
  }

  /**
   * 获取路由
   *
   * @returns 路由
   */
  const getRoutes = async (): Promise<RouteRecordRaw[]> => {
    try {
      const res: any = await getRoutesApi()
      const asyncRoutes = res.data
      const accessedRoutes: RouteRecordRaw[] = filterAsyncRoutes(asyncRoutes)
      const dynamicRoutes: RouteRecordRaw[] = filterDynamicRoutes(allDynamicRoutes)
      routes.value = [...constantRoutes, ...accessedRoutes, ...dynamicRoutes]
      return [...accessedRoutes, ...dynamicRoutes]
    } catch (error) {
      console.error('Error during get routes:', error)
      throw error
    }
  }

  return {
    routes,
    getRoutes
  }
})

/**
 * 在非 setup 中使用
 *
 * @returns permission store
 */
export const usePermissionStoreHook = () => {
  return usePermissionStore(store)
}
