<template>
  <div class="per">
    <div class="cjc">
      <el-button ref="btn" v-permission="role0" type="primary">role0</el-button>
      <el-button v-permission="role1" type="primary">role1</el-button>
      <el-button v-permission="role2" type="primary">role22</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import permission from '@/directive/permission'
export default defineComponent({
  directives: {
    permission,
  },
  setup() {
    const btn = ref(null)
    const role1 = ref(1)
    const role2 = ref(2)
    const role0 = ref(0)

    return {
      btn,
      role0,
      role1,
      role2,
    }
  },
})
</script>

<style>
</style>
