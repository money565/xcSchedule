<script lang="ts" setup>
import { getTypesChoices } from '@/axios/interface'
import { reactive } from 'vue'
import autoInputItem from './autoInputItem.vue'
import { LaborContractChoices, typeChoiceList } from './item'
// do not use same name with ref
const form = reactive({
  name: '',
  gender: true,
  labor_contract: 0,
  main_job: 0,
  price: 0,
  types: 0,
})

onMounted(() => {
  if (typeChoiceList.value === undefined) {
    getTypesChoices().then(({ data: res }) => {
      typeChoiceList.value = res.result
    })
  }
  if (LaborContractChoices.value === undefined) {
    getTypesChoices().then(({ data: res }) => {
      LaborContractChoices.value = res.result
    })
  }
})
</script>

<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="姓名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="form.gender">
        <el-radio :value="true">
          男
        </el-radio>
        <el-radio :label="false">
          女
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="合同类型">
      <div v-if="typeChoiceList">
        <el-select v-model="form.labor_contract" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in typeChoiceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-else>
        正在读取合同类型....
      </div>
    </el-form-item>
    <el-form-item label="员工类型">
      <div v-if="LaborContractChoices">
        <el-select v-model="form.types" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in LaborContractChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div v-else>
        正在读取员工类型....
      </div>
    </el-form-item>
    <el-form-item label="单价">
      <div>
        <el-input v-model="form.price" />
      </div>
    </el-form-item>
    <el-form-item label="固定岗位">
      <autoInputItem title="" />
    </el-form-item>
  </el-form>
</template>
