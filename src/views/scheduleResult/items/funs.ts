import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()

export interface workerCacheOpt {
  date: string
  jid: number
  jobName: number
  mainJob: number
  sid: number
  state: number
  wid: number
  workTime: string
  workerName: string
}

export function setWorkerHourPrice(df: any, wr: any, wp: any) {
  acs.scheduleResultData = df
  acs.workerHour = wr
  acs.workerPrice = wp
  acs.scheduleResultData.forEach((e: { workerHour: any, workerID: string | number, workerPrice: any }) => {
    e.workerHour = acs.workerHour[e.workerID]
    e.workerPrice = acs.workerPrice[e.workerID]
  })
}
