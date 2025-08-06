<!-- eslint-disable no-alert -->
<!-- eslint-disable ts/no-unused-expressions -->
<!-- eslint-disable prefer-const -->
<script lang="ts" setup>
import type { resultOpt } from '@/views/editJob/publicData'
import { useAppCacheStore } from '@/stores/appCache'
import { currentPage, init, perPage, total } from '@/views/editJob/publicData'
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
const addWorkerDate = ref('')
const editWorkerList = ref<{ wid: number, start: string, end: string }[]>([])
const X_coordinate = ref<number>()
const Y_coordinate = ref<number>()

function intiPointWorker() {
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
    const firstLise: any = {
      id: 'id号',
      area: '区域',
      name: '岗位名称',
      startTime: '开始时间',
      endTime: '结束时间',
    }
    dateList.value.forEach((item: string) => firstLise[item] = item)
    const temp = [firstLise]
    for (const i in res.jobList) {
      const otherLine: any = {
        id: res.jobList[i].id,
        area: res.jobList[i].area,
        name: res.jobList[i].name,
        startTime: res.jobList[i].startTime,
        endTime: res.jobList[i].endTime,
      }
      dateList.value.forEach((item: string) => otherLine[item] = null)
      temp.push(otherLine)
    }
    pointTable.value = temp
    total.value = res.total
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
  editWorkerList.value.push({
    wid: -1,
    start: pointTable.value[index].startTime,
    end: pointTable.value[index].endTime,
  })
  addWorkerDate.value = Object.values(pointTable.value[0])[dateIndex]
  addWorkerTitle.value = `添加${pointTable.value[index].area}-${pointTable.value[index].name}的工作人员`
  addWorkerDialog.value = true
}

function addWorkerLine(index: number) {
  console.log(editWorkerList.value[index])
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
  })
}

function minWorkerLine(index: number) {
  editWorkerList.value.splice(index, 1)
}

function onDateHovered(index: number, dateIndex: number) {
  Y_coordinate.value = dateIndex
  X_coordinate.value = index
}

function receivePointWorker(value: any, index: number) {
  editWorkerList.value[index].wid = value.link
  if (X_coordinate.value !== undefined) {
    const jid = pointTable.value[X_coordinate.value].id
    console.log(value, jid, addWorkerDate.value)
  }
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
          class=" h-15 w-30 items-center justify-center flex"
          :class="index === 0 ? ('bg-gray-200 text-gray-700 font-sans font-medium') : ''"
          @mouseenter="onDateHovered(index, value)"
        >
          <div
            v-if="value < 5"
            class="flex h-15 w-30 items-center justify-center "
            :class="index === X_coordinate ? (index === X_coordinate ? 'bg-light-blue-200' : 'bg-yellow-100') : ''"
          >
            {{ Object.values(item)[value] }}
          </div>
          <div v-else>
            <div class="flex h-15 w-30 items-center justify-center" :class="value === Y_coordinate || index === X_coordinate ? (index === X_coordinate ? 'bg-light-blue-200' : 'bg-yellow-200') : ''">
              <el-icon v-if="Object.values(item)[value] === null" size="25" class="cursor-pointer" @click="addWorker(index, value)">
                <svg-icon name="add" />
              </el-icon>
              <div v-else>
                {{ Object.values(item)[value] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination layout="prev, pager, next" :total="total" @change="pagePointWorkerChange" />
    <xt-dialog v-model="addWorkerDialog" :title="addWorkerTitle">
      <div class=" font-sans font-semibold">
        工作日期：{{ addWorkerDate }}
      </div>
      <div v-for="(item, index) in editWorkerList" :key="index">
        <div class="m-2 flex">
          <div class="mt-1">
            员工：
          </div>
          <div>
            <autoInputItem title="" target="worker" style="width: 240px" @sent-mesg="(value) => receivePointWorker(value, index)" />
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
