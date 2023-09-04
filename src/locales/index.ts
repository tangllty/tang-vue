import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import type { Language } from 'element-plus/es/locale';
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const modules = import.meta.glob('./lang/*.ts')
const elementPlusModules = import.meta.glob('../../node_modules/element-plus/es/locale/lang/*.mjs')

const messages: { [key: string]: any } = {}
export const langs: { key: string, title: string, sort: number }[] = []

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
  locale: appStore.language,
  messages,
  globalInjection: true,
  legacy: false
})

const getLocale = async (): Promise<Language> => {
  const elementPlusLangModule = await elementPlusModules[`../../node_modules/element-plus/es/locale/lang/${appStore.language}.mjs`]() as any
  return elementPlusLangModule.default
}

const elementPlusI18n = {
  locale: await getLocale(),
}

export const setupI18n = (app: App<Element>): void => {
  app.use(i18n)
}

export const setupElementPlusI18n = (app: App<Element>): void => {
  app.use(ElementPlus, elementPlusI18n)
}
