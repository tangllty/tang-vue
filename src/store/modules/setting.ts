import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { useCssVar, useDark } from '@vueuse/core'
import { store } from '@/store'
import { getTheme, saveTheme, setTheme } from '@/utils/theme'

export const useSettingStore = defineStore('setting', () => {
  const isDark: Ref<boolean> = ref(useDark().value ?? false)
  const theme: Ref<string> = ref(getTheme() ?? useCssVar('--el-color-primary', document.documentElement))

  // 刷新主题
  const flashTheme = (): void => {
    setTheme(theme.value)
    saveTheme(theme.value)
  }

  return {
    isDark,
    theme,
    flashTheme
  }
})

// 非setup
export const useSettingStoreHook = () => {
  return useSettingStore(store)
}
