import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes:Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue')
      },
      {
        path: '/system/user',
        component: () => import('@/views/system/user/index.vue')
      },
      {
        path: '/system/dept',
        component: () => import('@/views/system/dept/index.vue')
      },
      {
        path: '/system/menu',
        component: () => import('@/views/system/menu/index.vue')
      },
      {
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
