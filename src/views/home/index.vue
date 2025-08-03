<script setup lang="ts">
import { getScheduleResult, makeScheduls } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import axios from 'axios'
import { DateToStr } from '../editJob/publicData'
import checkView from './items/checkView.vue'
import footerView from './items/footerView.vue'
import headerView from './items/headerView.vue'
import upLoadItem from './items/upLoadItem.vue'

const acs = useAppCacheStore()
const resultTableData: any = ref(null)
async function getSchedule() {
  if (acs.timeRange) {
    // const target = `f${new Date().getTime()}`
    const params = {
      pid: acs.currentProject,
      start_data: DateToStr(acs.timeRange[0]),
      end_data: DateToStr(acs.timeRange[1]),
    }
    try {
      makeScheduls(params).then(({ data: res }) => {
        console.log(res)
      })
    }
    catch (error) {
      console.error('Error downloading CSV:', error)
      // eslint-disable-next-line no-alert
      alert('下载失败，请重试')
    }
  }
  else {
    // eslint-disable-next-line no-alert
    alert('选择排班区间')
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
    <div class="grid place-items-center mt-8">
      <el-button type="primary" class="w-60 h-12" @click="getSchedule">
        <div class="flex">
          <div>
            <el-icon size="25">
              <SvgIcon name="excel" />
            </el-icon>
          </div>
          <div class="font-sans font-semibold ml-5 text-4 mt-1">
            生成排班表
          </div>
        </div>
      </el-button>
    </div>
    <div v-if="resultTableData !== null" class="grid place-items-center mt-8">
      <el-card class="w-1080px rounded-1rem font-sans font-semibold text-center">
        <div>排班结果数据</div>
        <div>
          <el-table :data="resultTableData" class="w-200 mx-auto">
            <el-table-column prop="jobsNum" label="岗位总数" width="180" />
            <el-table-column prop="allTotalPrice" label="总成本" width="180" />
            <el-table-column prop="allWorkList" label="排班人数" />
            <el-table-column prop="allWorkerTime" label="总工时" />
            <el-table-column prop="unset" label="未安排人员岗位数" />
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>

</style>
