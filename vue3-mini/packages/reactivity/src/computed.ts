import { isFunction } from '@vue3-mini/shared'
import { effect, track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operators'

function computed(gettersOptions) {
  let getter
  let setter
  if (isFunction(gettersOptions)) {
    getter = gettersOptions
    setter = () => {
      console.warn('computed must be readonly')
    }
  } else {
    getter = gettersOptions.get
    setter = gettersOptions.set
  }
  return createComputed(getter, setter)
}

class ComputedRefImpl {
  public _value
  public _dirty = true // 默认取值时不用缓存
  public _effect
  constructor(getter, public setter) {
    // computed的getter就是一个effect 里面会进行收集依赖
    this._effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          trigger(this, TriggerOpTypes.SET, 'value')
        }
      },
    })
  }
  get value() {
    // computed里的getter默认不执行  只有当取值的时候才会执行  返回值是getter的返回值  存入缓存 多次取值不会一直执行
    if (this._dirty) {
      this._value = this._effect()
      this._dirty = false
    }
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }
  set value(newValue) {
    this.setter(newValue)
  }
}

function createComputed(getter, setter) {
  return new ComputedRefImpl(getter, setter)
}

export { computed }
