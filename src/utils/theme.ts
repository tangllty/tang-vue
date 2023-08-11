import { useCssVar } from '@vueuse/core'
import { useSettingStore } from '@/store/modules/setting'

// HEX 颜色正则
const colorReg: RegExp = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

// 设置主题
export const setTheme = (color: string): void => {
  const settingStore = useSettingStore()
  const isDark: boolean = settingStore.isDark

  const root: HTMLElement = document.documentElement
  const lightColor: string = useCssVar('--el-color-white', root).value
  const darkColor: string = useCssVar('--el-color-black', root).value
  const mixColor: string = isDark ? darkColor : lightColor
  const weight: number = 0.1

  useCssVar('--el-color-primary', root).value = color

  for (let i = 1; i < 10; i++) {
    useCssVar(`--el-color-primary-light-${i}`, root).value = mix(color, mixColor, weight * i)
  }

  useCssVar('--el-color-primary-dark-2', root).value = mix(color, darkColor, weight)
}

// 保存主题
export const saveTheme = (color: string): void => {
  localStorage.setItem('theme', color)
}

// 获取主题
export const getTheme = (): string | null => {
  return localStorage.getItem('theme')
}

// 删除主题
export const removeTheme = (): void => {
  localStorage.removeItem('theme')
}

// 混合颜色
const mix = (color: string, mixColor: string, weight: number): string => {
  if (!colorReg.test(color) || !colorReg.test(mixColor) || weight < 0 || weight > 1) {
    return ''
  }

  const rgb: number[] | null = hexToRgb(color)
  const mixRgb: number[] | null = hexToRgb(mixColor)

  if (!rgb || !mixRgb) {
    return ''
  }

  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(rgb[i] * (1 - weight) + mixRgb[i] * weight)
  }

  return rgbToHex(rgb)
}

// HEX 转 RGB
const hexToRgb = (hex: string): number[] | null => {
  if (!colorReg.test(hex)) {
    return null
  }
  hex = hex.replace('#', '')
  const rgb: number[] = []
  for (let i = 0; i < 3; i++) {
    rgb.push(parseInt(hex.substring(i * 2, i * 2 + 2), 16))
  }
  return rgb
}

// RGB 转 HEX
const rgbToHex = (rgb: number[]): string => {
  let hex = '#'
  for (let i = 0; i < 3; i++) {
    hex += ('0' + Math.floor(rgb[i]).toString(16)).slice(-2)
  }
  return hex
}
