<template>
  <div class="fff">
    <create-form />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import createForm from './components/free-form'
export default defineComponent({
  components: { createForm },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
