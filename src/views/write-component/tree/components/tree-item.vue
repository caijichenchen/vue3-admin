<template>
  <div class="tree-item">
    <span>{{ data.label }}</span>
    <div v-if="data.children" style="margin-left: 12px">
      <tree-item v-for="item in data.children" :key="item.label" :data="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TreeItem',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.tree-item {
  cursor: pointer;
}
</style>
