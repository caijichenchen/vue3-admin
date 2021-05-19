import Layout from '@/layout/index.vue'

export default {
  path: '/',
  redirect: '/home',
  name: 'index',
  meta: { title: '首页2' },
  component: Layout,
  children: [
    {
      component: () => import('@/views/home/index.vue'),
      meta: { title:'首页' },
      path: '/home',
      name: 'home',
    },
  ],
}
