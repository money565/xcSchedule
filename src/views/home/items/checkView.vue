<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { checkDatas } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { DateToStr } from '@/views/editJob/publicData'

const router = useRouter()
const acs = useAppCacheStore()
const checkResult = ref<{
  totalJobNum: number
  Plant_activeWorkNum: number
  Actually_activeWorkNum: number
}>()
function checkTimeRangeDatas() {
  if (acs.timeRange) {
    const params = {
      pid: acs.currentProject,
      start_date: DateToStr(acs.timeRange[0]),
      end_date: DateToStr(acs.timeRange[1]),
    }
    checkDatas(params).then(({ data: res }) => {
      checkResult.value = res.result
    })
  }
  else {
    alert('请选择周期')
  }
}
function toPointJob() {
  if (acs.timeRange === undefined) {
    alert('请选择排班周期')
    return null
  }
  router.push({ name: 'pointWorker' })
}
</script>

<template>
  <div>
    <el-card class="w-1080px rounded-1rem font-sans font-semibold">
      <el-button type="primary" class="font-sans font-semibold" link @click="toPointJob">
        手动指定班次
      </el-button>
      <el-button type="primary" class="font-sans font-medium" @click="checkTimeRangeDatas">
        检查数据
      </el-button>
      <el-text class="font-sans font-semibold" type="success">
        <div v-if="checkResult" class="flex">
          <div class="ml-5">
            岗位总数：
          </div>
          <div>
            {{ checkResult.totalJobNum }}
          </div>
          <div class="ml-5">
            计划活动员工数：
          </div>
          <div>
            {{ checkResult.Plant_activeWorkNum }}
          </div>
          <div class="ml-5">
            实际活动员工数：
          </div>
          <div>
            {{ checkResult.Actually_activeWorkNum }}
          </div>
        </div>
        <div v-else>
          待检查
        </div>
      </el-text>
    </el-card>
  </div>
</template>

<style scoped>

</style>
