var Vue3MiniRuntimDom = (function (exports) {
  'use strict';

  const isObject = (val) => typeof val === 'object' && val !== null;
  const assign = (val1, val2) => Object.assign(val1, val2);
  const isArray = (val) => Array.isArray(val);
  const isString = (val) => typeof val === 'string';
  const isFunction = (val) => typeof val === 'function';
  const isIntegerKey = (val) => parseInt(val) + '' === val;
  const hasOwn = Object.prototype.hasOwnProperty;
  const hasOwnProperty = (target, key) => hasOwn.call(target, key);
  const isChanged = (oldValue, newValue) => oldValue !== newValue;

  const PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
          const { setupState, props, data } = instance;
          if (hasOwnProperty(setupState, key)) {
              return setupState[key];
          }
          else if (hasOwnProperty(props, key)) {
              return props[key];
          }
          else if (hasOwnProperty(data, key)) {
              return data[key];
          }
          else {
              return undefined;
          }
      },
      set({ _: instance }, key, value) {
          const { setupState, props, data } = instance;
          if (hasOwnProperty(setupState, key)) {
              setupState[key] = value;
          }
          else if (hasOwnProperty(props, key)) {
              props[key] = value;
          }
          else if (hasOwnProperty(data, key)) {
              data[key] = value;
          }
      },
  };

  // 组件的方法
  const createComponentInstance = (vnode) => {
      //webcomponent 组件需要有属性、插槽
      const instance = {
          //组件实例
          vnode,
          type: vnode.type,
          props: {},
          attrs: {},
          ctx: {},
          slots: {},
          setupState: {},
          render: null,
          isMounted: false, //是否被挂载
      };
      instance.ctx = { _: instance };
      return instance;
  };
  const setupComponent = (instance) => {
      const { props, children } = instance.vnode;
      instance.props = props; // initProps
      instance.children = children; //initSlot 插槽的解析
      // 先判断当前组件是不是有状态的组件 函数组件
      const isStateful = instance.vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */;
      if (isStateful) {
          // 有状态的组件
          // 调用组件的setup方法  拿到返回值填充setupState和render
          setupStatefulComonent(instance);
      }
  };
  function setupStatefulComonent(instance) {
      // 1.代理 render方法里参数为proxy 但是可以直接访问到instance的各种属性 代理一层
      instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
      //2.获取组件类型  调用setup
      const component = instance.type;
      const { setup } = component;
      if (setup) {
          const setupContext = createSetupContext(instance);
          const setupResult = setup(instance.props, setupContext);
          handleSeupResult(instance, setupResult);
      }
      else {
          finishComponentSetup(instance);
      }
      // component.render(instance.proxy)
  }
  function handleSeupResult(instance, setupResult) {
      if (isFunction(setupResult)) {
          instance.render = setupResult;
      }
      else if (isObject(setupResult)) {
          instance.setupState = setupResult;
      }
  }
  function finishComponentSetup(instance) {
      const component = instance.type;
      if (!instance.render) {
          // 对模板进行编译 生成render函数
          if (!component.render && component.template) ;
      }
      // 对vue2.x兼容处理 applyOptions 遍历
  }
  function createSetupContext(instance) {
      return {
          attrs: instance.attrs,
          props: instance.props,
          slots: instance.slots,
          emit: () => {
              //
          },
          expose: () => {
              //
          },
      };
  }

  const isVNode = (vnode) => vnode.__v_isVnode;
  const createVNode = (type, props, children = null) => {
      // 用来描述对应的内容  虚拟节点具有跨平台的能力
      const shapeFlag = isString(type)
          ? 1 /* ELEMENT */
          : isObject(type)
              ? 4 /* STATEFUL_COMPONENT */
              : 0;
      const vnode = {
          __v_isVnode: true,
          type,
          props,
          children,
          el: null,
          key: props && props.key,
          shapeFlag, // 判断自己的类型和儿子的类型
      };
      normalizeChildren(vnode, children);
      return vnode;
  };
  function normalizeChildren(vnode, children) {
      let type = 0;
      if (children === null) ;
      else if (isArray(children)) {
          type = 16 /* ARRAY_CHILDREN */;
      }
      else {
          type = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlag |= type;
  }
  const Text = Symbol('Text');
  function normalizeVNode(child) {
      if (isObject(child))
          return child;
      return createVNode(Text, null, String(child));
  }

  function createAppAPI(render) {
      return function createApp(rootComponent, rootProps) {
          const app = {
              _props: rootProps,
              _component: rootComponent,
              _container: null,
              mount: function (container) {
                  //1.创建虚拟节点
                  const vnode = createVNode(rootComponent, rootProps);
                  //2.渲染
                  render(vnode, container);
                  app._container = container;
              },
          };
          return app;
      };
  }

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
              effect.options.scheduler(effect);
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

  const queue = [];
  function queueJob(job) {
      if (!queue.includes(job)) {
          queue.push(job);
          queusFinish();
      }
  }
  let isFinishPending = false;
  function queusFinish() {
      if (!isFinishPending) {
          isFinishPending = true;
          Promise.resolve().then(flushJobs);
      }
  }
  function flushJobs() {
      isFinishPending = false;
      // 需要根据父子顺序依次刷新，保证先刷新父再刷新子
      for (let i = 0; i < queue.length; i++) {
          const job = queue[i];
          job();
          console.log(job);
      }
      queue.length = 0;
  }

  function createRender(renderOptions) {
      const { createElement: hostCreateElement, remove: hostRemove, insert: hostInsert, querySelector: hostQuerySelector, setElementText: hostSetElementText, createText: hostCreateText, setText: hostSetText, patchProps: hostPatchProps, nextSibling: hostNextSibling, } = renderOptions;
      // -----------组件start---------
      const setupRenderEffect = (instance, container) => {
          //需要创建一个effect 在effect中调用render方法，这样render方法中拿到的数据会收集这个effect，属性更新时effect重新执行
          //每个组件都会有一个effect vue3是组件级更新 数据重新变化重新执行组件的effect
          instance.update = effect(function componentEffect() {
              if (!instance.isMounted) {
                  // 初次渲染
                  const proxyToUse = instance.proxy;
                  // 2.x $vnode _vnode
                  // 组件是vnode 真正渲染内容subTree
                  const subTree = (instance.subTree = instance.render.call(proxyToUse, proxyToUse));
                  patch(null, subTree, container);
                  instance.isMounted = true;
              }
              else {
                  // 更新
                  console.log('更新');
                  const prevTree = instance.subTree;
                  const proxyToUse = instance.proxy;
                  const nextTree = instance.render.call(proxyToUse, proxyToUse);
                  patch(prevTree, nextTree, container);
              }
          }, {
              scheduler: queueJob,
          });
      };
      const mountComponent = (initalVNode, container) => {
          /**
           * 组件渲染流程最核心的就是调用setup拿到返回值 获取render方法的返回结果
           * 1. 创建实例
           * 2. 需要的数据解析到实例上
           * 3. 创建一个effect 让render函数执行  render函数本身就是一个effect 依赖变化要重新执行
           */
          // 1. 创建实例
          const instance = (initalVNode.component =
              createComponentInstance(initalVNode));
          // 2. 需要的数据解析到实例上
          setupComponent(instance);
          // 3. 创建一个effect 让render函数执行  render函数本身就是一个effect 依赖变化要重新执行
          setupRenderEffect(instance, container);
      };
      const processComponent = (oldVale, newVal, container) => {
          if (oldVale === null) {
              // 旧的没有 创建
              mountComponent(newVal, container);
          }
          else {
              // 更新
              console.log('gengxin');
          }
      };
      //-------------组件end---------
      // ----------元素start----------
      const mountChildren = (children, el) => {
          children.forEach((child) => {
              const normalizeChild = normalizeVNode(child);
              patch(null, normalizeChild, el);
          });
      };
      const mountElement = (vnode, container, ancher) => {
          const { type, props, shapeFlag, children } = vnode;
          const el = (vnode.el = hostCreateElement(type));
          if (props) {
              for (const key in props) {
                  hostPatchProps(el, key, null, props[key]);
              }
          }
          if (shapeFlag & 8 /* TEXT_CHILDREN */) {
              // 文本
              hostSetElementText(el, children);
          }
          else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
              mountChildren(children, el);
          }
          hostInsert(el, container, ancher);
      };
      const patchProps = (oldProps, newProps, el) => {
          if (oldProps !== newProps) {
              for (const key in newProps) {
                  const prev = oldProps[key];
                  const next = newProps[key];
                  prev !== next && hostPatchProps(el, key, prev, next);
              }
              for (const key in oldProps) {
                  if (!newProps[key]) {
                      hostPatchProps(el, key, oldProps[key], null);
                  }
              }
          }
      };
      const unmountChildren = (children) => {
          children.forEach((child) => {
              unmount(child);
          });
      };
      const patchKeyedChildren = (c1, c2, el) => {
          let i = 0;
          let e1 = c1.length - 1;
          let e2 = c2.length - 1;
          /**
           * key1: [a,b,c,d]
           * key2: [a,b,e,f]
           * 缩小后的diff核心是ef 尾部
           */
          while (i <= e1 && i <= e2) {
              const n1 = c1[i];
              const n2 = c2[i];
              if (isSameVNodeType(n1, n2)) {
                  patch(n1, n2, el);
              }
              else {
                  break;
              }
              i++;
          }
          /**
           * key1: [a,b,c,d]
           * key2: [e,f,c,d]
           * diff核心ef 首部
           */
          while (i <= e1 && i <= e2) {
              const n1 = c1[e1 - 1];
              const n2 = c2[e2 - 1];
              if (isSameVNodeType(n1, n2)) {
                  patch(n1, n2, el);
              }
              else {
                  break;
              }
              e1--;
              e2--;
          }
          // common sequence + mount
          // 有一方比较完成后 怎么确定挂载？
          // 1.如果i比e1大 说明老的少
          if (i > e1) {
              // 老的少 新的多
              if (i >= e2) {
                  // 新增部分
                  const nextPos = e2 + 1;
                  const ancher = nextPos < c2.length ? c2[nextPos].el : null;
                  while (i <= e2) {
                      patch(null, c2[i], el, ancher);
                      i++;
                  }
              }
              else if (i > e2) {
                  // 老的多 新的少
                  while (i <= e1) {
                      unmount(c1[i]);
                      i++;
                  }
              }
              else {
                  //乱序比较  一样的尽可能的复用
                  const s1 = i;
                  const s2 = i;
                  // vue3是用新的做映射表  2是用老的做映射表
                  const keyToNewIndexMap = new Map();
                  for (let i = s2; i <= e2; i++) {
                      const childVNode = c2[i];
                      keyToNewIndexMap.set(childVNode.key, i);
                  }
                  // 去老的里面找有没有可以复用的
                  for (let i = s1; i <= e1; i++) {
                      const oldVNode = c1[i];
                      const newIndex = keyToNewIndexMap.get(oldVNode.key);
                      if (newIndex === undefined) {
                          unmount(oldVNode);
                      }
                      else {
                          patch(oldVNode, c2[newIndex], el);
                      }
                  }
              }
          }
      };
      const patchChildren = (oldValue, newValue, el) => {
          const c1 = oldValue.children;
          const c2 = newValue.children;
          const prevShapeFlag = oldValue.shapeFlag;
          const nextShapeFlag = newValue.shapeFlag;
          if (nextShapeFlag & 8 /* TEXT_CHILDREN */) {
              if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                  // 老的有多个孩子但新的是文本
                  unmountChildren(c1);
              }
              if (c1 !== c2) {
                  // 两个都是文本
                  hostSetElementText(el, c2);
              }
          }
          else {
              // 新的是数组  上一次是文本或者数组
              if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                  if (nextShapeFlag & 16 /* ARRAY_CHILDREN */) {
                      // 多子节点比较 核心
                      patchKeyedChildren(c1, c2, el);
                  }
                  else {
                      // 老的数组新的没有 删除老的
                      unmountChildren(c1);
                  }
              }
              else {
                  // 老的是文本
                  if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
                      hostSetElementText(el, '');
                  }
                  if (nextShapeFlag & 16 /* ARRAY_CHILDREN */) {
                      mountChildren(c2, el);
                  }
              }
          }
      };
      const patchElement = (oldValue, newValue, container) => {
          // 元素是相同节点
          const el = (newValue.el = oldValue.el);
          const oldProps = oldValue.props;
          const newProps = newValue.props;
          patchProps(oldProps, newProps, el);
          patchChildren(oldValue, newValue, el);
      };
      const processElement = (oldValue, newValue, container, ancher) => {
          if (oldValue === null) {
              mountElement(newValue, container, ancher);
          }
          else {
              patchElement(oldValue, newValue);
          }
      };
      // ----------元素end----------
      // -------文本start---------
      const processText = (oldVal, newVal, container) => {
          if (oldVal === null) {
              hostInsert((newVal.el = hostCreateText(newVal.children)), container);
          }
      };
      // -------文本end---------
      const unmount = (vnode) => {
          // 如果是组件调用组件生命周期
          hostRemove(vnode.el);
      };
      const isSameVNodeType = (oldVal, newVal) => oldVal.type === newVal.type && newVal.key === oldVal.key;
      function patch(oldVal, newVal, container, ancher = null) {
          // 这里做判断组件类别
          const { shapeFlag, type } = newVal;
          if (oldVal && !isSameVNodeType(oldVal, newVal)) {
              // 把以前的删掉换成新的
              ancher = hostNextSibling(oldVal.el);
              unmount(oldVal);
              oldVal = null;
          }
          switch (type) {
              case Text:
                  processText(oldVal, newVal, container);
                  break;
              default:
                  if (shapeFlag & 1 /* ELEMENT */) {
                      // 元素
                      processElement(oldVal, newVal, container, ancher);
                  }
                  else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
                      // 组件
                      console.log(22222);
                      processComponent(oldVal, newVal, container);
                  }
          }
      }
      const render = (vnode, container) => {
          patch(null, vnode, container);
      };
      return {
          createApp: createAppAPI(render),
      };
  }

  function h(type, propsOrChildren, children) {
      const l = arguments.length;
      if (l === 2) {
          // 类型 + 属性/孩子
          if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
              if (isVNode(propsOrChildren)) {
                  return createVNode(type, null, [propsOrChildren]);
              }
              return createVNode(type, propsOrChildren);
          }
          else {
              return createVNode(type, null, propsOrChildren);
          }
      }
      else {
          if (l > 3) {
              // eslint-disable-next-line prefer-rest-params
              children = Array.prototype.slice.call(arguments, 2);
          }
          else if (l === 3 && isVNode(children)) {
              children = [children];
          }
          return createVNode(type, propsOrChildren, children);
      }
  }

  const nodeOpts = {
      // 元素操作
      createElement: (tagName) => document.createElement(tagName),
      remove: (child) => {
          const parent = child.parentNode;
          parent && parent.removeChild(child);
      },
      insert: (child, parent, anchor = null) => parent.insertBefore(child, anchor),
      querySelector: (selector) => document.querySelector(selector),
      setElementText: (el, text) => (el.textContent = text),
      // 文本
      createText: (text) => document.createTextNode(text),
      setText: (node, text) => (node.nodeValue = text),
      nextSibling: (node) => node.nextSibling,
  };

  const patchAttrs = (el, key, value) => {
      if (!value) {
          el.removeAttribute(key);
      }
      else {
          el.setAttribute(key, value);
      }
  };

  const patchStyle = (el, prev, next) => {
      const style = el.style;
      if (next === null) {
          el.removeAttribute('style');
      }
      else {
          if (prev) {
              for (const key in prev) {
                  // 老的有新的没有置空
                  if (!next[key]) {
                      style[key] = '';
                  }
              }
          }
          if (next) {
              for (const key in next) {
                  style[key] = next[key];
              }
          }
      }
  };

  const patchClass = (el, next = '') => {
      el.className = next;
  };

  const patchEvent = (el, key, value) => {
      const eventName = key.slice(2).toLowerCase();
      const invokers = el._vei || (el._vei = {});
      let exists = invokers[eventName]; // 取出老的
      if (value && exists) {
          // 新的老的都存在  更新事件
          exists.value = value;
      }
      else {
          if (value) {
              // 新的有 添加事件
              const invoker = (invokers[eventName] = createInvoker(value));
              el.addEventListener(eventName, invoker);
          }
          else {
              // 老的有 移除事件
              el.removeEventListener(eventName, exists);
              exists = undefined;
          }
      }
  };
  function createInvoker(value) {
      const invoker = (e) => {
          invoker.value(e);
      };
      invoker.value = value;
      return invoker;
  }

  // 针对属性操作
  const patchProps = (el, key, prev, next) => {
      switch (key) {
          case 'class':
              patchClass(el, next);
              break;
          case 'style':
              patchStyle(el, prev, next);
              break;
          default:
              if (/^on[A-Z]/.test(key)) {
                  patchEvent(el, key, next);
              }
              else {
                  patchAttrs(el, key, next);
              }
              break;
      }
  };

  /**
   * runtime-dom 核心
   * 1. 提供domAPI
   * 2. 操作节点、属性
   */
  const renderOptions = assign({ patchProps }, nodeOpts);
  /**
   * 用户调用runtime-dom --> runtime-core
   * runtime-dom就是为了解决平台差异（浏览器的）和一些基本的dom操作 挂载渲染结果
   * runtime-core主要是用来渲染的
   */
  function createApp(rootComponent, rootProps = null) {
      const app = createRender(renderOptions).createApp(rootComponent, rootProps);
      const { mount } = app;
      app.mount = function (container) {
          // 清空容器
          container = nodeOpts.querySelector(container);
          container.innerHTML = '';
          mount(container);
      };
      return app;
  }

  exports.computed = computed;
  exports.createApp = createApp;
  exports.effect = effect;
  exports.h = h;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.ref = ref;
  exports.shallowReactive = shallowReactive;
  exports.shallowReadonly = shallowReadonly;
  exports.shallowRef = shallowRef;
  exports.toRef = toRef;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=runtime-dom.global.js.map
