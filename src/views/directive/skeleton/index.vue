<template>
  <div v-skeleton="load" class="s-box" style="width: 200px">
    <img src="" class="img-block skeleton-block" />
    <div class="list-wrap">
      <div v-for="item in 4" :key="item" class="list-item skeleton-circle" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import forms from '../../expand/form/index.vue'
import skeleton from '@/directive/skeleton'
export default defineComponent({
  // components: { forms },
  directives: { skeleton },
  setup() {
    const load = ref(true)
    setTimeout(() => {
      load.value = false
    }, 5000)
    return { load }
  },
})
</script>

<style lang="scss" scoped>
.s-box {
  // position: relative;
}
.img-block {
  width: 200px;
  height: 200px;
}
.list-wrap {
  display: flex;
  justify-content: space-between;
  .list-item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: red;
  }
}
</style>
