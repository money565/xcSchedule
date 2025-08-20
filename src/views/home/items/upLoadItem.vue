<!-- eslint-disable no-alert -->
<script setup lang="ts">
import type { UploadFile, UploadProps, UploadRawFile } from 'element-plus'
import { exportDataModels } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'
import { TXURL } from '@/webConfig'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  title: String,
  target: String,
})
const acs = useAppCacheStore()
const uploadRef = ref()
// 定义上传状态
const uploading = ref(false)
const file = ref<UploadRawFile | null>(null)
const fileList = ref<UploadFile[]>([])

// 允许的文件类型
const acceptedFileTypes = '.xls,.xlsx,.csv'
const allowedMimeTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
]

// 文件超出限制时的处理
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`只能上传一个文件，请先删除当前文件`)
}

// 重置上传状态
function resetUploadState() {
  file.value = null
  fileList.value = []
  uploadRef.value.clearFiles()
}

// 检查是否为允许的文件类型
function isAllowedFile(file: File): boolean {
  const fileName = file.name.toLowerCase()
  const isValidExtension = fileName.endsWith('.xls')
    || fileName.endsWith('.xlsx')
    || fileName.endsWith('.csv')

  const isValidMimeType = allowedMimeTypes.includes(file.type)
    || (file.type === '' && fileName.endsWith('.csv'))

  return isValidExtension && isValidMimeType
}

// 文件选择变化时的处理
const handleChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    // 检查文件大小 (10MB限制)
    if (uploadFile.raw.size > 10 * 1024 * 1024) {
      ElMessage.warning('文件大小不能超过10MB')
      fileList.value = []
      resetUploadState()
      return
    }

    // 检查文件类型
    if (!isAllowedFile(uploadFile.raw)) {
      ElMessage.warning('只能上传Excel或CSV文件 (.xls, .xlsx, .csv)')
      fileList.value = []
      resetUploadState()
      return
    }

    file.value = uploadFile.raw
    fileList.value = [uploadFile]
    submitUpload()
  }
}

// 生成文件唯一ID
function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
// 提交上传到服务器
async function submitUpload() {
  if (!file.value)
    return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file.value)

    // 添加文件唯一标识（用于失败时删除）
    const fileId = generateFileId()
    formData.append('fileId', fileId)

    // const response = await axios.post(`${TXURL}/setScheduleJob/replace/${acs.currentProject}`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    await axios.post(`${TXURL}/setScheduleJob/replace/${acs.currentProject}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    ElMessage.success('文件上传成功')

    // 上传成功后重置状态
    resetUploadState()
  }
  catch (error: any) {
    ElMessage.success(`上传失败${error}`)
    // 上传失败时尝试删除服务器上的文件
    try {
      if (error.response?.data?.fileId) {
        await axios.delete(`${TXURL}/setScheduleJob/replace/${acs.currentProject}`)
      }
    }
    catch (deleteError) {
      alert(`删除上传失败的文件出错:${deleteError}`)
    }

    ElMessage.error(error.response?.data?.message || '文件上传失败')
    resetUploadState()
  }
  finally {
    uploading.value = false
  }
}

const router = useRouter()
function toEdit() {
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

function downLoadModels(target: string) {
  const param = {
    pid: acs.currentProject,
    target,
  }
  exportDataModels(param).then(({ data: res }) => {
    const blob = new Blob([res.df], { type: 'text/csv;charset=utf-8;' })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'pbb'
    link.click()
    URL.revokeObjectURL(downloadUrl)
  })
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
            @click="downLoadModels(props.target!)"
          >
            下载模板
          </el-button>
        </div>
      </div>
      <div class="mt-5">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :auto-upload="false"
          drag
          action=""
          :limit="1"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :accept="acceptedFileTypes"
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
