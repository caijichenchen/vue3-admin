import { RouteModuleMap, RouteItem } from './router.type'

const files = require.context('./modules', false, /\.ts$/)
const modules: RouteModuleMap = {}

files.keys().forEach((file: string) => {
  modules[file.replace(/(\.\/|\.ts)/g, '')] = files(file).default
})

const routes = Object.values(modules) as RouteItem[]

const base = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
    hidden: true,
  },
]

export default [...base, ...routes]
