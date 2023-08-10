import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { useCssVar } from '@vueuse/core'
import { store } from '@/store'

export const useSettingStore = defineStore('setting', () => {
  const theme: Ref<string> = ref(localStorage.getItem('theme') ?? useCssVar('--el-color-primary', document.documentElement))
  // 设置主题
  useCssVar('--el-color-primary', document.documentElement).value = theme.value

  return {
    theme
  }
})

// 非setup
export const useSettingStoreHook = () => {
  return useSettingStore(store)
}
