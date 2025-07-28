import { defineStore } from 'pinia'

export const useAppCacheStore = defineStore('appCache', () => {
  const timeRange = ref<[Date, Date]>()
  const currentProject = ref<number>(1)
  const daysOfAnnualLeave = ref<number>(4) // 每人休假天数
  const rest_workDay = ref<number>(8)
  const rest_festival = ref<number>(6)
  const rest_weekend = ref<number>(6)
  return { timeRange, currentProject, rest_workDay, rest_festival, rest_weekend, daysOfAnnualLeave }
})
