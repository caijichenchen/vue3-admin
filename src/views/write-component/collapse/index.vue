<template>
  <c-collapse v-model="list">
    <c-collapse-item title="1" name="1"> 1111</c-collapse-item>
    <c-collapse-item title="2" name="2"> 2222</c-collapse-item>
    <c-collapse-item title="3" name="3"> 2222</c-collapse-item>
  </c-collapse>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import cCollapse from './components/c-collapse.vue'
import cCollapseItem from './components/c-collapse-item.vue'
export default defineComponent({
  components: { cCollapseItem, cCollapse },
  setup() {
    const list = ref(['1'])
    return { list }
  },
})
</script>

<style lang="scss" scoped></style>
