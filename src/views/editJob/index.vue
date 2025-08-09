<!-- eslint-disable no-alert -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable import/consistent-type-specifier-style -->
<script setup lang="ts">
import autoInputItem from '../editElement/autoInputItem.vue'
import creatJob from './items/creatJob.vue'
import noJobWokers from './items/noJobWokers.vue'
import {
  addWorker,
  addWorkerDialog,
  addWorkerToJob,
  createJobRefreshKey,
  createNewJobDialog,
  currentJobId,
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
  console.log(value, currentJobId.value)
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
        <autoInputItem v-if="currentTypes && (currentTypes.num === 4 || currentTypes.num === 5)" target="worker" title="" placeholder="请选择员工" @sent-mesg="setTempJobWorker" />
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
