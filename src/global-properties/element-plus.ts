import type { App } from 'vue'
import { ElMessage, ElNotification, ElMessageBox, ElLoadingService } from 'element-plus/es'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-notification.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-loading.css'

export const setupElementPlus = (app: App) => {
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$msgbox = ElMessageBox
  app.config.globalProperties.$messageBox = ElMessageBox
  app.config.globalProperties.$alert = ElMessageBox.alert
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$prompt = ElMessageBox.prompt
  app.config.globalProperties.$loading = ElLoadingService
}
