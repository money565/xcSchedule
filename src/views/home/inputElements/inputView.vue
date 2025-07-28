<script setup lang="ts">
interface Props {
  rid: number
  value: number
}
const props = defineProps<Props>()
const radioValue = ref(props.value)
function handleChange() {

}
</script>

<template>
  <div class="font-sans font-bold">
    <el-input-number v-model="radioValue" @change="handleChange" />
  </div>
</template>

<style scoped>

</style>
