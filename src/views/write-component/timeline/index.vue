<template>
  <c-timeline>
    <c-timeline-item
      v-for="item in list"
      :key="item.key"
      :timestamp="item.title"
    >
      {{ title }}
    </c-timeline-item>
  </c-timeline>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import CTimeline from './components/timeline.vue'
import CTimelineItem from './components/timelineItem.vue'
export default defineComponent({
  components: { CTimeline, CTimelineItem },
  setup() {
    const list = reactive([
      {
        key: 1,
        title: '1',
      },
      {
        key: 2,
        title: '2',
      },
    ])
    return { list }
  },
})
</script>

<style></style>
