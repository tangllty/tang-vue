import { useUserStore } from '@/store/modules/user'

export default {
  mounted(el: any, binding: any): void {
    const userStore = useUserStore()

    const allPermissions: string = '*:*:*'
    const permissions: Array<string> = userStore.permissions

    const { value } = binding

    /**
     * 判断是否有权限
     *
     * @param permission 权限
     * @returns 是否有权限
     */
    const hasPermission = (permission: string): boolean => {
      return permissions.includes(permission) || permissions.includes(allPermissions)
    }

    if (typeof value === 'string') {
      if (!hasPermission(value)) {
        el.parentNode.removeChild(el)
      }
    }
    if (value instanceof Array) {
      value.forEach(permission => {
        if (!hasPermission(permission)) {
          el.parentNode.removeChild(el)
        }
      })
    }
  }
}
