<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { gsap } from 'gsap'
import {
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from 'three'
import { globeColors, qualitySettings, type GlobeQuality } from './globeConfig'

const props = defineProps<{
  quality: GlobeQuality
  radius: number
  active: boolean
  reducedMotion: boolean
  visible: boolean
}>()

const group = shallowRef(new Group())
const paths: Array<{ points: Vector3[], particle: Mesh, progress: number, speed: number }> = []
const geometries: BufferGeometry[] = []
const materials: Array<LineBasicMaterial | MeshBasicMaterial> = []

const disposeOrbits = () => {
  group.value.clear()
  paths.length = 0
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
  geometries.length = 0
  materials.length = 0
}

const buildOrbits = () => {
  disposeOrbits()
  const orbitCount = qualitySettings[props.quality].orbits
  const particleGeometry = new SphereGeometry(0.026, 7, 7)
  geometries.push(particleGeometry)

  for (let orbitIndex = 0; orbitIndex < orbitCount; orbitIndex += 1) {
    const orbit = new Group()
    const radius = props.radius * (1.18 + orbitIndex * 0.1)
    const segments = 72
    const start = orbitIndex === 0 ? -0.15 : 0.7
    const span = orbitIndex === 0 ? Math.PI * 1.55 : Math.PI * 1.25
    const points = Array.from({ length: segments }, (_, index) => {
      const angle = start + span * index / (segments - 1)
      return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.42, 0)
    })
    const geometry = new BufferGeometry().setFromPoints(points)
    const lineMaterial = new LineBasicMaterial({
      color: orbitIndex === 0 ? globeColors.cyan : globeColors.darkCyan,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    geometries.push(geometry)
    materials.push(lineMaterial)
    orbit.add(new Line(geometry, lineMaterial))

    const particleMaterial = new MeshBasicMaterial({ color: globeColors.white, transparent: true, opacity: 0 })
    materials.push(particleMaterial)
    const particle = new Mesh(particleGeometry, particleMaterial)
    const initialPoint = points[orbitIndex * 12]
    if (!initialPoint) continue
    particle.position.copy(initialPoint)
    orbit.add(particle)
    orbit.rotation.set(orbitIndex === 0 ? 0.55 : -0.42, orbitIndex === 0 ? 0.18 : 0.62, orbitIndex * 0.5)
    group.value.add(orbit)
    paths.push({ points, particle, progress: orbitIndex * 0.38, speed: 0.045 + orbitIndex * 0.018 })
  }
}

const reveal = () => {
  if (!props.active) return
  const opacity = props.reducedMotion ? 0.22 : 0.28
  gsap.to(materials, { opacity, duration: props.reducedMotion ? 0 : 0.8, stagger: 0.05 })
}

watch([() => props.quality, () => props.radius], () => { buildOrbits(); reveal() }, { immediate: true })
watch(() => props.active, reveal)

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  if (!props.active || !props.visible || props.reducedMotion) return
  group.value.rotation.y += delta * 0.012
  paths.forEach((path) => {
    path.progress = (path.progress + delta * path.speed) % 1
    const index = Math.min(path.points.length - 1, Math.floor(path.progress * path.points.length))
    const point = path.points[index]
    if (!point) return
    path.particle.position.copy(point)
  })
})

onBeforeUnmount(() => {
  gsap.killTweensOf(materials)
  disposeOrbits()
})
</script>

<template>
  <primitive :object="group" />
</template>
