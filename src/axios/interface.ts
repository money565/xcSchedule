import { request } from './request'

export function getWorkerByProject(pid: number, start: number, end: number) {
  return request({
    url: `/getWorkerByProject/${pid}/${start}/${end}`,
    method: 'get',
  })
}

export function getTypesChoices() {
  return request({
    url: `/getTypesChoices`,
    method: 'get',
  })
}

export function getLaborContractChoices() {
  return request({
    url: `/getLaborContractChoices`,
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

export function changeWorker(config: any) {
  return request({
    url: `/changeWorker`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function queryJobKeyword(config: any) {
  return request({
    url: `/queryJobKeyword`,
    method: 'post',
    data: {
      ...config,
    },
  })
}
