import { ObjectDirective } from 'vue'

const skeleton: ObjectDirective = {
  mounted(el) {
    const { width, height, left, top } = el.getBoundingClientRect()
    console.log(left, top)
    const mask = document.createElement('div')
    const maskStyles = {
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      left: '0px',
      top: `0px`,
      bottom: '0px',
      right: '0px',
      backgroundColor: '#fff',
    }
    addStyle(mask, maskStyles)
    el.appendChild(mask)
    el._mask = mask
    renderSkeleton(el, left, top, mask)
  },
  updated(el, binding) {
    if (!binding.value) {
      el._mask && el.removeChild(el._mask)
    }
  },
}

// eslint-disable-next-line prettier/prettier
function addStyle(target: HTMLElement, styles: { [key: string]: string; }) {
  for (const key in styles) {
    target.style[key] = styles[key]
  }
}

function renderSkeleton(
  el: HTMLElement,
  left: number,
  top: number,
  mask: HTMLElement,
) {
  const rules = [
    { cls: 'skeleton-block', radius: 'none' },
    { cls: 'skeleton-circle', radius: '50%' },
  ]
  rules.forEach((rule) => {
    const skeletonItem = el.getElementsByClassName(rule.cls)
    renderSkeletonItem(skeletonItem, left, top, mask, rule)
  })
}

function renderSkeletonItem(
  skeletonArr: any,
  left: number,
  top: number,
  el: HTMLElement,
  rule: any,
) {
  Array.from(skeletonArr).forEach((skeleton: any) => {
    const styleInfo = skeleton.getBoundingClientRect()
    const loadBox = document.createElement('div')
    const styles = {
      position: 'absolute',
      backgroundColor: '#e5e5e5',
      width: styleInfo.width + 'px',
      height: styleInfo.height + 'px',
      left: styleInfo.left - left + 'px',
      top: styleInfo.top - top + 'px',
      borderRadius: rule.radius,
    }
    addStyle(loadBox, styles)
    loadBox.className = 'skeleton-fade'
    el.appendChild(loadBox)
  })
}

export default skeleton
