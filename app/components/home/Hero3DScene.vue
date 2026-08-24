<script setup lang="ts">
import { Group, MathUtils, Vector3 } from 'three'
import TechnologyGlobe from './globe/TechnologyGlobe.vue'
import { globeColors } from './globe/globeConfig'

type Quality = 'desktop' | 'tablet' | 'mobile'

const sceneRoot = ref<HTMLElement | null>(null)
const world = shallowRef<Group | null>(null)
const quality = ref<Quality>('desktop')
const reducedMotion = ref(false)
const isVisible = ref(true)
const pointer = { x: 0, y: 0 }
const cameraPosition = new Vector3(0, 0, 5)
const directionalLightPosition = new Vector3(-3, 3, 4)
const cyanLightPosition = new Vector3(3.2, 1.2, 3)
const darkCyanLightPosition = new Vector3(-3, -0.5, -2.5)
const worldPosition = new Vector3(0, 0, 0)
const worldScale = new Vector3(1, 1, 1)

let baseRotationY = 0
let dampedPointerX = 0
let dampedPointerY = 0
let observer: IntersectionObserver | undefined
const baseRotationSpeed = 0.075 * 1.1

const handleGlobeReady = (payload: { radius: number, meshes: string[], sourceSize: number[] }) => {
  // Este checkpoint confirma en desarrollo qué geometría real llegó al scene graph.
  if (import.meta.dev) console.info('[Neo Redes 3D] GLB listo', payload)
}

const getQuality = (): Quality => {
  if (window.innerWidth < 640) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

const updateQuality = () => {
  const nextQuality = getQuality()
  // Resize puede dispararse muchas veces; solo cambiamos calidad al cruzar un breakpoint real.
  if (nextQuality !== quality.value) quality.value = nextQuality
}

const updatePointer = (event: PointerEvent) => {
  if (!isVisible.value || reducedMotion.value) return
  // El viewport se normaliza a -1..1 para obtener objetivos limitados y simétricos.
  pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
  pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
}

const resetPointer = () => {
  pointer.x = 0
  pointer.y = 0
}

// TresCanvas emite loop antes de cada render. delta mantiene velocidades independientes del framerate.
const onLoop = ({ delta, elapsed }: { delta: number, elapsed: number }) => {
  if (!world.value || !isVisible.value || reducedMotion.value) return

  // La rotación base pasa de 0.075 a 0.0825: un aumento exacto del 10% sin acelerar el resto de gestos.
  baseRotationY += delta * baseRotationSpeed
  // damp interpola hacia el pointer: el mundo responde con masa en vez de copiar el mouse de golpe.
  dampedPointerY = MathUtils.damp(dampedPointerY, pointer.x * 0.14, 4, delta)
  dampedPointerX = MathUtils.damp(dampedPointerX, pointer.y * 0.075, 4, delta)

  world.value.rotation.y = baseRotationY + dampedPointerY
  world.value.rotation.x = dampedPointerX + Math.sin(elapsed * 0.18) * 0.018
  world.value.position.y = Math.sin(elapsed * 0.28) * 0.025
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  quality.value = getQuality()

  window.addEventListener('resize', updateQuality, { passive: true })
  window.addEventListener('pointermove', updatePointer, { passive: true })
  document.documentElement.addEventListener('mouseleave', resetPointer)

  if (sceneRoot.value) {
    // Fuera del viewport conservamos la escena, pero el loop evita actualizar rotación, pulsos y flujo.
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      isVisible.value = entry.isIntersecting
      if (!entry.isIntersecting) resetPointer()
    }, { threshold: 0 })
    observer.observe(sceneRoot.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateQuality)
  window.removeEventListener('pointermove', updatePointer)
  document.documentElement.removeEventListener('mouseleave', resetPointer)
  observer?.disconnect()
})
</script>

<template>
  <div ref="sceneRoot" class="hero-3d" aria-hidden="true">
    <!-- TresCanvas crea el renderer WebGL; sigue existiendo un único canvas transparente en el Hero. -->
    <TresCanvas alpha :antialias="false" :clear-alpha="0" :dpr="[1, 1.5]" @loop="onLoop">
      <TresPerspectiveCamera :position="cameraPosition" :fov="50" :near="0.1" :far="100" />

      <TresAmbientLight :intensity="0.38" :color="globeColors.white" />
      <TresDirectionalLight :position="directionalLightPosition" :intensity="2.6" :color="globeColors.white" />
      <TresPointLight :position="cyanLightPosition" :intensity="18" :distance="9" :color="globeColors.cyan" />
      <!-- El cian oscuro de marca crea el rim sin introducir el violeta de una paleta externa. -->
      <TresPointLight :position="darkCyanLightPosition" :intensity="13" :distance="8" :color="globeColors.darkCyan" />

      <!-- Group permite rotar todo el ecosistema tecnológico como una sola unidad. -->
      <TresGroup ref="world" :position="worldPosition" :scale="worldScale">
        <TechnologyGlobe
          :quality="quality"
          :reduced-motion="reducedMotion"
          :visible="isVisible"
          @ready="handleGlobeReady"
        />
      </TresGroup>
    </TresCanvas>
  </div>
</template>

<style scoped>
.hero-3d {
  position: absolute;
  z-index: 2;
  top: 9%;
  right: -5%;
  width: 52vw;
  height: 70vh;
  opacity: 0.88;
  pointer-events: none;
}

.hero-3d :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

@media (max-width: 1023px) {
  .hero-3d {
    top: 19%;
    right: -8%;
    width: 57vw;
    height: 64%;
    opacity: 0.7;
  }
}

@media (max-width: 639px) {
  .hero-3d {
    top: 45%;
    right: -20%;
    width: 73vw;
    height: 43%;
    opacity: 0.5;
  }
}

@media (max-width: 380px) {
  .hero-3d {
    right: -25%;
    opacity: 0.42;
  }
}
</style>
