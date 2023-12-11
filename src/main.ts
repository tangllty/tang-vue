import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setupStore } from '@/store'
import { setupDirective } from '@/directives'

// 权限
import '@/permission'

// uno.css
import 'virtual:uno.css'

// element-plus 样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 自定义样式
import '@/styles/index.scss'

// 注册 svg
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'

// 国际化
import { setupI18n, setupElementPlusI18n } from '@/locales'

// 分页
import Pagination from '@/components/Pagination/index.vue'

// 字典
import DictSpan from '@/components/Dict/Span/index.vue'
import DictTag from '@/components/Dict/Tag/index.vue'

// 代码高亮
import 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const app = createApp(App)

import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'
import webSocketService from '@/utils/websocket'
import contextMenu from '@/components/ContextMenu'

app.config.globalProperties.$dict = getDicts
app.config.globalProperties.$download = download
app.config.globalProperties.$path = getFullPath
app.config.globalProperties.$socket = webSocketService
app.config.globalProperties.$contextMenu = contextMenu

setupStore(app)
setupDirective(app)
setupI18n(app)
setupElementPlusI18n(app)
app
  .use(router)
  .use(hljsVuePlugin)
  .component('SvgIcon', SvgIcon)
  .component('Pagination', Pagination)
  .component('DictSpan', DictSpan)
  .component('DictTag', DictTag)
  .mount('#app')
