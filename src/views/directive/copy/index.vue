<template>
  <div>
    <el-button v-copy="text" type="primary">复制</el-button>
    {{ count }}
    <input v-dot="count" dot="count" type="text" />
    {{ form.age }}
    <input v-dot="form.age" dot="form[age]" type="text" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import copy from '@/directive/copy'
import dot from '@/directive/dotnumber'
export default defineComponent({
  directives: {
    copy,
    dot,
  },
  setup() {
    const text = ref('红红火火恍恍惚惚')
    const count = ref(0)
    const form = reactive({ age: 1 })
    return {
      text,
      count,
      form,
    }
  },
})
</script>

<style></style>
