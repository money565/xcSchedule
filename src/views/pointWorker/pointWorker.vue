<!-- eslint-disable prefer-const -->
<script lang="ts" setup>
import type { resultOpt } from '@/views/editJob/publicData'
import { useAppCacheStore } from '@/stores/appCache'
import { currentPage, init, pageChange, perPage, total } from '@/views/editJob/publicData'
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
const editWorkerList = ref<{ wid: number, start: string, end: string }[]>([])

onMounted(() => {
  dateList.value = acs.getDateRangeArray(acs.timeRange![0], acs.timeRange![1], 'json')
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
    const firstLise: any = {
      id: 'id号',
      area: '区域',
      name: '岗位名称',
      startTime: '开始时间',
      endTime: '结束时间',
    }
    dateList.value.forEach((item: string) => firstLise[item] = item)
    console.log(firstLise)
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
  addWorkerTitle.value = `添加${pointTable.value[index].area}-${pointTable.value[index].name}的工作人员`
  console.log(pointTable.value[index], dateIndex)
  addWorkerDialog.value = true
}
</script>

<template>
  <div>
    <div v-for="(item, index) in pointTable" :key="index">
      <div class="flex m-10 ">
        <div v-for="value in range(2, Object.keys(item).length)" :key="value" class="w-40 text-center" :class="index === 0 ? 'bg-red-300 h-10 text-center justify-center' : ''">
          <div v-if="Object.values(item)[value] !== null">
            {{ Object.values(item)[value] }}
          </div>
          <div v-else>
            <el-icon size="25" class="cursor-pointer" @click="addWorker(index, value)">
              <svg-icon name="add" />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <el-pagination layout="prev, pager, next" :total="total" @change="pageChange" />
    <xt-dialog v-model="addWorkerDialog" :title="addWorkerTitle">
      <div v-for="(item, index) in editWorkerList" :key="index">
        <div class="m-2 flex">
          <div class="mt-1">
            员工：
          </div>
          <div>
            <autoInputItem title="" target="worker" style="width: 240px" />
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
        </div>
      </div>
    </xt-dialog>
  </div>
</template>
