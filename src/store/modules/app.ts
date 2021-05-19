import Cookies from 'js-cookie'
export default {
  namespace: true,
  state: {
    sidebar: {
      opend: !+Cookies.get('sidebarStatus'),
    },
  },
  mutations: {
    TOGGLE_SIDBAR(state) {
      if(state.sidebar.opend === 1) {
        Cookies.set('sidebarStatus', 0)
      }else {
        Cookies.set('sidebarStatus', 1)
      }

    },
  },
  actions: {
    toggleSiebar({ commit }) {
      commit('TOGGLE_SIDBAR')
    },
  },
}
