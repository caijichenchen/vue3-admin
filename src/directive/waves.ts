import type { ObjectDirective, DirectiveBinding } from 'vue'
import './waves.css'
export default function createWaves(options = {}) {
  return {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      const handleClick = (e: MouseEvent) => {
        const opts = {
          ...{ target: el, type: 'hit', bgColor: 'rgba(0,0,0,.15)' },
          ...options,
          value: binding.value,
        }
        const { target } = opts
        if (target) {
          target.style.position = 'relative'
          target.style.overflow = 'hidden'
          const rect = el.getBoundingClientRect()
          let ripple = el.querySelector('.waves-ripple') as HTMLElement
          if (!ripple) {
            ripple = document.createElement('span')
            ripple.className = 'waves-ripple'
            ripple.style.height = ripple.style.width =
              Math.max(rect.width, rect.height) + 'px'

            target.appendChild(ripple)
          } else {
            ripple.className = 'waves-ripple'
          }

          switch (opts.type) {
            case 'center':
              ripple.style.top =
                rect.height / 2 - ripple.offsetHeight / 2 + 'px'
              ripple.style.left = rect.width / 2 - ripple.offsetWidth / 2 + 'px'
              break
            default:
              ripple.style.top =
                e.pageY -
                rect.top -
                ripple.offsetHeight / 2 -
                document.body.scrollTop +
                'px'
              ripple.style.left =
                e.pageX -
                rect.left -
                ripple.offsetWidth / 2 -
                document.body.scrollLeft +
                'px'
          }
          ripple.style.backgroundColor = opts.bgColor
          ripple.className = 'waves-ripple z-active'
          return false
        }
      }
      el.addEventListener('click', handleClick, false)
    },
    // unmounted(el: HTMLElement) {
    //   const child = el.querySelector('waves-ripple')
    //   if (child) {
    //     el.removeChild(child)
    //   }
    // },
  } as ObjectDirective
}
