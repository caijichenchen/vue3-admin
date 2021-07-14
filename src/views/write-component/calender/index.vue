<template>
  <div>
    <c-calender v-model="date" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import cCalender from './components/index.vue'
export default defineComponent({
  components: { cCalender },
  setup() {
    const date = ref(new Date())
    return { date }
  },
})
</script>

<style lang="scss" scoped></style>
