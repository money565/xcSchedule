<script setup lang="ts">
import { getJobSupport } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import autoInputItem from '@/views/editElement/autoInputItem.vue'

interface supportOpt {
  id: number
  job: {
    id: number
    name: string
  }
  supportedJob: {
    id: number
    name: string
  }
  start: string
  end: string
  feq: number
}
const emits = defineEmits(['sendData'])
const formData = reactive({
  job: -1,
  supportedJob: -1,
  start: '',
  end: '',
  feq: 1,
})
const acs = useAppCacheStore()
const tableData = ref<supportOpt[]>([])
function init() {
  getJobSupport(acs.currentProject).then(({ data: res }) => {
    if (res.result.length > 0) {
      const temp: supportOpt[] = []
      for (const i in res) {
        temp.push({
          id: res.result[i].id,
          job: res.result[i].job,
          supportedJob: res.result[i].supportedJob,
          start: res.result[i].start,
          end: res.result[i].end,
          feq: res.result[i].feq,
        })
      }
      tableData.value = temp
    }
  })
}

onMounted(() => {
  init()
})

watch(() => formData, (n) => {
  emits('sendData', n)
}, { deep: true })
</script>

<template>
  <div class="flex">
    <div class="w-60%">
      <div>
        支援列表
      </div>
      <div>
        <el-table :data="tableData" class="w-100%">
          <el-table-column prop="job.name" label="支援岗位" width="120" />
          <el-table-column prop="supportedJob.name" label="被支援岗位" width="120" />
          <el-table-column label="时间" width="120">
            <template #default="scoped">
              <div>{{ scoped.row.start }}-{{ scoped.row.end }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="feq" label="周期(天)" width="100" />
        </el-table>
      </div>
    </div>

    <div>
      <el-divider direction="vertical" class="h-70" />
    </div>

    <div>
      <div>
        <div class="flex">
          <div>
            <div>
              提供支援
            </div>
            <div>
              <autoInputItem titel="" target="job" class="w-50" placeholder="请选择岗位" current-date="" @sent-mesg="(value) => formData.job = value.link" />
            </div>
          </div>
          <div class="ml-5">
            <div>
              接受支援
            </div>
            <div>
              <autoInputItem titel="" target="job" class="w-50" placeholder="请选择岗位" current-date="" @sent-mesg="(value) => formData.supportedJob = value.link" />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <div class="flex">
          <div>
            <div>
              支援起始时间
            </div>
            <div>
              <el-time-select
                v-model="formData.start"
                class="w-50"
                start="08:00"
                step="00:15"
                end="23:30"
                placeholder="结束"
                format="HH:mm:ss"
              />
            </div>
          </div>
          <div class="ml-5">
            <div>
              支援结束时间
            </div>
            <div>
              <el-time-select
                v-model="formData.end"
                class="w-50"
                start="08:00"
                step="00:15"
                end="23:30"
                placeholder="开始"
                format="HH:mm:ss"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="mt-5">
          <div class="w-40">
            支援频率
          </div>
          <div>
            每<el-input-number v-model="formData.feq" :min="1" :max="10" class="w-30 ml-3 mr-3" />天支援一次
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
