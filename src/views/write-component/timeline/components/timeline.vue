<script lang="ts">
import { defineComponent, h } from 'vue'
export default defineComponent({
  setup() {
    return {}
  },
  render() {
    return h(
      'ul',
      {
        class: 'c-timeline-wrapper',
      },
      this.$slots.default?.(),
    )
  },
})
</script>

<style lang="scss" scoped>
.c-timeline-wrapper {
  list-style: none;
}
</style>
