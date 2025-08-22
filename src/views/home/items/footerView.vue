<script setup lang="ts">
import { getEditRuleByProject, setRule } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()
function init() {
  getEditRuleByProject(acs.currentProject).then(({ data: res }) => {
    acs.rest_workDay = res.result.workDay
    acs.rest_weekend = res.result.weekendDay
    acs.rest_festival = res.result.festival
    acs.daysOfAnnualLeave = res.result.daysOfAnnualLeave
  })
}

function restConfig(index: number) {
  const params = {
    pid: acs.currentProject,
    conf_name: '',
    conf_value: 0,
  }
  if (index === 1) {
    params.conf_name = 'workDay'
    params.conf_value = acs.rest_workDay
  }
  if (index === 2) {
    params.conf_name = 'weekendDay'
    params.conf_value = acs.rest_weekend
  }
  if (index === 3) {
    params.conf_name = 'festival'
    params.conf_value = acs.rest_festival
  }
  if (index === 4) {
    params.conf_name = 'daysOfAnnualLeave'
    params.conf_value = acs.daysOfAnnualLeave
  }
  setRule(params).then(() => {
    init()
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <el-card class="w-1080px rounded-1rem">
      <div>
        <div class="flex mt-3">
          <div class="w-40">
            工作日休息人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_workDay" :min="1" :max="10" @change="restConfig(1)" />
          </div>
        </div>
        <div class="flex mt-3">
          <div class="w-40">
            周末调休人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_weekend" :min="1" :max="10" @change="restConfig(2)" />
          </div>
        </div>

        <div class="flex mt-3">
          <div class="w-40">
            节日调休人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_festival" :min="1" :max="10" @change="restConfig(3)" />
          </div>
        </div>

        <div class="flex mt-3">
          <div class="w-40">
            员工月休天数：
          </div>
          <div>
            <el-input-number v-model="acs.daysOfAnnualLeave" :min="1" :max="10" @change="restConfig(4)" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>
