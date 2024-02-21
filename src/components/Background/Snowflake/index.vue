<template>
  <canvas ref="canvasRef" class="canvas" />
</template>

<script lang="ts" setup>
import Snowflake from './Snowflake'

const state = reactive({
  snowflakes: [] as Snowflake[],
  canvas: {} as HTMLCanvasElement,
  ctx: {} as CanvasRenderingContext2D
})

const {
  snowflakes,
  canvas,
  ctx
} = toRefs(state)

const canvasRef = ref<HTMLCanvasElement>()

let generateChance = 0.05
let maxSnowflakes = 1000

const animate = () => {
  ctx.value.clearRect(0, 0, window.innerWidth, window.innerHeight)
  if (Math.random() < generateChance && snowflakes.value.length < maxSnowflakes) {
    snowflakes.value.push(new Snowflake())
    generateChance += 0.0001
  }
  snowflakes.value.forEach((snowflake) => {
    snowflake.update()
    snowflake.draw(ctx.value)
  })
  requestAnimationFrame(animate)
}

onMounted(() => {
  state.canvas = canvasRef.value as HTMLCanvasElement
  state.ctx = canvas.value.getContext('2d') as CanvasRenderingContext2D
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  window.addEventListener('resize', () => {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  })
  animate()
})
</script>

<style lang="scss" scoped>
.canvas {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
