<script setup lang="ts">
interface Props {
  rid: number
  value: number[]
  options: {
    label: string
    value: number
  }[]
}
const props = defineProps<Props>()
const checkboxValue = ref(props.value)
</script>

<template>
  <div class="font-sans font-bold">
    <el-checkbox-group v-model="checkboxValue">
      <el-checkbox v-for="(item, index) in props.options" :key="index" :label="item.label" :value="item.value" />
    </el-checkbox-group>
  </div>
</template>

<style scoped>

</style>
