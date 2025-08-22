<script setup lang="ts">
import { getScheduleResultTotable, makeScheduls } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { DateToStr } from '../editJob/publicData'
import { setWorkerHourPrice } from '../scheduleResult/items/funs'
import checkView from './items/checkView.vue'
import footerView from './items/footerView.vue'
import headerView from './items/headerView.vue'
import scheduleResult from './items/scheduleResult.vue'
import upLoadItem from './items/upLoadItem.vue'

const acs = useAppCacheStore()
const worker_price_time = ref<{
  name: string
  workHour: number
  price: number
}[]>([])
const job_leak = ref({})
const worker_leak = ref({})
const router = useRouter()
const loadingSchedule = ref(false)
const hasScheduleTableDialog = ref(false)
const scheduleTableExist = ref([])
const makeSchedulsSource = ref<number>(-1)
const scheduleResultShowDialog = ref(false)

function orderMesgChange(value: { target: string, priceOrder: boolean }) {
  if (value.target === 'price') {
    if (value.priceOrder) {
      worker_price_time.value.sort((a, b) => a.price - b.price)
    }
    else {
      worker_price_time.value.sort((a, b) => b.price - a.price)
    }
  }

  if (value.target === 'worktime') {
    if (value.priceOrder) {
      worker_price_time.value.sort((a, b) => a.workHour - b.workHour)
    }
    else {
      worker_price_time.value.sort((a, b) => b.workHour - a.workHour)
    }
  }
}

function downloadSchedule(confirm: string | null = null) {
  loadingSchedule.value = true
  makeSchedulsSource.value = 1
  if (acs.timeRange) {
    // const target = `f${new Date().getTime()}`
    const params: { pid: number, start_data: string, end_data: string, confirm?: any } = {
      pid: acs.currentProject,
      start_data: DateToStr(acs.timeRange[0]),
      end_data: DateToStr(acs.timeRange[1]),
    }
    if (confirm !== null) {
      params.confirm = ''
    }
    try {
      makeScheduls(params).then(({ data: res }) => {
        if (res.result === 1) {
          scheduleTableExist.value = res.mesg
          hasScheduleTableDialog.value = true
          loadingSchedule.value = false
        }
        else {
          worker_price_time.value = res.worker_price_time
          job_leak.value = res.job_leak
          worker_leak.value = res.worker_leak
          const blob = new Blob([res.df], { type: 'text/csv;charset=utf-8;' })
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = 'pbb'
          link.click()
          URL.revokeObjectURL(downloadUrl)
          loadingSchedule.value = false
          hasScheduleTableDialog.value = false
          scheduleResultShowDialog.value = true
        }
      })
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      // eslint-disable-next-line no-alert
      alert('下载失败，请重试')
    }
  }
  else {
    // eslint-disable-next-line no-alert
    alert('选择排班区间')
  }
}

function getSchedule(confirm: string | null = null) {
  makeSchedulsSource.value = 2
  if (acs.timeRange) {
    loadingSchedule.value = true
    const params: { pid: number, start_data: string, end_data: string, target: string, confirm?: any } = {
      pid: acs.currentProject,
      start_data: DateToStr(acs.timeRange[0]),
      end_data: DateToStr(acs.timeRange[1]),
      target: 'ok',
    }
    if (confirm !== null) {
      params.confirm = ''
    }
    try {
      makeScheduls(params).then(({ data: res }) => {
        if (res.result === 1) {
          scheduleTableExist.value = res.mesg
          hasScheduleTableDialog.value = true
          loadingSchedule.value = false
        }
        else {
          setWorkerHourPrice(res.df, res.wr, res.wp)
          acs.worker_leak = res.worker_leak
          acs.job_leak = res.job_leak
          loadingSchedule.value = false
          router.push({
            name: 'scheduleResult',
          })
        }
      })
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (error) {
      // eslint-disable-next-line no-alert
      alert('下载失败，请重试')
    }
  }
  else {
    // eslint-disable-next-line no-alert
    alert('选择排班区间')
  }
}

function readScheduleTable() {
  loadingSchedule.value = true
  makeSchedulsSource.value = 3
  if (acs.timeRange) {
    const param = {
      pid: acs.currentProject,
      start_data: DateToStr(acs.timeRange[0]),
      end_data: DateToStr(acs.timeRange[1]),
    }
    getScheduleResultTotable(param).then(({ data: res }) => {
      setWorkerHourPrice(res.df, res.wr, res.wp)
      loadingSchedule.value = false
      router.push({
        name: 'scheduleResult',
      })
    })
  }
  else {
    // eslint-disable-next-line no-alert
    alert('选择排班区间')
  }
}

function cancelMakeSchedule() {
  loadingSchedule.value = false
  hasScheduleTableDialog.value = false
}

function confirmMakeSchedule() {
  if (makeSchedulsSource.value === 1) {
    downloadSchedule('ok')
  }
  if (makeSchedulsSource.value === 2) {
    getSchedule('ok')
  }
}
</script>

<template>
  <div class="pb-20">
    <div class="grid place-items-center mt-8">
      <headerView />
    </div>
    <div class="grid place-items-center mt-8">
      <div class="flex gap-8">
        <div>
          <upLoadItem title="员工信息表" target="price" />
        </div>
        <div>
          <upLoadItem title="固定岗位安排表" target="job" />
        </div>
      </div>
      <div class="flex gap-8 mt-8">
        <div>
          <upLoadItem title="员工休假表" target="rest" />
        </div>
        <div>
          <upLoadItem title="调班表上传" target="replace" />
        </div>
      </div>
    </div>
    <div class="grid place-items-center mt-8">
      <footerView />
    </div>
    <div class="grid place-items-center mt-8">
      <checkView />
    </div>
    <div class="flex justify-center items-center gap-4 h-32 bg-gray-100">
      <el-button type="warning" class="w-60 h-12" :loading="loadingSchedule" @click="downloadSchedule()">
        <div class="font-sans font-semibold ml-5 text-4">
          生成下载版排班表
        </div>
      </el-button>
      <el-button type="primary" class="w-60 h-12" :loading="loadingSchedule" @click="getSchedule()">
        <div class="flex">
          <div>
            <el-icon size="25">
              <SvgIcon name="excel" />
            </el-icon>
          </div>
          <div class="font-sans font-semibold ml-5 text-4 mt-1">
            {{ loadingSchedule && makeSchedulsSource === 2 ? "正在生成排班表" : "生成排班表" }}
          </div>
        </div>
      </el-button>
      <el-button type="success" class="w-60 h-12" :loading="loadingSchedule" @click="readScheduleTable">
        <div class="flex">
          <div>
            <el-icon size="25">
              <SvgIcon name="read" />
            </el-icon>
          </div>
          <div class="font-sans font-semibold ml-5 text-4 mt-1">
            {{ loadingSchedule && makeSchedulsSource === 3 ? "正在读取排班表" : "读取排班表" }}
          </div>
        </div>
      </el-button>
    </div>

    <XtDialog v-model="hasScheduleTableDialog" title="已经存在了排班表" :loading="loadingSchedule" @cancel="cancelMakeSchedule" @confirm="confirmMakeSchedule">
      <div class="text-4">
        已有如下日期的排班表，是否重新排班？
      </div>

      <div v-for="item in scheduleTableExist" :key="item">
        {{ item }}
      </div>

      <div class="flex">
        <el-icon size="30">
          <SvgIcon name="attention" />
        </el-icon>
        <div class="text-5 text-red-600 ml-2">
          重新排班将重置微调内容
        </div>
      </div>
    </XtDialog>
    <XtDialog v-model="scheduleResultShowDialog" title="排班数据一览" width="1200" :show-cancel="false" @confirm="scheduleResultShowDialog = false">
      <div class="grid place-items-center mt-8 h-150 overflow-auto">
        <scheduleResult :worker_price_time="worker_price_time" :job_leak="job_leak" :worker_leak="worker_leak" @order="orderMesgChange" />
      </div>
    </XtDialog>
  </div>
</template>

<style scoped>

</style>
