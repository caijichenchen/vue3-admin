import { RouteRecordRaw } from 'vue-router'

const files = require.context('./modules', false, /\.ts$/)
const modules: {[key:string]: RouteRecordRaw;} = {}
files.keys().forEach((file:string) => {
  modules[file.replace(/(\.\/|\.ts)/g, '')] = files(file).default
})

const routes:RouteRecordRaw[] = []
for(const key in modules) {
  routes.push(modules[key])
}

export default routes
