import { useUserStore } from "@/store/modules/user"

export default {
  mounted(el: any, binding: any) {
    const userStore = useUserStore()

    const allPermissions: string = '*:*:*'
    const permissions: Array<string> = userStore.permissions

    const { value } = binding

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

    function hasPermission(permission: string) {
      return permissions.includes(permission) || permissions.includes(allPermissions)
    }
  }
}
