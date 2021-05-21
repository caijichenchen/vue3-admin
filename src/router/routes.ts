import { RouteRecordRaw } from 'vue-router'

interface RouteMap {
  [key:string]: RouteRecordRaw
}

const files = require.context('./modules', false, /\.ts$/)
const modules: RouteMap = {}

files.keys().forEach((file:string) => {
  modules[file.replace(/(\.\/|\.ts)/g, '')] = files(file).default
})

const routes:RouteRecordRaw[] = Object.values(modules)


export default routes
