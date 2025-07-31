import { useAppCacheStore } from '@/stores/appCache'
import axios from 'axios'

const acs = useAppCacheStore()
export async function downLoadModels(target: string) {
  const params = {
    pid: acs.currentProject,
    target,
  }
  const response = await axios({
    method: 'post',
    url: `http://118.24.54.200:8080/schedule/exportDataModels`, // Django后端URL
    data: params,
    responseType: 'blob', // 关键！指定响应类型为二进制数据
    headers: {
      'Content-Type': 'application/json',
    },
  })
  // 创建下载链接
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', '岗位替换表.csv') // 设置下载文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
