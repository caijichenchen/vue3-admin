<template>
  <div>tree</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    emptyText: {
      type: String,
      default: 'no data',
    },
    nodeKey: {
      type: String,
      default: '',
    },
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled',
        }
      },
    },
    renderContent: {
      type: Function,
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
    checkOnClickNode: {
      type: Boolean,
      default: false,
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => [],
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    defaultCheckedKeys: {
      type: Boolean,
      default: false,
    },
    filterNodeMethod: {
      type: Function,
    },
    accordion: {
      type: Boolean,
      default: false,
    },
    indent: {
      type: Number,
      default: 16,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
