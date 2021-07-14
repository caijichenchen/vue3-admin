<template>
  <el-tooltip content="切换语言" placement="bottom">
    <el-button
      class="btn-text can-hover"
      type="text"
      icon="el-icon-s-grid"
      @click="handleClick"
    />
  </el-tooltip>
</template>

<script lang="ts">
import { getLanguage, setLanguage } from '@/utils/db'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  setup() {
    const { locale } = useI18n()
    const handleClick = () => {
      ElMessageBox.confirm('确认切换语言吗?', '切换语言', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const active = (locale.value = getLanguage() === 'ch' ? 'en' : 'ch')
          setLanguage(active)
          ElMessage({
            type: 'success',
            message: '切换成功!',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消切换',
          })
        })
    }
    return { handleClick }
  },
})
</script>

<style lang="scss" scoped></style>
