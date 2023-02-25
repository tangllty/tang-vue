import { App } from 'vue'
import hasRole from '@/directives/auth/hasRole'
import hasPermission from '@/directives/auth/hasPermission'

export function setupDirective(app: App<Element>){
  app.directive('hasRole', hasRole)
  app.directive('hasPermission', hasPermission)
}
