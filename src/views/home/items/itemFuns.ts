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
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const { csv_data } = response.data.df
  const blob = new Blob([csv_data], { type: 'text/csv;charset=utf-8;' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = 'pbb'
  link.click()
  URL.revokeObjectURL(downloadUrl)
}
