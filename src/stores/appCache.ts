/* eslint-disable no-unmodified-loop-condition */
import { defineStore } from 'pinia'

export const useAppCacheStore = defineStore('appCache', () => {
  const timeRange = ref<[Date, Date]>()
  const currentProject = ref<number>(1)
  const daysOfAnnualLeave = ref<number>(4) // 每人休假天数
  const rest_workDay = ref<number>(8)
  const rest_festival = ref<number>(6)
  const rest_weekend = ref<number>(6)
  const scheduleResultData: any = ref([])
  const workerHour = ref()
  const workerPrice = ref()
  const job_leak = ref()
  const worker_leak = ref()

  function getDateRangeArray(start: Date, end: Date, target: string | null = null) {
    const dateArray: any = {}
    const dateList: string[] = []

    // 复制start日期对象，避免修改原始对象
    const currentDate = new Date(start)

    // 循环直到当前日期超过结束日期
    while (currentDate <= end) {
      // 获取年月日部分
      const year = currentDate.getFullYear()
      let month: number | string = currentDate.getMonth() + 1 // 月份从0开始，所以要加1
      let day: number | string = currentDate.getDate()
      if (month < 10) {
        month = `0${month}`
      }
      if (day < 10) {
        day = `0${day}`
      }

      // 格式化为 YYYY-M-D 格式
      const dateString: string = String(`${year}-${month}-${day}`)
      if (target === null) {
        dateArray[dateString] = []
      }
      if (target === 'json') {
        dateList.push(dateString)
      }

      // 增加一天
      currentDate.setDate(currentDate.getDate() + 1)
    }
    if (target === null) {
      return dateArray
    }
    if (target === 'json') {
      return dateList
    }
    return dateArray
  }
  return { timeRange, currentProject, rest_workDay, rest_festival, rest_weekend, daysOfAnnualLeave, getDateRangeArray, scheduleResultData, workerHour, workerPrice, job_leak, worker_leak }
})
