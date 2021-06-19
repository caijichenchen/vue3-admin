<template>
  <el-tooltip placement="botton" :content="isFull ? '退出全屏' : '全屏'">
    <el-button
      class="btn-text"
      type="text"
      icon="el-icon-full-screen"
      @click="handleClick"
    />
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import screenfull from 'screenfull'
export default defineComponent({
  setup() {
    const isFull = ref(false)
    onMounted(() => {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          isFull.value = !isFull.value
        })
      }
    })

    const handleClick = () => {
      if (!screenfull.isEnabled) return false
      screenfull.toggle()
    }
    return { isFull, handleClick }
  },
})
</script>

<style lang="scss" scoped></style>
