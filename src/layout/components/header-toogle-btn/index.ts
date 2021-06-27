import { computed, defineComponent, h } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const handleClick = () => {
      store.dispatch('app/toggleAsideOpen', +collapse.value)
    }
    const collapse = computed(() => store.state.app.asideOpen)
    return () =>
      h(
        'div',
        {
          class: ['toggle-btn'],
        },
        h('i', {
          class: [
            'can-hover',
            'btn-text',
            `el-icon-s-${collapse.value ? 'unfold' : 'fold'}`,
          ],
          onClick: handleClick,
        }),
      )
  },
})
