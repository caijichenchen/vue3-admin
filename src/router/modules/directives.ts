import Layout from '@/layout/index.vue'
export default {
  path: '/directives',
  name: 'directives',
  component: Layout,
  meta: { title: '自定义指令' },
  children: ((pre) => [
    {
      path: 'copy',
      name: `${pre}-copy`,
      meta: { title: '复制' },
      component: () => import('@/views/directive/copy/index.vue'),
    },
    {
      path: 'permission',
      name: `${pre}-permission`,
      meta: { title: '权限' },
      component: () => import('@/views/directive/permission/index.vue'),
    },
    {
      path: 'waves',
      name: `${pre}-waves`,
      meta: { title: '波纹' },
      component: () => import('@/views/directive/waves/index.vue'),
    },
  ])('directives'),
}
