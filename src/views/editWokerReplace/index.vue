<script setup lang="ts">
import type { jonOpt, resultOpt } from '../editJob/publicData'
import { createJobAssociate } from '@/axios/interface'
import autoInputItem from '../editElement/autoInputItem.vue'
import { init } from '../editJob/publicData'

interface replaceOpt extends jonOpt {
  replace_edit: boolean
}
const total = ref(0)
const currentPage = ref(1)
const tableData = ref<replaceOpt[]>([])
const perPage = 12
const currentEditIndex = ref(-1)
const refreshKey = ref(0)

function exitEdit() {
  for (const i in tableData.value) {
    tableData.value[i].replace_edit = false
  }
}

function initThisPage() {
  init(currentPage.value * perPage - perPage, currentPage.value * perPage - 1, 1).then((res: resultOpt) => {
    const temp: replaceOpt[] = []
    for (const i in res.jobList) {
      temp.push({
        id: res.jobList[i].id,
        sn: res.jobList[i].sn,
        no_sn: res.jobList[i].no_sn,
        name: res.jobList[i].name,
        area: res.jobList[i].area,
        startTime: res.jobList[i].startTime,
        endTime: res.jobList[i].endTime,
        types: res.jobList[i].types,
        limit: res.jobList[i].limit,
        workerList: res.jobList[i].workerList,
        area_edit: res.jobList[i].area_edit,
        limit_edit: res.jobList[i].limit_edit,
        replacementList: res.jobList[i].replacementList,
        replace_edit: false,
        support: null,
      })
    }

    total.value = res.total
    tableData.value = temp
  })
}

function pageChange(page: number) {
  currentPage.value = page
  initThisPage()
}

function receiveMesg(value: { link: number, value: string }) {
  value.value = value.value.split('-')[0]
  if (tableData.value[currentEditIndex.value].replacementList !== undefined) {
    tableData.value[currentEditIndex.value].replacementList!.push(value)
    refreshKey.value = new Date().getTime()
  }
}

function doEditReplace(index: number) {
  currentEditIndex.value = index
  if (tableData.value[index].replace_edit) {
    upLoadWorkerAssociateToJob().then(() => {
      exitEdit()
      initThisPage()
    })
  }
  else {
    exitEdit()
    tableData.value[index].replace_edit = true
  }
}

function deletTag(items: { link: number, value: string }) {
  if (tableData.value[currentEditIndex.value].replace_edit) {
    const res = tableData.value[currentEditIndex.value].replacementList
    let index: number = -1
    for (const i in res) {
      if (res[Number(i)].link === items.link) {
        index = Number(i)
      }
    }
    if (index !== -1) {
      tableData.value[currentEditIndex.value].replacementList!.splice(index, 1)
    }
    doEditReplace(currentEditIndex.value)
  }
}

function upLoadWorkerAssociateToJob() {
  return new Promise((rs) => {
    const wl = []
    for (const i in tableData.value[currentEditIndex.value].replacementList) {
      wl.push(tableData.value[currentEditIndex.value].replacementList![Number(i)].link)
    }
    const params = {
      jid: tableData.value[currentEditIndex.value].id,
      wl,
    }
    createJobAssociate(params).then(({ data: res }) => {
      rs(res)
    })
  })
}

onMounted(() => {
  initThisPage()
})
</script>

<template>
  <div>
    <div class="flex">
      <div class="w-100% bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
        编辑员工信息
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="area" label="区域" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column label="替岗人员" width="300">
        <template #default="scoped">
          <div>
            <autoInputItem v-if="scoped.row.replace_edit" :key="refreshKey" target="worker" placeholder="选择员工" title="" @sent-mesg="receiveMesg" />
          </div>
          <div class="flex">
            <div v-if="scoped.row.replacementList.length !== 0" class="flex">
              <div class="w-100% flex flex-wrap p-2 border border-gray-200 items-start">
                <el-tag
                  v-for="(item, index) in scoped.row.replacementList"
                  :key="index"
                  :type="scoped.row.replace_edit ? 'danger' : 'success'"
                  class="flex-shrink-0 cursor-pointer m-1"
                  @click="deletTag(item)"
                >
                  {{ item.value }}
                </el-tag>
              </div>
            </div>
            <div v-else>
              该岗位可任意替代
            </div>
            <div>
              <el-icon v-if="!scoped.row.replace_edit" size="25" @click="doEditReplace(scoped.$index)">
                <svg-icon name="edit" />
              </el-icon>
              <el-icon v-else size="25" @click="doEditReplace(scoped.$index)">
                <svg-icon name="ok" />
              </el-icon>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column prop="types.name" label="类型" width="180" />
      <el-table-column prop="limit.name" label="限制" width="180" />
    </el-table>
    <el-pagination layout="prev, pager, next" :total="total" @change="pageChange" />
  </div>
</template>

<style scoped>

</style>
