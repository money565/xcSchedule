<script setup lang="ts">
const checkList = ref([])
const radio1 = ref()
const radio2 = ref()
const radio3 = ref()
const radio4 = ref()
const workDay = ref<number>(8)
const festival = ref<number>(6)
const weekend = ref<number>(6)
</script>

<template>
  <div>
    <el-card class="w-1080px rounded-1rem">
      <div class="flex mt-2">
        <div class="font-sans font-bold w-30">
          每周休息情况
        </div>
        <div class="ml-3 mt--1">
          工作日：<el-input v-model="workDay" class="w-10" />
        </div>
        <div class="ml-3 mt--1">
          节日：<el-input v-model="festival" class="w-10" />
        </div>
        <div class="ml-3 mt--1">
          周末：<el-input v-model="weekend" class="w-10" />
        </div>
      </div>
      <div class="flex mt-2">
        <div class="font-sans font-bold w-30">
          卫生间岗规则
        </div>
        <div class="ml-3 mt--1">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="女卫限女" value="Value A" class="font-sans font-bold" />
            <el-checkbox label="男卫限男" value="Value B" class="font-sans font-bold" />
          </el-checkbox-group>
        </div>
      </div>
      <div class="flex mt-5">
        <div class="font-sans font-bold w-30">
          排班优先级
        </div>
        <div class="ml-3 mt--2">
          <el-radio-group v-model="radio1">
            <el-radio value="1" size="large" class="font-sans font-bold">
              平均工时优先
            </el-radio>
            <el-radio value="2" size="large" class="font-sans font-bold">
              平均成本优先
            </el-radio>
            <el-radio value="3" size="large" class="font-sans font-bold">
              总成本优先
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="flex mt-2">
        <div class="font-sans font-bold w-30">
          机动员工规则
        </div>
        <div class="ml-3 mt--2">
          <el-radio-group v-model="radio2">
            <el-radio value="1" size="large" class="font-sans font-bold">
              优先替休
            </el-radio>
            <el-radio value="2" size="large" class="font-sans font-bold">
              优先工时调整
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="flex mt-2">
        <div class="font-sans font-bold w-30">
          工时未覆盖
        </div>
        <div class="ml-3 mt--2">
          <el-radio-group v-model="radio3">
            <el-radio value="1" size="large" class="font-sans font-bold">
              优先工时不足的员工
            </el-radio>
            <el-radio value="2" size="large" class="font-sans font-bold">
              优先成本较低的员工
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="flex mt-2">
        <div class="font-sans font-bold w-30">
          工时超覆盖
        </div>
        <div class="ml-3 mt--2">
          <el-radio-group v-model="radio4">
            <el-radio value="1" size="large" class="font-sans font-bold">
              仅显示空闲人员
            </el-radio>
            <el-radio value="2" size="large" class="font-sans font-bold">
              自动调整-替工时长的
            </el-radio>
            <el-radio value="3" size="large" class="font-sans font-bold">
              自动调整-替成本高的
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>
