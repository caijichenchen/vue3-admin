const isObject = (val) => typeof val === 'object' && val !== null;
const assign = (val1, val2) => Object.assign(val1, val2);
const isArray = (val) => Array.isArray(val);
const isNumber = (val) => typeof val === 'number';
const isString = (val) => typeof val === 'string';
const isFunction = (val) => typeof val === 'function';
const isIntegerKey = (val) => parseInt(val) + '' === val;
const hasOwn = Object.prototype.hasOwnProperty;
const hasOwnProperty = (target, key) => hasOwn.call(target, key);
const isChanged = (oldValue, newValue) => oldValue !== newValue;

export { assign, hasOwnProperty, isArray, isChanged, isFunction, isIntegerKey, isNumber, isObject, isString };
//# sourceMappingURL=shared.esm-builder.js.map
