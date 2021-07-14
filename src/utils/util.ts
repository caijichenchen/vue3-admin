export const isObject = (data: any) =>
  Object.prototype.toString.call(data) === '[object Object]'
