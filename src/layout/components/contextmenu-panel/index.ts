import { defineComponent, h, Teleport, computed } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    x: {
      type: [String, Number],
      default: 0,
    },
    y: {
      type: [String, Number],
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    function hasClass(el: HTMLElement, cl: string): boolean | undefined {
      if (!el || !cl) return false
      if (el.classList && el.classList.contains(cl)) return true
      if (el.parentNode) return hasClass(el.parentNode as HTMLElement, cl)
      return false
    }

    const menuClass = 'vd-contextmenu-panel'

    const handle = (event: Event) => {
      const target = event.target as HTMLElement
      visible.value = Boolean(hasClass(target, menuClass))
    }

    const visible = computed({
      get: () => {
        document.addEventListener('mousedown', handle)
        return props.modelValue
      },
      set: (val) => {
        if (!val) {
          emit('update:modelValue', val)
          document.removeEventListener('mousedown', handle)
        }
      },
    })

    return () =>
      visible.value &&
      h(
        Teleport, // 将操作面板挂载到body下
        {
          to: 'body',
        },
        h(
          'ul',
          {
            class: menuClass,
            style: { top: props.y + 'px', left: props.x + 'px' },
          },
          slots.default?.(),
        ),
      )
  },
})
