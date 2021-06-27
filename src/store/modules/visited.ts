import { RootState } from './../store.type'
import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'
import { getVisitedRoutes, setVisitedRoutes } from '@/utils/db'
import router from '@/router/index'

export type VisitedRouteItem = {
  path: string
  title: string
  name: string
  // eslint-disable-next-line prettier/prettier
  params: { [key: string]: any; }
  // eslint-disable-next-line prettier/prettier
  query: { [key: string]: any; }
  affix?: boolean
}

type VisitedRouteState = {
  list: VisitedRouteItem[]
}

const state: VisitedRouteState = {
  list: getVisitedRoutes() || [
    {
      path: '/vd-index',
      name: 'vd-index',
      title: '首页',
      params: {},
      query: {},
      affix: true,
    },
  ],
}

type VisitedRouteGetters = {
  visitedList(state: VisitedRouteState): VisitedRouteItem[]
}

const getters: GetterTree<VisitedRouteState, RootState> & VisitedRouteGetters =
  {
    visitedList: (state: VisitedRouteState) => state.list,
  }

type VisitedRouteMutations = {
  addVisitedRoute(state: VisitedRouteState, route: VisitedRouteItem): void
  deleteSelectVisitedRoute(state: VisitedRouteState, path: string): void
  deleteLeftVisitedRoutes(state: VisitedRouteState, path: string): void
  deleteRightVisitedRoutes(state: VisitedRouteState, path: string): void
  deleteAllVisitedRoutes(state: VisitedRouteState): void
  deleteOtherVisitedRoutes(state: VisitedRouteState, path: string): void
  setDbRoutes(state: VisitedRouteState): void
}

const mutations: MutationTree<VisitedRouteState> & VisitedRouteMutations = {
  // 添加路由
  addVisitedRoute: (state: VisitedRouteState, route: VisitedRouteItem) => {
    state.list.push(route)
  },
  // 删除选中
  deleteSelectVisitedRoute: (state: VisitedRouteState, path: string) => {
    const _index = state.list.findIndex((item) => item.path === path)
    state.list.splice(_index, 1)
  },
  // 删除左边
  deleteLeftVisitedRoutes: (state: VisitedRouteState, path: string) => {
    let _index = state.list.length
    state.list = state.list.filter((item, index) => {
      if (item.path === path) _index = index
      return index >= _index || item.affix
    })
  },
  // 删除右边
  deleteRightVisitedRoutes: (state: VisitedRouteState, path: string) => {
    let _index = state.list.length
    state.list = state.list.filter((item, index) => {
      if (item.path === path) _index = index
      return index <= _index || item.affix
    })
  },
  // 删除全部
  deleteAllVisitedRoutes: (state: VisitedRouteState) => {
    state.list = state.list.filter((item) => item.affix)
  },
  // 删除其他
  deleteOtherVisitedRoutes: (state: VisitedRouteState, path: string) => {
    state.list = state.list.filter((item) => item.path === path || item.affix)
  },
  // 持久化
  setDbRoutes: (state: VisitedRouteState) => {
    setVisitedRoutes(state.list)
  },
}

type VisitedRouteActions = {
  addRoute(
    // eslint-disable-next-line prettier/prettier
    { commit, state }: { commit: Commit; state: VisitedRouteState; },
    route: VisitedRouteItem,
  ): void
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  delSelectRoute({ commit }: { commit: Commit }, value: string): void
  // eslint-disable-next-line prettier/prettier
  delLeftRoutes({ commit }: { commit: Commit; }, path: string): void
  // eslint-disable-next-line prettier/prettier
  delRightRoutes({ commit }: { commit: Commit; }, path: string): void
  // eslint-disable-next-line prettier/prettier
  delOtherRoutes({ commit }: { commit: Commit; }, path: string): void
  // eslint-disable-next-line prettier/prettier
  delAllRoutes({ commit,state }: { commit: Commit;state: VisitedRouteState;}, path: string): void
}

const actions: ActionTree<VisitedRouteState, RootState> & VisitedRouteActions =
  {
    addRoute: ({ commit, state }, route: VisitedRouteItem) => {
      const _index = state.list.findIndex((item) => item.path === route.path)

      _index <= -1 && commit('addVisitedRoute', route)
      commit('setDbRoutes')
    },
    delSelectRoute({ commit }, value: string) {
      commit('deleteSelectVisitedRoute', value)
      commit('setDbRoutes')
    },
    delLeftRoutes({ commit }, path: string) {
      commit('deleteLeftVisitedRoutes', path)
      commit('setDbRoutes')
    },
    delRightRoutes({ commit }, path: string) {
      commit('deleteRightVisitedRoutes', path)
      commit('setDbRoutes')
    },
    delOtherRoutes({ commit }, path: string) {
      commit('deleteOtherVisitedRoutes', path)
      commit('setDbRoutes')
    },
    /**
     * 关闭左侧  关闭右侧  关闭其他 ==> 都只是针对当前tag 不需要准备下一个页面
     * 关闭全部需要准备下一个页面
     */
    delAllRoutes({ commit, state }, path: string) {
      commit('deleteAllVisitedRoutes', path)
      const next = state.list[state.list.length - 1]
      router.push({ path: next.path, query: next.query, params: next.params })
      commit('setDbRoutes')
    },
  }

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
