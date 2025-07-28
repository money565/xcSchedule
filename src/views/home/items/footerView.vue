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
      <div v-for="(item, index) in rules" :key="index" class="flex mt-5">
        <div class="font-sans font-bold w-30">
          {{ item.conf_name }}
        </div>
        <div class="ml-3 mt--2">
          <checkboxView
            v-if="item.conf_label.input_type === 'checkbox' && item.conf_label.options"
            :rid="item.id"
            :options="item.conf_label.options"
            :value="item.conf_value"
          />
          <radioView
            v-if="item.conf_label.input_type === 'radio' && item.conf_label.options"
            :rid="item.id"
            :options="item.conf_label.options"
            :value="Number(item.conf_value)"
          />
          <inputView
            v-if="item.conf_label.input_type === 'input'"
            :rid="item.id"
            :value="Number(item.conf_value)"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>
