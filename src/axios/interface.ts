import { request } from './request'

export function getWorkerByProject(pid:number) {
  return request({
    url: `/getWorkerByProject/${pid}`,
    method: 'get',
  })
}

export function findEmpByKw(config: any) {
  return request({
    url: `/searchemp`,
    method: 'post',
    data: {
      ...config,
    },
  })
}