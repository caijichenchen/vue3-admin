<template>
  <el-tooltip content="搜索" placement="bottom">
    <el-button
      class="btn-text can-hover"
      type="text"
      icon="el-icon-search"
      @click="handleClick"
    />
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('click')
    }
    return { handleClick }
  },
})
</script>

<style lang="scss" scoped></style>
