import Layout from '@/layout/index.vue'
export default {
  path: '/write-components',
  name: 'write-components',
  component: Layout,
  meta: { title: '组件' },
  children: ((pre) => [
    {
      path: 'calender',
      name: `${pre}calender`,
      meta: { title: '日历' },
      component: () => import('@/views/write-component/calender/index.vue'),
    },
    {
      path: 'form',
      name: `${pre}form`,
      meta: { title: '表单' },
      component: () => import('@/views/write-component/form/index.vue'),
    },
    {
      path: 'virtual-list',
      name: `${pre}virtual-list`,
      meta: { title: '虚拟列表' },
      component: () => import('@/views/write-component/virtual-list/index.vue'),
    },
    {
      path: 'timeline',
      name: `${pre}timeline`,
      meta: { title: '时间线' },
      component: () => import('@/views/write-component/timeline/index.vue'),
    },
    {
      path: 'loading',
      name: `${pre}loading`,
      meta: { title: '加载' },
      component: () => import('@/views/write-component/loading/index.vue'),
    },
    {
      path: 'collapse',
      name: `${pre}collapse`,
      meta: { title: '折叠面板' },
      component: () => import('@/views/write-component/collapse/index.vue'),
    },
    {
      path: 'tree',
      name: `${pre}tree`,
      meta: { title: '树' },
      component: () => import('@/views/write-component/tree/index.vue'),
    },
  ])('write-components-'),
}
