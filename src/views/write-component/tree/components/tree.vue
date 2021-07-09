<template>
  <div class="c-tree">
    1
    <tree-item v-for="item in data" :key="item.label" :data="item" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import treeItem from './tree-item.vue'
export default defineComponent({
  name: 'Tree',
  components: { treeItem },
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

<style lang="scss" scoped></style>
