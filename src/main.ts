import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setupStore } from '@/store'
import { setupDirective } from '@/directives'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
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
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'

app.config.globalProperties.$dict = getDicts
app.config.globalProperties.$download = download
app.config.globalProperties.$path = getFullPath

setupStore(app)
setupDirective(app)
app
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .component('SvgIcon', SvgIcon)
  .component('Pagination', Pagination)
  .component('DictSpan', DictSpan)
  .component('DictTag', DictTag)
  .mount('#app')
