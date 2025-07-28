<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable import/consistent-type-specifier-style -->
<script setup lang="ts">
import { changeJob, deleteJob, delWorkerJob, getJobByProject, getLimitChoices, setWorkerJob } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import noJobWokers from './items/noJobWokers.vue'
import { noJobWorkerList, type workerListOpt } from './publicData'

interface jonOpt {
  id: number
  name: string
  area: string
  startTime: string
  endTime: string
  types: {
    num: number
    name: string
  }
  limit: {
    num: number
    name: string
  }
  workerList: {
    id: number
    name: string
  }[]
  area_edit: boolean
  limit_edit: boolean
}
const acs = useAppCacheStore()
const noJobRefresh = ref(0)
const tableData = ref<jonOpt[]>([])
const addWorkerDialog = ref<boolean>(false)
const selectedWorkers = ref<workerListOpt[]>([])
const currentJobId = ref<number>()
const currentPage = ref(1)
const perPage = 12
const total = ref(0)
const isEdit = ref(false)
const deleteDialog = ref(false)
const deleteIndex = ref<number>(-1)
const limitChoiceList = ref()
function init(start: number, end: number) {
  getJobByProject(acs.currentProject, start, end).then(({ data: res }) => {
    const temp: jonOpt[] = []
    total.value = res.total
    for (const i in res.result) {
      temp.push({
        id: res.result[i].id,
        name: res.result[i].name,
        area: res.result[i].area,
        startTime: res.result[i].startTime,
        endTime: res.result[i].endTime,
        types: res.result[i].types,
        workerList: res.result[i].workerList,
        area_edit: false,
        limit_edit: false,
        limit: res.result[i].limit,
      })
    }
    tableData.value = temp
  })
}

function resetEdit() {
  for (const i in tableData.value) {
    tableData.value[i].area_edit = false
    tableData.value[i].limit_edit = false
  }
}

function editWork(target: string, index: number) {
  let updata = false
  let strValue
  if (target === 'area') {
    if (tableData.value[index].area_edit === true) {
      strValue = tableData.value[index].area
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].area_edit = true
      updata = false
    }
  }

  if (target === 'limit') {
    if (limitChoiceList.value === undefined) {
      getLimitChoices().then(({ data: res }) => {
        limitChoiceList.value = res.result
      })
    }
    if (tableData.value[index].limit_edit === true) {
      for (const i in limitChoiceList.value) {
        if (tableData.value[index].limit.num === limitChoiceList.value[Number(i)].value) {
          tableData.value[index].limit.name = limitChoiceList.value[Number(i)].label
        }
      }
      strValue = tableData.value[index].limit.num
      tableData.value[index].limit_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].limit_edit = true
      updata = false
    }
  }

  const params = {
    jid: tableData.value[index].id,
    strValue,
    target,
  }
  if (updata) {
    changeJob(params).then(() => {
      tableData.value[index].area_edit = false
      tableData.value[index].limit_edit = false
    })
  }
}

function delWorkJob(wid: number) {
  delWorkerJob(wid).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1)
    noJobRefresh.value = new Date().getTime()
  })
}

function addWorker(jid: number) {
  currentJobId.value = jid
  addWorkerDialog.value = true
}

function selectWokers(rows: any) {
  selectedWorkers.value = rows
}

function addWorkerToJob() {
  const wl = []
  for (const i in selectedWorkers.value) {
    wl.push(selectedWorkers.value[i].id)
  }
  setWorkerJob({
    jid: currentJobId.value,
    wl,
  }).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1)
    noJobRefresh.value = new Date().getTime()
    addWorkerDialog.value = false
  })
}

onMounted(() => {
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1)
})

function pageChange(page: number) {
  currentPage.value = page
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1)
}
function modelChange() {
  resetEdit()
  isEdit.value = !isEdit.value
}

function showDelete(index: number) {
  deleteIndex.value = index
  deleteDialog.value = true
}

function doDelete() {
  deleteJob(tableData.value[deleteIndex.value].id).then(({ data: res }) => {
    console.log('删除结果', res)
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1)
    noJobRefresh.value = new Date().getTime()
    deleteDialog.value = false
  })
}
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
    </div>
    <div class="flex">
      <div class="w-60% overflow-auto">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="序号" width="60">
            <template #default="scoped">
              <div>{{ scoped.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="区域" width="150">
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
          <el-table-column prop="name" label="岗位名称" width="230" />
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
                <el-icon size="25" @click="addWorker(scoped.row.id)">
                  <svg-icon name="add" />
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="120" />
          <el-table-column prop="endTime" label="开始时间" width="120" />
          <el-table-column prop="types.name" label="岗位期间" width="120" />
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
                          v-for="item in limitChoiceList"
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
  </div>
</template>

<style scoped>

</style>
