import { createApp } from 'vue'
import App from '@/App.vue'
import router from "@/router"
import { setupStore } from '@/store'
import { setupDirective } from '@/directives'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import '@/permission'

// 自定义样式
import '@/styles/index.scss'

// 注册 svg
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

setupStore(app)
setupDirective(app)
app
  .use(router)
  .use(ElementPlus, {
    locale: {
      el: {
        // 整体覆盖
        ...zhLocale.el,
        pagination: {
          pagesize: '条/页',
          total: `共 {total} 条`,
          goto: '前往第',
          pageClassifier: '页'
        },
      }
    }
  })
  .component('SvgIcon', SvgIcon)
  .mount('#app')
