const themeKey = 'theme'

export function setTheme(theme: string) {
  return window.sessionStorage.setItem(themeKey, theme)
}

export function getTheme() {
  return window.sessionStorage.getItem(themeKey)
}
