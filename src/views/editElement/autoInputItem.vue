<script lang="ts" setup>
import { queryJobKeyword } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const props = defineProps({
  title: String,
  target: String,
  placeholder: String,
  currentDate: String,
})
const emits = defineEmits(['sentMesg'])
const acs = useAppCacheStore()
const state = ref(props.title)
function querySearchAsync(queryString: string, cb: (arg: any) => void) {
  let params = null
  if (props.target === 'job') {
    params = {
      pid: acs.currentProject,
      kw: queryString,
      t: 'job',
    }
  }
  if (props.target === 'worker') {
    params = {
      pid: acs.currentProject,
      kw: queryString,
      t: 'worker',
    }
  }
  if (props.target === 'worker_rest') {
    params = {
      pid: acs.currentProject,
      kw: queryString,
      currentDate: props.currentDate,
      t: 'wr',
    }
  }
  if (params !== null) {
    queryJobKeyword(params).then(({ data: res }) => {
      cb(res.q)
    })
  }
}

function handleSelect(item: Record<string, any>) {
  emits('sentMesg', item)
}
</script>

<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    :placeholder="props.placeholder"
    :debounce="1000"
    @select="handleSelect"
  />
</template>
