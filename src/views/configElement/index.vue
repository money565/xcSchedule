<script setup lang="ts">
import { editRule } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()
const rules = [{
  conf_name: '工作日调休人数',
  conf_value: 8,
  conf_label: {
    input_type: 'input',
    value_type: 'number',
  },
}, {
  conf_name: '周末调休人数',
  conf_value: 6,
  conf_label: {
    input_type: 'input',
    value_type: 'number',
  },
}, {
  conf_name: '节日调休人数',
  conf_value: 6,
  conf_label: {
    input_type: 'input',
    value_type: 'number',
  },
}, {
  conf_name: '员工月休天数',
  conf_value: 4,
  conf_label: {
    input_type: 'input',
    value_type: 'number',
  },
}, {
  conf_name: '卫生间规则',
  conf_value: [1, 2],
  conf_label: {
    input_type: 'checkbox',
    value_type: 'num_list',
    options: [{ label: '女卫限女', value: 1 }, { label: '男卫限男', value: 2 }],
  },
}, {
  conf_name: '排班优先级',
  conf_value: 3,
  conf_label: {
    input_type: 'radio',
    value_type: 'number',
    options: [{ label: '平均工时优先', value: 1 }, { label: '平均成本优先', value: 2 }, { label: '总成本优先', value: 3 }],
  },
}, {
  conf_name: '机动员工规则',
  conf_value: 1,
  conf_label: {
    input_type: 'radio',
    value_type: 'number',
    options: [{ label: '优先替休', value: 1 }, { label: '优先工时调整', value: 2 }],
  },
}, {
  conf_name: '工时未覆盖',
  conf_value: 3,
  conf_label: {
    input_type: 'radio',
    value_type: 'number',
    options: [{ label: '仅通知', value: 1 }, { label: '调用低工时员工补足', value: 2 }, { label: '调用低成本员工补足', value: 3 }],
  },
}, {
  conf_name: '工时超覆盖',
  conf_value: 3,
  conf_label: {
    input_type: 'radio',
    value_type: 'number',
    options: [{ label: '仅通知', value: 1 }, { label: '调用低工时员工替代', value: 2 }, { label: '调用低成本员工替代', value: 3 }],
  },
}]
function upLoadRule() {
  const param = {
    pid: acs.currentProject,
    rules,
  }
  editRule(param).then(({ data: res }) => {
    console.log(res)
  })
}
</script>

<template>
  <div>
    换班
    <el-button @click="upLoadRule">
      上传规则
    </el-button>
  </div>
</template>

<style scoped>

</style>
