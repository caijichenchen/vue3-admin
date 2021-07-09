'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.assign = assign;
exports.hasOwnProperty = hasOwnProperty;
exports.isArray = isArray;
exports.isChanged = isChanged;
exports.isFunction = isFunction;
exports.isIntegerKey = isIntegerKey;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
//# sourceMappingURL=shared.cjs.js.map
