/* eslint-disable no-alert */
import { changeJob, createJob, deleteJob, delWorkerJob, getJobByProject, getJobTypesChoices, getLimitChoices, setWorkerJob } from '@/axios/interface'
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
export const currentJobId = ref<number>()
export const currentPage = ref(1)
export const perPage = 12
export const total = ref(0)
export const isEdit = ref(false)
export const deleteDialog = ref(false)
export const deleteIndex = ref<number>(-1)

export const createNewJobDialog = ref(false)
const form = ref()
export const createJobRefreshKey = ref(0)

export function resetEdit() {
  for (const i in tableData.value) {
    tableData.value[i].area_edit = false
    tableData.value[i].limit_edit = false
    tableData.value[i].sn_edit = false
    tableData.value[i].type_edit = false
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

export function addWorker(jid: number) {
  currentJobId.value = jid
  addWorkerDialog.value = true
}

export function selectWokers(rows: any) {
  selectedWorkers.value = rows
}

export function addWorkerToJob() {
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
