import { useUserStore } from "@/store/modules/user"

export default {
  mounted(el: any, binding: any) {
    const userStore = useUserStore()

    const allPermissions: string = '*:*:*'
    const permissions: Array<string> = userStore.permissions

    const { value } = binding

    if (!permissions.includes(value) && !permissions.includes(allPermissions)) {
      el.parentNode.removeChild(el)
    }
  }
}
