import { isObject } from './util'

// 给dom设置样式
export function setStyle(
  el: HTMLElement,
  styleName:
    | CSSStyleDeclaration
    | string
    | {
        [key: string]: any
      },
  value?: string,
) {
  if (isObject(styleName)) {
    // for (const [key, val] in Object.entries(styleName)) {
    //   setStyle(el, key, val)
    // }
    Object.keys(styleName).forEach((styleKey) => {
      setStyle(el, styleKey, styleName[styleKey])
    })
  } else {
    el.style[styleName as string] = value
  }
}

// 获取dom上的样式
export function getStyle(el: HTMLElement, styleName: string): string | null {
  if (!el || !styleName) return null
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const style = el.style[styleName]
    if (style) return style
    const styleComputed = document.defaultView?.getComputedStyle(el, '')
    return styleComputed ? styleComputed[styleName] : ''
  } catch (e) {
    return el.style[styleName]
  }
}
