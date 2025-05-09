import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
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
   * 将路由占位符替换为动态路由 ${id} -> :id(\\d+)
   *
   * @param path 路由路径
   * @returns 替换后的路由路径
   */
  const replaceRoutePlaceholder = (path: string): string => {
    return path.replace(/\$\{(\w+)\}/g, (_, key) => {
      return `:${key}(\\d+)`
    })
  }

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
        if (tempRoute.path.includes('${')) {
          tempRoute.path = replaceRoutePlaceholder(tempRoute.path)
          tempRoute.props = true
        }
        tempRoute.component = modules[`../../views/${route.component}.vue`] as any
      }
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children)
      }
      return tempRoute
    })
  }

  const filterFrontendRoutes = (routes: RouteRecordRaw[], frontendRoutes: RouteRecordRaw[]) => {
    routes.forEach((route) => {
      const tempRoute: any = { ...route }
      if (tempRoute.type === 'PAGE') {
        frontendRoutes.push(tempRoute)
      }
      if (tempRoute.children) {
        filterFrontendRoutes(tempRoute.children, frontendRoutes)
      }
    })
  }

  // 递归移除 type 为 'PAGE' 的路由
  const removeFrontendRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    return routes
      .filter(route => (route as any).type !== 'PAGE')
      .map(route => {
        const tempRoute = { ...route }
        if (tempRoute.children) {
          tempRoute.children = removeFrontendRoutes(tempRoute.children)
        }
        return tempRoute
      })
  }

  const getAsyncRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const filteredAsyncRoutes: RouteRecordRaw[] = filterAsyncRoutes(routes)
    const frontendRoutes: RouteRecordRaw[] = []
    filterFrontendRoutes(filteredAsyncRoutes, frontendRoutes)
    return [...removeFrontendRoutes(filteredAsyncRoutes), ...frontendRoutes]
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
      const accessedRoutes: RouteRecordRaw[] = getAsyncRoutes(asyncRoutes)
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
