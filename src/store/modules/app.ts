import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const sidebar: Ref<boolean> = ref(false)

    return {
      sidebar
    }
})
