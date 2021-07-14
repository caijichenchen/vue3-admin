import { isObject } from '@vue3-mini/shared'
import {
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
  readonlyHandlers,
  mutableHandles,
} from './baseHandlers'

// WeekMap 自动垃圾回收 key是一个对象  不会造成内存泄漏
const reactiveMap = new WeakMap()
const readlyonlyMap = new WeakMap()
const shallowReactiveMap = new WeakMap()
const shallowReadonlyMap = new WeakMap()

function reactive(target) {
  return createReactiveObject(target, false, mutableHandles, reactiveMap)
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowReactiveMap,
  )
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyMap,
  )
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readlyonlyMap)
}

/**
 * new Proxy() 最核心的还是拦截  数据的读取和修改 get set
 */
function createReactiveObject(target, isReadonly, baseHandlers, proxyMap) {
  // 只代理对象
  if (!isObject(target)) return target
  // 代理过得就不要再代理了
  const existingProxy = proxyMap.get(target)
  if (existingProxy) return existingProxy
  // 开启对象熟悉操作拦截
  const proxy = new Proxy(target, baseHandlers)
  // 将对象缓存
  proxyMap.set(target, proxy)
  return proxy
}

export { reactive, shallowReactive, shallowReadonly, readonly }
