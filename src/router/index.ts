import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import store from '@/store/index'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router.beforeEach((to, from) => {
//   // if(to.path !=='/login')
//   console.log(to)
// })

router.afterEach((to) => {
  // console.log('to', to)
  const targetRouteInfo = {
    path: to.fullPath,
    name: to.name,
    title: to.meta.title,
    params: to.params,
    query: to.query,
  }
  store.dispatch('visited/addRoute', targetRouteInfo)
})

export default router
