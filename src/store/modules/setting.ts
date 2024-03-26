import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { useCssVar, useDark } from '@vueuse/core'
import type { Language } from 'element-plus/es/locale'
import { store } from '@/store'
import { getTheme, saveTheme, setTheme } from '@/utils/theme'
import settings from '@/settings'

/**
 * 获取 localStorage 中的 boolean 值
 *
 * @param key 键
 * @returns boolean | null
 */
const getValue = (key: string): boolean | null => {
  const value: string | null = localStorage.getItem(key)
  if (value === null) {
    return null
  }
  return value === 'true'
}

export const useSettingStore = defineStore('setting', () => {
  const isDark: Ref<boolean> = ref(useDark().value ?? false)
  const theme: Ref<string> = ref(getTheme() ?? useCssVar('--el-color-primary', document.documentElement))
  /** 语言 */
  const language: Ref<string> = ref(localStorage.getItem('language') ?? settings.language)
  const elementPlusLocale: Ref<Language> = ref({} as Language)
  /** 组件大小 */
  const size: Ref<string> = ref(localStorage.getItem('size') ?? settings.size)
  /** 侧边栏头部是否显示 */
  const sidebarHeader: Ref<boolean> = ref(getValue('sidebarHeader') ?? settings.sidebarHeader)
  /** 侧边栏展开时，是否显示logo */
  const sidebarHeaderLogo: Ref<boolean> = ref(getValue('sidebarHeaderLogo') ?? settings.sidebarHeaderLogo)
  /** 顶部是否固定 */
  const fixedHeader: Ref<boolean> = ref(getValue('fixedHeader') ?? settings.fixedHeader)
  /** 折叠侧边栏 */
  const sidebar: Ref<boolean> = ref(getValue('sidebar') ?? settings.sidebar)

  const modules = import.meta.glob('../../../node_modules/element-plus/dist/locale/*.min.mjs')
  const elementPlusLocalePath = (val: string) => `../../../node_modules/element-plus/dist/locale/${val}.min.mjs`
  modules[elementPlusLocalePath(language.value)]().then(({ default: Language }: any) => elementPlusLocale.value = Language)

  const setElementPlusLocale = async (val: string) => {
    const { default: Language }: any = await modules[elementPlusLocalePath(val)]()
    elementPlusLocale.value = Language
  }

  watch(language, async (val: string) => {
    await setElementPlusLocale(val)
    localStorage.setItem('language', language.value)
  })
  watch(size, (val: string) => localStorage.setItem('size', val))
  watch(sidebarHeader, (val: boolean) => localStorage.setItem('sidebarHeader', String(val)))
  watch(sidebarHeaderLogo, (val: boolean) => localStorage.setItem('sidebarHeaderLogo', String(val)))
  watch(fixedHeader, (val: boolean) => localStorage.setItem('fixedHeader', String(val)))
  watch(sidebar, (val: boolean) => localStorage.setItem('sidebar', String(val)))

  /**
   * 刷新主题
   */
  const flashTheme = (): void => {
    setTheme(theme.value)
    saveTheme(theme.value)
  }

  const config = {
    isDark,
    theme,
    language,
    size,
    sidebarHeader,
    sidebarHeaderLogo,
    fixedHeader,
    sidebar,
  }
  return {
    config,
    ...config,
    elementPlusLocale,
    flashTheme
  }
})

/**
 * 在非 setup 中使用
 *
 * @returns setting store
 */
export const useSettingStoreHook = () => {
  return useSettingStore(store)
}
