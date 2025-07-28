<script setup lang="ts">
import { getUnflexibleWorker } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { noJobWorkerList } from '../publicData'

const acs = useAppCacheStore()
function init() {
  getUnflexibleWorker(acs.currentProject).then(({ data: res }) => {
    noJobWorkerList.value = res.result
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div v-if="noJobWorkerList.length === 0">
      <el-empty description="目前没有未分配岗位的非机动岗" />
    </div>
    <div v-for="(item, index) in noJobWorkerList" :key="index" class="ml-5 mt-5 mr-5">
      <el-descriptions border :column="4">
        <el-descriptions-item
          :rowspan="2"
          :width="50"
          label="头像"
          align="center"
        >
          <el-image
            style="width: 80px; height: 80px"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
        </el-descriptions-item>
        <el-descriptions-item label="姓名" label-align="center" :width="50">
          {{ item.name }}
        </el-descriptions-item>
        <el-descriptions-item label="性别" label-align="center" :width="50">
          {{ item.gender ? '男' : '女' }}
        </el-descriptions-item>
        <el-descriptions-item label="成本" label-align="center" :width="50">
          {{ item.price }}
        </el-descriptions-item>
        <el-descriptions-item label="性质" label-align="center" :width="50">
          {{ item.types.name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同" label-align="center" :width="50">
          {{ item.labor_contract.name }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位" label-align="center" :width="50">
          无
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped>

</style>
