<script setup lang="ts">
import checkView from './items/checkView.vue'
import footerView from './items/footerView.vue'
import headerView from './items/headerView.vue'
import upLoadItem from './items/upLoadItem.vue'
</script>

<template>
  <div class="pb-20">
    <div class="grid place-items-center mt-8">
      <headerView />
    </div>
    <div class="grid place-items-center mt-8">
      <div class="flex gap-8">
        <div>
          <upLoadItem title="员工信息表" target="price" />
        </div>
        <div>
          <upLoadItem title="固定岗位安排表" target="job" />
        </div>
      </div>
      <div class="flex gap-8 mt-8">
        <div>
          <upLoadItem title="员工休假表" target="rest" />
        </div>
        <div>
          <upLoadItem title="调班表上传" target="replace" />
        </div>
      </div>
    </div>
    <div class="grid place-items-center mt-8">
      <footerView />
    </div>
    <div class="grid place-items-center mt-8">
      <checkView />
    </div>
    <div class="grid place-items-center mt-8">
      <el-button type="primary" class="w-60 h-12">
        <div class="flex">
          <div>
            <el-icon size="25">
              <SvgIcon name="excel" />
            </el-icon>
          </div>
          <div class="font-sans font-semibold ml-5 text-4 mt-1">
            生成排班表
          </div>
        </div>
      </el-button>
    </div>
  </div>
</template>

<style scoped>

</style>
