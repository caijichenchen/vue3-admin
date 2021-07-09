import { isObject } from '@vue3-mini/shared'
import {
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
  readonlyHandlers,
  mutableHandles,
} from './baseHandlers'

function reactive(target) {
  return createReactiveObject(target, false, mutableHandles)
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers)
}
function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers)
}

/**
 * 是不是仅读  是不是深度  柯里化
 * new Proxy() 最核心的还是拦截  数据的读取和修改 get set
 */
const reactiveMap = new WeakMap() // 自动垃圾回收 不会造成内存泄漏，key是一个对象
const readonlyMap = new WeakMap()
function createReactiveObject(target, isReadonly, baseHandlers) {
  // 只代理对象
  if (!isObject(target)) return target
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  // 已经被代理过了不需要被代理
  const existProxy = proxyMap.get(target)
  if (existProxy) return existProxy
  // 将代理对象缓存
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}

export { reactive, shallowReactive, shallowReadonly, readonly }
