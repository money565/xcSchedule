<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()
const period = ref<[Date, Date]>()
const options = [
  {
    value: 1,
    label: '群光广场',
  },
  {
    value: 2,
    label: '蔚蓝卡地亚花园城',
  },
]

function timeRangeChange() {
  if (period.value) {
    const start_data = `${period.value[0].getFullYear()}-${period.value[0].getMonth() + 1}-${period.value[0].getDate()}`
    const end_data = `${period.value[1].getFullYear()}-${period.value[1].getMonth() + 1}-${period.value[1].getDate()}`
    console.log(start_data, end_data)
  }
}
</script>

<template>
  <div>
    <div class="text-center mt-10">
      <div class="text-4xl font-sans font-bold">
        细川排班系统
      </div>
      <div class="mt-5 text-gray-500 font-sans">
        高效管理员工排班，简化人力资源流程
      </div>
    </div>
    <div class="mt-10">
      <div>
        <el-card class="w-1080px rounded-1rem" shadow="hover">
          <div class="flex">
            <div class="text-4 font-sans font-bold mt-2 truncate">
              当前项目:
            </div>
            <div>
              <el-select
                v-model="acs.currentProject"
                size="large"
                :offset="0"
                placeholder="选择项目"
                class="w-200px ml-20px m-0 p-0 rounded-10px text-4 font-sans font-bold"
              >
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  class="text-3 font-sans font-bold"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="text-4 font-sans font-bold mt-2 ml-10">
              主管：汤卉
            </div>
            <div class="text-4 font-sans font-bold mt-2 ml-10">
              期间：
            </div>
            <div>
              <el-date-picker
                v-model="period"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                size="large"
                @change="timeRangeChange"
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-select--large .el-select__wrapper){
  background-color: #409EFF;
}
:deep(.el-select__caret){
  color: #FFFFFF;
}
:deep(.el-select__placeholder){
  color: #FFFFFF;
}
</style>
