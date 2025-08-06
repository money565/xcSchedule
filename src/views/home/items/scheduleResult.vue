<!-- eslint-disable vue/valid-define-props -->
<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
interface Props {
  worker_price_time: {
    name: string
    workHour: number
    price: number
  }[]
  job_leak: {
    [key: string]: string[]
  }

  worker_leak: {
    [key: string]: string[]
  }
}
const props = defineProps<Props>()
const emits = defineEmits(['order'])
const priceOrder = ref(false)
const workTimeOrder = ref(false)
const totalPrice = computed(() => {
  let ptemp = 0
  let ttemp = 0
  for (const i in props.worker_price_time) {
    ptemp = ptemp + props.worker_price_time[i].price
    ttemp = ttemp + props.worker_price_time[i].workHour
  }
  return [ptemp.toFixed(2), ttemp, (ptemp / props.worker_price_time.length).toFixed(2), (ttemp / props.worker_price_time.length).toFixed(2)]
})
function orderByPrice() {
  priceOrder.value = !priceOrder.value
  console.log('单价排序', priceOrder.value)
  emits('order', {
    target: 'price',
    priceOrder: priceOrder.value,
  })
}
function orderByWorkTimeOrder() {
  workTimeOrder.value = !workTimeOrder.value
  console.log('工时排序', priceOrder.value)
  emits('order', {
    target: 'worktime',
    priceOrder: workTimeOrder.value,
  })
}
</script>

<template>
  <div>
    <el-card class="w-1080px rounded-1rem font-sans font-semibold">
      <div class="flex">
        <div>
          <div class="mb-5 flex">
            <div>
              本班次员工工时数：
            </div>
            <div @click="orderByWorkTimeOrder">
              <el-icon size="25">
                <svg-icon name="worktime" />
              </el-icon>
            </div>
            <div class="ml-3 mt-0.5" @click="orderByPrice">
              <el-icon size="21">
                <svg-icon name="rmb" />
              </el-icon>
            </div>
          </div>
          <div class="h-100 w-80 overflow-auto">
            <div v-for="(item, index) in worker_price_time" :key="index">
              {{ item.name }} : {{ item.workHour }} h, {{ item.price }} 元
            </div>
          </div>
        </div>

        <div class="ml-15">
          <div class="mb-5">
            总成本
          </div>
          <div class="h-20 w-20 overflow-auto">
            {{ totalPrice[0] }}
          </div>

          <div class="mb-5">
            总工时
          </div>
          <div class="h-20 w-20 overflow-auto">
            {{ totalPrice[1] }}
          </div>
          <div class="mb-5">
            节日数
          </div>
          <div class="h-20 w-20 overflow-auto">
            0
          </div>
        </div>

        <div class="ml-15">
          <div class="mb-5">
            人均成本
          </div>
          <div class="h-20 w-20 overflow-auto">
            {{ totalPrice[2] }}
          </div>
          <div class="mb-5">
            人均工时
          </div>
          <div class="h-20 w-20 overflow-auto">
            {{ totalPrice[3] }}
          </div>
          <div class="mb-5">
            周末数
          </div>
          <div class="h-20 w-20 overflow-auto">
            0
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="w-1080px rounded-1rem font-sans font-semibold">
      <div class="ml-5">
        <div class="mb-5">
          未安排到的岗位：
        </div>
        <div class="w-100% overflow-auto">
          <div v-for="(item, index) in props.job_leak" :key="index">
            {{ index }} : {{ item.length === 0 ? "全部安排" : item }}
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="w-1080px rounded-1rem font-sans font-semibold">
      <div class="ml-5">
        <div class="mb-5">
          未安排到的人员：
        </div>
        <div class="w-100% overflow-auto">
          <div v-for="(item, index) in props.worker_leak" :key="index">
            {{ index }} : {{ item.length === 0 ? "全部安排" : item }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>
