import { isArray, isObject, isString, ShapeFlags } from '@vue3-mini/shared'

export const isVNode = (vnode) => vnode.__v_isVnode

export const createVNode = (type, props, children = null) => {
  // 用来描述对应的内容  虚拟节点具有跨平台的能力
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT // dom
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT // component
    : 0
  const vnode = {
    __v_isVnode: true, //是一个虚拟节点
    type,
    props,
    children,
    el: null, // 会将虚拟节点跟真实节点对应
    key: props && props.key,
    shapeFlag, // 判断自己的类型和儿子的类型
  }
  normalizeChildren(vnode, children)
  return vnode
}

function normalizeChildren(vnode, children) {
  let type = 0
  if (children === null) {
    //
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.shapeFlag |= type
}

export const Text = Symbol('Text')
export function normalizeVNode(child) {
  if (isObject(child)) return child
  return createVNode(Text, null, String(child))
}
