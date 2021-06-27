<template>
  <div class="vd-layout-logo" @click="handleClick">vu3-admin</div>
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

<style lang="scss" scoped>
.vd-layout-logo {
  width: 200px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
</style>
