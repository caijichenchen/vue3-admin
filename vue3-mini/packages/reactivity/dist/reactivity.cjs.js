'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (val) => typeof val === 'object' && val !== null;
const assign = (val1, val2) => Object.assign(val1, val2);
const isArray = (val) => Array.isArray(val);
const isFunction = (val) => typeof val === 'function';
const isIntegerKey = (val) => parseInt(val) + '' === val;
const hasOwn = Object.prototype.hasOwnProperty;
const hasOwnProperty = (target, key) => hasOwn.call(target, key);
const isChanged = (oldValue, newValue) => oldValue !== newValue;

function effect(fn, options = {}) {
    // 创建一个响应的effect,依赖变化时重新执行副作用
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        // 默认执行一次
        effect();
    }
    return effect;
}
let uid = 0;
let activeEffect; // 当前的effect
const effectStack = []; // effect栈数组
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        /**
         * 当effect有嵌套关系时  可能会错误的引用当前的activeEffect
         * 利用栈 先进后出  当副作用执行完   更新activeEffect为栈数组的最后一项
         */
        if (!effectStack.includes(effect)) {
            // 防止重复添加
            try {
                activeEffect = effect;
                effectStack.push(activeEffect);
                return fn();
            }
            finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    };
    effect.id = uid++; // 区分effect的唯一标识
    effect._isEffect = true; // 标记响应式的effect
    effect.raw = fn; // 副作用
    effect.options = options; // 参数配置
    return effect;
}
/**
 * target key effect对应数据结构关系
 * target --> key --> effect 例：{name:'c',age:12} --> name --> [effect1,effect2]
 * targetsMap
 * targetsMap --> target1 --> key --> effect
 */
const targetsMap = new WeakMap();
// 依赖收集
function track(target, type, key) {
    if (activeEffect === undefined || activeEffect === null)
        return;
    // 拿到targetsMap对应target的Map集合 {key:Set}
    let depsMap = targetsMap.get(target);
    if (!depsMap) {
        targetsMap.set(target, (depsMap = new Map()));
    }
    // 拿到targetMap对应的key的Set集合 Set
    let depMap = depsMap.get(key);
    if (!depMap) {
        depsMap.set(key, (depMap = new Set()));
    }
    if (!depMap.has(activeEffect)) {
        depMap.add(activeEffect);
    }
    // console.log('ta', targetsMap)
}
// 依赖触发更新
function trigger(target, type, key, value, oldValue) {
    // console.log('key', target, type, key, value, oldValue)
    const depsMap = targetsMap.get(target);
    console.log('3', targetsMap);
    if (!depsMap)
        return; // 没有收集过effect依赖直接返回
    // 创建一个集合 统一执行副作用  去重
    const effects = new Set();
    const addEffect = (depMap) => {
        depMap && depMap.forEach((effect) => effects.add(effect));
    };
    /**
     * 查看修改的是否是数组且修改的是否是数组长度
     * q: 数据使用可能会使用到数组的长度、取数组某个下标值
     * r: 当更新数组的长度的时候  对应的数组长度的依赖和下标依赖也应该更新
     */
    if (isArray(target) && key === 'length') {
        depsMap.forEach((dep, key) => {
            // console.log('111', dep, key)
            /**
             * 查找收集过的key是否符合条件
             * 1. obj.arr.length 当修改数组长度时候收集过的arr.length需要改变
             * 2. obj.arr[2] 当修改数组长度时候收集过的key也就是对应的index值大于修改的数组长度value时(数组变短)需要改变
             */
            if (key > value || key === 'length') {
                addEffect(dep);
            }
        });
    }
    else {
        if (key !== undefined) {
            // 修改某个key
            addEffect(depsMap.get(key));
        }
        switch (type) {
            // 修改数组的某一个索引 当使用obj.arr时内部会自动收集length属性(对数组转成字符串调用toString,toString就会取得数组length)
            case 0 /* ADD */:
                if (isArray(target) && isIntegerKey(key)) {
                    addEffect(depsMap.get('length'));
                }
                break;
        }
    }
    effects.forEach((effect) => {
        if (effect.options.scheduler) {
            effect.options.scheduler();
        }
        else {
            effect();
        }
    });
}

// 实现new proxy(target, handlers)
/**
 * proxy + Reflect
 * Refect优势：
 *    r1: 后续Object上的方法会迁徙到Reflect上,例如Object.getProptypeof()
 *    r2: 以前的obj[key]设置值可能会失败，并不会报异常，也没有设置状态标识，Reflect方法会有一个状态标识true/false
 */
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key);
        if (!isReadonly) {
            // 收集依赖
            track(target, 0 /* GET */, key);
        }
        if (isShallow)
            return res;
        /**
         * vue2的代理模式是一上来就递归对象的key代理，深度遍历对象，性能不好
         * vue3是当读取对象的key时才会触发代理,懒代理
         */
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(isShallow = false) {
    // console.log('222')
    return function set(target, key, value, receiver) {
        const oldVlaue = target[key];
        const hasKey = isArray(target) && isIntegerKey(key)
            ? Number(key) < target.length
            : hasOwnProperty(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (!hasKey) {
            //新增
            trigger(target, 0 /* ADD */, key, value);
        }
        else if (isChanged(oldVlaue, value)) {
            // 修改
            trigger(target, 1 /* SET */, key, value);
        }
        return result;
    };
}
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();
const shallowSet = createSetter(true);
const readonlyObj = {
    set() {
        return console.warn(`key in readonly`);
    },
};
const mutableHandles = {
    get,
    set,
};
const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet,
};
const readonlyHandlers = assign({
    get: readonlyGet,
}, readonlyObj);
const shallowReadonlyHandlers = assign({
    get: shallowReadonlyGet,
}, readonlyObj);

function reactive(target) {
    return createReactiveObject(target, false, mutableHandles);
}
function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers);
}
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers);
}
/**
 * 是不是仅读  是不是深度  柯里化
 * new Proxy() 最核心的还是拦截  数据的读取和修改 get set
 */
const reactiveMap = new WeakMap(); // 自动垃圾回收 不会造成内存泄漏，key是一个对象
const readonlyMap = new WeakMap();
function createReactiveObject(target, isReadonly, baseHandlers) {
    // 只代理对象
    if (!isObject(target))
        return target;
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    // 已经被代理过了不需要被代理
    const existProxy = proxyMap.get(target);
    if (existProxy)
        return existProxy;
    // 将代理对象缓存
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

function ref(value) {
    return createrEef(value);
}
function shallowRef(value) {
    return createrEef(value, true);
}
function toRef(target, key) {
    return new ObjectRefImpl(target, key);
}
const convert = (value) => (isObject(value) ? reactive(value) : value);
class RefImpl {
    rawValue;
    isShallow;
    _value; // 声明一个_value
    // eslint-disable-next-line camelcase
    __v_isRef = true; // 产生的实例会被添加上一个__v_isRef属性表示是一个ref属性
    // 参数前加上修饰符 表示此属性会被加到实例上
    constructor(rawValue, isShallow) {
        this.rawValue = rawValue;
        this.isShallow = isShallow;
        // 如果是深度代理 使用reactive
        this._value = isShallow ? rawValue : convert(rawValue);
    }
    get value() {
        track(this, 0 /* GET */, 'value');
        return this._value;
    }
    set value(newValue) {
        if (isChanged(this.rawValue, newValue)) {
            this.rawValue = newValue;
            this._value = this.isShallow ? newValue : convert(newValue);
            trigger(this, 1 /* SET */, 'value', newValue);
        }
    }
}
class ObjectRefImpl {
    target;
    key;
    _value;
    // eslint-disable-next-line camelcase
    __v_isRef = true;
    constructor(target, key) {
        this.target = target;
        this.key = key;
    }
    get value() {
        return this.target[this.key];
    }
    set value(newValue) {
        this.target[this.key] = newValue;
    }
}
function createrEef(rawValue, isShallow = false) {
    return new RefImpl(rawValue, isShallow);
}

function computed(gettersOptions) {
    let getter;
    let setter;
    if (isFunction(gettersOptions)) {
        getter = gettersOptions;
        setter = () => {
            console.warn('computed must be readonly');
        };
    }
    else {
        getter = gettersOptions.get;
        setter = gettersOptions.set;
    }
    return createComputed(getter, setter);
}
class ComputedRefImpl {
    setter;
    _value;
    _dirty = true; // 默认取值时不用缓存
    _effect;
    constructor(getter, setter) {
        this.setter = setter;
        // computed的getter就是一个effect 里面会进行收集依赖
        this._effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(this, 1 /* SET */, 'value');
                }
            },
        });
    }
    get value() {
        // computed里的getter默认不执行  只有当取值的时候才会执行  返回值是getter的返回值  存入缓存 多次取值不会一直执行
        if (this._dirty) {
            this._value = this._effect();
            this._dirty = false;
        }
        track(this, 0 /* GET */, 'value');
        return this._value;
    }
    set value(newValue) {
        this.setter(newValue);
    }
}
function createComputed(getter, setter) {
    return new ComputedRefImpl(getter, setter);
}

exports.computed = computed;
exports.effect = effect;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
exports.shallowRef = shallowRef;
exports.toRef = toRef;
//# sourceMappingURL=reactivity.cjs.js.map
