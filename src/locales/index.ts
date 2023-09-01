import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import type { Language } from 'element-plus/es/locale';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const modules = import.meta.glob('./lang/*.ts')

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

const getLocale = (): Language => {
  // TODO 暂时的解决方案，后续需要做成动态加载
  return appStore.language === 'zh-cn' ? zhCn : en
}

const elementPlusI18n = {
  locale: getLocale(),
}

export const setupI18n = (app: App<Element>): void => {
  app.use(i18n)
}

export const setupElementPlusI18n = (app: App<Element>): void => {
  app.use(ElementPlus, elementPlusI18n)
}
