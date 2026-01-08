<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { getEditRuleByProject, setFixedRest, setRule, unsetFixedRest } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import autoInputItem from '@/views/editElement/autoInputItem.vue'

const acs = useAppCacheStore()
const queryRefreshKey = ref(0)
function init() {
  getEditRuleByProject(acs.currentProject).then(({ data: res }) => {
    acs.rest_workDay = res.result.workDay
    acs.rest_weekend = res.result.weekendDay
    acs.rest_festival = res.result.festival
    acs.daysOfAnnualLeave = res.result.daysOfAnnualLeave
    acs.fixedRestEmps = res.result.fixedRestList
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

function addRestMan(value: { link: number, value: string }) {
  console.log(value)
  let isin = false
  for (const i in acs.fixedRestEmps) {
    if (acs.fixedRestEmps[i].value === value.value) {
      isin = true
    }
  }
  if (!isin) {
    setFixedRest(value.link).then(() => {
      init()
      queryRefreshKey.value = new Date().getTime()
    })
  }
  else {
    alert('该人员已添加')
  }
}

function deleteFixedEmp(index: number) {
  unsetFixedRest(index).then(() => {
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
          <div class="ml-5 mt-1">
            选择固定休息人员：
          </div>
          <div class="ml-3">
            <autoInputItem :key="queryRefreshKey" title="" target="worker" placeholder="选择要调休的员工" @sent-mesg="addRestMan" />
          </div>
          <div class="flex gap-4 mt-1 ml-3 w-80 overflow-auto">
            <el-tag v-for="item in acs.fixedRestEmps" :key="item.link" type="primary" class="cursor-pointer" @click="deleteFixedEmp(item.link)">
              {{ item.value }}
            </el-tag>
          </div>
        </div>
        <div class="flex mt-5">
          <div class="w-40">
            周末调休人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_weekend" :min="1" :max="10" @change="restConfig(2)" />
          </div>
        </div>

        <div class="flex mt-5">
          <div class="w-40">
            节日调休人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_festival" :min="1" :max="10" @change="restConfig(3)" />
          </div>
        </div>

        <div class="flex mt-5">
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
