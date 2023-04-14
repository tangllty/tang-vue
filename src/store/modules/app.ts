import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const sidebar: Ref<Boolean> = ref(false)

    return {
      sidebar
    }
})
