import router from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 全局进度条的配置
NProgress.configure({
  showSpinner: false,
  minimum: 0.25,
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()

  // 白名单路由
  const whiteList = ['/login'] as Array<String>

  if (userStore.token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const gotUserInfo = userStore.roles.length > 0
      if (gotUserInfo) {
        if (to.matched.length === 0) {
          from.path ? next({ path: from.path as string }) : next('/401')
        } else {
          next()
        }
      } else {
        await userStore.getInfo()
        const accessRoutes: RouteRecordRaw[] = await permissionStore.getRoutes()
        accessRoutes.forEach(route => router.addRoute(route))
        next({ ...to, replace: true })
      }
    }
  } else {
    // 白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login'})
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
