<template>
  <el-tooltip content="主题" placement="bottom">
    <el-button
      type="text"
      class="btn-text can-hover"
      icon="el-icon-magic-stick"
      @click="themeVisible = true"
    />
  </el-tooltip>
  <el-dialog v-model="themeVisible" title="主题" width="600px">
    <theme-list :list="themeList" :active="active" @click="set" />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import themeList from './components/theme-list/index.vue'
// import useSetTheme from '../../Hooks/useSetTheme'
import { useStore } from 'vuex'
export default defineComponent({
  components: { themeList },
  setup() {
    const store = useStore()
    const themeVisible = ref(false)
    console.log(store.state.theme.activeName)

    const active = computed(() => store.state.theme.activeName)
    const themeList = computed(() => store.state.theme.list)
    // const { themeList, active, load, set } = useSetTheme()

    onMounted(() => {
      store.dispatch('theme/load')
    })
    const set = (name: string) => {
      store.dispatch('theme/set', name)
    }

    return { themeVisible, themeList, active, set }
  },
})
</script>

<style lang="scss" scoped></style>
