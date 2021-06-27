import { Commit, MutationTree } from 'vuex'

type UserInfo = {
  name: string
  role: string
}

type UserState = {
  name: string
  token: string
  role: string
}
const state: UserState = {
  name: '',
  token: '',
  role: '',
}

type UserMutations = {
  setToken(state: UserState, token: string): void
  setUserInfo(state: UserState, info: UserInfo): void
  clearAll(state: UserState): void
}
const mutations: MutationTree<UserState> & UserMutations = {
  setToken: (state: UserState, token: string) => {
    state.token = token
  },
  setUserInfo: (state: UserState, info: UserInfo) => {
    state.name = info.name
    state.role = info.role
  },
  clearAll: (state: UserState) => {
    state.name = ''
    state.role = ''
    state.token = ''
  },
}

type UserActions = {
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  logout({ commit }: { commit: Commit }): void
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  login({ commit }: { commit: Commit }): void
}

export default {
  namespaced: true,
  state,
  mutations,
}
