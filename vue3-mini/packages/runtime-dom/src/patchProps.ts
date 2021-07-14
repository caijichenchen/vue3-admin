import { patchAttrs } from './modules/attrs'
import { patchStyle } from './modules/style'
import { patchClass } from './modules/class'
import { patchEvent } from './modules/event'
// 针对属性操作
export const patchProps = (el, key, prev, next) => {
  switch (key) {
    case 'class':
      patchClass(el, next)
      break
    case 'style':
      patchStyle(el, prev, next)
      break
    default:
      if (/^on[A-Z]/.test(key)) {
        patchEvent(el, key, next)
      } else {
        patchAttrs(el, key, next)
      }
      break
  }
}
