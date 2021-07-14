import { RouteRecordRaw } from 'vue-router'

export type RouteItem = RouteRecordRaw & {
  hidden?: boolean
  httpHref?: string
  meta?: RouteMeta
}

type RouteMeta = {
  title?: string
  role?: string[]
}

export interface RouteModuleMap {
  [key: string]: RouteItem
}
