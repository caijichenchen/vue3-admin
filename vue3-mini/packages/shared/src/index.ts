export const isObject = (val) => typeof val === 'object' && val !== null

export const assign = (val1, val2) => Object.assign(val1, val2)

export const isArray = (val) => Array.isArray(val)
export const isNumber = (val) => typeof val === 'number'
export const isString = (val) => typeof val === 'string'
export const isFunction = (val) => typeof val === 'function'

export const isIntegerKey = (val) => parseInt(val) + '' === val

const hasOwn = Object.prototype.hasOwnProperty
export const hasOwnProperty = (target, key) => hasOwn.call(target, key)

export const isChanged = (oldValue, newValue) => oldValue !== newValue

export { ShapeFlags } from './shapeFlags'
