<template>
  <div>
    <el-button v-copy="text" type="primary">复制</el-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import copy from '@/directive/copy'
export default defineComponent({
  directives: {
    copy,
  },
  setup() {
    const text = ref('红红火火恍恍惚惚')
    return {
      text,
    }
  },
})
</script>

<style>
</style>
