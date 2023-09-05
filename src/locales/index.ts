import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import type { EpPropMergeType } from 'element-plus/es/utils'
import type { Language } from 'element-plus/es/locale'
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

// 加载 Element Plus 国际化语言包
const getLocale = async (): Promise<Language> => {
  const langModule = await import(`../../node_modules/element-plus/dist/locale/${appStore.language}.mjs`) as any
  return langModule.default
}

type ElementPlusSize = EpPropMergeType<StringConstructor, '' | 'default' | 'small' | 'large', never>

const elementPlusI18n = {
  locale: await getLocale(),
  size: appStore.size as ElementPlusSize
}

export const flashLocale = async (): Promise<void> => {
  elementPlusI18n.locale = await getLocale()
}

export const flashSize = (): void => {
  elementPlusI18n.size = appStore.size as ElementPlusSize
}

export const setupI18n = (app: App<Element>): void => {
  app.use(i18n)
}

export const setupElementPlusI18n = (app: App<Element>): void => {
  app.use(ElementPlus, elementPlusI18n)
}
