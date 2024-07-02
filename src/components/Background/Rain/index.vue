<template>
  <canvas ref="canvasRef" class="canvas" />
</template>

<script lang="ts" setup>
const state = reactive({
  canvas: {} as HTMLCanvasElement,
  ctx: {} as CanvasRenderingContext2D
})

const {
  canvas,
  ctx
} = toRefs(state)

const canvasRef = ref<HTMLCanvasElement>()

const raindrops: { x: number; y: number; speed: number }[] = []

const animate = () => {
  generateRaindrops()
  requestAnimationFrame(draw)
}

const resizeCanvas = () => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  generateRaindrops()
}

const generateRaindrops = () => {
  raindrops.length = 0 // Clear previous raindrops
  const dropsCount = Math.floor(canvasRef.value!.width / 20) // Adjust density here
  for (let i = 0; i < dropsCount; i++) {
    raindrops.push({
      x: Math.random() * canvasRef.value!.width,
      y: Math.random() * canvasRef.value!.height,
      speed: 1 + Math.random() * 5 // Adjust speed here
    })
  }
}

const draw = () => {
  if (ctx && canvasRef.value) {
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    updateRain()
    drawRain()
    requestAnimationFrame(draw)
  }
}

const updateRain = () => {
  // Update raindrops position
  for (let i = 0; i < raindrops.length; i++) {
    raindrops[i].y += raindrops[i].speed
    if (raindrops[i].y > canvasRef.value!.height) {
      raindrops[i].y = 0 // Reset raindrop to top
    }
  }
}

const drawRain = () => {
  // Draw raindrops
  if (ctx && canvasRef.value) {
    ctx.value.fillStyle = '#6495ED' // Raindrop color
    for (let i = 0; i < raindrops.length; i++) {
      ctx.value.beginPath()
      ctx.value.arc(raindrops[i].x, raindrops[i].y, 2, 0, Math.PI * 2)
      ctx.value.fill()
    }
  }
}

onMounted(() => {
  state.canvas = canvasRef.value as HTMLCanvasElement
  state.ctx = canvas.value.getContext('2d') as CanvasRenderingContext2D
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
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
