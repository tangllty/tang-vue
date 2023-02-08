import { useUserStore } from "@/store/modules/user"

export default {
  mounted(el: any, binding: any) {
    const userStore = useUserStore()

    const adminRole: string = 'admin'
    const roles: Array<string> = userStore.roles

    const { value } = binding

    if (!roles.includes(value) && !roles.includes(adminRole)) {
      el.parentNode.removeChild(el)
    }
  }
}
