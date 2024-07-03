<template>
  <div ref="editor" />
</template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import loader, { Monaco } from '@monaco-editor/loader'
import { getProxy } from '@/utils/getCurrentInstance'
import { github, githubDark, githubLight } from './themes'

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

const editorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
  value: editorValue.value,
  language: props.language,
  automaticLayout: true,
  cursorSmoothCaretAnimation: 'on',
  cursorBlinking: 'expand',
  autoIndent: 'full',
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
  monacoRef.value.editor.defineTheme('github', github)
  monacoRef.value.editor.defineTheme('github-dark', githubDark)
  monacoRef.value.editor.defineTheme('github-light', githubLight)
  monacoRef.value.editor.setTheme('github-light')
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
