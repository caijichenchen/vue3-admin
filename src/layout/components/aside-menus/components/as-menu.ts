import { RouteRecordRaw } from 'vue-router'
import path from 'path'
import { RouteItem } from '@/router/router.type'

let _h: any

const resolveBasePath = (basePath, path) => path.join(basePath, path)
const resolvePath = (basePath, parentPath, childPath) =>
  path.join(basePath, parentPath, childPath)

export function renderSubMenu(route: RouteItem, h?: any) {
  !_h && (_h = h)
  return _h(
    'el-submenu',
    {
      key: route.path,
      index: route.path,
    },
    [
      _h(
        'div',
        {
          slot: 'title',
        },
        _h('span', {}, route.meta?.title),
      ),
      route.children
        ? route.children.map((item) => renderSubMenu(item))
        : route.meta?.httpHref
        ? _h(
            'a',
            {
              key: route.meta?.httpHref,
              href: route.meta?.httpHref,
              target: '_blank',
            },
            renderMenuItem(route),
          )
        : _h(
            'router-link',
            { key: route.path, to: route.path },
            renderMenuItem(route),
          ),
    ],
  )
}

export function renderMenuItem(route: RouteItem) {
  return _h(
    'el-menu-item',
    { key: route.path, index: route.path },
    _h('span', {}, route.meta?.title),
  )
}
