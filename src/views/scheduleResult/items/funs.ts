import { useAppCacheStore } from '@/stores/appCache'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

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

export function exportToExcel(dateList: string[]) {
  const temp: any[] = []
  acs.scheduleResultData.forEach((e: any) => {
    const param: any = {
      楼层: e.area,
      岗位名称: e.job,
      姓名: e.workName,
    }
    dateList.forEach((w: string) => {
      let mesg = ''
      for (const t in e[w]) {
        if (e[w][t].state === 2) {
          mesg = '休息/'
        }
        else {
          if (e[w][t].jid === e[w][t].mainJob) {
            mesg = `${mesg + e[w][t].workTime}/`
          }
          else {
            if (mesg === '') {
              mesg = `(${e[w][t].jobName}-${e[w][t].workTime})/`
            }
            else {
              mesg = `${mesg}(${e[w][t].jobName}-${e[w][t].workTime})/`
            }
          }
        }
      }
      if (mesg)
        mesg = mesg.slice(0, -1)
      param[w] = mesg
    })
    temp.push(param)
  })
  const worksheet = XLSX.utils.json_to_sheet(temp)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '数据')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), '表格数据.xlsx')
}

export function exportToPartA(dateList: string[]) {
  dateList.forEach((w: string) => {
    const temp: any[] = []
    acs.scheduleResultData.forEach((e: any) => {
      if (e.id !== '') {
        const param: any = {
          楼层: e.area,
          人数: 1,
          岗位: e.job,
          姓名: '',
          工作时间: e.workTime,
        }
        if (e[w][0].state === 2) {
          for (const i in acs.scheduleResultData) {
            if (e.id === acs.scheduleResultData[i][w][0].jid) {
              param.姓名 = acs.scheduleResultData[i][w][0].workerName
            }
          }
        }
        else {
          if (e[w][0].jid === e[w][0].mainJob) {
            param.姓名 = e[w][0].workerName
          }
          else {
            for (const i in acs.scheduleResultData) {
              if (e.id === acs.scheduleResultData[i][w][0].jid) {
                param.姓名 = acs.scheduleResultData[i][w][0].workerName
              }
            }
          }
        }
        temp.push(param)
      }
    })
    const worksheet = XLSX.utils.json_to_sheet(temp)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${w}表格数据.xlsx`)
  })
}
