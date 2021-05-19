import { createStore } from 'vuex'

const files = require.context('./modules', false, /\.ts$/)
const modules: {[key:string]:any;} = {}
files.keys().forEach((file: string) => {
  modules[file.replace(/(\.\/|\.ts$)/g,'')] = files(file).default
})

const store = createStore({
  modules,
})

export default store
