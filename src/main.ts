import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'

// 自定义样式
import './styles/index.scss'

const app = createApp(App)

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
  .mount('#app')
