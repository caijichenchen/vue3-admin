import { isVNode, createVNode } from './vnode'
import { isArray, isObject } from '@vue3-mini/shared'

export function h(type, propsOrChildren, children) {
  const l = arguments.length
  if (l === 2) {
    // 类型 + 属性/孩子
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      return createVNode(type, propsOrChildren)
    } else {
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      // eslint-disable-next-line prefer-rest-params
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
