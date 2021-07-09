<template>
  <c-timeline>
    <c-timeline-item
      v-for="item in list"
      :key="item.key"
      :timestamp="item.time"
    >
      {{ item.content }}
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
        time: '2021-7-8',
        content: '一giao窝哩giaogiao',
      },
      {
        key: 2,
        time: '2021-7-8  17:12',
        content: '八嘎',
      },
    ])
    return { list }
  },
})
</script>

<style></style>
