// import { ObjectDirective, ComponentPublicInstance } from 'vue'

const normalDotNumber = (value) => {
  const val = value
    // 先把非数字的都替换掉，除了数字和.
    .replace(/[^\d.]/g, '')
    // 必须保证第一个为数字而不是.
    .replace(/^\./g, '')
    // 保证.只出现一次，而不能出现两次以上
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    // 只能输入两个小数
    .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return val
}

const genAssignmentCode = (value, assignment) => {
  const res = parseModel(value)
  if (res.key === null) {
    return `${value}=${assignment}`
  } else {
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}

let len, str, chr, index, expressionPos, expressionEndPos

export function parseModel(val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim()
  len = val.length

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index = val.lastIndexOf('.')
    if (index > -1) {
      return {
        exp: val.slice(0, index),
        key: '"' + val.slice(index + 1) + '"',
      }
    } else {
      return {
        exp: val,
        key: null,
      }
    }
  }

  str = val
  index = expressionPos = expressionEndPos = 0

  while (!eof()) {
    chr = next()
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr)
    } else if (chr === 0x5b) {
      parseBracket(chr)
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos),
  }
}

function next() {
  return str.charCodeAt(++index)
}

function eof() {
  return index >= len
}

function isStringStart(chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket(chr) {
  let inBracket = 1
  expressionPos = index
  while (!eof()) {
    chr = next()
    if (isStringStart(chr)) {
      parseString(chr)
      continue
    }
    if (chr === 0x5b) inBracket++
    if (chr === 0x5d) inBracket--
    if (inBracket === 0) {
      expressionEndPos = index
      break
    }
  }
}

function parseString(chr) {
  const stringQuote = chr
  while (!eof()) {
    chr = next()
    if (chr === stringQuote) {
      break
    }
  }
}

export default {
  mounted(el, binding) {
    const name = el.getAttribute('dot')
    const instance = binding.instance
    el.value = binding.value
    const code = genAssignmentCode('form.age.a', '$event.target.value')
    console.log(code)
    const handleInput = (e) => {
      const { value } = e.target
      const dotValue = normalDotNumber(value)
      el.value = dotValue
      instance[name] = dotValue
    }
    el.addEventListener('input', handleInput, false)
  },
}
