import themeInfo from '@/config/modules/theme'
import { getTheme, setTheme } from '@/utils/db.ts'

export default {
  namespace: true,
  state: {
    // 当前注册主题
    activeName: getTheme() || themeInfo.default,
    // 主题列表
    map: themeInfo.map,
  },
  getters: {
    activeThemeInfo: (state) => state.map[state.activeName],
  },
  mutations: {
    registered: (state) => {
      document.body.className = `theme-${state.activeName}`
    },
    set: (state, themeName: string) => {
      state.activeName = themeName
    },
  },
  actions: {
    load({ commit }) {
      commit('registered')
    },
    set({ commit }, themeName: string) {
      setTheme(themeName)

      commit('set', themeName)
      commit('registered')
    },
  },
}
