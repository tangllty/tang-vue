<template>
  <FormDesigner
    v-model="designerData"
    :save="save"
    :cancel="cancel"
  />
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import { getSurveyForm, editSurveyForm } from '@/api/survey/form'
import type { SurveyFormForm } from '@/api/survey/form/types'

const proxy = getProxy()

const props = defineProps({
  formId: {
    type: Number,
    required: true
  },
})

const state = reactive({
  designerData: [] as Component[]
})

const {
  designerData
} = toRefs(state)

const save = async () => {
  try {
    const surveyForm = {
      formId: props.formId,
      formData: JSON.stringify(designerData.value)
    } as SurveyFormForm
    await editSurveyForm(surveyForm)
    proxy.$message.success('保存成功')
  } catch (error) {
    proxy.$message.error('保存失败')
  }
}

const cancel = async () => {
  proxy.$router.back()
}

onMounted(async () => {
  const res = await getSurveyForm(props.formId)
  designerData.value = JSON.parse(res.data.formData)
})
</script>

<style lang="scss" scoped>
</style>
