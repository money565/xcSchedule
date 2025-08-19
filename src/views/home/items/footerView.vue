<script setup lang="ts">
import { getEditRuleByProject } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import checkboxView from '../inputElements/checkboxView.vue'
import inputView from '../inputElements/inputView.vue'
import radioView from '../inputElements/radioView.vue'

interface rulesOpt {
  id: number
  conf_name: string
  conf_value: any
  conf_label: {
    input_type: string
    value_type: string
    options?: { label: string, value: number }[]
  }
}
const acs = useAppCacheStore()
const rules = ref<rulesOpt[]>([])
const showMore = ref(false)
function init() {
  getEditRuleByProject(acs.currentProject).then(({ data: res }) => {
    rules.value = res.result
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
            <el-input-number v-model="acs.rest_workDay" :min="1" :max="10" />
          </div>
        </div>
        <div class="flex mt-3">
          <div class="w-40">
            周末调休人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_weekend" :min="1" :max="10" />
          </div>
        </div>

        <div class="flex mt-3">
          <div class="w-40">
            节日调休人数：
          </div>
          <div>
            <el-input-number v-model="acs.rest_festival" :min="1" :max="10" />
          </div>
        </div>

        <div class="flex mt-3">
          <div class="w-40">
            员工月休天数：
          </div>
          <div>
            <el-input-number v-model="acs.daysOfAnnualLeave" :min="1" :max="10" />
          </div>
        </div>
      </div>
      <el-button class="mt-5" link type="primary" @click="showMore = !showMore">
        {{ showMore ? '隐藏' : '显示更多规则' }}
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>

</style>
