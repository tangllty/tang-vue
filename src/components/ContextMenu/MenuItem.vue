<template>
  <li v-if="item.children" class="sub-menu">
    <div class="sub-menu__title menu-item" @click="handleItemClick">
      <div class="menu-item__container">
        <div v-if="item.icon" class="icon">
          <SvgIcon :name="item.icon" />
        </div>
        <span class="title">{{ item.label }} ></span>
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
    v-else
    class="menu-item"
    :class="item.disabled ? 'disabled' : ''"
    @click="handleItemClick"
  >
    <div class="menu-item__container">
      <div v-if="item.icon" class="icon">
        <SvgIcon :name="item.icon" />
      </div>
      <span class="title">{{ item.label }}</span>
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
    top: 0;
    left: 100%;
    margin-top: 2px;
    padding: 0;
    border-radius: 5px;
    background-color: #f9f9fb;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border: 1px solid  #c5c5c5;
    width: fit-content;
    display: none;
  }

  &:hover {
    & > .menu {
      display: block;
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

    .icon {
      padding-left: 8px;
    }

    .title {
      display: list-item;
      padding: 8px 12px;
      width: max-content;
    }

    .icon + .title {
      padding-left: 2px;
    }

    &:hover {
      color: #68b3ff;
      background-color: #dfedfd;
      border-radius: 6px;
    }
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
  color: #c5c5c5;

  &__container {
    span {
      &:hover {
        color: #c5c5c5;
        background-color: transparent;
      }
    }
  }
}
</style>
