import { defineStore } from 'pinia'
import { Ref, ref, watch } from 'vue'
import settings from '@/settings'

// 获取 localStorage 中的 boolean 值
const getValue = (key: string): boolean | null => {
  const value: string | null = localStorage.getItem(key)
  if (value === null) {
    return null
  }
  return value === 'true'
}

export const useAppStore = defineStore('app', () => {
  // 侧边栏头部是否显示
  const sidebarHeader: Ref<boolean> = ref(getValue('sidebarHeader') ?? settings.sidebarHeader)
  // 侧边栏展开时，是否显示logo
  const sidebarHeaderLogo: Ref<boolean> = ref(getValue('sidebarHeaderLogo') ?? settings.sidebarHeaderLogo)
  // 顶部是否固定
  const fixedHeader: Ref<boolean> = ref(getValue('fixedHeader') ?? settings.fixedHeader)
  // 折叠侧边栏
  const sidebar: Ref<boolean> = ref(getValue('sidebar') ?? settings.sidebar)
  // 语言
  const language: Ref<string> = ref(localStorage.getItem('language') ?? settings.language)

  watch([sidebarHeader, sidebarHeaderLogo, fixedHeader, sidebar], (): void => {
    localStorage.setItem('sidebarHeader', String(sidebarHeader.value))
    localStorage.setItem('sidebarHeaderLogo', String(sidebarHeaderLogo.value))
    localStorage.setItem('fixedHeader', String(fixedHeader.value))
    localStorage.setItem('sidebar', String(sidebar.value))
    localStorage.setItem('language', language.value)
  }, { deep: true })

  return {
    sidebarHeader,
    sidebarHeaderLogo,
    fixedHeader,
    sidebar,
    language
  }
})
