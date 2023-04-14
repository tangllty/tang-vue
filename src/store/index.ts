import type { App } from 'vue'
import { createPinia, Pinia } from 'pinia'

const store: Pinia = createPinia()

// 全局挂载store
export const setupStore = (app: App<Element>): void => {
  app.use(store)
}

export { store }
