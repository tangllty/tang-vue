import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { routes as constantRoutes } from '@/router'
import { store } from '@/store'
import { getRoutes as getRoutesApi } from '@/api/auth'

const modules = import.meta.glob('../../views/**/**.vue')
export const Layout = () => import('@/layout/index.vue')

export const usePermissionStore = defineStore('permission', () => {
    const routes = ref<RouteRecordRaw[]>([])

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

    function getRoutes() {
        return new Promise<RouteRecordRaw[]>((resolve, reject) => {
            getRoutesApi().then((response) => {
                const asyncRoutes = response.data
                const accessedRoutes = filterAsyncRoutes(asyncRoutes)
                routes.value = constantRoutes.concat(accessedRoutes)
                resolve(accessedRoutes)
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
