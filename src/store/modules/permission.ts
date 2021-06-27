import Layout from '@/layout/index.vue'
import { RootState } from './../store.type'
import { ActionTree, Commit, MutationTree } from 'vuex'
import routes from '@/router/routes'
import { RouteItem } from '@/router/router.type'

// 模拟权限路由表
const roleRoutes = [
  {
    path: '/role',
    name: 'role',
    meta: { title: '权限' },
    component: Layout,
    redirect: 'role-page',
    children: [
      {
        path: 'role-page',
        name: 'role-page',
        meta: { title: 'admin权限', roles: ['admin'] },
        component: () => import('@/views/role-page/admin.ts'),
      },
      {
        path: 'role-page',
        name: 'role-page',
        meta: { title: 'editor权限', roles: ['admin', 'editor'] },
        component: () => import('@/views/role-page/editor.ts'),
      },
    ],
  },
]
/**
 * 权限路由
 */

type PermissionState = {
  routersMap: RouteItem[] // 路由表
  addRoutes: RouteItem[] // 权限路由
}
const state: PermissionState = {
  routersMap: routes,
  addRoutes: [],
}

type PermissionMutations = {
  addRoleRoutes(state: PermissionState, routes: RouteItem[]): void
}
const mutations: MutationTree<PermissionState> & PermissionMutations = {
  addRoleRoutes: (state: PermissionState, routes: RouteItem[]) => {
    state.addRoutes = routes
    state.routersMap = state.routersMap.concat(routes)
  },
}

type PermissionActions = {
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  getRoleRoutes({
    commit,
    rootState,
  }: {
    commit: Commit
    rootState: RootState
  }): void
}
const actions: ActionTree<PermissionState, RootState> & PermissionActions = {
  getRoleRoutes({ commit, rootState }) {
    console.log('1', rootState)
    const role = 'admin'
    // 模拟请求
    new Promise((resolve) => {
      let routes: RouteItem[]
      if (role === 'admin') {
        routes = roleRoutes
      } else {
        routes = filterAsyncRoutes(roleRoutes, role)
      }
      commit('addRoleRoutes', routes)
      resolve(routes)
    })
  },
}

function filterAsyncRoutes(routes: RouteItem[], role: string): RouteItem[] {
  return routes.map((route) => {
    const cloneRoute = { ...route }
    const hasRole = hasPermission(cloneRoute, role)
    if (hasRole && cloneRoute.children) {
      cloneRoute.children = filterAsyncRoutes(cloneRoute.children, role)
    }
    return cloneRoute
  })
}

function hasPermission(route: RouteItem, role: string): boolean {
  let flag = true // 默认是有权限
  const roles = route.meta?.roles as string[] | undefined
  if (roles) {
    flag = roles?.some((item) => item === role)
  }
  return flag
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
