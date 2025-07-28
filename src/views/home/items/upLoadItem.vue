<!-- eslint-disable no-alert -->
<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'

const props = defineProps({
  title: String,
  target: String,
})
const acs = useAppCacheStore()
const router = useRouter()
const action = ref('https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15')
function toEdit() {
  console.log(props.target)
  if (props.target === 'price') {
    router.push({
      name: 'worker',
    })
  }
  if (props.target === 'job') {
    router.push({
      name: 'job',
    })
  }
  if (props.target === 'rest') {
    if (acs.timeRange === undefined) {
      alert('需要先在顶部选择排版期间')
      return null
    }
    router.push({
      name: 'rest',
    })
  }
  if (props.target === 'replace') {
    router.push({
      name: 'replace',
    })
  }
}
</script>

<template>
  <el-card class="w-520px rounded-1rem" shadow="hover">
    <div>
      <div class="flex">
        <div>
          <el-icon size="25">
            <svg-icon :name="props.target!" />
          </el-icon>
        </div>
        <div class="text-4 font-sans font-bold ml-2">
          {{ props.title }}
        </div>
        <div class="ml-auto mr-4">
          <el-button
            class="font-sans font-bold"
            type="primary"
            link
            @click="toEdit"
          >
            手动编辑
          </el-button>
          <el-button
            class="font-sans font-bold"
            type="primary"
            link
          >
            下载模板
          </el-button>
        </div>
      </div>
      <div class="mt-5">
        <el-upload
          class="upload-demo"
          drag
          :action="action"
          multiple
        >
          <el-icon class="el-icon--upload">
            <svg-icon name="upload2" />
          </el-icon>
          <div class="el-upload__text font-sans font-bold">
            点击或拖拽文件到此处上传 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip font-sans font-bold">
              支持格式: .xlsx, .xls, .csv
            </div>
          </template>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<style scoped>

</style>
