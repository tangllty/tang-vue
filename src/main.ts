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

// 字典
import DictSpan from '@/components/Dict/Span/index.vue'
import DictTag from '@/components/Dict/Tag/index.vue'

const app = createApp(App)

import { getDicts } from '@/utils/dict'

app.config.globalProperties.$dict = getDicts

setupStore(app)
setupDirective(app)
app
  .use(router)
  .use(ElementPlus, { locale: zhLocale })
  .component('SvgIcon', SvgIcon)
  .component('Pagination', Pagination)
  .component('DictSpan', DictSpan)
  .component('DictTag', DictTag)
  .mount('#app')
