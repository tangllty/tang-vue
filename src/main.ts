import App from '@/App.vue'
import router from '@/router'
import { setupStore } from '@/store'
import { setupDirective } from '@/directives'

// 权限
import '@/permission'

// uno.css
import 'virtual:uno.css'

// element-plus 暗黑主题
import 'element-plus/theme-chalk/dark/css-vars.css'

// 自定义样式
import '@/styles/index.scss'
import '@/styles/dark/css-vars.scss'

// element-plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 国际化
import { setupI18n } from '@/locales'

// 代码高亮
import 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'
import webSocketService from '@/utils/websocket'
import contextMenu from '@/components/ContextMenu'
import { resetForm } from '@/utils/form'
import { notImplemented } from '@/utils/notImplemented'

app.config.globalProperties.$dict = getDicts
app.config.globalProperties.$download = download
app.config.globalProperties.$path = getFullPath
app.config.globalProperties.$socket = webSocketService
app.config.globalProperties.$contextMenu = contextMenu
app.config.globalProperties.$resetForm = resetForm
app.config.globalProperties.$notImplemented = notImplemented

setupStore(app)
setupDirective(app)
setupI18n(app)
app
  .use(router)
  .use(hljsVuePlugin)
  .mount('#app')
