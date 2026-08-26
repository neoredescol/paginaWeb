<script setup lang="ts">
type Depth = 'far' | 'mid' | 'near'
type Tint = 'graphite' | 'cyan' | 'orange'

interface Particle {
  x: number
  y: number
  depth: Depth
  tint: Tint
  size: number
  opacity: number
  speedX: number
  speedY: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

let context: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let sprites: Record<Tint, HTMLCanvasElement> | null = null
let animationFrame = 0
let lastFrame = 0
let width = 0
let height = 0
let dpr = 1
let scrollPosition = 0
let reducedMotion = false
let mobile = false

const depthSettings: Record<Depth, { scroll: number, drift: number }> = {
  far: { scroll: .005, drift: 1.8 },
  mid: { scroll: .012, drift: 3.5 },
  near: { scroll: .02, drift: 6.5 },
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createSprite(color: string) {
  const sprite = document.createElement('canvas')
  sprite.width = 64
  sprite.height = 64
  const spriteContext = sprite.getContext('2d')
  if (!spriteContext) return sprite
  const gradient = spriteContext.createRadialGradient(32, 32, 0, 32, 32, 31)
  gradient.addColorStop(0, color)
  gradient.addColorStop(.18, color)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  spriteContext.fillStyle = gradient
  spriteContext.fillRect(0, 0, 64, 64)
  return sprite
}

function getParticleCount() {
  if (reducedMotion) return mobile ? 8 : 12
  if (width >= 1200) return 72
  if (width >= 801) return 50
  return 28
}

function createParticle(): Particle {
  const depthRoll = Math.random()
  const depth: Depth = depthRoll < .5 ? 'far' : depthRoll < .88 ? 'mid' : 'near'
  const tintRoll = Math.random()
  const tint: Tint = tintRoll < .9 ? 'graphite' : tintRoll < .98 ? 'cyan' : 'orange'
  const drift = depthSettings[depth].drift

  const visual = depth === 'far'
    ? { size: randomBetween(.5, 1.4), opacity: randomBetween(.035, .075) }
    : depth === 'mid'
      ? { size: randomBetween(1.1, 3), opacity: randomBetween(.045, .105) }
      : { size: randomBetween(8, 20), opacity: randomBetween(.022, .052) }

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth,
    tint,
    size: visual.size,
    opacity: visual.opacity,
    speedX: randomBetween(-drift, drift),
    speedY: randomBetween(-drift * .42, drift * .25),
  }
}

function syncParticleCount() {
  const target = getParticleCount()
  while (particles.length < target) particles.push(createParticle())
  if (particles.length > target) particles.length = target
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const previousWidth = width || window.innerWidth
  const previousHeight = height || window.innerHeight
  width = window.innerWidth
  height = window.innerHeight
  mobile = width <= 800
  dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  context = canvas.getContext('2d')
  context?.setTransform(dpr, 0, 0, dpr, 0, 0)
  particles.forEach((particle) => {
    particle.x *= width / previousWidth
    particle.y *= height / previousHeight
  })
  syncParticleCount()
  drawFrame(0)
}

function drawFrame(deltaSeconds: number) {
  if (!context || !sprites) return
  context.clearRect(0, 0, width, height)

  for (const particle of particles) {
    if (deltaSeconds) {
      particle.x += particle.speedX * deltaSeconds
      particle.y += particle.speedY * deltaSeconds
      const margin = particle.size * 2
      if (particle.x < -margin) particle.x = width + margin
      if (particle.x > width + margin) particle.x = -margin
      if (particle.y < -margin) particle.y = height + margin
      if (particle.y > height + margin) particle.y = -margin
    }

    const parallaxY = (particle.y + scrollPosition * depthSettings[particle.depth].scroll) % (height + particle.size * 4)
    const drawY = parallaxY < -particle.size * 2 ? parallaxY + height : parallaxY
    const diameter = particle.size * 2
    context.globalAlpha = particle.opacity
    context.drawImage(sprites[particle.tint], particle.x - particle.size, drawY - particle.size, diameter, diameter)
  }
  context.globalAlpha = 1
}

function animate(time: number) {
  const frameInterval = mobile ? 1000 / 24 : 1000 / 30
  const elapsed = time - lastFrame
  if (elapsed >= frameInterval) {
    drawFrame(Math.min(elapsed, 100) / 1000)
    lastFrame = time - (elapsed % frameInterval)
  }
  animationFrame = requestAnimationFrame(animate)
}

function handleVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame)
    animationFrame = 0
    return
  }
  if (!reducedMotion && !animationFrame) {
    lastFrame = performance.now()
    animationFrame = requestAnimationFrame(animate)
  }
}

function handleScroll() {
  scrollPosition = window.scrollY
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  sprites = {
    graphite: createSprite('rgba(13,17,23,1)'),
    cyan: createSprite('rgba(0,212,224,1)'),
    orange: createSprite('rgba(255,138,0,1)'),
  }
  resizeCanvas()
  handleScroll()
  window.addEventListener('resize', resizeCanvas, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
  if (!reducedMotion) animationFrame = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('visibilitychange', handleVisibility)
  particles = []
  sprites = null
  context = null
})
</script>

<template>
  <canvas ref="canvasRef" class="dust-canvas" aria-hidden="true" />
</template>

<style scoped>
.dust-canvas {
  position: fixed;
  z-index: 0;
  inset: 0;
  display: block;
  pointer-events: none;
}
</style>
