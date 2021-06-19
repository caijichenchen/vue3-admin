<script lang="ts">
import { defineComponent, h, reactive } from 'vue'
import { CollapseType } from './collapse.type'
interface Arr {
  [index: number]: string | number
}
export default defineComponent({
  props: {
    modelValue: {
      type: [Array, String, Number] as CollapseType,
      default: () => [],
    },
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return {}
  },
  render() {
    const { $slots } = this
    return h(
      'div',
      {
        class: 'c-collapse',
      },
      $slots.default?.(),
    )
  },
})
</script>

<style lang="scss" scoped></style>
