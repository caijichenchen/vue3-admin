var Vue3MiniRuntimeCore = (function (exports) {
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
      if (children === null) {
          console.log();
      }
      else if (isArray(children)) {
          type = 16 /* ARRAY_CHILDREN */;
      }
      else {
          type = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlag |= type;
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
  const readonlyGet = createGetter(true);
  const shallowReadonlyGet = createGetter(true, true);
  const set = createSetter();
  const readonlyObj = {
      set() {
          return console.warn(`key in readonly`);
      },
  };
  const mutableHandles = {
      get,
      set,
  };
  const readonlyHandlers = assign({
      get: readonlyGet,
  }, readonlyObj);
  assign({
      get: shallowReadonlyGet,
  }, readonlyObj);

  function reactive(target) {
      return createReactiveObject(target, false, mutableHandles);
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

  function createRender(renderOptions) {
      const { createElement: hostCreateElement, remove: hostRemove, insert: hostInsert, querySelector: hostQuerySelector, setElementText: hostSetElementText, createText: hostCreateText, setText: hostSetText, patchProps: hostPatchProps, } = renderOptions;
      // -----------组件start---------
      const setupRenderEffect = (instance, container) => {
          //需要创建一个effect 在effect中调用render方法，这样render方法中拿到的数据会收集这个effect，属性更新时effect重新执行
          //每个组件都会有一个effect vue3是组件级更新 数据重新变化重新执行组件的effect
          effect(function componentEffect() {
              if (!instance.isMounted) {
                  // 初次渲染
                  const proxyToUse = instance.proxy;
                  // 2.x $vnode _vnode
                  // 组件是vnode 真正渲染内容subTree
                  const subTree = (instance.subTree = instance.render.call(proxyToUse, proxyToUse));
                  patch(null, subTree, container);
                  instance.isMounted = true;
              }
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
      };
      //-------------组件end---------
      // ----------元素start----------
      const mountElement = (vnode, container) => {
          const { type, props, shapeFlag, children } = vnode;
          const el = (vnode.el = hostCreateElement(type));
          if (props) {
              for (const key in props) {
                  hostPatchProps(el, key, null, props[key]);
              }
          }
          hostInsert(el, container);
      };
      const processElement = (oldValue, newValue, container) => {
          if (oldValue === null) {
              mountElement(newValue, container);
          }
      };
      // ----------元素end----------
      const patch = (oldVal, newVal, container) => {
          // 这里做判断组件类别
          const { shapeFlag } = newVal;
          if (shapeFlag & 1 /* ELEMENT */) {
              // 元素
              processElement(oldVal, newVal, container);
          }
          else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
              // 组件
              processComponent(oldVal, newVal, container);
          }
      };
      const render = (vnode, container) => {
          console.log(vnode, container);
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

  exports.createRender = createRender;
  exports.h = h;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=runtime-core.global.js.map
