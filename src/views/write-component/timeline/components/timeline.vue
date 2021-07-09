<script lang="ts">
import { defineComponent, h } from 'vue'
export default defineComponent({
  setup(props, { slots }) {
    return () => h('ul', { class: 'c-timeline-wrapper' }, slots.default?.())
  },
})
</script>

<style>
.c-timeline-wrapper .timeline-item:last-child .timeline-item__tail {
  display: none;
}
</style>
<style lang="scss" scoped>
.c-timeline-wrapper {
  list-style: none;
  margin: 0;
}
</style>
