<template>
  <div>
    tree
    <tree :data="data" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import tree from './components/tree.vue'
export default defineComponent({
  components: { tree },
  setup() {
    const data = [
      {
        label: '一级 1',
        children: [
          {
            label: '二级 1-1',
            children: [
              {
                label: '三级 1-1-1',
              },
            ],
          },
        ],
      },
      {
        label: '一级 2',
        children: [
          {
            label: '二级 2-1',
            children: [
              {
                label: '三级 2-1-1',
              },
            ],
          },
          {
            label: '二级 2-2',
            children: [
              {
                label: '三级 2-2-1',
              },
            ],
          },
        ],
      },
      {
        label: '一级 3',
        children: [
          {
            label: '二级 3-1',
            children: [
              {
                label: '三级 3-1-1',
              },
            ],
          },
          {
            label: '二级 3-2',
            children: [
              {
                label: '三级 3-2-1',
              },
            ],
          },
        ],
      },
    ]
    return { data }
  },
})
</script>

<style lang="scss" scoped></style>
