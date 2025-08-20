<!-- eslint-disable no-alert -->
<!-- eslint-disable unicorn/prefer-number-properties -->
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { createWorker, getLaborContractChoices, getTypesChoices } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { reactive } from 'vue'
import autoInputItem from './autoInputItem.vue'
import { LaborContractChoices, typeChoiceList } from './item'

const emits = defineEmits(['sendMesg'])
// do not use same name with ref

const acs = useAppCacheStore()
interface formOpt {
  pid: number
  name: string
  gender: boolean
  labor_contract: number
  main_job: number
  price: number
  types: number
}
const form = reactive<formOpt>({
  pid: acs.currentProject,
  name: '',
  gender: true,
  labor_contract: 0,
  main_job: -1,
  price: 0,
  types: 0,
})
const ruleFormRef = ref()
onMounted(() => {
  if (typeChoiceList.value === undefined) {
    getTypesChoices().then(({ data: res }) => {
      typeChoiceList.value = res.result
    })
  }
  if (LaborContractChoices.value === undefined) {
    getLaborContractChoices().then(({ data: res }) => {
      LaborContractChoices.value = res.result
    })
  }
  if (typeChoiceList.value) {
    form.types = typeChoiceList.value[0].value
  }
  if (LaborContractChoices.value) {
    form.labor_contract = LaborContractChoices.value[0].value
  }
})

function checkPrice(rule: any, value: any, callback: any) {
  if (!isNaN(Number.parseFloat(value)) && isFinite(value)) {
    if (value <= 0) {
      callback(new Error('请填写正确的单价'))
    }
    else {
      callback()
    }
  }
  else {
    callback(new Error('必须是数字'))
  }
}

function receiveMesg(value: any) {
  form.main_job = value.link
}

const rules = reactive<FormRules<formOpt>>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 6, message: '字数在2-6个字', trigger: 'blur' },
  ],
  gender: [
    { required: true, message: '请指定性别' },
  ],
  types: [
    { required: true, message: '请选择员工类型' },
  ],
  labor_contract: [
    { required: true, message: '请选择合同类型' },
  ],
  price: [
    {
      validator: checkPrice,
      trigger: 'blur',
    },
  ],
})

function submitForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formEl.validate((valid) => {
    if (valid) {
      let upload = true
      if (form.types !== 4) {
        if (form.main_job === -1) {
          alert('非机动岗必须分配岗位')
          upload = false
        }
      }
      if (upload) {
        createWorker(form).then(() => {
          emits('sendMesg')
        })
      }
    }
    else {
      alert('error submit!')
    }
  })
}

function resetForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formEl.resetFields()
  emits('sendMesg', false)
}
</script>

<template>
  <div>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" style="max-width: 600px">
      <el-form-item label="姓名" prop="name" required>
        <el-input v-model="form.name" class="w-60" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio :value="true">
            男
          </el-radio>
          <el-radio :value="false">
            女
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="员工类型" prop="types">
        <div v-if="typeChoiceList">
          <el-select v-model="form.types" placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in typeChoiceList"
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
      <el-form-item label="合同类型" prop="labor_contract">
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
          正在读取合同类型....
        </div>
      </el-form-item>
      <el-form-item label="单价" prop="price" required>
        <div>
          <el-input v-model="form.price" class="w-60" />
        </div>
      </el-form-item>
      <el-form-item label="固定岗位">
        <autoInputItem title="" target="job" placeholder="选择岗位" class="w-60" @sent-mesg="receiveMesg" />
      </el-form-item>
    </el-form>
    <div class="grid justify-items-end mt-10">
      <div>
        <el-button type="default" @click="resetForm(ruleFormRef)">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>
