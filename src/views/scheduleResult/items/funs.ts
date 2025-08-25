import { changeScheduleResultWorkTime, changeWorkerJobInterface, deleteAdjustWorkerTime, getScheduleResultTotable, giveWorkTimeBlock, setUnArrayJobWorker } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { DateToStr } from '@/views/editJob/publicData'
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

export function perpareDatas() {
  for (const i in acs.scheduleResultData) {
    acs.dateList.forEach((w) => {
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

export function exportToExcel() {
  const temp: any[] = []
  acs.scheduleResultData.forEach((e: any) => {
    const param: any = {
      楼层: e.area,
      岗位名称: e.job,
      姓名: e.workName,
    }
    acs.dateList.forEach((w: string) => {
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

export function exportToPartA() {
  acs.dateList.forEach((w: string) => {
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

export const title = ref<any>()
export const currentClickedItem = ref<workerCacheOpt>()
export const currentButton = ref<number>()
export const workTimeCache = ref<workerCacheOpt[]>([])
export const restShowReplace = ref('')
export const timeDivisionDialog = ref(false)
export const workTimeChangeDialog = ref(false)
export const arrangeWorkDialog = ref(false)
export const deleteLoadingState = ref(false)
export const workJobChangeDialog = ref(false)
export const jobStanderTimeChangeDialog = ref(false)
export const changedJobTime = ref<string[]>([])
export function makeScheduleTableTitle() {
  title.value = {
    area: {
      name: '楼层',
      width: '80px',
    },
    job: {
      name: '岗位名称',
      width: '160px',
    },
    workName: {
      name: '姓名',
      width: '120px',
    },
    workTime: {
      name: '工作时间',
      width: '180px',
    },
    workerHour: {
      name: '工时',
      width: '120px',
    },
    workerPrice: {
      name: '成本',
      width: '120px',
    },
  }
  acs.dateList.forEach((e) => {
    title.value[e] = {
      name: e,
      width: '160px',
    }
  })
}

export function init() {
  return new Promise ((resolve, _reject) => {
    if (acs.timeRange) {
      const param = {
        pid: acs.currentProject,
        start_data: DateToStr(acs.timeRange[0]),
        end_data: DateToStr(acs.timeRange[1]),
      }
      getScheduleResultTotable(param).then(({ data: res }) => {
        setWorkerHourPrice(res.df, res.wr, res.wp)
        perpareDatas()
        resolve('ok')
      })
    }
  })
}

export function timeDivisionClick(item: workerCacheOpt) {
  currentClickedItem.value = item
  timeDivisionDialog.value = true
}

export function closeWorkTimeDate() {
  workTimeCache.value = []
  currentButton.value = undefined
  workTimeChangeDialog.value = false
  // tableRefreshKey.value = new Date().getTime()
}

export function showReplace(item: workerCacheOpt) {
  if (item.mainJob) {
    for (const i in acs.scheduleResultData) {
      for (const d in acs.scheduleResultData[i][item.date]) {
        if (acs.scheduleResultData[i][item.date][d].jid) {
          if (acs.scheduleResultData[i][item.date][d].jid === item.mainJob) {
            restShowReplace.value = `该岗位由 ${acs.scheduleResultData[i][item.date][d].workerName} 代替`
            return null
          }
        }
      }
    }
  }
  else {
    let isin = false
    let mesg = ''
    for (const x in acs.scheduleResultData) {
      if (item.jid === acs.scheduleResultData[x].id) {
        isin = true
        mesg = `替代 ${acs.scheduleResultData[x].workName} 的岗位`
        break
      }
    }
    if (isin) {
      return mesg
    }
    else {
      if (item.state === 2) {
        restShowReplace.value = `休息`
        return null
      }
      else {
        restShowReplace.value = `节假日增岗`
        return null
      }
    }
  }
  restShowReplace.value = '危险！！！该岗位没有员工替岗'
  return null
}

export function workerTimeAdjust(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    currentClickedItem.value = item
    workTimeCache.value.push(item)
    currentButton.value = 1
  }
}

export function workerJobChange(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    currentClickedItem.value = item
    workTimeCache.value.push(item)
    currentButton.value = 2
  }
}

export function provideTime(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    currentClickedItem.value = item
    workTimeCache.value.push(item)
    currentButton.value = 3
  }
}

export function arrangeWork(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    currentClickedItem.value = item
    workTimeCache.value.push(item)
    currentButton.value = 4
  }
}

export function itemClicked(item: workerCacheOpt) {
  if (currentButton.value === undefined) {
    currentClickedItem.value = item
    if (item.state === 3) {
      showReplace(item)
    }
  }
  else {
    if (workTimeCache.value[0].date === item.date) {
      if (currentButton.value === 1 || currentButton.value === 2 || currentButton.value === 3 || currentButton.value === 4) {
        if (workTimeCache.value.length === 1) {
          if (currentButton.value === 1) {
            workTimeCache.value.push(item)
            workTimeChangeDialog.value = true
          }
          if (currentButton.value === 2) {
            workTimeCache.value.push(item)
            workJobChangeDialog.value = true
          }
          if (currentButton.value === 3) {
            workTimeCache.value.push(item)
            workJobChangeDialog.value = true
          }
          if (currentButton.value === 4) {
            if (item.state === 8) {
              workTimeCache.value.push(item)
              workJobChangeDialog.value = true
            }
          }
        }
      }
    }
  }
}

export function deleteChangedWorkerHour(sid: number) {
  deleteLoadingState.value = true
  deleteAdjustWorkerTime(sid, acs.currentProject).then(() => {
    init().then(() => {
      deleteLoadingState.value = false
    })
  })
}

export function closeWorkJobChangeDialog() {
  workTimeCache.value = []
  workJobChangeDialog.value = false
  currentButton.value = undefined
}

export function upLoadChangeJob() {
  if (currentButton.value === 2) {
    changeWorkerJobInterface(workTimeCache.value[0].sid, workTimeCache.value[1].sid).then(() => {
      init().then(() => {
        deleteLoadingState.value = false
        workJobChangeDialog.value = false
        currentButton.value = undefined
        workTimeCache.value = []
      })
    })
  }
  if (currentButton.value === 3) {
    deleteLoadingState.value = true
    const param = {
      e_sid: workTimeCache.value[0].sid,
      i_sid: workTimeCache.value[1].sid,
    }
    giveWorkTimeBlock(param).then(() => {
      init().then(() => {
        workJobChangeDialog.value = false
        deleteLoadingState.value = false
        currentButton.value = undefined
        workTimeCache.value = []
      })
    })
  }
  if (currentButton.value === 4) {
    deleteLoadingState.value = true
    const param = {
      pid: acs.currentProject,
      jid: workTimeCache.value[0].mainJob,
      wid: workTimeCache.value[1].wid,
      date: workTimeCache.value[0].date,
      sid: workTimeCache.value[1].sid,
    }
    setUnArrayJobWorker(param).then(() => {
      init().then(() => {
        workJobChangeDialog.value = false
        deleteLoadingState.value = false
        currentButton.value = undefined
        workTimeCache.value = []
      })
    })
  }
}

export function resetChangedJob(sid: number) {
  console.log(sid)
}

export function closeCutTime() {
  currentClickedItem.value = undefined
  timeDivisionDialog.value = false
}

export function closeArrangeWorkDialog() {
  arrangeWorkDialog.value = false
  deleteLoadingState.value = false
  currentButton.value = undefined
  workTimeCache.value = []
}

export function jobStanderTimeChange(item: workerCacheOpt) {
  const temp = item.workTime.split('-')
  changedJobTime.value = [temp[0], temp[1]]
  currentClickedItem.value = item
  jobStanderTimeChangeDialog.value = true
}

export function changJobworkTime() {
  if (currentClickedItem.value) {
    deleteLoadingState.value = true
    const param = {
      sid: currentClickedItem.value.sid,
      start: changedJobTime.value[0],
      end: changedJobTime.value[1],
    }
    changeScheduleResultWorkTime(param).then(() => {
      init().then(() => {
        deleteLoadingState.value = false
        jobStanderTimeChangeDialog.value = false
        changedJobTime.value = []
      })
    })
  }
}
