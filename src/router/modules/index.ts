import Layout from '@/layout/index.vue'
export default {
  path: '/',
  name: 'index',
  component: Layout,
  redirect: 'vd-index',
  meta: { title: '首页' },
  children: ((pre) => [
    {
      path: `${pre}index`,
      name: `${pre}index`,
      meta: { title: 'Home' },
      component: () => import('@/views/vd-index/index.vue'),
    },
  ])('vd-'),
}
