import { RouteRecordRaw } from 'vue-router'

export type RouteItem = RouteRecordRaw & {
  hidden?: boolean
  httpHref?: string
}

export interface RouteModuleMap {
  [key: string]: RouteItem
}
