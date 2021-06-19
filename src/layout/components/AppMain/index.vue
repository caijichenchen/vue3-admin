<template>
  <div class="app-main">
    <router-view :key="key" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  setup() {
    // setup中没有this 不能访问$router/$route 提供useRouter/useRoute
    const route = useRoute()
    const key = computed(() => {
      return route.path
    })
    return {
      key,
    }
  },
})
</script>

<style></style>
