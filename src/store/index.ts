import type { App } from 'vue'
import { createPinia, Pinia } from 'pinia'
import { useSettingStore } from './modules/setting'

const store: Pinia = createPinia()

// 全局挂载 store
export const setupStore = (app: App<Element>): void => {
  app.use(store)
  useSettingStore().flashTheme()
}

export { store }
