<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="ts" setup>
import { changeWorkerJobInterface, deleteAdjustWorkerTime, getReplacementByJobID, getScheduleResultTotable } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { DateToStr } from '../editJob/publicData'
import { setWorkerHourPrice } from './items/funs'
import resultInfo from './items/resultInfo.vue'
import workTimeChange from './items/workTimeChange.vue'

const acs = useAppCacheStore()
const dateList = ref<string[]>(acs.getDateRangeArray(acs.timeRange![0], acs.timeRange![1], 'json'))
const currentButton = ref()
const workTimeCache: any = ref([])
const isHovering = ref()
const workTimeChangeDialog = ref(false)
const workJobChangeDialog = ref(false)
const hoverTexts = ref('前四周工时')
const replacementList = ref<number[]>([0])
const popoverText = ref('')
const popoverTitle = ref('')
const tableRefreshKey = ref(0)
const workTimeRadioValue = ref(1)
const deleteLoadingState = ref(false)
const changeWorkerJob = ref<any[]>([])
const optionText = computed(() => {
  if (currentButton.value === 1 && workTimeCache.value.length === 0) {
    return '请选择需要调整的人员'
  }
  else {
    if (currentButton.value === 1 && workTimeCache.value.length === 1) {
      return '调整到哪个岗位'
    }
    else {
      return ''
    }
  }
})

function init() {
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

function selectTag(row: any, item: any) {
  if (currentButton.value === 1) {
    if (item.state === 1) {
      if (workTimeCache.value.length === 0) {
        workTimeCache.value = [item]
        getReplacementByJobID(item.jid).then(({ data: res }) => {
          replacementList.value = res.result
        })
      }
      else {
        if (item.date !== workTimeCache.value[0].date) {
          return null
        }
        // TODO写入变更班次的逻辑
        workTimeCache.value.push(item)
        currentButton.value = undefined
        workTimeChangeDialog.value = true
      }
    }
  }
  if (currentButton.value === 2) {
    changeWorkerJob.value.push(item)
    if (changeWorkerJob.value.length > 1) {
      workJobChangeDialog.value = true
    }
  }
}

function dohoverItem(item: any) {
  if ((currentButton.value === undefined && item.mainJob !== item.jid) || item.jobName === undefined) {
    popoverTitle.value = ''
    popoverText.value = '危险！！！该岗位没有员工替岗'
    if (item.mainJob) {
      for (const i in acs.scheduleResultData) {
        for (const d in acs.scheduleResultData[i][item.date]) {
          if (acs.scheduleResultData[i][item.date][d].jid) {
            if (acs.scheduleResultData[i][item.date][d].jid === item.mainJob) {
              popoverTitle.value = '被替的岗位'
              popoverText.value = `该岗位由 ${acs.scheduleResultData[i][item.date][d].workerName} 代替`
            }
          }
        }
      }
    }
    else {
      let isin = false
      for (const x in acs.scheduleResultData) {
        if (item.jid === acs.scheduleResultData[x].id) {
          popoverTitle.value = '替代岗位'
          popoverText.value = `替代 ${acs.scheduleResultData[x].workName} 的岗位`
          isin = true
        }
      }
      if (!isin) {
        if (item.state === 2) {
          popoverTitle.value = '休息'
          popoverText.value = `休息`
        }
        else {
          popoverTitle.value = '节假日增岗'
          popoverText.value = `节假日增岗`
        }
      }
    }
  }
  isHovering.value = item
}

function closeWorkTimeDate() {
  workTimeCache.value = []
  workTimeChangeDialog.value = false
  tableRefreshKey.value = new Date().getTime()
}

function perpareDatas() {
  for (const i in acs.scheduleResultData) {
    dateList.value.forEach((w) => {
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

function deleteChangedWorkerHour(sid: number) {
  deleteLoadingState.value = true
  deleteAdjustWorkerTime(sid, acs.currentProject).then(() => {
    init().then(() => {
      deleteLoadingState.value = false
      workJobChangeDialog.value = false
    })
  })
  console.log(sid)
}

function closeWorkJobChangeDialog() {
  changeWorkerJob.value = []
  workJobChangeDialog.value = false
  currentButton.value = undefined
}

function upLoadChangeJob() {
  changeWorkerJobInterface(changeWorkerJob.value[0].sid, changeWorkerJob.value[1].sid).then(() => {
    init().then(() => {
      deleteLoadingState.value = false
      workJobChangeDialog.value = false
    })
  })
}

function exportToExcel() {
  const temp: any[] = []
  acs.scheduleResultData.forEach((e: any) => {
    const param: any = {
      楼层: e.area,
      岗位名称: e.job,
      姓名: e.workName,
    }
    dateList.value.forEach((w: string) => {
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

function exportToPartA() {
  console.log(acs.scheduleResultData)
  dateList.value.forEach((w: string) => {
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

onMounted(() => {
  console.log(acs.job_leak, acs.worker_leak)
  perpareDatas()
})

function reslove(resolve: (value: unknown) => void, reject: (reason?: any) => void): void {
  throw new Error('Function not implemented.')
}
</script>

<template>
  <div>
    <el-table
      :key="tableRefreshKey"
      :data="acs.scheduleResultData"
      stripe
      style="width: 100%; height: 55rem; overflow: auto;"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="area" width="70" fixed>
        <template #header>
          <div class="text-black">
            区域
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="job" label="岗位名称" width="150" fixed>
        <template #header>
          <div class="text-black">
            岗位名称
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="workTime" label="岗位时间" width="110" fixed>
        <template #header>
          <div class="text-black">
            岗位时间
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="workName" label="姓名" width="80" fixed>
        <template #header>
          <div class="text-black">
            姓名
          </div>
        </template>
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="hoverTexts"
            placement="top-start"
          >
            {{ scope.row.workName }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="workerHour" label="工时" width="80" fixed>
        <template #header>
          <el-popover
            class="box-item"
            placement="top-start"
          >
            <template #reference>
              <el-button type="primary" link>
                <div class="font-sans font-semibold mb-1">
                  工时
                </div>
              </el-button>
            </template>
            <el-radio-group v-model="workTimeRadioValue">
              <!-- works when >=2.6.0, recommended ✔️ not work when <2.6.0 ❌ -->
              <el-radio :value="1">
                周
              </el-radio>
              <!-- works when <2.6.0, deprecated act as value when >=3.0.0 -->
              <el-radio :value="2">
                月
              </el-radio>
            </el-radio-group>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="workerPrice" label="成本" width="80" fixed />

      <el-table-column v-for="(item, index) in dateList" :key="index" :label="item" width="200">
        <template #header>
          <div class="text-black">
            {{ item }}
          </div>
        </template>
        <template #default="scope">
          <div class="text-center">
            <div
              v-for="(i, v) in scope.row[item]"
              :key="v"
              :class="{ ' bg-blue-300 text-light-50 rounded-md cursor-pointer text-center p-2': isHovering && currentButton === 1 && (workTimeCache.length === 0 || workTimeCache[0].date === i.date) ? i.date === isHovering.date && i.wid === isHovering.wid : false }"
              @click="selectTag(scope.row, i)"
              @mouseenter="dohoverItem(i)"
            >
              <div :class="{ ' text-red-700 text-5 font-sans font-semibold': workTimeCache.length === 1 ? i.date === workTimeCache[0].date && replacementList.includes(i.wid) : false }">
                <div :class="{ ' bg-blue-400 text-light-50 p-2 rounded-md': workTimeCache.length > 0 && workTimeCache[0].date === i.date && i.wid === workTimeCache[0].wid && i.state === 1 ? true : false }">
                  <div :class="{ 'bg-yellow-300 rounded-md p-2 cursor-pointer': currentButton === 2 && (isHovering.sid === i.sid && changeWorkerJob.length === 0 || changeWorkerJob.length > 0 && (changeWorkerJob[0].sid && changeWorkerJob[0].sid === i.sid) || isHovering.sid === i.sid && changeWorkerJob[0].date === i.date) }">
                    <div v-if="i.state === 2" class="bg-teal-300 p-2 rounded-md text-light-50 w-100%">
                      <el-popover
                        class="box-item"
                        :title="popoverTitle"
                        :content="popoverText"
                        placement="top-start"
                      >
                        <template #reference>
                          <div :class="{ ' bg-red-400 font-sans': i.noReplace === true }">
                            休
                          </div>
                        </template>
                      </el-popover>
                    </div>
                    <div v-if="i.state === 1">
                      {{ i.workTime }}
                    </div>

                    <div v-if="i.state === 3" class=" bg-sky-200 rounded-md p-2 font-sans">
                      <el-popover
                        class="box-item"
                        :title="popoverTitle"
                        :content="popoverText"
                        placement="top-start"
                      >
                        <template #reference>
                          <div>
                            {{ i.workTime }}
                            {{ `(${i.jobName})` }}
                          </div>
                        </template>
                      </el-popover>
                    </div>
                    <div v-if="i.state === 7" class="bg-yellow-200 rounded-md p-2 font-sans">
                      <el-popover
                        class="box-item"
                        :title="popoverTitle"
                        :content="popoverText"
                        placement="top-start"
                      >
                        <template #reference>
                          <div>
                            {{ i.workTime }}
                            {{ `(${i.jobName})` }}
                          </div>
                        </template>
                      </el-popover>
                    </div>
                    <div v-if="i.state === 5" class="bg-red-200 rounded-md p-2 mt-2 font-sans">
                      <el-popover
                        placement="bottom"
                        :width="200"
                        trigger="click"
                        content="this is content, this is content, this is content"
                      >
                        <template #reference>
                          <div class="cursor-pointer">
                            {{ i.workTime }}({{ i.jobName }})
                          </div>
                        </template>
                        <div class="flex">
                          <el-button type="danger" :loading="deleteLoadingState" @click="deleteChangedWorkerHour(i.sid)">
                            删除
                          </el-button>
                        </div>
                      </el-popover>
                    </div>
                    <div v-if="i.state === 4" class=" bg-green-200 rounded-md p-2 mt-2 font-sans">
                      {{ i.workTime }}({{ i.jobName }})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex mt-3 ml-5">
      <resultInfo class="mt--1 mr-5" />
      <el-button :type="currentButton === 1 ? 'primary' : 'default'" @click="currentButton = 1">
        调整工时
      </el-button>
      <el-button :disabled="currentButton === 1" :type="currentButton === 2 ? 'primary' : 'default'" @click="currentButton = 2">
        调换岗位
      </el-button>
      <el-button type="primary" :disabled="currentButton === 1 || currentButton === 2" @click="exportToExcel">
        生成自用表格
      </el-button>
      <el-button type="primary" :disabled="currentButton === 1 || currentButton === 2" @click="exportToPartA">
        生成提交表格
      </el-button>
      <div class="m-auto">
        {{ optionText }}
      </div>
    </div>
    <xt-dialog v-model="workTimeChangeDialog" title="工时班次调整" width="900" :show-cancel="false" :show-confirm="false">
      <workTimeChange :work-time-cache="workTimeCache" @close="closeWorkTimeDate" />
    </xt-dialog>
    <xt-dialog v-model="workJobChangeDialog" title="岗位调整" width="600" @cancel="closeWorkJobChangeDialog" @confirm="upLoadChangeJob">
      <div class="flex">
        <el-card class="w-60">
          <div>
            {{ changeWorkerJob[0] && changeWorkerJob[0].date ? changeWorkerJob[0].date : '' }}
          </div>
          <div>
            {{ changeWorkerJob[0] && changeWorkerJob[0].jobName ? changeWorkerJob[0].jobName : '' }}
          </div>
          <div>
            {{ changeWorkerJob[0] && changeWorkerJob[0].workerName ? changeWorkerJob[0].workerName : '' }}
          </div>
          <div>
            {{ changeWorkerJob[0] && changeWorkerJob[0].workTime ? changeWorkerJob[0].workTime : '' }}
          </div>
        </el-card>
        <el-icon size="30" class="w-20 mt-10">
          <SvgIcon name="change" />
        </el-icon>
        <el-card class="w-60">
          <div>
            {{ changeWorkerJob[1] && changeWorkerJob[1].date ? changeWorkerJob[1].date : '' }}
          </div>
          <div>
            {{ changeWorkerJob[1] && changeWorkerJob[1].jobName ? changeWorkerJob[1].jobName : '' }}
          </div>
          <div>
            {{ changeWorkerJob[1] && changeWorkerJob[1].workerName ? changeWorkerJob[1].workerName : '' }}
          </div>
          <div>
            {{ changeWorkerJob[1] && changeWorkerJob[1].workTime ? changeWorkerJob[1].workTime : '' }}
          </div>
        </el-card>
      </div>
    </xt-dialog>
  </div>
</template>

<style scope>

</style>
