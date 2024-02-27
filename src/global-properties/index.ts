import type { App } from 'vue'
import { setupElementPlus } from './element-plus'
import { setupTangVue } from './tang-vue'

export const setupGlobalProperties = (app: App) => {
  setupElementPlus(app)
  setupTangVue(app)
}
