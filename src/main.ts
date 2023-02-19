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

// 分页
import Pagination from '@/components/Pagination/index.vue'

const app = createApp(App)

setupStore(app)
setupDirective(app)
app
  .use(router)
  .use(ElementPlus, { locale: zhLocale })
  .component('SvgIcon', SvgIcon)
  .component('Pagination', Pagination)
  .mount('#app')
