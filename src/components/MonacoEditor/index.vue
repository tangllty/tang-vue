<template>
  <div ref="editor" />
</template>

<script lang="ts" setup>
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import loader, { Monaco } from '@monaco-editor/loader'
import { getProxy } from '@/utils/getCurrentInstance'

const proxy = getProxy()
const monacoRef = ref<Monaco>()
const editor = ref<HTMLDivElement>() as Ref<HTMLDivElement>

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: '',
  }
})

const editorValue = computed<string>({
  get: () => props.modelValue,
  set: val => proxy.$emit('update:modelValue', val)
})

const editorConfig: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
  value: editorValue.value,
  language: props.language,
}

const initMonaco = async () => {
  if (monacoRef.value) {
    return
  }
  monacoRef.value = await loader.init()
  const monacoEditor = monacoRef.value.editor.create(editor.value, editorConfig)

  // Update editor value when model value changes
  monacoEditor.onDidChangeModelContent(() => {
    editorValue.value = monacoEditor.getValue()
  })
}

onMounted(async () => {
  await initMonaco()
})
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  width: 100%;
}
</style>
