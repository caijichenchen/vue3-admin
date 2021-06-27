import { createStore } from 'vuex'
import type { ModuleStoreItemMap } from './store.type'

const files = require.context('./modules', false, /\.ts$/)
const modules: ModuleStoreItemMap = {}
files.keys().forEach((file: string) => {
  modules[file.replace(/(\.\/|\.ts$)/g, '')] = files(file).default
})

const store = createStore({
  modules,
})

export default store
