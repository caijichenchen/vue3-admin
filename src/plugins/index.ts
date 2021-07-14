import { App } from 'vue'
import router from '../router/index'
import store from '../store/index'
import language from '../language'

// import copy from '../directive/modules/copy'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

export default {
  install(app: App) {
    app.use(router)
    app.use(store)
    app.use(language)

    // app.directive('copy', copy)

    app.use(ElementPlus)
  },
}
