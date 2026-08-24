<script setup lang="ts">
import { Vector3 } from 'three'
import BackgroundNetwork from './BackgroundNetwork.vue'

type Quality = 'desktop' | 'tablet' | 'mobile'

const sectionStates = {
  inicio: { activity: 0.45, speed: 0.55, dark: false },
  manifiesto: { activity: 0.05, speed: 0.06, dark: true },
  servicios: { activity: 0.7, speed: 0.94, dark: false },
  proceso: { activity: 0.58, speed: 0.72, dark: true },
  trabajo: { activity: 0.75, speed: 1.08, dark: false },
  planes: { activity: 0.25, speed: 0.24, dark: false },
  contacto: { activity: 0.45, speed: 0.42, dark: true },
} as const

const quality = ref<Quality>('desktop')
const aspect = ref(16 / 9)
const activity = ref<number>(sectionStates.inicio.activity)
const speed = ref<number>(sectionStates.inicio.speed)
const pointerX = ref(0)
const pointerY = ref(0)
const scrollOffset = ref(0)
const darkSurface = ref<boolean>(sectionStates.inicio.dark)
const reducedMotion = ref(false)
const observers: IntersectionObserver[] = []
const cameraPosition = new Vector3(0, 0, 10)

const updateViewport = () => {
  quality.value = window.innerWidth < 640 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
  aspect.value = window.innerWidth / Math.max(1, window.innerHeight)
}

const handlePointer = (event: PointerEvent) => {
  if (reducedMotion.value) return
  pointerX.value = (event.clientX / window.innerWidth - 0.5) * 2
  pointerY.value = -(event.clientY / window.innerHeight - 0.5) * 2
}

const handleScroll = () => {
  if (reducedMotion.value) return
  scrollOffset.value = Math.sin(window.scrollY / Math.max(1, window.innerHeight) * 0.42)
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  updateViewport()
  window.addEventListener('resize', updateViewport, { passive: true })
  window.addEventListener('pointermove', handlePointer, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })

  Object.entries(sectionStates).forEach(([id, state]) => {
    const section = document.getElementById(id)
    if (!section) return
    // Cada observer cambia objetivos numéricos; el render loop interpola la transición sin regenerar buffers.
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      if (!entry.isIntersecting) return
      activity.value = state.activity
      speed.value = state.speed
      darkSurface.value = state.dark
    }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 })
    observer.observe(section)
    observers.push(observer)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
  window.removeEventListener('pointermove', handlePointer)
  window.removeEventListener('scroll', handleScroll)
  observers.forEach(observer => observer.disconnect())
})
</script>

<template>
  <div class="interactive-background" aria-hidden="true">
    <TresCanvas alpha :antialias="false" :clear-alpha="0" :dpr="[1, 1.25]">
      <TresPerspectiveCamera :position="cameraPosition" :fov="50" :near="0.1" :far="30" />
      <BackgroundNetwork
        :quality="quality"
        :aspect="aspect"
        :activity="activity"
        :speed="speed"
        :pointer-x="pointerX"
        :pointer-y="pointerY"
        :scroll-offset="scrollOffset"
        :dark-surface="darkSurface"
        :reduced-motion="reducedMotion"
      />
    </TresCanvas>
  </div>
</template>

<style scoped>
.interactive-background {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.interactive-background :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
