import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"

// 自定义样式
import './styles/index.scss'

const app = createApp(App)

app
  .use(router)
  .mount('#app')
