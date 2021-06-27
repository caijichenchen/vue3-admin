import Cookies from 'js-cookie'
import { VisitedRouteItem } from '@/store/modules/visited'

/**
 * 主要用于信息存储
 * 只是在页面cookies/localstorage.get/set时并不方便数据的管理
 * 声明好响应的key只抛出对应的方法   在使用该方法时言简意赅的就能知道该方法作用
 */
const themeKey = 'theme'
const visitedRoutesKey = 'visitedRoutes'
const asideOpenKey = 'asideStatus'

export function setTheme(theme: string) {
  return Cookies.set(themeKey, theme)
}
export function getTheme() {
  return Cookies.get(themeKey)
}

export const setVisitedRoutes = (routes: VisitedRouteItem[]) =>
  Cookies.set(visitedRoutesKey, routes)
export const getVisitedRoutes = () => {
  const history = Cookies.get(visitedRoutesKey)
  return history ? JSON.parse(history) : false
}

export const removeVisitedRoutes = () => Cookies.remove(visitedRoutesKey)

export const getAsideOpen = () => !+(Cookies.get(asideOpenKey) || 0)
export const setAsideOpen = (value: string) => Cookies.set(asideOpenKey, value)
