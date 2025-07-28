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
    {
      path: '/job',
      name: 'job',
      component: () => import('@/views/editJob/index.vue'),
    },
    {
      path: '/rest',
      name: 'rest',
      component: () => import('@/views/editRest/index.vue'),
    },
    {
      path: '/replace',
      name: 'replace',
      component: () => import('@/views/editWokerReplace/index.vue'),
    },
  ],
})

export default router
