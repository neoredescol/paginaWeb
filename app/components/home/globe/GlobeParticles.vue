<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { gsap } from 'gsap'
import {
  Group,
  Mesh,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  SphereGeometry,
} from 'three'
import { connectionPairs, getNodePositions, globeColors, qualitySettings, type GlobeQuality } from './globeConfig'

const props = defineProps<{
  quality: GlobeQuality
  radius: number
  active: boolean
  reducedMotion: boolean
  visible: boolean
}>()

const group = shallowRef(new Group())
const particles: Array<{ mesh: Mesh, curve: QuadraticBezierCurve3, progress: number, speed: number }> = []
let geometry: SphereGeometry | undefined
let cyanMaterial: MeshBasicMaterial | undefined
let yellowMaterial: MeshBasicMaterial | undefined

const disposeParticles = () => {
  group.value.clear()
  particles.length = 0
  geometry?.dispose()
  cyanMaterial?.dispose()
  yellowMaterial?.dispose()
}

const buildParticles = () => {
  disposeParticles()
  const positions = getNodePositions(props.quality, props.radius * 1.025)
  geometry = new SphereGeometry(0.034, 8, 8)
  cyanMaterial = new MeshBasicMaterial({ color: globeColors.white, transparent: true, opacity: 0 })
  yellowMaterial = new MeshBasicMaterial({ color: globeColors.yellow, transparent: true, opacity: 0 })

  connectionPairs.slice(0, qualitySettings[props.quality].particles).forEach(([startIndex, endIndex], index) => {
    const start = positions[startIndex]
    const end = positions[endIndex]
    if (!start || !end) return
    const control = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(props.radius + 0.28 + (index % 3) * 0.1)
    const curve = new QuadraticBezierCurve3(start, control, end)
    const progress = (index * 0.21) % 1
    const mesh = new Mesh(geometry, index === 1 ? yellowMaterial : cyanMaterial)
    curve.getPointAt(progress, mesh.position)
    group.value.add(mesh)
    particles.push({ mesh, curve, progress, speed: 0.065 + index * 0.014 })
  })
}

const reveal = () => {
  if (!props.active || !cyanMaterial || !yellowMaterial) return
  if (props.reducedMotion) {
    cyanMaterial.opacity = 0.85
    yellowMaterial.opacity = 0.9
    return
  }
  gsap.to([cyanMaterial, yellowMaterial], { opacity: 0.82, duration: 0.5 })
}

watch([() => props.quality, () => props.radius], () => { buildParticles(); reveal() }, { immediate: true })
watch(() => props.active, reveal)

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  if (!props.active || !props.visible || props.reducedMotion) return
  particles.forEach((particle) => {
    particle.progress = (particle.progress + delta * particle.speed) % 1
    // getPointAt(progress) escribe la posición correspondiente al tramo 0..1 sin crear objetos por frame.
    particle.curve.getPointAt(particle.progress, particle.mesh.position)
  })
})

onBeforeUnmount(() => {
  gsap.killTweensOf([cyanMaterial, yellowMaterial])
  disposeParticles()
})
</script>

<template>
  <primitive :object="group" />
</template>
