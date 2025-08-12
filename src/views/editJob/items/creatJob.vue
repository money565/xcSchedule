<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-alert -->
<script lang="ts" setup>
import { getJobTypesChoices, getLimitChoices } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import autoInputItem from '@/views/editElement/autoInputItem.vue'
import { jobTypeList, limitList } from '../publicData'

const emits = defineEmits(['sendMesg'])
const acs = useAppCacheStore()
// do not use same name with ref
const form = reactive({
  pid: acs.currentProject,
  area: '',
  name: '',
  sn: -1,
  start: {
    hour: 0,
    min: 0,
  },
  end: {
    hour: 0,
    min: 0,
  },
  limit: '',
  types: '',
  worker: -1,
})

function sendMesg(param: number) {
  if (param === 1) {
    if (form.area === '') {
      alert('输入区域名')
      return null
    }
  }
  if (param === 2) {
    if (form.name === '') {
      alert('输入岗位名')
      return null
    }
  }
  if (param === 3) {
    if (form.sn < 0) {
      alert('请输入正确的序号')
      return null
    }
  }
  if (param === 4) {
    if (form.start.hour < 0 || form.start.hour > 23) {
      alert('开始时间的时不能小于0或大于23')
      return null
    }
  }
  if (param === 5) {
    if (form.start.hour < 0 || form.start.hour > 59) {
      alert('开始时间的分不能小于0或大于59')
      return null
    }
  }
  if (param === 6) {
    if (form.end.hour < 0 || form.end.hour > 23) {
      alert('结束时间的时不能小于0或大于23')
      return null
    }
  }
  if (param === 7) {
    if (form.end.hour < 0 || form.end.hour > 59) {
      alert('结束时间的分不能小于0或大于59')
      return null
    }
  }
  if (param === 8) {
    if (form.types === '') {
      alert('请选择岗位类型')
      return null
    }
  }
  if (param === 9) {
    if (form.limit === '') {
      alert('是否有限制')
      return null
    }
  }
  let up = true
  if (form.area === '' || form.name === '' || form.sn > 0) {
    up = false
  }
  if (form.start.hour < 0 || form.start.hour > 23 || form.start.min < 0 || form.start.min > 59) {
    up = false
  }

  if (form.end.hour < 0 || form.end.hour > 23 || form.end.min < 0 || form.end.min > 59) {
    up = false
  }
  if (form.limit !== '' || form.types !== '') {
    up = false
  }
  if (up) {
    emits('sendMesg', form)
  }
}

function receiveData(value: { link: number, value: string }) {
  form.worker = value.link
}

onMounted(() => {
  if (jobTypeList.value.length === 0) {
    getJobTypesChoices().then(({ data: res }) => {
      jobTypeList.value = res.result
    })
  }
  if (limitList.value.length === 0) {
    getLimitChoices().then(({ data: res }) => {
      limitList.value = res.result
    })
  }
})
</script>

<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="区域">
      <el-input v-model="form.area" class="w-70" placeholder="输入区域名称" @blur="sendMesg(1)" />
    </el-form-item>
    <el-form-item label="岗位名称">
      <el-input v-model="form.name" class="w-70" placeholder="输入岗位名称" @blur="sendMesg(2)" />
    </el-form-item>
    <el-form-item label="顺序号">
      <el-input v-model="form.sn" class="w-70" placeholder="输入顺序号" type="number" @blur="sendMesg(3)" />
    </el-form-item>
    <el-form-item label="开始时间">
      <div class="flex">
        <div>
          <el-icon class="mr-3 mt-3">
            <svg-icon name="time" />
          </el-icon>
        </div>
        <div>
          <el-input v-model="form.start.hour" class="w-15" type="number" :min="0" :max="23" @blur="sendMesg(4)" />
        </div>
        <div class="ml-2 mr-2">
          点
        </div>
        <div>
          <el-input v-model="form.start.min" class="w-15" type="number" :min="0" :max="59" @blur="sendMesg(5)" />
        </div>
        <div class="ml-2 mr-2">
          分
        </div>
        <div class="ml-2 mr-2">
          24小时制
        </div>
      </div>
    </el-form-item>
    <el-form-item label="结束时间">
      <div class="flex">
        <div>
          <el-icon class="mr-3 mt-3">
            <svg-icon name="time" />
          </el-icon>
        </div>
        <div>
          <el-input v-model="form.end.hour" class="w-15" type="number" :min="0" :max="23" @blur="sendMesg(6)" />
        </div>
        <div class="ml-2 mr-2">
          点
        </div>
        <div>
          <el-input v-model="form.end.min" class="w-15" type="number" :min="0" :max="59" @blur="sendMesg(7)" />
        </div>
        <div class="ml-2 mr-2">
          分
        </div>
        <div class="ml-2 mr-2">
          24小时制
        </div>
      </div>
    </el-form-item>
    <el-form-item label="固定岗位员工">
      <autoInputItem title="" target="worker" class="w-70" placeholder="选择员工" @sent-mesg="receiveData" />
    </el-form-item>
    <el-form-item label="限制">
      <el-select v-model="form.limit" placeholder="选择工作限制" class="w-70" @change="sendMesg(9)">
        <el-option v-for="(item, index) in limitList" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="form.types" placeholder="岗位类型" class="w-70" @change="sendMesg(8)">
        <el-option v-for="(item, index) in jobTypeList" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
