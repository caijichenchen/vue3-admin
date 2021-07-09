<script lang="ts">
import { createVNode, defineComponent, h } from 'vue'
import { ElInput } from 'element-plus'

export default defineComponent({
  setup() {
    return () => h('el-input', { modelValue: 0 }, {})
  },
})
</script>

<style lang="scss" scoped></style>
