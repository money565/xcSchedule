import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/worker',
      name: 'worker',
      component: () => import('@/views/editElement/workerPrice.vue'),
    },
  ],
})

export default router
