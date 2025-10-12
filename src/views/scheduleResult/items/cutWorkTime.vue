<!-- eslint-disable no-unmodified-loop-condition -->
<!-- eslint-disable vue/valid-define-props -->
<script setup lang="ts">
import type { workerCacheOpt } from './funs'
import { cutDownJobTime, getScheduleResultTotable } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { DateToStr } from '@/views/editJob/publicData'
import { perpareDatas, setWorkerHourPrice } from './funs'

const props = defineProps<Props>()
const emits = defineEmits(['close'])
const acs = useAppCacheStore()
interface Props {
  item: workerCacheOpt | undefined
  dateList: any
}
const marks: any = {}
const loadingSchedule = ref(false)
const value2 = ref()
function generateTimeSlots(
  start: string,
  end: string,
  stepMinutes: number = 30,
): string[] {
  const result: string[] = []

  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)

  const startTime = new Date()
  startTime.setHours(startHour, startMinute, 0, 0)

  const endTime = new Date()
  endTime.setHours(endHour, endMinute, 0, 0)

  while (startTime <= endTime) {
    const hh = String(startTime.getHours()).padStart(2, '0')
    const mm = String(startTime.getMinutes()).padStart(2, '0')
    result.push(`${hh}:${mm}`)

    startTime.setMinutes(startTime.getMinutes() + stepMinutes)
  }

  return result
}
function formatTooltip(value: number) {
  if (props.item) {
    const temp = generateTimeSlots(props.item.workTime.split('-')[0], props.item?.workTime.split('-')[1])
    for (const i in temp) {
      marks[Number(i) * 10] = temp[i]
    }
    return value in marks ? marks[value] : ''
  }
  else {
    return null
  }
}

function confirmUpLoad() {
  loadingSchedule.value = true
  if (marks[value2.value] === undefined) {
    // eslint-disable-next-line no-alert
    alert('请拖动时间切割滑块')
    return null
  }
  const param = {
    sid: props.item?.sid,
    point: marks[value2.value],
  }
  cutDownJobTime(param).then(() => {
    if (acs.timeRange) {
      const param = {
        pid: acs.currentProject,
        start_data: DateToStr(acs.timeRange[0]),
        end_data: DateToStr(acs.timeRange[1]),
      }
      getScheduleResultTotable(param).then(({ data: res }) => {
        setWorkerHourPrice(res.df, res.wr, res.wp)
        perpareDatas()
        emits('close')
      })
    }
  })
}
</script>

<template>
  <div class="w-115">
    <div class="mt-5">
      时间：{{ props.item?.date }}
    </div>
    <div class="mt-5">
      岗位：{{ props.item?.jobName }}
    </div>
    <div class="mt-5">
      姓名：{{ props.item?.workerName }}
    </div>
    <div class="mt-4 flex">
      <div class="mt-4">
        时间：
      </div>
      <div class="flex">
        <div class="mr-5 mt-2 bg-gray-200 pt-2 pb-2 pl-4 pr-4 rounded-md">
          {{ props.item?.workTime.split('-')[0] }}
        </div>
        <div class="w-50 mt-2">
          <el-slider v-model="value2" :step="10" :format-tooltip="formatTooltip" />
        </div>
        <div class="ml-5 mt-2 bg-gray-200 pt-2 pb-2 pl-4 pr-4 rounded-md">
          {{ props.item?.workTime.split('-')[1] }}
        </div>
      </div>
    </div>
    <div class="flex m-auto w-30 text-center items-center justify-center mt-8 bg-green-200 p-2 rounded-md">
      分割点：{{ marks[value2] }}
    </div>
    <div>
      <el-button>
        取消
      </el-button>
      <el-button type="primary" :loading="loadingSchedule" @click="confirmUpLoad">
        确定
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
