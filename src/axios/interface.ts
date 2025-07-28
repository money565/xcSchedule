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

export function deleteWorker(wid: number) {
  return request({
    url: `/deleteWorker/${wid}`,
    method: 'get',
  })
}

export function deleteJob(jid: number) {
  return request({
    url: `/deleteJob/${jid}`,
    method: 'get',
  })
}

export function getJobByProject(pid: number, start: number, end: number) {
  return request({
    url: `/getJobByProject/${pid}/${start}/${end}`,
    method: 'get',
  })
}

export function delWorkerJob(wid: number) {
  return request({
    url: `/delWorkerJob/${wid}`,
    method: 'get',
  })
}

export function getUnflexibleWorker(pid: number) {
  return request({
    url: `/getUnflexibleWorker/${pid}`,
    method: 'get',
  })
}

export function getEditRuleByProject(pid: number) {
  return request({
    url: `/getEditRuleByProject/${pid}`,
    method: 'get',
  })
}

export function getLimitChoices() {
  return request({
    url: `/getLimitChoices`,
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

export function changeJob(config: any) {
  return request({
    url: `/changeJob`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function createWorker(config: any) {
  return request({
    url: `/createWorker`,
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

export function setWorkerJob(config: any) {
  return request({
    url: `/setWorkerJob`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function editRule(config: any) {
  return request({
    url: `/editRule`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function setFestivalInterface(config: any) {
  return request({
    url: `/setFestival`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getFestival(config: any) {
  return request({
    url: `/getFestival`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function setWorkerRest(config: any) {
  return request({
    url: `/setWorkerRest`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getWorkerRestByTimerange(config: any) {
  return request({
    url: `/getWorkerRestByTimerange`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function delWorkerRest(config: any) {
  return request({
    url: `/delWorkerRest`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function checkDatas(config: any) {
  return request({
    url: `/checkDatas`,
    method: 'post',
    data: {
      ...config,
    },
  })
}
