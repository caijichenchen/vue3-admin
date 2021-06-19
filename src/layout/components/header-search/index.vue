<template>
  <el-tooltip content="搜索" placement="bottom">
    <el-button type="text" icon="el-icon-search" @click="handleClick" />
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = () => {
      console.log('22')
      emit('click')
    }
    return { handleClick }
  },
})
</script>

<style lang="scss" scoped></style>
