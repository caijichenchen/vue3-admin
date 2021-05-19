import { App } from 'vue'
import router from '../router/index'
// import store from '../store/index'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

export default {
  install(app: App) {
    app.use(router)
    // app.use(store)

    app.use(ElementPlus)
  },
}
