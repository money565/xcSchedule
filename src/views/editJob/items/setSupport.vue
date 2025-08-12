<script setup lang="ts">
import autoInputItem from '@/views/editElement/autoInputItem.vue'

const supportTime = ref<string[]>([])
const supportfeq = ref<number>(1)
</script>

<template>
  <div class="flex">
    <div>
      <div>
        <div class="flex">
          <div>
            <div>
              提供支援
            </div>
            <div>
              <autoInputItem titel="" target="job" class="w-50" />
            </div>
          </div>
          <div class="ml-5">
            <div>
              接受支援
            </div>
            <div>
              <autoInputItem titel="" target="job" class="w-50" />
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
                v-model="supportTime[0]"
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
                v-model="supportTime[1]"
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
      <div class="mt-5">
        <div>
          支援频率
        </div>
        <div>
          每<el-input-number v-model="supportfeq" :min="1" :max="10" class="w-30 ml-3 mr-3" />天支援一次
        </div>
      </div>
    </div>
    <div>
      <el-divider direction="vertical" class="h-50" />
    </div>
    <div>
      支援列表
    </div>
  </div>
</template>

<style scoped>

</style>
