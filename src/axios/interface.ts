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

export function getJobByProject(pid: number, start: number, end: number, replace: number = 0) {
  return request({
    url: `/getJobByProject/${pid}/${start}/${end}/${replace}`,
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

export function getJobTypesChoices() {
  return request({
    url: `/getJobTypesChoices`,
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

export function makeScheduls(config: any) {
  return request({
    url: `/makeScheduls`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function createJobAssociate(config: any) {
  return request({
    url: `/createJobAssociate`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function createJob(config: any) {
  return request({
    url: `/createJob`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getScheduleResult(target: string) {
  return request({
    url: `/getSchedule/${target}`,
    method: 'get',
  })
}

export function deleteWorkerPoint(wjid: number) {
  return request({
    url: `/deleteWorkerPoint/${wjid}`,
    method: 'get',
  })
}

export function pointJobToWorker(config: any) {
  return request({
    url: `/pointJobToWorker`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getWorkerPoint(config: any) {
  return request({
    url: `/getWorkerPoint`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function setJobConvert(config: any) {
  return request({
    url: `/setJobConvert`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function deleteConvert(jid: number) {
  return request({
    url: `/deleteConvert/${jid}`,
    method: 'get',
  })
}

export function getJobSupport(pid: number) {
  return request({
    url: `/getJobSupport/${pid}`,
    method: 'get',
  })
}

export function deleteSupport(sid: number) {
  return request({
    url: `/deleteSupport/${sid}`,
    method: 'get',
  })
}

export function getReplacementByJobID(pid: number) {
  return request({
    url: `/getReplacementByJobID/${pid}`,
    method: 'get',
  })
}

export function tempJobSetWorker(config: any) {
  return request({
    url: `/tempJobSetWorker`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function exportDataModels(config: any) {
  return request({
    url: `/exportDataModels`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function setSupportedJob(config: any) {
  return request({
    url: `/setSupportedJob`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function getScheduleResultTotable(config: any) {
  return request({
    url: `/getScheduleResult`,
    method: 'post',
    data: {
      ...config,
    },
  })
}

export function changeWorkerTime(config: any) {
  return request({
    url: `/changeWorkerTime`,
    method: 'post',
    data: {
      ...config,
    },
  })
}
