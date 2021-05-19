import { ref } from 'vue'

export default function useSidebarOpen() {
  const sidebarOpen = ref(true)

  const toggleSideBar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    sidebarOpen,
    toggleSideBar,
  }
}
