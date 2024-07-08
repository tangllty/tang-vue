<template>
  <div class="icon-select">
    <el-input
      v-model="iconName"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    />
    <div class="icon-select__list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <SvgIcon
          color="#999"
          :name="item"
          class="mr-5"
        />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const icons = [] as string[]
const modules = import.meta.glob('../../assets/icons/*.svg')

for (const path in modules) {
  const name = path.split('assets/icons/')[1].split('.svg')[0]
  icons.push(name)
}

const iconList = ref(icons)

const iconName = ref('')

const emit = defineEmits(['selected'])

const filterIcons = (): void => {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter(item => item.indexOf(iconName.value) !== -1)
  }
}

const selectedIcon = (name: string): void => {
  emit('selected', name)
  document.body.click()
}

const reset = (): void => {
  iconName.value = ''
  iconList.value = icons
}

defineExpose({
  reset
})
</script>

<style lang="scss" scoped>
.icon-select {
  width: 100%;
  padding: 10px;

  &__list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 25%;
      float: left;

      .svg-icon {
        height: 25px;
      }
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
