<template>
  <div v-waves class="waves-wrapper">1</div>
</template>

<script>
import { defineComponent } from 'vue'
import wavesFunc from '@/directive/waves.ts'
export default defineComponent({
  directives: { waves: wavesFunc() },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.waves-wrapper {
  width: 300px;
  height: 300px;
  background-color: pink;
}
</style>
