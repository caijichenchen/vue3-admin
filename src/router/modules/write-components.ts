import  Layout  from '@/layout/index.vue'
export default {
  path: '/write-components',
  name: 'write-components',
  component: Layout,
  meta: { title: '组件' },
  children: (pre => [
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
  ])('write-components-'),
}
