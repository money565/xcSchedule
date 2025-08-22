<script lang="ts" setup>
import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()
</script>

<template>
  <div class="flex">
    <div style="display: flex; align-items: center">
      <el-popover
        :width="300"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
      >
        <template #reference>
          <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
        </template>
        <template #default>
          <div class="text-center">
            未安排的员工
          </div>
          <div
            class="demo-rich-conent"
            style="display: flex; gap: 16px; flex-direction: column"
          >
            <div v-for="(item, index) in acs.worker_leak" :key="index">
              <div>{{ index }}</div>
              <div>{{ item }}</div>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
    <div style="display: flex; align-items: center; margin-left: 10%;">
      <el-popover
        :width="300"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
      >
        <template #reference>
          <el-icon><svg-icon name="mtiemp" /></el-icon>
        </template>
        <template #default>
          <div class="text-center">
            未安排的工作
          </div>
          <div
            class="demo-rich-conent"
            style="display: flex; gap: 16px; flex-direction: column"
          >
            <div v-for="(item, index) in acs.job_leak" :key="index">
              <div>{{ index }}</div>
              <div>{{ item }}</div>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>
