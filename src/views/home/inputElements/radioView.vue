<script setup lang="ts">
interface Props {
  rid: number
  value: number
  options: {
    label: string
    value: number
  }[]
}
const props = defineProps<Props>()
const radioValue = ref(props.value)
</script>

<template>
  <div>
    <el-radio-group v-model="radioValue">
      <el-radio v-for="(item, index) in props.options" :key="index" :value="item.value" size="large" class="font-sans font-bold">
        {{ item.label }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<style scoped>

</style>
