<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="ts" setup>
import { getReplacementByJobID } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import workTimeChange from './items/workTimeChange.vue'

const acs = useAppCacheStore()
const dateList = ref<string[]>(acs.getDateRangeArray(acs.timeRange![0], acs.timeRange![1], 'json'))
const currentButton = ref()
const workTimeCache: any = ref([])
const isHovering = ref()
const workTimeChangeDialog = ref(false)
const hoverTexts = ref('前四周工时')
const replacementList = ref<number[]>([0])
const popoverText = ref('危险！！！该岗位没有安排到员工')
const popoverTitle = ref('')
const savingDialog = ref(false)
const tableRefreshKey = ref(0)
const optionText = computed(() => {
  if (currentButton.value === 1 && workTimeCache.value.length === 0) {
    return '请选择需要调整的人员'
  }
  else {
    if (currentButton.value === 1 && workTimeCache.value.length === 1) {
      return '调整到哪个岗位'
    }
    else {
      return ''
    }
  }
})
function selectTag(row: any, item: any) {
  if (currentButton.value === 1) {
    if (workTimeCache.value.length === 0) {
      workTimeCache.value = [item]
      getReplacementByJobID(item.jid).then(({ data: res }) => {
        replacementList.value = res.result
      })
    }
    else {
      if (item.date !== workTimeCache.value[0].date) {
        return null
      }
      // TODO写入变更班次的逻辑
      workTimeCache.value.push(item)
      currentButton.value = undefined
      workTimeChangeDialog.value = true
    }
  }
}

function dohoverItem(item: any) {
  if ((currentButton.value === undefined && item.mainJob !== item.jid) || item.jobName === undefined) {
    popoverTitle.value = ''
    popoverText.value = '危险！！！该岗位没有员工替岗'
    if (item.mainJob) {
      for (const i in acs.scheduleResultData) {
        for (const d in acs.scheduleResultData[i][item.date]) {
          if (acs.scheduleResultData[i][item.date][d].jid) {
            if (acs.scheduleResultData[i][item.date][d].jid === item.mainJob) {
              popoverTitle.value = '被替的岗位'
              popoverText.value = `该岗位由 ${acs.scheduleResultData[i][item.date][d].workerName} 代替`
            }
          }
        }
      }
    }
    else {
      for (const i in acs.scheduleResultData) {
        for (const d in acs.scheduleResultData[i][item.date]) {
          if (acs.scheduleResultData[i][item.date][d].jid) {
            if (acs.scheduleResultData[i][item.date][d].mainJob === item.jid) {
              popoverTitle.value = '替代岗位'
              popoverText.value = `替代 ${acs.scheduleResultData[i][item.date][d].workerName} 的岗位`
            }
          }
        }
      }
    }
  }
  isHovering.value = item
}

function upLoadWorkTimeDate() {
  workTimeCache.value = []
  workTimeChangeDialog.value = false
}

function closeWorkTimeDate() {
  workTimeCache.value = []
  workTimeChangeDialog.value = false
  tableRefreshKey.value = new Date().getTime()
}

onMounted(() => {
  for (const i in acs.scheduleResultData) {
    dateList.value.forEach((w) => {
      for (const j in acs.scheduleResultData[i][w]) {
        if (acs.scheduleResultData[i][w][j].state === 2) {
          let hasReplace = false
          for (const t in acs.scheduleResultData) {
            for (const tj in acs.scheduleResultData[t][w]) {
              if (acs.scheduleResultData[t][w][tj].jid === acs.scheduleResultData[i][w][j].mainJob) {
                hasReplace = true
                break
              }
            }
          }
          if (!hasReplace) {
            if (acs.scheduleResultData[i][w][j].mainJob) {
              console.log('没有替休')
              acs.scheduleResultData[i][w][j].noReplace = true
            }
          }
        }
      }
    })
  }
})
</script>

<template>
  <div>
    <el-table
      :key="tableRefreshKey"
      :data="acs.scheduleResultData"
      stripe
      style="width: 100%; height: 55rem; overflow: auto;"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column prop="area" width="70" fixed>
        <template #header>
          <div class="text-black">
            区域
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="job" label="岗位名称" width="180" fixed>
        <template #header>
          <div class="text-black">
            岗位名称
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="workTime" label="岗位时间" width="100" fixed>
        <template #header>
          <div class="text-black">
            岗位时间
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="workName" label="姓名" width="130" fixed>
        <template #header>
          <div class="text-black">
            姓名
          </div>
        </template>
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="hoverTexts"
            placement="top-start"
          >
            {{ scope.row.workName }}
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column v-for="(item, index) in dateList" :key="index" :label="item" width="200">
        <template #header>
          <div class="text-black">
            {{ item }}
          </div>
        </template>
        <template #default="scope">
          <div class="text-center">
            <div
              v-for="(i, v) in scope.row[item]"
              :key="v"
              :class="{ ' bg-blue-300 text-light-50 rounded-md cursor-pointer text-center p-2': isHovering && currentButton === 1 && (workTimeCache.length === 0 || workTimeCache[0].date === i.date) ? i.date === isHovering.date && i.wid === isHovering.wid : false }"
              @click="selectTag(scope.row, i)"
              @mouseenter="dohoverItem(i)"
            >
              <div :class="{ ' text-red-700 text-5 font-sans font-semibold': workTimeCache.length === 1 ? i.date === workTimeCache[0].date && replacementList.includes(i.wid) : false }">
                <div :class="{ ' bg-blue-400 text-light-50 p-2 rounded-md': workTimeCache.length > 0 ? workTimeCache[0].date === i.date && i.wid === workTimeCache[0].wid : false }">
                  <div>
                    <div v-if="i.state === 2" class="bg-teal-300 p-2 rounded-md text-light-50 w-100%">
                      <el-popover
                        class="box-item"
                        :title="popoverTitle"
                        :content="popoverText"
                        placement="top-start"
                      >
                        <template #reference>
                          <div :class="{ ' bg-red-400': i.noReplace === true }">
                            休
                          </div>
                        </template>
                      </el-popover>
                    </div>
                    <div v-if="i.state === 1">
                      {{ i.workTime }}
                    </div>

                    <div v-if="i.state === 3" class="bg-yellow-200 rounded-md p-2">
                      <el-popover
                        class="box-item"
                        :title="popoverTitle"
                        :content="popoverText"
                        placement="top-start"
                      >
                        <template #reference>
                          <div>
                            {{ i.workTime }}
                            {{ `(${i.jobName})` }}
                          </div>
                        </template>
                      </el-popover>
                    </div>
                    <div v-if="i.state === 5" class="bg-red-200 rounded-md p-2 mt-2">
                      {{ i.workTime }}({{ i.jobName }})
                    </div>
                    <div v-if="i.state === 4" class=" bg-blue-400 rounded-md p-2 mt-2 text-light-50">
                      {{ i.workTime }}({{ i.jobName }})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex">
      <el-button :type="currentButton === 1 ? 'primary' : 'default'" @click="currentButton = 1">
        调整工时
      </el-button>
      <el-button :disabled="currentButton === 1">
        调换岗位
      </el-button>
      <el-button type="primary" :disabled="currentButton === 1">
        生成自用表格
      </el-button>
      <el-button type="primary" :disabled="currentButton === 1">
        生成提交表格
      </el-button>
      <div class="m-auto">
        {{ optionText }}
      </div>
    </div>
    <xt-dialog v-model="workTimeChangeDialog" title="工时班次调整" width="900" :show-cancel="false" :show-confirm="false">
      <workTimeChange :work-time-cache="workTimeCache" @close="closeWorkTimeDate" />
    </xt-dialog>
    <xt-dialog v-model="savingDialog" title="正在保存中" width="900" :show-cancel="false" :show-confirm="false">
      <div>
        正在保存
      </div>
    </xt-dialog>
  </div>
</template>

<style scope>

</style>
