<script setup lang="ts">
import type { workerCacheOpt } from './funs'
import { changeWorkerTime } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

interface Props {
  workTimeCache: workerCacheOpt[]
}
const props = defineProps<Props>()
const emits = defineEmits(['close'])
const acs = useAppCacheStore()
const directionOfArrow = ref('right')
const timeNumber = ref(0)
const overChangeValue = ref<string[]>([])
const overChangeJob = ref<workerCacheOpt>()
const ext_sn = ref(-1)
const ext_time = ref('')
const mesg = reactive({
  ext_sn: -1,
  ext_time: '',
  in_job: -1,
  in_wid: -1,
  in_time_start: '',
  in_time_end: '',
  in_date: '',
})

function compareTimes(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number)
  const [h2, m2] = time2.split(':').map(Number)

  const totalMinutes1 = h1 * 60 + m1
  const totalMinutes2 = h2 * 60 + m2

  return totalMinutes1 - totalMinutes2
}

function confirmUp() {
  console.log(mesg)
//   ext_sn = int(data.ext_sn)
//   ext_time = data.ext_time
//   in_job = int(data.in_job)
//   in_wid = int(data.wid)
//   in_time_start = data.in_time_start
//   in_time_end = data.in_time_end
//   in_date = data.in_date
//   changeWorkerTime
}
onMounted(() => {
  const t1 = props.workTimeCache[0].workTime.split('-')
  const t2 = props.workTimeCache[1].workTime.split('-')
  timeNumber.value = compareTimes(t1[0], t2[0])
  if (timeNumber.value > 0) {
    directionOfArrow.value = 'rightArrow'
    overChangeValue.value = [`${t1[0]}-${t2[1]}`, `${t2[0]}-${t1[0]}`]
    overChangeJob.value = props.workTimeCache[1]
    console.log('右给出时间', props.workTimeCache[1])
    mesg.ext_sn = props.workTimeCache[1].sid
    mesg.ext_time = t1[0]
    mesg.in_job = props.workTimeCache[1].jid
    mesg.in_wid = props.workTimeCache[0].wid
    mesg.in_time_start = t2[0]
    mesg.in_time_end = t1[0]
    mesg.in_date = props.workTimeCache[1].date
    console.log(ext_sn.value, ext_time.value, mesg)
  }
  else {
    if (timeNumber.value === 0) {
      directionOfArrow.value = 'nosuggest'
    }
    else {
      directionOfArrow.value = 'leftArrow'
      overChangeValue.value = [`${t1[0]}-${t2[0]}`, `${t2[0]}-${t1[1]}`]
      overChangeJob.value = props.workTimeCache[0]
      console.log('左给出时间', props.workTimeCache[0])
      mesg.ext_sn = props.workTimeCache[0].sid
      mesg.ext_time = t2[0]
      mesg.in_job = props.workTimeCache[0].jid
      mesg.in_wid = props.workTimeCache[1].wid
      mesg.in_time_start = t2[0]
      mesg.in_time_end = t1[0]
      mesg.in_date = props.workTimeCache[1].date
      console.log(ext_sn.value, ext_time.value, mesg)
    }
  }
})
</script>

<template>
  <div>
    <div class="flex">
      <el-card style="width: 580px; height: 300px;">
        <div class="flex gap-9">
          <div>
            姓名：
          </div>
          <div>
            {{ props.workTimeCache[1].workerName }}
          </div>
        </div>
        <div class="flex gap-9">
          <div>
            id：
          </div>
          <div>
            {{ props.workTimeCache[1].wid }}
          </div>
        </div>
        <div class="flex gap-9">
          <div>
            sn：
          </div>
          <div>
            {{ props.workTimeCache[1].sid }}
          </div>
        </div>
        <div class="flex gap-9">
          <div>
            日期：
          </div>
          <div>
            {{ workTimeCache[1].date }}
          </div>
        </div>
        <div class="flex gap-2">
          <div>
            工作时间：
          </div>
          <div>
            {{ workTimeCache[1].workTime }}
          </div>
        </div>
        <div class="flex gap-2">
          <div>
            岗位名称：
          </div>
          <div>
            {{ workTimeCache[1].jobName }}
          </div>
        </div>
        <div class="flex gap-2">
          <div>
            是否主岗：
          </div>
          <div>
            {{ workTimeCache[1].jid === workTimeCache[1].mainJob ? '是' : '否' }}
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <div>
            调整后：
          </div>
          <div>
            <div v-if="directionOfArrow === 'leftArrow'" class="text-red-600">
              <div>
                增加：{{ overChangeJob?.jobName }}
              </div>
              <div>
                时间：{{ overChangeValue[0] }}
              </div>
            </div>
            <div v-else-if="directionOfArrow === 'rightArrow'" class="text-green-600">
              原工作时间调整为：{{ overChangeValue[0] }}
            </div>
          </div>
        </div>
      </el-card>
      <div>
        <el-icon size="30" class="ml-5 mr-5 mt-20">
          <svg-icon :name="directionOfArrow" />
        </el-icon>
        <div class="justify-center items-center text-center">
          {{ timeNumber < 0 ? -timeNumber / 60 : timeNumber / 60 }}小时
        </div>
      </div>
      <el-card style="width: 580px; height: 300px;">
        <div class="flex gap-9">
          <div>
            姓名：
          </div>
          <div>
            {{ workTimeCache[0].workerName }}
          </div>
        </div>
        <div class="flex gap-9">
          <div>
            id：
          </div>
          <div>
            {{ props.workTimeCache[0].wid }}
          </div>
        </div>
        <div class="flex gap-9">
          <div>
            sn：
          </div>
          <div>
            {{ props.workTimeCache[0].sid }}
          </div>
        </div>
        <div class="flex gap-9">
          <div>
            日期：
          </div>
          <div>
            {{ workTimeCache[0].date }}
          </div>
        </div>
        <div class="flex gap-2">
          <div>
            工作时间：
          </div>
          <div>
            {{ workTimeCache[0].workTime }}
          </div>
        </div>
        <div class="flex gap-2">
          <div>
            岗位名称：
          </div>
          <div>
            {{ workTimeCache[0].jobName }}
          </div>
        </div>
        <div class="flex gap-2">
          <div>
            是否主岗：
          </div>
          <div>
            {{ workTimeCache[0].jid === workTimeCache[1].mainJob ? '是' : '否' }}
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <div>
            调整后：
          </div>
          <div>
            <div v-if="directionOfArrow === 'rightArrow'" class="text-red-600">
              <div>
                增加：{{ overChangeJob?.jobName }}
              </div>
              <div>
                时间：{{ overChangeValue[1] }}
              </div>
            </div>
            <div v-else-if="directionOfArrow === 'leftArrow'" class="text-green-600">
              原工作时间改为：{{ overChangeValue[1] }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="flex text-right items-end justify-end mt-10">
      <el-button @click="emits('close')">
        取消
      </el-button>
      <el-button type="primary" @click="confirmUp">
        确定
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
