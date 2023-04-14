import { useUserStore } from '@/store/modules/user'

export default {
  mounted(el: any, binding: any): void {
    const userStore = useUserStore()

    const adminRole: string = 'admin'
    const roles: Array<string> = userStore.roles

    const { value } = binding

    const hasRole = (role: string): boolean => {
      return roles.includes(role) || roles.includes(adminRole)
    }

    if (typeof value === 'string') {
      if (!hasRole(value)) {
        el.parentNode.removeChild(el)
      }
    }
    if (value instanceof Array) {
      value.forEach(role => {
        if (!hasRole(role)) {
          el.parentNode.removeChild(el)
        }
      })
    }
  }
}
