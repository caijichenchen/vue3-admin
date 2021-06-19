<template>
  <div style="width: 200px" @click="handleClick">vu3-admin</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const handleClick = () => {
      console.log('2222')
    }
    return { handleClick }
  },
})
</script>

<style lang="scss" scoped></style>
