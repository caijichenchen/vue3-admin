import { createStore, Module } from 'vuex'

interface ModuleMap {
  [key: string]: Module
}

const files = require.context('./modules', false, /\.ts$/)
const modules: ModuleMap = {}
files.keys().forEach((file: string) => {
  modules[file.replace(/(\.\/|\.ts$)/g, '')] = files(file).default
})

const store = createStore({
  modules,
})

export default store
