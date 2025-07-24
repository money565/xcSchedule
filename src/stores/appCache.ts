import { defineStore } from 'pinia'

export const useAppCacheStore = defineStore('appCache', () => {
  const timeRange = ref()
  const currentProject = ref<number>(1)

  return { timeRange, currentProject }
})
