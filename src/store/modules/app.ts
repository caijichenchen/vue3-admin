import { getAsideOpen, setAsideOpen } from '@/utils/db'
import { Commit, MutationTree, ActionTree } from 'vuex'

type AppState = {
  asideOpen: boolean
}
const state: AppState = {
  asideOpen: getAsideOpen(),
}

type AppMutations = {
  changeAsideOpen(state: AppState, value: boolean): void
}
const mutations: MutationTree<AppState> & AppMutations = {
  changeAsideOpen: (state: AppState, value: boolean) => {
    state.asideOpen = value
  },
}

interface AppActions {
  // eslint-disable-next-line prettier/prettier
  toggleAsideOpen({ commit }: { commit: Commit; }, value: string | number): void
}
const actions: ActionTree<AppState, AppState> & AppActions = {
  toggleAsideOpen({ commit }, value: string | number) {
    setAsideOpen(value + '')
    const status = !+value
    commit('changeAsideOpen', status)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
