import { useAppCacheStore } from '@/stores/appCache'

export const acs = useAppCacheStore()
export const typeChoiceList = ref<{ label: string, value: number }[]>()
export const LaborContractChoices = ref<{ label: string, value: number }[] | undefined>()
