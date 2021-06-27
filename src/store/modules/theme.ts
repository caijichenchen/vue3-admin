import themeInfo, { ThemeItemType } from '@/config/modules/theme'
import { getTheme, setTheme } from '@/utils/db.ts'
import {
  GetterTree,
  ActionContext,
  MutationTree,
  ActionTree,
  Module,
  Commit,
  CommitOptions,
  DispatchOptions,
} from 'vuex'
import type { RootState } from '../store.type'

// state
type ThemeState = {
  activeName: string
  list: ThemeItemType[]
}

const state: ThemeState = {
  // 当前注册主题
  activeName: themeInfo.default,
  // 主题列表
  list: themeInfo.list,
}

// getters
type ThemeGetters = {
  activeThemeInfo(state: ThemeState): ThemeItemType | undefined
}

const getters: GetterTree<ThemeState, RootState> & ThemeGetters = {
  activeThemeInfo: (state: ThemeState) =>
    state.list.find((item: ThemeItemType) => item.name === state.activeName),
}

// mutations
type ThemeMutations = {
  register(state: ThemeState): void
  set(state: ThemeState, themeName: string): void
}

const mutations: MutationTree<ThemeState> & ThemeMutations = {
  register: (state: ThemeState) => {
    document.body.className = `theme-${state.activeName}`
  },
  set: (state: ThemeState, themeName: string) => {
    state.activeName = themeName
  },
}

// actions
// type ThemeActionsCtx = {
//   commit<K extends keyof ThemeMutations, P extends Parameters<ThemeMutations[K]>[1]>(
//     key: K,
//     payload: P,
//   >): ReturnType<ThemeMutations[K]>
// } & Omit<ActionContext<ThemeState, RootState>, 'commit'>
type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P]
}
type NamespacedMutations = Namespaced<Actions, 'theme'>
type ActionsCtx = Omit<
  ActionContext<ThemeState, RootState>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<
    K extends keyof ThemeMutations,
    P extends Parameters<ThemeMutations[K]>[1],
  >(
    key: K,
    payload?: P,
    options?: CommitOptions,
  ): ReturnType<ThemeMutations[K]>
} & {
  dispatch<
    K extends keyof NamespacedMutations,
    P extends Parameters<NamespacedMutations[K]>[1],
  >(
    key: K,
    payload: P,
    options?: DispatchOptions,
  ): ReturnType<NamespacedMutations[K]>
} & {
  getters: {
    [K in keyof ThemeGetters]: ReturnType<ThemeGetters[K]>
  }
}

interface Actions {
  // load({ commit, getters, dispatch }: ActionsCtx): void
  // eslint-disable-next-line prettier/prettier
  load({ commit }: { commit: Commit; }): void
  // eslint-disable-next-line prettier/prettier
  set({ commit }: { commit: Commit; }, themeName?: string): void
}

const actions: ActionTree<ThemeState, RootState> & Actions = {
  load({ commit }) {
    const history = getTheme()
    history && commit('set', history)
    commit('register')
  },
  set({ commit }, themeName: string) {
    setTheme(themeName)

    commit('set', themeName)
    commit('register')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as Module<ThemeState, RootState>
