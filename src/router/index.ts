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
    {
      path: '/pointWorker',
      name: 'pointWorker',
      component: () => import('@/views/pointWorker/pointWorker.vue'),
    },
    {
      path: '/scheduleResult',
      name: 'scheduleResult',
      component: () => import('@/views/scheduleResult/scheduleResultDiv.vue'),
    },
  ],
})

export default router
