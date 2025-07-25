<script setup lang="ts">
interface IProps {
  loading?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  showClose?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  width?: string
  title?: string
  dialogTop?: string
}

defineOptions({
  name: 'XtDialog',
})

const props = withDefaults(defineProps<IProps>(), {
  loading: false,
  showCancel: true,
  showConfirm: true,
  cancelButtonText: '取消',
  confirmButtonText: '确定',
  width: '500',
  title: '',
  dialogTop: '10vh',
  showClose: true,
})

const emits = defineEmits(['cancel', 'confirm'])

const model = defineModel<boolean>()

function handleCancel() {
  emits('cancel')
}

function handleConfirm() {
  emits('confirm')
}
</script>

<template>
  <el-dialog
    v-model="model"
    :lock-scroll="false"
    :destroy-on-close="true"
    class="xt-base-dialog rounded-md"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-bind="$attrs"
    :width="width"
    :top="props.dialogTop"
    :show-close="props.showClose"
  >
    <template #header>
      <div class="p-3 ml--4 mt--4 mr--12 bg-[linear-gradient(45deg,#1E90FF,#00BFFF)] font-600 text-white rounded-t-md">
        <span>{{ props.title }}</span>
      </div>
    </template>
    <slot />
    <template #footer>
      <slot name="footer">
        <span v-if="showCancel || showConfirm">
          <el-button v-if="showCancel" @click="handleCancel">
            {{ cancelButtonText }}
          </el-button>
          <el-button v-if="showConfirm" type="primary" :loading="loading" @click="handleConfirm">
            {{ confirmButtonText }}
          </el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
