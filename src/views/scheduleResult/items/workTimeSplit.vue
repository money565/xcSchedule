<script setup lang="ts">
import type { workerCacheOpt } from './funs'
import { jobStanderTimeChange, provideTime, timeDivisionClick, workerJobChange, workerTimeAdjust } from './funs'

interface Props {
  item: workerCacheOpt
}
const props = defineProps<Props>()
</script>

<template>
  <div>
    <div class="flex">
      <el-button type="primary" link @click="timeDivisionClick(props.item)">
        <div class="text-3">
          分割
        </div>
      </el-button>
      <el-button type="warning" link @click="workerJobChange(props.item)">
        <div class="text-3">
          调换
        </div>
      </el-button>
      <el-button type="success" link @click="workerTimeAdjust(props.item)">
        <div class="text-3">
          快调
        </div>
      </el-button>
    </div>
    <div class="flex mt-2">
      <el-button type="danger" link @click="provideTime(props.item)">
        <div class="text-3">
          给出
        </div>
      </el-button>
      <el-button type="info" link @click="jobStanderTimeChange(props.item)">
        <div class="text-3">
          调时
        </div>
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
