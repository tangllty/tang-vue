import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const sidebar = ref(false)

    return {
      sidebar
    }
})
