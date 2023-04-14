import { App } from 'vue'
import hasRole from '@/directives/auth/hasRole'
import hasPermission from '@/directives/auth/hasPermission'

export const setupDirective = (app: App<Element>): void => {
  app.directive('hasRole', hasRole)
  app.directive('hasPermission', hasPermission)
}
