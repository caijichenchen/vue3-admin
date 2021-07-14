// 实现new proxy(target, handlers)

import {
  assign,
  isObject,
  isArray,
  isIntegerKey,
  hasOwnProperty,
  isChanged,
} from '@vue3-mini/shared'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operators'
import { reactive, readonly } from './reactive'

/**
 * proxy + Reflect
 * Refect优势：
 *    r1: 后续Object上的方法会迁徙到Reflect上,例如Object.getProptypeof()
 *    r2: 以前的obj[key]设置值可能会失败，并不会报异常，也没有设置状态标识，Reflect方法会有一个状态标识true/false
 */
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      // 收集依赖
      track(target, TrackOpTypes.GET, key)
    }
    if (isShallow) return res
    /**
     * vue2的代理模式是一上来就递归对象的key代理，深度遍历对象，性能不好
     * vue3是当读取对象的key时才会触发代理,懒代理
     */
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}

function createSetter(isShallow = false) {
  return function set(target, key, value, receiver) {
    const oldVlaue = target[key]
    const hasKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwnProperty(target, key)
    const result = Reflect.set(target, key, value, receiver)
    if (!hasKey) {
      //新增
      trigger(target, TriggerOpTypes.ADD, key, value)
    } else if (isChanged(oldVlaue, value)) {
      // 修改
      trigger(target, TriggerOpTypes.SET, key, value, oldVlaue)
    }

    return result
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

const readonlyObj = {
  set() {
    return console.warn(`key in readonly`)
  },
}

const mutableHandles = {
  get,
  set,
}
const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
}
const readonlyHandlers = assign(
  {
    get: readonlyGet,
  },
  readonlyObj,
)
const shallowReadonlyHandlers = assign(
  {
    get: shallowReadonlyGet,
  },
  readonlyObj,
)

export {
  mutableHandles,
  shallowReadonlyHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
}
