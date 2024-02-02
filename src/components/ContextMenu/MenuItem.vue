<template>
  <li v-if="item.children" class="sub-menu">
    <div class="sub-menu__title menu-item" @click="handleItemClick">
      <div class="menu-item__container">
        <div class="menu-item__container__content">
          <div v-if="item.icon" class="icon">
            <SvgIcon :name="item.icon" />
          </div>
          <span class="title">{{ item.label }}</span>

          <div class="icon">
            <SvgIcon name="右箭头" />
          </div>
        </div>
      </div>
    </div>
    <ul class="menu">
      <MenuItem
        v-for="(children, index) in item.children"
        :item="children"
        :key="index"
        :on-close="props.onClose"
      />
    </ul>
  </li>

  <li
    v-else-if="item.visible || item.visible === undefined"
    class="menu-item"
    :class="{
      disabled: item.disabled,
    }"
    @click="handleItemClick"
  >
    <div v-if="!item.divided" class="menu-item__container">
      <div class="menu-item__container__content">
        <div v-if="item.icon" class="icon">
          <SvgIcon :name="item.icon" />
        </div>
        <span class="title">{{ item.label }}</span>
      </div>
    </div>

    <div v-else>
      <div class="menu-item__divider"></div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { MenuItem as ContextMenuItem } from './types'
import SvgIcon from '@/components/SvgIcon/index.vue'

const props = defineProps({
  item: {
    type: Object as () => ContextMenuItem,
    required: true
  },
  onClose: {
    type: Function,
    default: () => {}
  }
})

const handleItemClick = computed(() => {
  return () => {
    if (props.item.disabled) {
      return
    }
    if (!props.item.onClick) {
      console.warn('onClick is not defined')
      props.onClose()
      return
    }
    if (props.item.children) {
      props.item.onClick()
      return
    }
    props.item.onClick()
    props.onClose()
  }
})
</script>

<style lang="scss" scoped>
.sub-menu {
  position: relative;
  cursor: pointer;
  list-style: none;
  padding: 0px 3px;

  .sub-menu__title {
    padding: 0;
  }

  .menu {
    position: absolute;
    margin-top: 2px;
    padding: 0;
    border-radius: 5px;
    background-color: var(--context-menu-background);
    box-shadow: 0 0 4px var(--context-menu-box-shadow);
    border: 1px solid  var(--context-menu-border);
    width: fit-content;
    display: none;
  }

  &:hover {
    & > .menu {
      display: block;
    }

    & > .menu-item > .menu-item__container > .menu-item__container__content {
      color: var(--context-menu-hover-color);
      background-color: var(--context-menu-hover-background);
      border-radius: 5px;
    }
  }
}

.menu-item {
  padding: 0px 3px;
  cursor: pointer;
  list-style: none;

  &__container {
    display: flex;
    align-items: center;

    &__content {
      min-width: calc(100% - 24px);
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;

      .icon {
        width: 1em;
      }

      .title {
        margin-right: auto;
      }

      .icon + .title {
        margin-left: 5px;
      }
    }

    &:hover {
      color: var(--context-menu-hover-color);
      background-color: var(--context-menu-hover-background);
      border-radius: 5px;
    }
  }

  &__divider {
    height: 1px;
    margin: 4px 0;
    border-bottom: 1px solid var(--context-menu-border);
    width: calc(100% - 20px);
    margin-left: 10px;
  }
}

ul > li {
  &:first-child {
    padding-top: 3px;
  }

  &:last-child {
    padding-bottom: 3px;
  }
}

.disabled {
  cursor: not-allowed;
  color: var(--context-menu-border);

  &__container {
    .title {
      &:hover {
        color: var(--context-menu-border);
        background-color: transparent;
      }
    }
  }
}

.title {
  font-size: 14px;
}
</style>
