import router from '@/router'
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import webSocketService from '@/utils/websocket'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const userStore = useUserStoreHook()
const permissionStore = usePermissionStoreHook()

// 全局进度条的配置
NProgress.configure({
  showSpinner: false,
  minimum: 0.25,
})

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start()

  /**
   * 白名单路由
   */
  const whiteList: string[] = ['/login']

  if (!userStore.token) {
    if (whiteList.includes(to.path)) {
      return next()
    }
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.path === '/login') {
    const redirectUrl: string = to.query.redirect as string

    if (!redirectUrl) {
      return next({ path: '/' })
    }

    const redirectUrlArr: string[] = redirectUrl.split('?')

    if (redirectUrlArr.length === 1) {
      return next({ path: redirectUrl })
    }

    const redirectUrlParams: string[] = redirectUrlArr[1].split('&')
    const redirectUrlParamsObj: { [key: string]: string } = {}
    redirectUrlParams.forEach((item: string) => {
      const itemArr: string[] = item.split('=')
      redirectUrlParamsObj[itemArr[0]] = itemArr[1]
    })
    return next({ path: redirectUrlArr[0], query: redirectUrlParamsObj })
  }

  if (userStore.user.userId) {
    webSocketService.connect(import.meta.env.VITE_APP_WS_URL + userStore.user.userId)
  }

  const gotUserInfo: boolean = userStore.roles.length > 0

  if (gotUserInfo) {
    if (to.matched.length > 0) {
      return next()
    }
    return next(from.path ? { path: from.path } : '/401')
  }

  try {
    await Promise.all([userStore.getInfo(), permissionStore.getRoutes()])
    const accessRoutes: RouteRecordRaw[] = permissionStore.routes
    accessRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route))
    next({ ...to, replace: true })
  } catch (error) {
    console.error('Error during route navigation:', error)
    next('/500')
  }
})

router.afterEach((): void => {
  NProgress.done()
})
