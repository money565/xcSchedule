<script setup lang="ts">
import VConsole from 'vconsole'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/counter'

const aconter = useUserStore()
const vConsole = new VConsole()
vConsole.setOption({ log: { maxLogNumber: 5000 } })
onMounted(() => {
  aconter.login().then(() => {
    console.log(aconter.userInfo)
  })
})
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #F5F5F5;
}
</style>
