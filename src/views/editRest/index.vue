<!-- eslint-disable no-alert -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unmodified-loop-condition -->
<script setup lang="ts">
import { delWorkerRest, getFestival, getWorkerRestByTimerange, setFestivalInterface, setWorkerRest } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import dayjs from 'dayjs'
import autoInputItem from '../editElement/autoInputItem.vue'

const acs = useAppCacheStore()
const playback = ref<any>({})
const allViewDate = ref<[Date, Date]>()
const timeArray = ref<any>({})
const queryRefreshKey = ref(0)
const festival = ref<string[]>([])
const viewDays = ref<number>(15)
function setFestival(date: string) {
  let index = -1
  for (const i in festival.value) {
    if (date === festival.value[i]) {
      index = Number(i)
    }
  }
  if (index === -1) {
    timeArray.value[date] = timeArray.value[date].slice(0, acs.rest_festival)
    const params = {
      pid: acs.currentProject,
      target: 'add',
      f_date: date,
    }
    setFestivalInterface(params).then(({ data: res }) => {
      festival.value.push(date)
    })
  }
  else {
    const params = {
      pid: acs.currentProject,
      target: 'del',
      f_date: date,
    }
    setFestivalInterface(params).then(({ data: res }) => {
      festival.value.splice(index, 1)
    })
  }
}
function isWeekend(inputDate: string | number | Date | dayjs.Dayjs | null | undefined) {
  const day = dayjs(inputDate).day()
  return day === 0 || day === 6 // 0是周日，6是周六
}

function DateToStr(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始，补 0
  const day = String(date.getDate()).padStart(2, '0') // 补 0
  return `${year}-${month}-${day}`
}

function init() {
  if (acs.timeRange) {
    timeArray.value = acs.getDateRangeArray(acs.timeRange[0], acs.timeRange[1])
    const date1 = new Date(acs.timeRange[0])
    date1.setDate(date1.getDate() - viewDays.value)
    const date2 = new Date(acs.timeRange[0])
    date2.setDate(date2.getDate() - 1)
    playback.value = acs.getDateRangeArray(date1, date2)
    allViewDate.value = [date1, acs.timeRange[1]]
    const FesParams = {
      pid: acs.currentProject,
      date_list: { ...playback.value, ...timeArray.value },
    }
    getFestival(FesParams).then(({ data: res }) => {
      festival.value = res.result
    })
    const params = {
      pid: acs.currentProject,
      start: DateToStr(date1),
      end: DateToStr(acs.timeRange[1]),
    }
    getWorkerRestByTimerange(params).then(({ data: res }) => {
      for (const i in res.result) {
        if (res.result[i].date in timeArray.value) {
          timeArray.value[res.result[i].date].push({
            link: res.result[i].link,
            value: res.result[i].value,
          })
        }
        if (res.result[i].date in playback.value) {
          playback.value[res.result[i].date].push({
            link: res.result[i].link,
            value: res.result[i].value,
          })
        }
      }
    })
  }
}
function getWeekday(dateString: string): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[dayjs(dateString).day()]
}

function addRestMan(value: any, date: string) {
  const day = dayjs(date).day()
  if (festival.value.includes(date)) {
    if (timeArray.value[date].length >= acs.rest_festival) {
      alert('当日排休人员已满，请换其他日期休息')
      queryRefreshKey.value = new Date().getTime()
      return null
    }
  }
  if (day === 0 || day === 6) {
    if (timeArray.value[date].length >= acs.rest_weekend) {
      alert('当日排休人员已满，请换其他日期休息')
      queryRefreshKey.value = new Date().getTime()
      return null
    }
  }
  else {
    if (timeArray.value[date].length >= acs.rest_workDay) {
      alert('当日排休人员已满，请换其他日期休息')
      queryRefreshKey.value = new Date().getTime()
      return null
    }
  }
  for (const i in timeArray.value[date]) {
    if (value.link === timeArray.value[date][i].link) {
      alert('当日已安排该员工休息')
      queryRefreshKey.value = new Date().getTime()
      return null
    }
  }
  const params = {
    wid: value.link,
    date,
  }
  setWorkerRest(params).then(({ data: res }) => {
    if (res.result === 'ok') {
      timeArray.value[date].push(value)
      queryRefreshKey.value = new Date().getTime()
    }
    else {
      alert(res.result)
    }
  })
}

function delRestMan(item: { link: number, value: string }, date: string) {
  const temp = timeArray.value[date]
  let index = -1
  for (const i in temp) {
    if (temp[i].link === item.link) {
      index = Number(i)
    }
  }
  const params = {
    wid: item.link,
    date,
  }
  delWorkerRest(params).then(() => {
    timeArray.value[date].splice(index, 1)
  })
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div class="flex overflow-auto">
      <div class="w-100% bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
        调休安排表
      </div>
    </div>
    <el-calendar :range="allViewDate">
      <template #header>
        <div class="flex">
          <div class="font-sans font-bold mt-1 mr-3 text-dark-50">
            预览
          </div>
          <div class="font-sans font-bold">
            <el-input v-model="viewDays" type="number" :min="1" max="45" @blur="init" />
          </div>
          <div class="font-sans font-bold mt-1 ml-3 text-dark-50">
            天内的休假表
          </div>
        </div>
      </template>
      <template #date-cell="{ data }">
        <div v-if="timeArray.hasOwnProperty(data.day)" class="text-gray-500 font-sans font-600 w-100%">
          <div
            class="w-97% bg-blue-500 rounded-md p-1 text-light-50"
            :class="{ 'bg-green-500': isWeekend(data.day), 'bg-red-400': festival.includes(data.day) }"
            @click="setFestival(data.day)"
          >
            {{ data.day }} {{ getWeekday(data.day) }}
          </div>
          <div class="mt-2">
            <autoInputItem :key="queryRefreshKey" title="" target="worker" @sent-mesg="(value) => addRestMan(value, data.day)" />
          </div>
          <div>
            <el-card class="w-99% mt-2 h-22 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div class="ml-1">
                <el-tag
                  v-for="item in timeArray[data.day]"
                  :key="item"
                  type="primary"
                  class="ml-1 mt-1 w-13.3 truncate"
                  @click="delRestMan(item, data.day)"
                >
                  {{ String(item.value).split('-')[0] }}
                </el-tag>
              </div>
            </el-card>
          </div>
        </div>
        <div v-else class="text-gray-200 font-sans font-semibold">
          <div v-if="playback.hasOwnProperty(data.day)">
            <div class="w-97% bg-gray-300 rounded-md p-1 text-light-50">
              {{ data.day }} {{ getWeekday(data.day) }}
            </div>

            <div class="ml-1">
              <el-tag
                v-for="item in playback[data.day]"
                :key="item"
                type="info"
                class="ml-1 mt-1 w-13.3 truncate"
              >
                {{ String(item.value).split('-')[0] }}
              </el-tag>
            </div>
          </div>
          <div v-else>
            {{ data.day }}
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<style scoped>
:deep(.el-calendar-table .el-calendar-day){
  height: 180px;
}
:deep(.el-card__body ){
  padding: 0;
}
</style>
