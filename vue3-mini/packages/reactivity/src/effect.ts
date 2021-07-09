import { isArray, isIntegerKey } from '@vue3-mini/shared'
import { TriggerOpTypes } from './operators'

function effect(fn, options: any = {}) {
  // 创建一个响应的effect,依赖变化时重新执行副作用
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    // 默认执行一次
    effect()
  }
  return effect
}

let uid = 0
let activeEffect // 当前的effect
const effectStack = [] // effect栈数组
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    /**
     * 当effect有嵌套关系时  可能会错误的引用当前的activeEffect
     * 利用栈 先进后出  当副作用执行完   更新activeEffect为栈数组的最后一项
     */
    if (!effectStack.includes(effect)) {
      // 防止重复添加
      try {
        activeEffect = effect
        effectStack.push(activeEffect)
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++ // 区分effect的唯一标识
  effect._isEffect = true // 标记响应式的effect
  effect.raw = fn // 副作用
  effect.options = options // 参数配置
  return effect
}

/**
 * target key effect对应数据结构关系
 * target --> key --> effect 例：{name:'c',age:12} --> name --> [effect1,effect2]
 * targetsMap
 * targetsMap --> target1 --> key --> effect
 */

const targetsMap = new WeakMap()
// 依赖收集
function track(target, type, key) {
  if (activeEffect === undefined || activeEffect === null) return
  // 拿到targetsMap对应target的Map集合 {key:Set}
  let depsMap = targetsMap.get(target)
  if (!depsMap) {
    targetsMap.set(target, (depsMap = new Map()))
  }
  // 拿到targetMap对应的key的Set集合 Set
  let depMap = depsMap.get(key)
  if (!depMap) {
    depsMap.set(key, (depMap = new Set()))
  }
  if (!depMap.has(activeEffect)) {
    depMap.add(activeEffect)
  }
  // console.log('ta', targetsMap)
}
// 依赖触发更新
function trigger(target, type, key?, value?, oldValue?) {
  // console.log('key', target, type, key, value, oldValue)
  const depsMap = targetsMap.get(target)
  console.log('3', targetsMap)
  if (!depsMap) return // 没有收集过effect依赖直接返回

  // 创建一个集合 统一执行副作用  去重
  const effects = new Set()
  const addEffect = (depMap) => {
    depMap && depMap.forEach((effect) => effects.add(effect))
  }

  /**
   * 查看修改的是否是数组且修改的是否是数组长度
   * q: 数据使用可能会使用到数组的长度、取数组某个下标值
   * r: 当更新数组的长度的时候  对应的数组长度的依赖和下标依赖也应该更新
   */
  if (isArray(target) && key === 'length') {
    depsMap.forEach((dep, key) => {
      // console.log('111', dep, key)
      /**
       * 查找收集过的key是否符合条件
       * 1. obj.arr.length 当修改数组长度时候收集过的arr.length需要改变
       * 2. obj.arr[2] 当修改数组长度时候收集过的key也就是对应的index值大于修改的数组长度value时(数组变短)需要改变
       */
      if (key > value || key === 'length') {
        addEffect(dep)
      }
    })
  } else {
    if (key !== undefined) {
      // 修改某个key
      addEffect(depsMap.get(key))
    }
    switch (type) {
      // 修改数组的某一个索引 当使用obj.arr时内部会自动收集length属性(对数组转成字符串调用toString,toString就会取得数组length)
      case TriggerOpTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          addEffect(depsMap.get('length'))
        }

        break
    }
  }

  effects.forEach((effect: any) => {
    if (effect.options.scheduler) {
      effect.options.scheduler()
    } else {
      effect()
    }
  })
}

export { effect, track, trigger }
