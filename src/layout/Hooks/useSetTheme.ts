import { reactive, ref } from 'vue'
import { setTheme, getTheme } from '@/utils/db'
import theme, { ThemeItemType } from '@/config/modules/theme'

export default function setThemeHook() {
  const themeList = reactive<ThemeItemType[]>(theme.list)
  const active = ref<string>(getTheme() || theme.default)
  // load theme
  const load = () => {
    const current = active.value
    register(current)
  }
  // set theme
  const set = (themeName: string) => {
    setTheme(themeName)
    active.value = themeName
    register(themeName)
  }

  // register theme
  const register = (themeName: string) => {
    document.body.className = `theme-${themeName}`
  }

  return {
    themeList,
    active,
    load,
    set,
    register,
  }
}
