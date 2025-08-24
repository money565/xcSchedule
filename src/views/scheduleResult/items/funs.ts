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
    try {
      e.workerHour = acs.workerHour[e.workerID]
      e.workerPrice = acs.workerPrice[e.workerID]
    }
    catch (error) {
      console.log(error)
    }
  })
}

export function perpareDatas(dateList: string[]) {
  for (const i in acs.scheduleResultData) {
    dateList.forEach((w) => {
      if (acs.scheduleResultData[i].job !== '') {
        for (const j in acs.scheduleResultData[i][w]) {
          if (acs.scheduleResultData[i][w][j].state === 2) {
            let hasReplace = false
            for (const t in acs.scheduleResultData) {
              for (const tj in acs.scheduleResultData[t][w]) {
                if (acs.scheduleResultData[t][w][tj].jid === acs.scheduleResultData[i][w][j].mainJob) {
                  hasReplace = true
                  break
                }
              }
            }
            if (!hasReplace) {
              if (acs.scheduleResultData[i][w][j].mainJob) {
                acs.scheduleResultData[i][w][j].noReplace = true
              }
            }
          }
        }
      }
    })
  }
}
