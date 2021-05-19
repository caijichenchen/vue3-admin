import Layout from '@/layout/index.vue'

export default {
  path: '/',
  redirect: '/home',
  component: Layout,
  children: [
    {
      component: () => import('@/views/home/index.vue'),
      meta: { title:'首页' },
      path: '/home',
    },
  ],
}
