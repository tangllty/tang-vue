import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { usePermissionStoreHook } from '@/store/modules/permission'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: 'index',
    meta: { hidden: true },
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue'),
        meta: { title: '首页', icon: 'House' }
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('@/layout/index.vue'),
    meta: { hidden: true },
    children: [
      {
        path: '/profile',
        component: () => import('@/views/profile/index.vue'),
        redirect: '/profile/info',
        meta: { title: '个人中心', icon: 'House' },
        children: [
          {
            path: '/profile/info',
            component: () => import('@/views/profile/Info.vue'),
            meta: { title: '个人中心', icon: 'House' }
          },
          {
            path: '/profile/login-log',
            component: () => import('@/views/profile/LoginLog.vue'),
            meta: { title: '个人中心', icon: 'House' }
          }
        ]
      }
    ]
  }
]

// 动态路由
export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/system/dict',
    component: () => import('@/layout/index.vue'),
    meta: { permission: 'system:dict:list' },
    children: [
      {
        path: 'data/:typeId(\\d+)',
        component: () => import('@/views/system/dict/data/index.vue'),
        meta: { title: '字典数据', activeMenu: '/system/dict' },
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 重置路由
export function resetRouter() {
  const permissionStore = usePermissionStoreHook();
  permissionStore.routes.forEach(route => {
    const name = route.name
    if (name && router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

export default router
