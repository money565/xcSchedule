<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'
import cutWorkTime from './items/cutWorkTime.vue'

import {
  arrangeWork,
  changedJobTime,
  changJobworkTime,
  closeCutTime,
  closeWorkJobChangeDialog,
  closeWorkTimeDate,
  currentButton,
  currentClickedItem,
  deleteChangedWorkerHour,
  deleteLoadingState,
  exportToExcel,
  exportToPartA,
  itemClicked,
  jobStanderTimeChangeDialog,
  makeScheduleTableTitle,
  perpareDatas,
  resetChangedJob,
  restShowReplace,
  showReplace,
  timeDivisionDialog,
  title,
  upLoadChangeJob,
  workerJobChange,
  workJobChangeDialog,
  workTimeCache,
  workTimeChangeDialog,
} from './items/funs'
import resultInfo from './items/resultInfo.vue'
import workTimeChange from './items/workTimeChange.vue'
import workTimeSplit from './items/workTimeSplit.vue'

const acs = useAppCacheStore()
onMounted(() => {
  makeScheduleTableTitle()
  perpareDatas()
})
</script>

<template>
  <div class="h-227 overflow-auto">
    <div class=" flex items-center justify-center text-center sticky h-12 top-0 z-9 bg-light-50">
      <div class="flex overflow-auto">
        <div class="w-1080 bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
          {{ acs.dateList[0] }}到{{ acs.dateList[acs.dateList.length - 1] }}排班表
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
          <td v-for="(block, page) in acs.dateList" :key="page" class="text-center p-2">
            <div v-for="(i, v) in item[block]" :key="v">
              <div
                v-if="i.state === 2"
                class="text-white w-36 p-2 rounded-lg cursor-pointer"
                :class="{
                  'bg-green-400': currentButton === undefined,
                  'bg-red-600': i.noReplace && currentButton === undefined,
                  'bg-green-100': currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4,
                }"
                @click="showReplace(i)"
              >
                <el-popover
                  placement="bottom"
                  trigger="click"
                  :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4"
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
                      <el-button type="danger" link @click="arrangeWork(i)">
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
                      <div
                        :class="{ 'text-gray-200': (currentButton === 1 || currentButton === 2 || currentButton === 3) && currentClickedItem?.date !== i.date || currentButton === 4 }"
                        @click="itemClicked(i)"
                      >
                        {{ i.workTime }}
                      </div>
                    </template>
                    <workTimeSplit :item="i" />
                  </el-popover>
                </div>
              </div>
              <div
                v-else-if="i.state === 3"
                class="w-36 p-2 rounded-lg cursor-pointer"
                :class="{
                  'bg-yellow-300 ': currentButton === undefined || currentClickedItem?.date === i.date && (currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4),
                  'bg-yellow-50 text-gray-300': (currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4) && currentClickedItem?.date !== i.date || currentButton === 4,
                }"
                @click="itemClicked(i)"
              >
                <div>
                  <el-popover
                    placement="bottom"
                    trigger="click"
                    :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4"
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
                        <workTimeSplit :item="i" />
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div
                v-else-if="i.state === 4"
                class="w-36 p-2 rounded-lg"
                :class="{
                  'bg-sky-300': currentButton === undefined,
                  'bg-sky-100 text-gray-300': currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4,
                }"
              >
                <div>
                  <div>{{ i.jobName }}</div>
                  <div>{{ i.workTime }}</div>
                </div>
              </div>
              <div
                v-else-if="i.state === 5"
                class="w-36 p-2 rounded-lg cursor-pointer"
                :class="{
                  'bg-red-300 ': currentButton === undefined,
                  'bg-red-100 text-gray-300': currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4,
                }"
              >
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
              <div
                v-else-if="i.state === 7"
                class="w-36 p-2 rounded-lg"
                :class="{
                  'bg-indigo-300 ': currentButton === undefined,
                  'bg-indigo-50 text-gray-300': currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4,
                }"
                @click="showReplace(i)"
              >
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
              <div
                v-else-if="i.state === 8"
                class=" text-light-50  w-36 p-2 rounded-lg"
                :class="{
                  'bg-red-400': currentButton === undefined || currentClickedItem?.date === i.date && (currentButton === 4 || currentButton === 2 || currentButton === 3),
                  'bg-red-50': (currentButton === 4) && currentClickedItem?.date !== i.date,
                }"
                @click="itemClicked(i)"
              >
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
    <el-button type="primary" :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4" @click="exportToExcel()">
      生成自用表格
    </el-button>
    <el-button type="primary" :disabled="currentButton === 1 || currentButton === 2 || currentButton === 3 || currentButton === 4" @click="exportToPartA()">
      生成提交表格
    </el-button>
  </div>
  <xt-dialog v-model="timeDivisionDialog" title="分割时间" :show-cancel="false" :show-confirm="false">
    <cutWorkTime :item="currentClickedItem" :date-list="acs.dateList" @close="closeCutTime" />
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
      <el-icon v-if="currentButton === 3 || currentButton === 4" size="30" class="w-20 mt-10">
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
