<!-- eslint-disable no-alert -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable import/consistent-type-specifier-style -->
<script setup lang="ts">
import { changeJob, createJob, deleteJob, delWorkerJob, getJobTypesChoices, getLimitChoices, setWorkerJob } from '@/axios/interface'
import creatJob from './items/creatJob.vue'
import noJobWokers from './items/noJobWokers.vue'
import { init, jobTypeList, type jonOpt, limitList, noJobWorkerList, type resultOpt, type workerListOpt } from './publicData'

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

const createNewJobDialog = ref(false)
const form = ref()
const createJobRefreshKey = ref(0)

function resetEdit() {
  for (const i in tableData.value) {
    tableData.value[i].area_edit = false
    tableData.value[i].limit_edit = false
    tableData.value[i].sn_edit = false
    tableData.value[i].type_edit = false
  }
}

function editWork(target: string, index: number) {
  let updata = false
  let strValue
  if (target === 'sn') {
    if (tableData.value[index].sn_edit === true) {
      strValue = tableData.value[index].sn
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].sn_edit = true
      updata = false
    }
  }

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
    if (limitList.value.length === 0) {
      getLimitChoices().then(({ data: res }) => {
        limitList.value = res.result
      })
    }
    if (tableData.value[index].limit_edit === true) {
      for (const i in limitList.value) {
        if (tableData.value[index].limit.num === limitList.value[Number(i)].value) {
          tableData.value[index].limit.name = limitList.value[Number(i)].label
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

  if (target === 'types') {
    if (jobTypeList.value.length === 0) {
      getJobTypesChoices().then(({ data: res }) => {
        jobTypeList.value = res.result
      })
    }
    if (tableData.value[index].type_edit === true) {
      for (const i in jobTypeList.value) {
        if (tableData.value[index].types.num === jobTypeList.value[Number(i)].value) {
          tableData.value[index].types.name = jobTypeList.value[Number(i)].label
        }
      }
      strValue = tableData.value[index].types.num
      tableData.value[index].type_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].type_edit = true
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
      tableData.value[index].sn_edit = false
    })
  }
}

function delWorkJob(wid: number) {
  delWorkerJob(wid).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
    })
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
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
    })
    noJobRefresh.value = new Date().getTime()
    addWorkerDialog.value = false
  })
}

onMounted(() => {
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
    tableData.value = res.jobList
    total.value = res.total
  })
})

function pageChange(page: number) {
  currentPage.value = page
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
    const temp: resultOpt = res
    tableData.value = temp.jobList
    total.value = temp.total
  })
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
  deleteJob(tableData.value[deleteIndex.value].id).then(() => {
    init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
      tableData.value = res.jobList
      total.value = res.total
    })
    noJobRefresh.value = new Date().getTime()
    deleteDialog.value = false
  })
}

function modelCreate() {
  resetEdit()
  createNewJobDialog.value = true
}

function docreateJob() {
  if (form.value !== undefined) {
    createJob(form.value).then(() => {
      form.value = undefined
      createNewJobDialog.value = false
      createJobRefreshKey.value = new Date().getTime()
      init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1).then((res: resultOpt) => {
        tableData.value = res.jobList
        total.value = res.total
      })
    })
  }
  else {
    alert('请完成所有项目')
  }
}
function receiveMesg(value: any) {
  console.log('收到的上传消息', value)
  form.value = value
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
      <el-button @click="modelCreate">
        创建岗位
      </el-button>
    </div>
    <div class="flex">
      <div class="w-60% overflow-auto">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="顺序号" width="180">
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
                  <el-input v-model="scoped.row.sn" class="w-20" />
                </div>
                <div class="ml-3 mt-1">
                  <el-icon v-if="isEdit" size="23" @click="editWork('sn', scoped.$index)">
                    <svg-icon name="ok" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="区域" width="180">
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
  </div>
</template>

<style scoped>

</style>
