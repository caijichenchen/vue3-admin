import Layout from '@/layout/index.vue'
export default {
  path: '/expand',
  name: 'expand',
  component: Layout,
  redirect: 'vd-expand',
  meta: { title: '拓展' },
  children: ((pre) => [
    {
      path: `${pre}form`,
      name: `${pre}form`,
      meta: { title: 'form' },
      component: () => import('@/views/expand/form/index.vue'),
    },
  ])('vd-'),
}
