import router from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'

router.beforeEach(async (to, from, next) => {
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
        next()
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
