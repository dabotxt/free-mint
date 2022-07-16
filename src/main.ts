import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from './store'
import './styles/index.scss'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'src/styles/font-family/font.css'
const app = createApp(App)
setupStore(app)
app.use(router).mount('#app')
