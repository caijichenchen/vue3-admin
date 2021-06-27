import { defineComponent, h, PropType } from 'vue'

export interface ContextmenuItem {
  icon: string
  content: string
  value: string
}

export default defineComponent({
  props: {
    menuList: {
      type: Array as PropType<ContextmenuItem[]>,
      default: () => [],
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (value: string) => {
      emit('click', value)
    }

    return () =>
      props.menuList.map((menu) => {
        return h(
          'li',
          {
            class: 'el-dropdown-menu__item',
            key: menu.value,
            'data-value': menu.value,
            onClick: () => {
              handleClick(menu.value)
            },
          },
          [h('i', { class: menu.icon }), menu.content],
        )
      })
  },
})
