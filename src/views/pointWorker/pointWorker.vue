<!-- eslint-disable no-alert -->
<!-- eslint-disable ts/no-unused-expressions -->
<!-- eslint-disable prefer-const -->
<script lang="ts" setup>
import type { resultOpt } from '@/views/editJob/publicData'
import { deleteWorkerPoint, getWorkerPoint, pointJobToWorker } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { currentPage, doTimeRangesOverlap, findUncoveredTimes, init, perPage, total } from '@/views/editJob/publicData'
import autoInputItem from '../editElement/autoInputItem.vue'

interface tabOpt {
  id: number
  area: string
  name: string
  startTime: string
  endTime: string
  [key: string]: any
}
const acs = useAppCacheStore()
const pointTable = ref<tabOpt[]>([])
const dateList = ref([])
const addWorkerDialog = ref(false)
const addWorkerTitle = ref('')
const addWorkerJobId = ref<number>(-1)
const addWorkerDate = ref('')
const addWorkerTimeRange = ref<string[]>()
const editWorkerList = ref<{ wid: number, start: string, end: string, jid: number, date: string }[]>([])
const X_coordinate = ref<number>()
const Y_coordinate = ref<number>()

function intiPointWorker() {
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res1: resultOpt) => {
    const firstLise: any = {
      id: 'id号',
      area: '区域',
      name: '岗位名称',
      startTime: '开始时间',
      endTime: '结束时间',
    }
    dateList.value.forEach((item: string) => firstLise[item] = item)
    const temp = [firstLise]
    const params = {
      pid: acs.currentProject,
      start: dateList.value[0],
      end: dateList.value[dateList.value.length - 1],
    }
    getWorkerPoint(params).then(({ data: wjs }) => {
      for (const i in res1.jobList) {
        const otherLine: any = {
          id: res1.jobList[i].id,
          area: res1.jobList[i].area,
          name: res1.jobList[i].name,
          startTime: res1.jobList[i].startTime,
          endTime: res1.jobList[i].endTime,
        }

        dateList.value.forEach((item: string) => {
          let record = false
          for (const t in wjs.result) {
            if (wjs.result[t].date === item && otherLine.id === wjs.result[t].jid) {
              if (otherLine[item]) {
                otherLine[item].push(wjs.result[t].worker)
                record = true
              }
              else {
                otherLine[item] = [wjs.result[t].worker]
                record = true
              }
            }
          }
          if (!record) {
            otherLine[item] = []
          }
        })
        temp.push(otherLine)
      }
      pointTable.value = temp
      total.value = res1.total
    })
  })
}

function pagePointWorkerChange(page: number) {
  currentPage.value = page
  intiPointWorker()
}

onMounted(() => {
  dateList.value = acs.getDateRangeArray(acs.timeRange![0], acs.timeRange![1], 'json')
  intiPointWorker()
})

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function addWorker(index: number, dateIndex: number) {
  editWorkerList.value = []
  addWorkerDate.value = Object.values(pointTable.value[0])[dateIndex]
  addWorkerJobId.value = pointTable.value[index].id
  addWorkerTitle.value = `添加${pointTable.value[index].area}-${pointTable.value[index].name}的工作人员`
  editWorkerList.value.push({
    wid: -1,
    start: pointTable.value[index].startTime,
    end: pointTable.value[index].endTime,
    jid: pointTable.value[index].id,
    date: addWorkerDate.value,
  })
  addWorkerTimeRange.value = [pointTable.value[index].startTime, pointTable.value[index].endTime]
  addWorkerDialog.value = true
}

function addWorkerLine(index: number) {
  if (editWorkerList.value[index].wid === -1) {
    alert('请选择员工')
    return null
  }
  if (editWorkerList.value[index].start === '') {
    alert('请选择开始时间')
    return null
  }
  if (editWorkerList.value[index].start === '') {
    alert('请选择结束时间')
    return null
  }
  editWorkerList.value.push({
    wid: -1,
    start: '',
    end: '',
    jid: addWorkerJobId.value,
    date: addWorkerDate.value,
  })
}

function minWorkerLine(index: number) {
  editWorkerList.value.splice(index, 1)
}

function uploadData() {
  const timeArr = []
  for (const i in editWorkerList.value) {
    timeArr.push([editWorkerList.value[i].start, editWorkerList.value[i].end])
  }
  if (editWorkerList.value.length > 1) {
    if (doTimeRangesOverlap(timeArr)) {
      alert('时间重复')
      return null
    }
  }
  if (addWorkerTimeRange.value) {
    const timeGap = findUncoveredTimes(addWorkerTimeRange.value, timeArr)
    if (timeGap.length > 0) {
      let msg = ''
      for (const i in timeGap) {
        msg = `${msg}\r\n${timeGap[i][0]}-${timeGap[i][1]},`
      }
      alert(`${msg}没有被覆盖`)
      return null
    }
  }
  pointJobToWorker({
    upload: editWorkerList.value,
  }).then(() => {
    addWorkerDialog.value = false
    intiPointWorker()
  })
}

function onDateHovered(index: number, dateIndex: number) {
  Y_coordinate.value = dateIndex
  X_coordinate.value = index
}

function receivePointWorker(value: any, index: number) {
  editWorkerList.value[index].wid = value.link
}

function getUnoClass(index: number, value: number) {
  const firstLine = ['bg-gray-200', 'text-gray-700', 'font-sans', 'font-medium', 'flex']
  const classes = []
  if (index === 0) {
    for (const i in firstLine) {
      classes.push(firstLine[i])
    }
  }
  else {
    if (index === X_coordinate.value) {
      classes.push('bg-light-blue-200')
    }
  }
  if (value < 5) {
    if (value === 2) {
      classes.push('w-60')
    }
    else {
      classes.push('w-20')
    }
  }
  else {
    classes.push('w-40')
  }
  return classes
}

function deletePointWorker(id: number) {
  deleteWorkerPoint(id).then(() => {
    intiPointWorker()
  })
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="w-100% bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
        指定工作岗位
      </div>
    </div>
    <div v-for="(item, index) in pointTable" :key="index">
      <div class="flex">
        <div
          v-for="value in range(1, Object.keys(item).length - 1)"
          :key="value"
          class=" h-15 items-center justify-center flex"
          :class="getUnoClass(index, value)"
          @mouseenter="onDateHovered(index, value)"
        >
          <div
            v-if="value < 5"
            class="flex h-15 items-center justify-center "
            :class="getUnoClass(index, value)"
          >
            {{ Object.values(item)[value] }}
          </div>
          <div v-else>
            <div v-if="index === 0" class="flex h-15 w-40 items-center justify-center" :class="value === Y_coordinate || index === X_coordinate ? (index === X_coordinate ? 'bg-light-blue-200' : 'bg-yellow-200') : ''">
              {{ Object.values(item)[value] }}
            </div>
            <div v-else>
              <div class="flex h-15 w-40 items-center justify-center" :class="value === Y_coordinate || index === X_coordinate ? (index === X_coordinate ? 'bg-light-blue-200' : 'bg-yellow-200') : ''">
                <div v-if="Object.values(item)[value].length > 0 ">
                  <div class="flex">
                    <div v-for="(k, v) in Object.values(item)[value]" :key="v">
                      <el-tag closable type="warning" class="cursor-pointer" @close="deletePointWorker(k.id)">
                        {{ k.wName }}
                      </el-tag>
                    </div>
                  </div>
                </div>
                <el-icon v-if="index !== 0" size="25" class="cursor-pointer" @click="addWorker(index, value)">
                  <svg-icon name="add" />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination layout="prev, pager, next" :total="total" @change="pagePointWorkerChange" />
    <xt-dialog v-model="addWorkerDialog" :title="addWorkerTitle" @cancel="addWorkerDialog = false" @confirm="uploadData">
      <div class=" font-sans font-semibold">
        工作日期：{{ addWorkerDate }}
      </div>
      <div v-for="(item, index) in editWorkerList" :key="index">
        <div class="m-2 flex">
          <div class="mt-1">
            员工：
          </div>
          <div>
            <autoInputItem title="" target="worker" placeholder="选择员工" style="width: 240px" @sent-mesg="(value) => receivePointWorker(value, index)" />
          </div>
        </div>
        <div class="m-2 flex">
          <div class="mt-1">
            开始：
          </div>
          <div>
            <el-time-select
              v-model="item.start"
              style="width: 240px"
              start="08:30"
              step="00:15"
              end="23:30"
              placeholder="开始时间"
            />
          </div>
        </div>
        <div class="m-2 flex">
          <div class="mt-1">
            结束：
          </div>
          <div>
            <el-time-select
              v-model="item.end"
              style="width: 240px"
              start="08:30"
              step="00:15"
              end="23:30"
              placeholder="结束时间"
            />
          </div>
          <div class="flex ml-5">
            <el-button v-if="index === editWorkerList.length - 1" link @click="addWorkerLine(index)">
              <el-icon size="30">
                <SvgIcon name="addWorker" />
              </el-icon>
            </el-button>
            <el-button v-if="editWorkerList.length > 1" link @click="minWorkerLine(index)">
              <el-icon size="30">
                <SvgIcon name="minWorker" />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </xt-dialog>
  </div>
</template>
