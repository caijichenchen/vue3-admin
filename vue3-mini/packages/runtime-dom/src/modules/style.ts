export const patchStyle = (el, prev, next) => {
  const style = el.style
  if (next === null) {
    el.removeAttribute('style')
  } else {
    if (prev) {
      for (const key in prev) {
        // 老的有新的没有置空
        if (!next[key]) {
          style[key] = ''
        }
      }
    }
    if (next) {
      for (const key in next) {
        style[key] = next[key]
      }
    }
  }
}
