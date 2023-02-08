import { App } from 'vue'
import hasRole from '@/directives/authentication/hasRole'
import hasPermission from '@/directives/authentication/hasPermission'

export function setupDirective(app: App<Element>){
  app.directive('hasRole', hasRole)
  app.directive('hasPermission', hasPermission)
}