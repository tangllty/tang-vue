import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStoreHook()

  // 白名单路由
  const whiteList = ['/login'] as Array<String>

  if (userStore.token) {
    if (to.path === '/login') {
      next({ path: '/' })
    }
    next()
  } else {
    // 白名单
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login'})
    }
  }
})
