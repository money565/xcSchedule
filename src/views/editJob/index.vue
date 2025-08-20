<!-- eslint-disable no-alert -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable import/consistent-type-specifier-style -->
<script setup lang="ts">
import { deleteConvert, setJobConvert, setSupportedJob } from '@/axios/interface'
import autoInputItem from '../editElement/autoInputItem.vue'
import creatJob from './items/creatJob.vue'
import noJobWokers from './items/noJobWokers.vue'
import setSupport from './items/setSupport.vue'
import {
  addWorker,
  addWorkerDialog,
  addWorkerToJob,
  calculateHours,
  createJobRefreshKey,
  createNewJobDialog,
  currentPage,
  currentTypes,
  deleteDialog,
  delWorkJob,
  docreateJob,
  doDelete,
  editWork,
  init,
  isEdit,
  jobTypeList,
  type jonOpt,
  limitList,
  modelChange,
  modelCreate,
  noJobRefresh,
  noJobWorkerList,
  pageChange,
  perPage,
  receiveMesg,
  type resultOpt,
  selectedTempWorkers,
  selectWokers,
  showDelete,
  tableData,
  total,
} from './publicData'

function setTempJobWorker(value: { link: number, name: string }) {
  selectedTempWorkers.value = value.link
}

const setConvertTimeDialog = ref(false)
const setConvertTimeTitle = ref('')
const setConvertTimeFeq = ref(1)
const setConvertTimeList = ref<{ start: string, end: string }[]>([])
const setConvertTimeJid = ref()
const hasConvertTime = ref(false)
function setConvertTime(row: jonOpt) {
  setConvertTimeList.value = []
  setConvertTimeFeq.value = 1
  setConvertTimeJid.value = row.id
  if (row.convert !== null) {
    setConvertTimeFeq.value = row.convert!.feq
    setConvertTimeList.value = row.convert!.timeList
    hasConvertTime.value = true
  }
  else {
    setConvertTimeList.value = [{
      start: row.startTime,
      end: row.endTime,
    }]
    hasConvertTime.value = false
    addConvertTime()
  }
  setConvertTimeTitle.value = `设置${row.area}-${row.name}岗位的可变时间`
  setConvertTimeDialog.value = true
}

function deleteConvertByJid() {
  deleteConvert(setConvertTimeJid.value).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
      setConvertTimeDialog.value = false
    })
  })
}

function addConvertTime() {
  setConvertTimeList.value.push({
    start: '',
    end: '',
  })
}

function minConvertTime(index: number) {
  setConvertTimeList.value.splice(index, 1)
}

function uploadData() {
  for (const i in setConvertTimeList.value) {
    if (setConvertTimeList.value[i].start === '' || setConvertTimeList.value[i].start === null || setConvertTimeList.value[i].start === undefined) {
      alert('请填写所有时间段')
      return null
    }
    const s = setConvertTimeList.value[i].start.split(':')
    const e = setConvertTimeList.value[i].end.split(':')
    if (s[0] > e[0]) {
      alert(`第${Number(i) + 1}行，开始时间不得大于结束时间`)
      return null
    }
    else {
      if (s[0] === e[0]) {
        if (s[1] > e[1]) {
          alert(`第${Number(i) + 1}行，开始时间不得大于结束时间`)
          return null
        }
      }
    }
  }
  if (setConvertTimeFeq.value === null) {
    alert('请填写循环周期')
    return null
  }
  const params = {
    jid: setConvertTimeJid.value,
    feq: setConvertTimeFeq.value,
    timeList: setConvertTimeList.value,
  }
  setJobConvert(params).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
      setConvertTimeDialog.value = false
    })
  })
}

const showSetSupportDialog = ref(false)
const supportItem = ref()
const supportRefreshKey = ref(0)
function receiveSupportDatas(value: any) {
  supportItem.value = value
}

function setSupportToServer() {
  setSupportedJob(supportItem.value).then(() => {
    supportRefreshKey.value = new Date().getTime()
  })
}

onMounted(() => {
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
    tableData.value = res.jobList
    total.value = res.total
  })
})
</script>

<template>
  <div>
    <div class="flex overflow-auto">
      <div class="w-100% bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
        编辑工作岗位
      </div>
    </div>
    <div>
      <el-button @click="modelChange">
        {{ isEdit ? "编辑模式" : "浏览模式" }}
      </el-button>
      <el-button @click="modelCreate">
        创建岗位
      </el-button>
      <el-button type="success" @click="showSetSupportDialog = true">
        设置支援岗位
      </el-button>
    </div>
    <div class="flex">
      <div class="w-60% overflow-auto">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="顺序号" width="120">
            <template #default="scoped">
              <div v-if="scoped.row.sn_edit === false" class="flex">
                <div :class="[scoped.row.no_sn ? ' text-red-600' : ' text-dark-600']">
                  {{ scoped.row.sn }}
                </div>
                <div>
                  <el-icon v-if="isEdit" size="25" @click="editWork('sn', scoped.$index)">
                    <svg-icon name="edit" />
                  </el-icon>
                </div>
              </div>
              <div v-else class="flex">
                <div>
                  <el-input v-model="scoped.row.sn" class="w-15" />
                </div>
                <div class="ml-3 mt-1">
                  <el-icon v-if="isEdit" size="23" @click="editWork('sn', scoped.$index)">
                    <svg-icon name="ok" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="区域" width="140">
            <template #default="scoped">
              <div v-if="scoped.row.area_edit === false" class="flex">
                <div>
                  {{ scoped.row.area }}
                </div>
                <div>
                  <el-icon v-if="isEdit" size="25" @click="editWork('area', scoped.$index)">
                    <svg-icon name="edit" />
                  </el-icon>
                </div>
              </div>
              <div v-else class="flex">
                <div>
                  <el-input v-model="scoped.row.area" class="w-20" />
                </div>
                <div class="ml-3 mt-1">
                  <el-icon v-if="isEdit" size="23" @click="editWork('area', scoped.$index)">
                    <svg-icon name="ok" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column props="name" label="岗位名称" width="230">
            <template #default="scoped">
              <div v-if="scoped.row.job_name_edit === false" class="flex">
                <div>
                  {{ scoped.row.name }}
                </div>
                <div>
                  <el-icon v-if="isEdit" size="25" @click="editWork('job_name', scoped.$index)">
                    <svg-icon name="edit" />
                  </el-icon>
                </div>
              </div>
              <div v-else class="flex">
                <div>
                  <el-input v-model="scoped.row.name" class="w-20" />
                </div>
                <div class="ml-3 mt-1">
                  <el-icon v-if="isEdit" size="23" @click="editWork('job_name', scoped.$index)">
                    <svg-icon name="ok" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="岗位员工" width="120">
            <template #default="scoped">
              <div v-if="scoped.row.workerList && scoped.row.workerList.length > 0">
                <div v-for="(item, index) in scoped.row.workerList" :key="index" class="flex">
                  <div>{{ item.name }}</div>
                  <div v-if="isEdit" class="mt-1 ml-3">
                    <el-icon @click="delWorkJob(item.id)">
                      <svg-icon name="del" />
                    </el-icon>
                  </div>
                </div>
              </div>
              <div v-if="isEdit">
                <el-icon size="25" @click="addWorker(scoped.row.id, scoped.row.types)">
                  <svg-icon name="add" />
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="190">
            <template #default="scoped">
              <div v-if="scoped.row.start_edit === false" class="flex">
                {{ scoped.row.startTime }}
                <div>
                  <el-icon v-if="isEdit" size="25" @click="editWork('start_edit', scoped.$index)">
                    <svg-icon name="edit" />
                  </el-icon>
                </div>
              </div>
              <div v-else class="flex">
                <div>
                  <el-time-select
                    v-model="scoped.row.startTime"
                    style="width: 120px"
                    start="07:30"
                    step="00:15"
                    end="23:30"
                    placeholder="Select time"
                  />
                </div>
                <div class="ml-3 mt-1">
                  <el-icon v-if="isEdit" size="23" @click="editWork('start_edit', scoped.$index)">
                    <svg-icon name="ok" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="190">
            <template #default="scoped">
              <div v-if="scoped.row.end_edit === false" class="flex">
                {{ scoped.row.endTime }}
                <div>
                  <el-icon v-if="isEdit" size="25" @click="editWork('end_edit', scoped.$index)">
                    <svg-icon name="edit" />
                  </el-icon>
                </div>
              </div>
              <div v-else class="flex">
                <div>
                  <el-time-select
                    v-model="scoped.row.endTime"
                    style="width: 120px"
                    start="07:30"
                    step="00:15"
                    end="23:30"
                    placeholder="Select time"
                  />
                </div>
                <div class="ml-3 mt-1">
                  <el-icon v-if="isEdit" size="23" @click="editWork('end_edit', scoped.$index)">
                    <svg-icon name="ok" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工时">
            <template #default="scoped">
              {{ calculateHours(scoped.row.startTime, scoped.row.endTime) }}
            </template>
          </el-table-column>
          <el-table-column label="岗位时间变动" width="190">
            <template #default="scoped">
              <div v-if="scoped.row.convert === null">
                <el-button type="primary" link @click="setConvertTime(scoped.row)">
                  无可变时间
                </el-button>
              </div>
              <div v-else class="cursor-pointer text-green-700" @click="setConvertTime(scoped.row)">
                <div>周期：每{{ scoped.row.convert.feq }}天变换一次</div>
                <div v-for="(item, index) in scoped.row.convert.timeList" :key="index">
                  {{ item.start }} - {{ item.end }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="岗位期间" width="120">
            <template #default="scoped">
              <div class="flex">
                <div v-if="scoped.row.type_edit === false">
                  <div class="flex">
                    <div>{{ scoped.row.types.name }}</div>
                    <el-icon v-if="isEdit" size="25" @click="editWork('types', scoped.$index)">
                      <svg-icon name="edit" />
                    </el-icon>
                  </div>
                </div>
                <div v-else>
                  <div class="flex">
                    <div>
                      <el-select v-model="scoped.row.types.num" placeholder="Select" style="width: 80px">
                        <el-option
                          v-for="item in jobTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="mt-1 ml-2">
                      <el-icon v-if="isEdit" size="22" @click="editWork('types', scoped.$index)">
                        <svg-icon name="ok" />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="限制" width="120">
            <template #default="scoped">
              <div class="flex">
                <div v-if="scoped.row.limit_edit === false">
                  <div class="flex">
                    <div>{{ scoped.row.limit.name }}</div>
                    <el-icon v-if="isEdit" size="25" @click="editWork('limit', scoped.$index)">
                      <svg-icon name="edit" />
                    </el-icon>
                  </div>
                </div>
                <div v-else>
                  <div class="flex">
                    <div>
                      <el-select v-model="scoped.row.limit.num" placeholder="Select" style="width: 80px">
                        <el-option
                          v-for="item in limitList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div class="mt-1 ml-2">
                      <el-icon v-if="isEdit" size="22" @click="editWork('limit', scoped.$index)">
                        <svg-icon name="ok" />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scoped">
              <el-button type="danger" link @click="showDelete(scoped.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="total" @change="pageChange" />
      </div>

      <div class="w-40% h-220 overflow-auto">
        <div class="text-center mt-5 font-sans font-semibold">
          非机动岗未分配工作员工
        </div>

        <div>
          <noJobWokers :key="noJobRefresh" />
        </div>
      </div>
    </div>
    <xt-dialog v-model="addWorkerDialog" title="添加工作人员" width="600" @confirm="addWorkerToJob" @cancel="addWorkerDialog = false">
      <div>
        <autoInputItem v-if="currentTypes && (currentTypes.num === 4 || currentTypes.num === 5)" target="worker" title="" placeholder="请选择员工" current-date="" @sent-mesg="setTempJobWorker" />
        <el-table :data="noJobWorkerList" style="width: 100%" @selection-change="selectWokers">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="姓名" width="80" />
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="scoped">
              <div>
                {{ scoped.row.gender ? '男' : '女' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="成本" width="80" />
          <el-table-column prop="types.name" label="性质" width="80" />
          <el-table-column prop="labor_contract.name" label="合同" width="80" />
        </el-table>
      </div>
    </xt-dialog>
    <XtDialog v-model="deleteDialog" title="删除工作岗位确认" @cancel="deleteDialog = false" @confirm="doDelete">
      确实要删除工作岗位吗？
    </XtDialog>
    <XtDialog v-model="createNewJobDialog" title="新建工作岗位" @cancel="createNewJobDialog = false" @confirm="docreateJob">
      <div>
        <creatJob :key="createJobRefreshKey" @send-mesg="receiveMesg" />
      </div>
    </XtDialog>
    <XtDialog v-model="setConvertTimeDialog" :title="setConvertTimeTitle" @cancel="setConvertTimeDialog = false" @confirm="uploadData">
      <div class="max-h-100 overflow-auto">
        <div class="flex">
          <div>
            每<el-input-number v-model="setConvertTimeFeq" :min="1" :max="365" class="ml-2 mr-2" />天变动一次
          </div>
          <div>
            <el-button v-if="hasConvertTime" type="danger" class="ml-3" @click="deleteConvertByJid">
              删除该岗位时间变换
            </el-button>
          </div>
        </div>
        <div class="mt-5">
          变动循环时间
        </div>

        <div v-for="(item, index) in setConvertTimeList" :key="index">
          <div class="flex gap-4 mt-3">
            <el-time-select
              v-model="item.start"
              style="width: 150px"
              start="08:00"
              step="00:15"
              end="23:30"
              placeholder="开始"
              format="HH:mm:ss"
            />
            <el-time-select
              v-model="item.end"
              style="width: 150px"
              start="08:00"
              step="00:15"
              end="23:30"
              placeholder="结束"
              format="HH:mm:ss"
            />
            <el-button class="text-6" @click="addConvertTime">
              +
            </el-button>
            <el-button v-if="setConvertTimeList.length > 2" class="text-6" @click="minConvertTime(index)">
              -
            </el-button>
          </div>
        </div>
      </div>
    </XtDialog>
    <XtDialog v-model="showSetSupportDialog" title="设置岗位支援" width="1100" @cancel="showSetSupportDialog = false" @confirm="setSupportToServer">
      <div>
        <setSupport :key="supportRefreshKey" @send-data="receiveSupportDatas" />
      </div>
    </XtDialog>
  </div>
</template>

<style scoped>

</style>
