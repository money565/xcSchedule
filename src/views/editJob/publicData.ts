import { getJobByProject } from '@/axios/interface'
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
