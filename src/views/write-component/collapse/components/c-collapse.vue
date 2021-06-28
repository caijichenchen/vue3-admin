<script lang="ts">
import mitt from 'mitt'
import { defineComponent, h, provide, ref, watch } from 'vue'
import { CollapseModelValue } from './collapse.type'

export default defineComponent({
  props: {
    modelValue: {
      type: [Array, String, Number] as CollapseModelValue,
      default: () => [],
    },
    accordion: {
      // 是否开启手风琴
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const collapseMitt = mitt()
    const opend = ref(([] as Array<string | number>).concat(props.modelValue))

    const handleItemClick = (item: any) => {
      if (props.accordion) {
        const update = opend.value[0] === item ? '' : item
        emit('update:modelValue', update)
      } else {
        const copy = [...opend.value]
        const _index = copy.findIndex((open) => open === item)
        if (_index >= 0) {
          copy.splice(_index, 1)
        } else {
          copy.push(item)
        }
        emit('update:modelValue', copy)
      }
    }

    watch(
      () => props.modelValue,
      (val) => {
        opend.value = ([] as Array<string | number>).concat(val)
      },
    )

    collapseMitt.on('item-click', handleItemClick)

    provide('c-collapse', {
      collapseMitt,
      opend,
    })

    return () =>
      h(
        'div',
        {
          class: 'c-collapse',
        },
        slots.default?.(),
      )
  },
})
</script>

<style lang="scss" scoped>
.c-collapse {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
</style>
