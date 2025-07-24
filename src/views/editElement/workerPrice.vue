<script lang="ts" setup>
import { getWorkerByProject } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const acs = useAppCacheStore()
const tableData = ref([])
getWorkerByProject(acs.currentProject).then(({ data: res }) => {
  console.log(res)
  tableData.value = res.result
})

function deleteWorker(index: number) {
  console.log('删除', index)
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="w-100% bg-#409EFF h-10 text-center font-sans font-bold text-#FFFFFF lh-10">
        编辑员工信息
      </div>
    </div>
    <div class="mx-auto">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="姓名" width="200">
          <template #default="scoped">
            <div v-if="!scoped.row.name_edit || scoped.row.name_edit === false" class="flex">
              <div>
                {{ scoped.row.name }}
              </div>
              <div>
                <el-icon size="25" @click="scoped.row.name_edit = true">
                  <svg-icon name="edit" />
                </el-icon>
              </div>
            </div>
            <div v-else class="flex">
              <div>
                <el-input v-model="scoped.row.name" class="w-25" />
              </div>
              <div class="ml-3 mt-1">
                <el-icon size="23" @click="scoped.row.name_edit = false">
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
                <el-radio-group v-model="scoped.row.gender" :disabled="true">
                  <el-radio :value="1" size="small">
                    男
                  </el-radio>
                  <el-radio :value="0" size="small">
                    女
                  </el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-icon size="25">
                  <svg-icon name="edit" />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="main_job.name" label="岗位" width="280" />
        <el-table-column prop="price" label="工价" width="180" />
        <el-table-column prop="types.name" label="合同" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="scoped">
            <div>
              <el-button type="danger" @click="deleteWorker(scoped.$index)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
