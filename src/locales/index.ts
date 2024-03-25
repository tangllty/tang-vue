import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { useSettingStore } from '@/store/modules/setting'
import { languages } from './types'

const settingStore = useSettingStore()

const modules = import.meta.glob('./lang/*.ts')

const messages: { [key: string]: any } = {}
export const langs: languages[] = []

// 动态加载语言包
await Promise.all(Object.keys(modules).map(async (path) => {
  const key = path.match(/\.\/lang\/(.*).ts$/)![1]
  const langModule = await modules[path]() as any
  const { title, sort, lang } = langModule.default
  messages[key] = { ...lang }
  langs.push({ key, title, sort })
}))

// 根据 sort 字段排序
langs.sort((a, b) => a.sort - b.sort)

const i18n = createI18n({
  locale: settingStore.language,
  messages,
  globalInjection: true,
  legacy: false
})

export const setupI18n = (app: App<Element>): void => {
  app.use(i18n)
}
