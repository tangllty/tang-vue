export default class Snowflake {
  x: number
  y: number
  speed: number
  radius: number
  angle: number

  constructor() {
    this.x = Math.random() * window.innerWidth
    this.y = -10
    this.speed = Math.random() * 2 + 1
    this.radius = Math.random() * 3 + 1
    this.angle = Math.random() * Math.PI * 2
  }

  update(): void {
    this.y += this.speed
    this.x += Math.sin(this.angle) * 0.5
    if (this.y > window.innerHeight) {
      this.y = -this.radius
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }
}
