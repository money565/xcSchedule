<script lang="ts" setup>
import { changeWorker, deleteWorker, getLaborContractChoices, getTypesChoices, getWorkerByProject } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import autoInputItem from './autoInputItem.vue'
import createWorkerShow from './createWorker.vue'
import { LaborContractChoices, typeChoiceList } from './item'

interface workOpt {
  id: number
  name: string
  gender: boolean
  labor_contract: {
    num: number
    name: string
  }
  main_job: {
    id: number
    name: string
  }
  price: number
  types: {
    num: number
    name: string
  }
  name_edit: boolean | undefined
  gender_edit: boolean | undefined
  types_edit: boolean | undefined
  price_edit: boolean | undefined
  lc_edit: boolean | undefined
  job_edit: boolean | undefined
}
const acs = useAppCacheStore()
const tableData = ref <workOpt[]> ([])
const TypesChoices = ref<{ label: string, value: number }[] | undefined>()
const isEdit = ref<boolean>(false)
const currentIndex = ref<number>(-1)
const totalItem = ref<number>(0)
const createWorkerDialog = ref(false)
const deleteWorkerDialog = ref(false)
const currentPage = ref<number>(1)
onMounted(() => {
  init()
})
function init(start = 0, end = 14) {
  getWorkerByProject(acs.currentProject, start, end).then(({ data: res }) => {
    console.log(res)
    totalItem.value = res.total
    const temp = []
    for (const i in res.result) {
      temp.push({
        id: res.result[i].id,
        name: res.result[i].name,
        gender: res.result[i].gender,
        labor_contract: res.result[i].labor_contract,
        main_job: res.result[i].main_job,
        price: res.result[i].price,
        types: res.result[i].types,
        name_edit: false,
        gender_edit: false,
        types_edit: false,
        price_edit: false,
        lc_edit: false,
        job_edit: false,
      })
    }
    tableData.value = temp
  })
}

function resetEdit() {
  for (const i in tableData.value) {
    tableData.value[i].lc_edit = false
    tableData.value[i].job_edit = false
    tableData.value[i].name_edit = false
    tableData.value[i].price_edit = false
    tableData.value[i].types_edit = false
    tableData.value[i].gender_edit = false
  }
}

function editWork(target: string, index: number) {
  let updata = false
  let strValue
  if (target === 'name') {
    if (tableData.value[index].name_edit === true) {
      strValue = tableData.value[index].name
      tableData.value[index].name_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].name_edit = true
      updata = false
    }
  }
  if (target === 'price') {
    if (tableData.value[index].price_edit === true) {
      strValue = tableData.value[index].price
      tableData.value[index].price_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].price_edit = true
      updata = false
    }
  }

  if (target === 'gender') {
    if (tableData.value[index].gender_edit === true) {
      strValue = tableData.value[index].gender
      tableData.value[index].gender_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].gender_edit = true
      updata = false
    }
  }

  if (target === 'types') {
    if (TypesChoices.value === undefined) {
      getTypesChoices().then(({ data: res }) => {
        typeChoiceList.value = res.result
      })
    }
    if (tableData.value[index].types_edit === true) {
      for (const i in typeChoiceList.value) {
        if (tableData.value[index].types.num === typeChoiceList.value[Number(i)].value) {
          tableData.value[index].types.name = typeChoiceList.value[Number(i)].label
        }
      }
      strValue = tableData.value[index].types.num
      tableData.value[index].types_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].types_edit = true
      updata = false
    }
  }

  if (target === 'LaborContract') {
    if (LaborContractChoices.value === undefined) {
      getLaborContractChoices().then(({ data: res }) => {
        LaborContractChoices.value = res.result
      })
    }
    if (tableData.value[index].lc_edit === true) {
      for (const t in LaborContractChoices.value) {
        if (tableData.value[index].labor_contract.num === LaborContractChoices.value[Number(t)].value) {
          tableData.value[index].labor_contract.name = LaborContractChoices.value[Number(t)].label
        }
      }
      strValue = tableData.value[index].labor_contract.num
      tableData.value[index].lc_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].lc_edit = true
      updata = false
    }
  }

  if (target === 'job') {
    currentIndex.value = index
    if (tableData.value[index].job_edit === true) {
      strValue = tableData.value[index].main_job.id
      tableData.value[index].job_edit = false
      updata = true
    }
    else {
      resetEdit()
      tableData.value[index].job_edit = true
      updata = false
    }
  }

  const params = {
    wid: tableData.value[index].id,
    strValue,
    target,
  }
  if (updata) {
    changeWorker(params)
  }
}

function receiveMesg(value: any) {
  tableData.value[currentIndex.value].main_job = {
    id: value.link,
    name: value.value,
  }
}

function pageChange(page: number) {
  const start = page * 15 - 15
  const end = page * 15 - 1
  currentPage.value = page
  createWorkerDialog.value = false
  init(start, end)
}

function createWorker() {
  createWorkerDialog.value = true
}

function showDeleteWorkerDialog(index: number) {
  console.log('删除', index)
  currentIndex.value = index
  deleteWorkerDialog.value = true
}

function doDeleteWorker() {
  deleteWorker(tableData.value[currentIndex.value].id).then(() => {
    pageChange(currentPage.value)
    deleteWorkerDialog.value = false
  })
}

function modelChange() {
  resetEdit()
  isEdit.value = !isEdit.value
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="w-100% bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
        编辑员工信息
      </div>
    </div>
    <div>
      <div>
        <el-button @click="modelChange">
          {{ isEdit ? "编辑模式" : "浏览模式" }}
        </el-button>
        <el-button @click="createWorker">
          新建
        </el-button>
      </div>
    </div>
    <div class="mx-auto">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" width="150" align="center">
          <template #default="scoped">
            <div>
              {{ scoped.$index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="200">
          <template #default="scoped">
            <div v-if="scoped.row.name_edit === false" class="flex">
              <div>
                {{ scoped.row.name }}
              </div>
              <div>
                <el-icon v-if="isEdit" size="25" @click="editWork('name', scoped.$index)">
                  <svg-icon name="edit" />
                </el-icon>
              </div>
            </div>
            <div v-else class="flex">
              <div>
                <el-input v-model="scoped.row.name" class="w-25" />
              </div>
              <div class="ml-3 mt-1">
                <el-icon v-if="isEdit" size="23" @click="editWork('name', scoped.$index)">
                  <svg-icon name="ok" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="180">
          <template #default="scoped">
            <div class="flex">
              <div>
                <el-radio-group v-model="scoped.row.gender" :disabled="scoped.row.gender_edit === false ? true : false">
                  <el-radio :value="true" size="small">
                    男
                  </el-radio>
                  <el-radio :value="false" size="small">
                    女
                  </el-radio>
                </el-radio-group>
              </div>
              <div v-if="scoped.row.gender_edit === false">
                <el-icon v-if="isEdit" size="25" @click="editWork('gender', scoped.$index)">
                  <svg-icon name="edit" />
                </el-icon>
              </div>
              <div v-else>
                <el-icon v-if="isEdit" size="25" @click="editWork('gender', scoped.$index)">
                  <svg-icon name="ok" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="岗位" width="280">
          <template #default="scoped">
            <div v-if="scoped.row.job_edit === false" class="flex">
              <div>
                {{ scoped.row.main_job === null ? "" : scoped.row.main_job.name }}
              </div>
              <div>
                <el-icon v-if="isEdit && scoped.row.types.num !== 4" size="25" @click="editWork('job', scoped.$index)">
                  <svg-icon name="edit" />
                </el-icon>
                <div v-if="isEdit && scoped.row.types.num === 4" class="text-gray-400">
                  固定岗位员工不设置岗位
                </div>
              </div>
            </div>
            <div v-else class="flex">
              <div v-if="scoped.row.main_job !== null">
                <autoInputItem :title="scoped.row.main_job.name" target="job" @sent-mesg="receiveMesg" />
              </div>
              <div v-else>
                <autoInputItem title="" target="job" @sent-mesg="receiveMesg" />
              </div>
              <div class="ml-3 mt-1">
                <el-icon v-if="isEdit" size="23" @click="editWork('job', scoped.$index)">
                  <svg-icon name="ok" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="工价" width="180">
          <template #default="scoped">
            <div v-if="scoped.row.price_edit === false" class="flex">
              <div>
                {{ scoped.row.price }}
              </div>
              <div>
                <el-icon v-if="isEdit" size="25" @click="editWork('price', scoped.$index)">
                  <svg-icon name="edit" />
                </el-icon>
              </div>
            </div>
            <div v-else class="flex">
              <div>
                <el-input v-model="scoped.row.price" class="w-25" />
              </div>
              <div class="ml-3 mt-1">
                <el-icon v-if="isEdit" size="23" @click="editWork('price', scoped.$index)">
                  <svg-icon name="ok" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="types.name" label="人员类型" width="210">
          <template #default="scoped">
            <div class="flex">
              <div v-if="scoped.row.types_edit === false">
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
                        v-for="item in typeChoiceList"
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
        <el-table-column prop="labor_contract.name" label="合同" width="180">
          <template #default="scoped">
            <div class="flex">
              <div v-if="scoped.row.lc_edit === false">
                <div class="flex">
                  <div>{{ scoped.row.labor_contract.name }}</div>
                  <el-icon v-if="isEdit" size="25" @click="editWork('LaborContract', scoped.$index)">
                    <svg-icon name="edit" />
                  </el-icon>
                </div>
              </div>
              <div v-else>
                <div class="flex">
                  <div>
                    <el-select v-model="scoped.row.labor_contract.num" placeholder="Select" style="width: 80px">
                      <el-option
                        v-for="item in LaborContractChoices"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <div class="mt-1 ml-2">
                    <el-icon v-if="isEdit" size="22" @click="editWork('LaborContract', scoped.$index)">
                      <svg-icon name="ok" />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scoped">
            <div>
              <el-button type="danger" @click="showDeleteWorkerDialog(scoped.$index)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        layout="prev, pager, next"
        :total="totalItem"
        :page-size="15"
        @change="pageChange"
      />
    </div>
    <XtDialog v-model="createWorkerDialog" title="新建员工" :show-confirm="false" :show-cancel="false">
      <div>
        <createWorkerShow @send-mesg="pageChange(currentPage)" />
      </div>
    </XtDialog>
    <XtDialog v-model="deleteWorkerDialog" title="确认删除" @cancel="deleteWorkerDialog = false" @confirm="doDeleteWorker">
      <div>
        <h3>
          确认删除员工
          <el-text class="text-4 font-sans font-semibold" type="warning">
            {{ tableData[currentIndex].name }}
          </el-text>  吗？
        </h3>
      </div>
    </XtDialog>
  </div>
</template>
