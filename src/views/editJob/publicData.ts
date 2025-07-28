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
