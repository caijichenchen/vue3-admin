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
  current: string
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
  current: '',
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
  deleteSelectVisitedRoute(state: VisitedRouteState, index: number): void
  deleteLeftVisitedRoutes(state: VisitedRouteState, path: string): void
  deleteRightVisitedRoutes(state: VisitedRouteState, path: string): void
  deleteAllVisitedRoutes(state: VisitedRouteState): void
  deleteOtherVisitedRoutes(state: VisitedRouteState, path: string): void
  setDbRoutes(state: VisitedRouteState): void
  setCurrentPath(state: VisitedRouteState, current: string): void
  sortableTabs(
    state: VisitedRouteState,
    {
      oldIndex,
      newIndex,
    }: {
      oldIndex: number
      newIndex: number
    },
  ): void
}

const mutations: MutationTree<VisitedRouteState> & VisitedRouteMutations = {
  // 添加路由
  addVisitedRoute: (state: VisitedRouteState, route: VisitedRouteItem) => {
    state.list.push(route)
  },
  // 删除选中
  deleteSelectVisitedRoute: (state: VisitedRouteState, index: number) => {
    state.list.splice(index, 1)
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
  setCurrentPath: (state: VisitedRouteState, current: string) => {
    state.current = current
  },
  // 排序
  sortableTabs: (state: VisitedRouteState, { oldIndex, newIndex }) => {
    const sortPage = state.list[oldIndex]
    state.list.splice(oldIndex, 1)
    state.list.splice(newIndex, 0, sortPage)
  },
}

type VisitedRouteActions = {
  addRoute(
    {
      commit,
      state,
    }: {
      commit: Commit
      state: VisitedRouteState
    },
    route: VisitedRouteItem,
  ): void
  delSelectRoute(
    {
      commit,
      state,
    }: {
      commit: Commit
      state: VisitedRouteState
    },
    selectedPath: string,
  ): void
  delLeftRoutes(
    {
      commit,
      state,
    }: {
      commit: Commit
      state: VisitedRouteState
    },
    path: string,
  ): void
  delRightRoutes(
    {
      commit,
    }: {
      commit: Commit
    },
    path: string,
  ): void
  delOtherRoutes(
    {
      commit,
    }: {
      commit: Commit
    },
    path: string,
  ): void
  delAllRoutes(
    {
      commit,
      state,
    }: {
      commit: Commit
      state: VisitedRouteState
    },
    path: string,
  ): void
  sortTabs(
    {
      commit,
    }: {
      commit: Commit
    },
    {
      oldIndex,
      newIndex,
    }: {
      oldIndex: number
      newIndex: number
    },
  ): void
}

/**
 * 操作面板及删除会有两种情况
 * 1.操作当前打开页
 *  1.1 关闭当前/全部  需要准备下一个页面
 *  1.2 关闭左边/右边  不需要准备下一个页面
 * 2.操作非当前页
 *  2.1 关闭 不需要准备下一个页面
 *  2.2 关闭全部/左边/右边 需要准备下一个页面
 */
const actions: ActionTree<VisitedRouteState, RootState> & VisitedRouteActions =
  {
    addRoute: ({ commit, state }, route: VisitedRouteItem) => {
      const _index = state.list.findIndex((item) => item.path === route.path)
      _index <= -1 && commit('addVisitedRoute', route)
      commit('setCurrentPath', route.path)
      commit('setDbRoutes')
    },
    /**
     * 关闭当前页面也需要准备下一个页面
     */
    delSelectRoute({ commit, state }, selectedPath) {
      const _index = state.list.findIndex((item) => item.path === selectedPath)
      if (selectedPath === state.current) {
        const len = state.list.length - 1
        const nextIndex = _index === len ? len - 1 : _index
        const next = state.list[nextIndex]
        router.push({ path: next.path, query: next.query, params: next.params })
      }
      commit('deleteSelectVisitedRoute', _index)
      commit('setDbRoutes')
    },
    delLeftRoutes({ commit, state }, path: string) {
      const next = path || state.current
      const isCurrent = path === state.current
      commit('deleteLeftVisitedRoutes', path)
      const isCurrentDeleted =
        state.list.findIndex((item) => item.path === state.current) < 0
      if (!isCurrent && isCurrentDeleted) {
        // 当操作页非当前页 可能当前页也被删除  需准备下一个页面
        router.push(next)
      }
      commit('setDbRoutes')
    },
    delRightRoutes({ commit }, path: string) {
      const next = path || state.current
      const isCurrent = path === state.current
      commit('deleteRightVisitedRoutes', path)
      const isCurrentDeleted =
        state.list.findIndex((item) => item.path === state.current) < 0
      if (!isCurrent && isCurrentDeleted) {
        router.push(next)
      }
      commit('setDbRoutes')
    },
    delOtherRoutes({ commit }, path: string) {
      const next = path || state.current
      const isCurrent = path === state.current
      commit('deleteOtherVisitedRoutes', path)
      if (!isCurrent) {
        router.push(next)
      }
      commit('setDbRoutes')
    },
    delAllRoutes({ commit, state }, path: string) {
      commit('deleteAllVisitedRoutes', path)
      // 准备下一个页面
      const next = state.list[state.list.length - 1]
      router.push({ path: next.path, query: next.query, params: next.params })
      commit('setDbRoutes')
    },
    sortTabs({ commit }, index) {
      commit('sortableTabs', index)
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
