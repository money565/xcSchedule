<script lang="ts" setup>
import { queryJobKeyword } from '@/axios/interface'
import { useAppCacheStore } from '@/stores/appCache'

const props = defineProps({
  title: String,
})
const emits = defineEmits(['sentMesg'])
const acs = useAppCacheStore()
const state = ref(props.title)
function querySearchAsync(queryString: string, cb: (arg: any) => void) {
  queryJobKeyword({
    pid: acs.currentProject,
    kw: queryString,
  }).then(({ data: res }) => {
    console.log(res)
    cb(res.q)
  })
}

function handleSelect(item: Record<string, any>) {
  emits('sentMesg', item)
}
</script>

<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="Please input"
    :debounce="1000"
    @select="handleSelect"
  />
</template>
