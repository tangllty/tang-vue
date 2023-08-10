import { useCssVar } from '@vueuse/core'

// 设置主题
export const setTheme = (color: string) => {
  useCssVar('--el-color-primary', document.documentElement).value = color
}

// 保存主题
export const saveTheme = (color: string) => {
  localStorage.setItem('theme', color)
}

// 删除主题
export const removeTheme = () => {
  localStorage.removeItem('theme')
}
