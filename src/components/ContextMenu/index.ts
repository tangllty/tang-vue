import { h, render } from 'vue'
import type { ContextMenuInstance, ContextMenuProps, ContextMenuOptions } from './types'
import MenuContext from './index.vue'

let currentInstance: ContextMenuInstance = null as any
let seed = 1
const contextMenu = (mouseEvent: MouseEvent, options: ContextMenuOptions) => {
  // 阻止默认事件和冒泡
  mouseEvent.preventDefault()
  mouseEvent.stopPropagation()
  // 销毁之前的菜单
  if (currentInstance) {
    currentInstance.destroy()
  }
  currentInstance = null as any
  const id = seed++
  // 创建一个临时的 div，用于挂载菜单
  const container = document.createElement('div')
  // 获取 body 标签，用于挂载整个菜单
  const body = document.body
  // 传给 menu 组件的 props
  const props: ContextMenuProps = {
    options,
    onClose: () => {
      if(currentInstance){
        currentInstance.destroy()
      }
    },
  }
  // 渲染虚拟节点
  const vNode = h(
    MenuContext,
    props
  )
  // vNode 为需要渲染的虚拟节点，container 为渲染的容器
  render(vNode, container)
  // 首先需要先把菜单真正渲染到页面，才能拿到它的宽度和高度
  if (!container.firstElementChild) return
  body.appendChild(container.firstElementChild)
  // 当前真正的菜单节点，上面输出的 vNode 中可以看到，el 就是我们的菜单节点
  const currentMenu = vNode.el
  // 获取 currentMenu 的高度和宽度，用于临界的计算
  if (!currentMenu) return
  const { offsetWidth, offsetHeight } = currentMenu
  // 获取 body 的可视区域的宽度
  const { clientWidth } = body
  // 获取鼠标点击的位置，clientX 是距离左侧的位置，clientY 是距离顶部的位置
  const { clientX, clientY } = mouseEvent

  // 当前可视区域的宽度 - 当前鼠标距离浏览器左边的距离
  // 如果大于菜单的宽度，说明正常设置菜单距离左边界的距离,即设置 style.left
  // 否则菜单需要在鼠标左侧展示，即需要设置 style.right 组件距离可视区域右侧的距离
  const leftOrRight = clientWidth - clientX > offsetWidth ? 'left' : 'right'

  // 当前浏览器的高度(不包含滚动条) - 当前鼠标距离浏览器上边的距离
  // 如果大于菜单的高度，说明可以正常设置菜单距离上边界的距离,即设置 style.top
  // 否则需要设置菜单距离底部边界的位置，即 style.bottom
  const topOrBottom = window.innerHeight - clientY > offsetHeight ? 'top' : 'bottom'
  const offsetLeft = Math.abs(clientWidth - clientX)
  const offsetTop = Math.abs(window.innerHeight - clientY)

  // 设置菜单的位置
  currentMenu.style[leftOrRight] = leftOrRight === 'left' ? `${clientX + 2}px` : `${offsetLeft}px`
  currentMenu.style[topOrBottom] = topOrBottom === 'top' ? `${clientY + 1}px` : `${offsetTop}px`

  // 菜单实例
  const instance: ContextMenuInstance = {
    id,
    destroy: () => {
      currentInstance = null as any
      render(null, container)
    },
  }
  currentInstance = instance
  return instance
}

export default contextMenu
