import type { ObjectDirective } from 'vue'

const role = [1, 2, 3]

export default {
  mounted(el: HTMLElement, binding) {
    const { value } = binding
    if (!role.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
} as ObjectDirective
