/* eslint-disable no-alert */
import { changeJob, createJob, deleteJob, delWorkerJob, getJobByProject, getJobTypesChoices, getLimitChoices, setWorkerJob, tempJobSetWorker } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()
export const jobTypeList = ref<{ label: string, value: number }[]>([])
export const limitList = ref<{ label: string, value: number }[]>([])
export interface jonOpt {
  id: number
  sn: number
  no_sn: boolean
  name: string
  area: string
  startTime: string
  endTime: string
  types: {
    num: number
    name: string
  }
  limit: {
    num: number
    name: string
  }
  workerList: {
    id: number
    name: string
  }[]
  area_edit?: boolean
  limit_edit?: boolean
  sn_edit?: boolean
  type_edit?: boolean
  start_edit?: boolean
  end_edit?: boolean
  replacementList?: { link: number, value: string }[]
}

export interface resultOpt {
  jobList: jonOpt[]
  total: number
}

export interface workerListOpt {
  id: number
  name: string
  gender: boolean
  price: number
  types: {
    num: number
    name: string
  }
  labor_contract: {
    num: number
    name: string
  }
}
export const noJobWorkerList = ref<workerListOpt[]>([])

export function DateToStr(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始，补 0
  const day = String(date.getDate()).padStart(2, '0') // 补 0
  return `${year}-${month}-${day}`
}

export function init(start: number, end: number, replace: number = 0): Promise<resultOpt> {
  return new Promise ((resolve, _reject) => {
    getJobByProject(acs.currentProject, start, end, replace).then(({ data: res }) => {
      const temp: jonOpt[] = []
      for (const i in res.result) {
        temp.push({
          id: res.result[i].id,
          sn: res.result[i].sn,
          no_sn: res.result[i].no_sn,
          name: res.result[i].name,
          area: res.result[i].area,
          startTime: res.result[i].startTime,
          endTime: res.result[i].endTime,
          types: res.result[i].types,
          workerList: res.result[i].workerList,
          area_edit: false,
          limit_edit: false,
          sn_edit: false,
          limit: res.result[i].limit,
          type_edit: false,
          start_edit: false,
          end_edit: false,
          replacementList: res.result[i].replacementList,
        })
      }

      resolve({
        jobList: temp,
        total: res.total,
      })
    })
  })
}

export const noJobRefresh = ref(0)
export const tableData = ref<jonOpt[]>([])
export const addWorkerDialog = ref<boolean>(false)
export const selectedWorkers = ref<workerListOpt[]>([])
export const selectedTempWorkers = ref()
export const currentJobId = ref<number>()
export const currentPage = ref(1)
export const perPage = 12
export const total = ref(0)
export const isEdit = ref(false)
export const deleteDialog = ref(false)
export const deleteIndex = ref<number>(-1)
export const currentTypes = ref<{ num: number, name: string }>()

export const createNewJobDialog = ref(false)
const form = ref()
export const createJobRefreshKey = ref(0)

export function resetEdit() {
  for (const i in tableData.value) {
    tableData.value[i].area_edit = false
    tableData.value[i].limit_edit = false
    tableData.value[i].sn_edit = false
    tableData.value[i].type_edit = false
    tableData.value[i].start_edit = false
    tableData.value[i].end_edit = false
  }
}

export function editWork(target: string, index: number) {
  let updata = false
  let strValue
  if (target === 'sn') {
    if (tableData.value[index].sn_edit === true) {
      strValue = tableData.value[index].sn
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].sn_edit = true
      updata = false
    }
  }

  if (target === 'area') {
    if (tableData.value[index].area_edit === true) {
      strValue = tableData.value[index].area
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].area_edit = true
      updata = false
    }
  }

  if (target === 'limit') {
    if (limitList.value.length === 0) {
      getLimitChoices().then(({ data: res }) => {
        limitList.value = res.result
      })
    }
    if (tableData.value[index].limit_edit === true) {
      for (const i in limitList.value) {
        if (tableData.value[index].limit.num === limitList.value[Number(i)].value) {
          tableData.value[index].limit.name = limitList.value[Number(i)].label
        }
      }
      strValue = tableData.value[index].limit.num
      tableData.value[index].limit_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].limit_edit = true
      updata = false
    }
  }

  if (target === 'start_edit' || target === 'end_edit') {
    let clumn = ''
    if (target === 'start_edit') {
      clumn = 'startTime'
    }
    else {
      clumn = 'endTime'
    }
    if (tableData.value[index][target] === true) {
      if (clumn === 'startTime' || clumn === 'endTime') {
        strValue = tableData.value[index][clumn]
      }
      tableData.value[index][target] = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index][target] = true
      updata = false
    }
  }

  if (target === 'types') {
    if (jobTypeList.value.length === 0) {
      getJobTypesChoices().then(({ data: res }) => {
        jobTypeList.value = res.result
      })
    }
    if (tableData.value[index].type_edit === true) {
      for (const i in jobTypeList.value) {
        if (tableData.value[index].types.num === jobTypeList.value[Number(i)].value) {
          tableData.value[index].types.name = jobTypeList.value[Number(i)].label
        }
      }
      strValue = tableData.value[index].types.num
      tableData.value[index].type_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].type_edit = true
      updata = false
    }
  }
  const params = {
    jid: tableData.value[index].id,
    strValue,
    target,
  }
  if (updata) {
    changeJob(params).then(() => {
      tableData.value[index].area_edit = false
      tableData.value[index].limit_edit = false
      tableData.value[index].sn_edit = false
    })
  }
}

export function delWorkJob(wid: number) {
  delWorkerJob(wid).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
    })
    noJobRefresh.value = new Date().getTime()
  })
}

export function addWorker(jid: number, types: { num: number, name: string }) {
  currentTypes.value = types
  currentJobId.value = jid
  addWorkerDialog.value = true
}

export function selectWokers(rows: any) {
  selectedWorkers.value = rows
}

export function addWorkerToJob() {
  if (currentTypes.value && (currentTypes.value.num === 4 || currentTypes.value.num === 5)) {
    const param = {
      jid: currentJobId.value,
      wid: selectedTempWorkers.value,
    }
    tempJobSetWorker(param).then(() => {
      init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
        tableData.value = res.jobList
        total.value = res.total
      })
      noJobRefresh.value = new Date().getTime()
      addWorkerDialog.value = false
    })
  }
  else {
    const wl = []
    for (const i in selectedWorkers.value) {
      wl.push(selectedWorkers.value[i].id)
    }
    setWorkerJob({
      jid: currentJobId.value,
      wl,
    }).then(() => {
      init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
        tableData.value = res.jobList
        total.value = res.total
      })
      noJobRefresh.value = new Date().getTime()
      addWorkerDialog.value = false
    })
  }
}

export function pageChange(page: number) {
  currentPage.value = page
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
    const temp: resultOpt = res
    tableData.value = temp.jobList
    total.value = temp.total
  })
}
export function modelChange() {
  resetEdit()
  isEdit.value = !isEdit.value
}

export function showDelete(index: number) {
  deleteIndex.value = index
  deleteDialog.value = true
}

export function doDelete() {
  deleteJob(tableData.value[deleteIndex.value].id).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
    })
    noJobRefresh.value = new Date().getTime()
    deleteDialog.value = false
  })
}

export function modelCreate() {
  resetEdit()
  createNewJobDialog.value = true
}

export function docreateJob() {
  if (form.value !== undefined) {
    createJob(form.value).then(() => {
      form.value = undefined
      createNewJobDialog.value = false
      createJobRefreshKey.value = new Date().getTime()
      init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
        tableData.value = res.jobList
        total.value = res.total
      })
    })
  }
  else {
    alert('请完成所有项目')
  }
}
export function receiveMesg(value: any) {
  console.log('收到的上传消息', value)
  form.value = value
}

export function doTimeRangesOverlap(timeRanges: string[][]) {
  // 将时间字符串转换为分钟数
  function timeToMinutes(timeStr: string) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  // 转换所有时间区间为分钟数
  const ranges = timeRanges.map(range => ({
    start: timeToMinutes(range[0]),
    end: timeToMinutes(range[1]),
  }))

  // 两两比较所有时间区间
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const range1 = ranges[i]
      const range2 = ranges[j]

      // 检查是否有交集
      if (!(range1.end <= range2.start || range2.end <= range1.start)) {
        return true // 发现交集
      }
    }
  }

  return false // 没有发现交集
}

export function findUncoveredTimes(baseRange: string[], timeRanges: any[]) {
  // 将时间字符串转换为分钟数
  const toMinutes = (time: any) => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  // 转换标定区间
  const [baseStart, baseEnd] = baseRange.map(toMinutes)

  // 转换所有时间段并按照开始时间排序
  const ranges = timeRanges
    .map((range: any[]) => range.map(toMinutes))
    .sort((a: number[], b: number[]) => a[0] - b[0])

  // 初始化未覆盖时间段数组
  const uncovered = []
  let current = baseStart

  // 检查每个时间段
  for (const [start, end] of ranges) {
    if (start > current) {
      // 发现未覆盖的时间段
      uncovered.push([current, start])
    }
    if (end > current) {
      current = end
    }
    if (current >= baseEnd)
      break
  }

  // 检查最后一段是否覆盖到标定结束时间
  if (current < baseEnd) {
    uncovered.push([current, baseEnd])
  }

  // 将分钟数转换回时间字符串
  const toTimeString = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  return uncovered.map(range => range.map(toTimeString))
}
