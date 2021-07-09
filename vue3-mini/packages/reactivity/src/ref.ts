import { isArray, isChanged, isObject } from '@vue3-mini/shared'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operators'
import { reactive } from './reactive'

function ref(value) {
  return createrEef(value)
}

function shallowRef(value) {
  return createrEef(value, true)
}

function toRef(target, key) {
  return new ObjectRefImpl(target, key)
}

function toRefs(target) {
  const res = isArray(target) ? new Array(target.length) : {}
  for (const key in target) {
    res[key] = toRef(target, key)
  }
  return res
}

const convert = (value) => (isObject(value) ? reactive(value) : value)

class RefImpl {
  public _value // 声明一个_value
  // eslint-disable-next-line camelcase
  public __v_isRef = true // 产生的实例会被添加上一个__v_isRef属性表示是一个ref属性
  // 参数前加上修饰符 表示此属性会被加到实例上
  constructor(public rawValue, public isShallow) {
    // 如果是深度代理 使用reactive
    this._value = isShallow ? rawValue : convert(rawValue)
  }
  get value() {
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }
  set value(newValue) {
    if (isChanged(this.rawValue, newValue)) {
      this.rawValue = newValue
      this._value = this.isShallow ? newValue : convert(newValue)
      trigger(this, TriggerOpTypes.SET, 'value', newValue)
    }
  }
}

class ObjectRefImpl {
  public _value
  // eslint-disable-next-line camelcase
  public __v_isRef = true
  constructor(public target, public key) {}
  get value() {
    return this.target[this.key]
  }
  set value(newValue) {
    this.target[this.key] = newValue
  }
}

function createrEef(rawValue, isShallow = false) {
  return new RefImpl(rawValue, isShallow)
}

export { ref, shallowRef, toRef, toRefs }
