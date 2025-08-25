<script setup lang="ts">
import type { workerCacheOpt } from './items/funs'
import { changeScheduleResultWorkTime, changeWorkerJobInterface, deleteAdjustWorkerTime, getScheduleResultTotable, giveWorkTimeBlock } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { DateToStr } from '../editJob/publicData'
import cutWorkTime from './items/cutWorkTime.vue'
import { exportToExcel, exportToPartA, perpareDatas, setWorkerHourPrice } from './items/funs'
import resultInfo from './items/resultInfo.vue'
import workTimeChange from './items/workTimeChange.vue'

const acs = useAppCacheStore()
const dateList = ref<string[]>(acs.getDateRangeArray(acs.timeRange![0], acs.timeRange![1], 'json'))
const title = ref<any>()
const currentClickedItem = ref<workerCacheOpt>()
const currentButton = ref<number>()
const workTimeCache = ref<workerCacheOpt[]>([])
const restShowReplace = ref('')
const timeDivisionDialog = ref(false)
const workTimeChangeDialog = ref(false)
const deleteLoadingState = ref(false)
const workJobChangeDialog = ref(false)
const jobStanderTimeChangeDialog = ref(false)
const changedJobTime = ref<string[]>([])

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
        perpareDatas(dateList.value)
        resolve('ok')
      })
    }
  })
}

onMounted(() => {
  console.log(acs.scheduleResultData)
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
  dateList.value.forEach((e) => {
    title.value[e] = {
      name: e,
      width: '160px',
    }
  })
  perpareDatas(dateList.value)
})

function timeDivisionClick(item: workerCacheOpt) {
  currentClickedItem.value = item
  timeDivisionDialog.value = true
}

function closeWorkTimeDate() {
  workTimeCache.value = []
  currentButton.value = undefined
  workTimeChangeDialog.value = false
  // tableRefreshKey.value = new Date().getTime()
}

function showReplace(jid: number, item: workerCacheOpt) {
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

function workerTimeAdjust(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    workTimeCache.value.push(item)
    currentButton.value = 1
  }
}

function workerJobChange(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    workTimeCache.value.push(item)
    currentButton.value = 2
  }
}

function provideTime(item: workerCacheOpt) {
  if (workTimeCache.value.length === 0) {
    workTimeCache.value.push(item)
    currentButton.value = 3
  }
}

function itemClicked(item: workerCacheOpt) {
  if (currentButton.value === undefined) {
    currentClickedItem.value = item
  }
  else {
    if (workTimeCache.value[0].date === item.date) {
      if (currentButton.value === 1 || currentButton.value === 2 || currentButton.value === 3) {
        if (workTimeCache.value.length === 1) {
          workTimeCache.value.push(item)
          if (currentButton.value === 1) {
            workTimeChangeDialog.value = true
          }
          if (currentButton.value === 2) {
            workJobChangeDialog.value = true
          }
          if (currentButton.value === 3) {
            workJobChangeDialog.value = true
          }
        }
      }
    }
  }
}

function deleteChangedWorkerHour(sid: number) {
  deleteLoadingState.value = true
  deleteAdjustWorkerTime(sid, acs.currentProject).then(() => {
    init().then(() => {
      deleteLoadingState.value = false
    })
  })
}

function closeWorkJobChangeDialog() {
  workTimeCache.value = []
  workJobChangeDialog.value = false
  currentButton.value = undefined
}

function upLoadChangeJob() {
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
}

function resetChangedJob(sid: number) {
  console.log(sid)
}

function closeCutTime() {
  currentClickedItem.value = undefined
  timeDivisionDialog.value = false
}

function jobStanderTimeChange(item: workerCacheOpt) {
  const temp = item.workTime.split('-')
  changedJobTime.value = [temp[0], temp[1]]
  currentClickedItem.value = item
  jobStanderTimeChangeDialog.value = true
}

function changJobworkTime() {
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
</script>

<template>
  <div class="h-227 overflow-auto">
    <div class=" flex items-center justify-center text-center sticky h-12 top-0 z-9 bg-light-50">
      <div class="flex overflow-auto">
        <div class="w-1080 bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
          {{ dateList[0] }}到{{ dateList[dateList.length - 1] }}排班表
        </div>
      </div>
    </div>
    <table class="complex-table" style="border-collapse: collapse; border: none;">
      <thead>
        <tr>
          <th v-for="(item, index) in title" :key="index" :style="{ width: item.width }" class="sticky top-12 z-10 bg-light-50 p-2">
            {{ item.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in acs.scheduleResultData" :key="index" class=" text-3.5 text-gray-600" :class="index % 2 === 0 ? 'bg-yellow-50' : 'bg-gray-50'">
          <td class="text-center p-2">
            {{ item.area }}
          </td>
          <td class="text-center p-2">
            {{ item.job }}
          </td>
          <td class="text-center p-2">
            {{ item.workName }}
          </td>
          <td class="text-center p-2">
            {{ item.workTime }}
          </td>
          <td class="text-center p-2">
            {{ item.workerHour }}
          </td>
          <td class="text-center p-2">
            {{ item.workerPrice }}
          </td>
          <td v-for="(block, page) in dateList" :key="page" class="text-center p-2">
            <div v-for="(i, v) in item[block]" :key="v">
              <div v-if="i.state === 2" class=" bg-green-400 text-white w-36 p-2 rounded-lg cursor-pointer" :class="{ ' bg-red-600': i.noReplace }" @click="showReplace(item.id, i)">
                <el-popover
                  placement="bottom"
                  trigger="click"
                >
                  <template #reference>
                    <div>
                      休
                    </div>
                  </template>
                  <div>
                    <div>
                      {{ restShowReplace }}
                    </div>
                    <div v-if="i.noReplace">
                      <el-button type="danger" link>
                        安排员工
                      </el-button>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div v-else-if="i.state === 1" class="cursor-pointer">
                <div>
                  <el-popover
                    content="Left Top prompts info"
                    placement="bottom"
                    trigger="click"
                    :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4"
                  >
                    <template #reference>
                      <div :class="{ 'text-gray-200': (currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4) && currentClickedItem?.date !== i.date }" @click="itemClicked(i)">
                        {{ i.workTime }}
                      </div>
                    </template>
                    <div class="flex">
                      <el-button type="primary" link @click="timeDivisionClick(i)">
                        <div class="text-3">
                          分割
                        </div>
                      </el-button>
                      <el-button type="warning" link @click="workerJobChange(i)">
                        <div class="text-3">
                          调换
                        </div>
                      </el-button>
                      <el-button type="success" link @click="workerTimeAdjust(i)">
                        <div class="text-3">
                          快调
                        </div>
                      </el-button>
                    </div>
                    <div class="flex mt-2">
                      <el-button type="danger" link @click="provideTime(i)">
                        <div class="text-3">
                          给出
                        </div>
                      </el-button>
                      <el-button type="info" link @click="jobStanderTimeChange(i)">
                        <div class="text-3">
                          调时
                        </div>
                      </el-button>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div v-else-if="i.state === 3" class="bg-yellow-200 w-36 p-2 rounded-lg cursor-pointer">
                <div>
                  <el-popover
                    placement="bottom"
                    trigger="click"
                  >
                    <template #reference>
                      <div>
                        <div>{{ i.jobName }}</div>
                        <div>{{ i.workTime }}</div>
                      </div>
                    </template>
                    <div>
                      <div>
                        {{ restShowReplace }}
                      </div>
                      <div>
                        <el-button type="danger" link>
                          删除
                        </el-button>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div v-else-if="i.state === 4" class="bg-green-200  w-36 p-2 rounded-lg">
                <div>
                  <div>{{ i.jobName }}</div>
                  <div>{{ i.workTime }}</div>
                </div>
              </div>
              <div v-else-if="i.state === 5" class="bg-red-200  w-36 p-2 rounded-lg">
                <div>
                  <el-popover
                    placement="bottom"
                    trigger="click"
                  >
                    <template #reference>
                      <div>
                        <div>{{ i.jobName }}</div>
                        <div>{{ i.workTime }}</div>
                      </div>
                    </template>
                    <div>
                      <div>
                        {{ restShowReplace }}
                      </div>
                      <div>
                        <el-button type="danger" link :loading="deleteLoadingState" @click="deleteChangedWorkerHour(i.sid)">
                          删除
                        </el-button>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div v-else-if="i.state === 7" class=" bg-indigo-200  w-36 p-2 rounded-lg" @click="showReplace(item.id, i)">
                <div>
                  <el-popover
                    placement="bottom"
                    trigger="click"
                    :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4"
                  >
                    <template #reference>
                      <div @click="itemClicked(i)">
                        <div>{{ i.jobName }}</div>
                        <div>{{ i.workTime }}</div>
                      </div>
                    </template>
                    <div>
                      <div>
                        {{ restShowReplace }}
                      </div>
                      <div>
                        <el-button type="danger" link :loading="deleteLoadingState" @click="resetChangedJob(i)">
                          还原
                        </el-button>
                        <el-button type="warning" link :loading="deleteLoadingState" @click="workerJobChange(i)">
                          调换
                        </el-button>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div v-else-if="i.state === 8" class="bg-red-400 text-light-50  w-36 p-2 rounded-lg">
                <div class="cursor-pointer">
                  没有排班
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex mt-3 ml-5">
    <resultInfo class="mt--1 mr-5" />
    <el-button type="primary" :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4" @click="exportToExcel(dateList)">
      生成自用表格
    </el-button>
    <el-button type="primary" :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4" @click="exportToPartA(dateList)">
      生成提交表格
    </el-button>
  </div>
  <xt-dialog v-model="timeDivisionDialog" title="分割时间" :show-cancel="false" :show-confirm="false">
    <cutWorkTime :item="currentClickedItem" :date-list="dateList" @close="closeCutTime" />
  </xt-dialog>
  <xt-dialog v-model="workTimeChangeDialog" title="工时班次调整" width="900" :show-cancel="false" :show-confirm="false" @cancel="closeWorkTimeDate">
    <workTimeChange :work-time-cache="workTimeCache" @close="closeWorkTimeDate" />
  </xt-dialog>
  <xt-dialog v-model="workJobChangeDialog" title="岗位调整" width="600" :loading="deleteLoadingState" @cancel="closeWorkJobChangeDialog" @confirm="upLoadChangeJob">
    <div class="flex">
      <el-card class="w-60">
        <div>
          {{ workTimeCache[0] && workTimeCache[0].date ? workTimeCache[0].date : '' }}
        </div>
        <div>
          {{ workTimeCache[0] && workTimeCache[0].jobName ? workTimeCache[0].jobName : '' }}
        </div>
        <div>
          {{ workTimeCache[0] && workTimeCache[0].workerName ? workTimeCache[0].workerName : '' }}
        </div>
        <div>
          {{ workTimeCache[0] && workTimeCache[0].workTime ? workTimeCache[0].workTime : '' }}
        </div>
      </el-card>
      <el-icon v-if="currentButton === 2" size="30" class="w-20 mt-10">
        <SvgIcon name="change" />
      </el-icon>
      <el-icon v-if="currentButton === 3" size="30" class="w-20 mt-10">
        <SvgIcon name="rightArrow" />
      </el-icon>
      <el-card class="w-60">
        <div>
          {{ workTimeCache[1] && workTimeCache[1].date ? workTimeCache[1].date : '' }}
        </div>
        <div>
          {{ workTimeCache[1] && workTimeCache[1].jobName ? workTimeCache[1].jobName : '' }}
        </div>
        <div>
          {{ workTimeCache[1] && workTimeCache[1].workerName ? workTimeCache[1].workerName : '' }}
        </div>
        <div>
          {{ workTimeCache[1] && workTimeCache[1].workTime ? workTimeCache[1].workTime : '' }}
        </div>
      </el-card>
    </div>
  </xt-dialog>
  <XtDialog v-model="jobStanderTimeChangeDialog" title="更改工作时间" :loading="deleteLoadingState" @cancel="jobStanderTimeChangeDialog = false" @confirm="changJobworkTime">
    <div>
      <div class="text-4">
        工作日期：{{ currentClickedItem?.date }}
      </div>
      <div class="text-4 mt-5">
        岗位名称：{{ currentClickedItem?.jobName }}
      </div>
      <div class="text-4 mt-5">
        员工姓名：{{ currentClickedItem?.workerName }}
      </div>
      <div class="text-4 mt-5 flex">
        <div class="mt-1">
          开始时间：
        </div>
        <div class="w-30 ml-4">
          <el-time-select
            v-model="changedJobTime[0]"
            start="08:30"
            step="00:15"
            end="23:30"
            placeholder="Select time"
          />
        </div>

        <div class="mt-1 ml-4">
          结束时间：
        </div>
        <div class="ml-4 w-30">
          <el-time-select
            v-model="changedJobTime[1]"
            start="08:30"
            step="00:15"
            end="23:30"
            placeholder="Select time"
          />
        </div>
      </div>
    </div>
  </XtDialog>
</template>

<style scoped>

</style>
