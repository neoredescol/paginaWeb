<script setup lang="ts">
import { gsap } from 'gsap'
import {
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  QuadraticBezierCurve3,
  type Material,
} from 'three'
import { connectionPairs, getNodePositions, globeColors, qualitySettings, type GlobeQuality } from './globeConfig'

const props = defineProps<{
  quality: GlobeQuality
  radius: number
  active: boolean
  reducedMotion: boolean
}>()

const group = shallowRef(new Group())
const geometries = new Set<BufferGeometry>()
const materials = new Set<Material>()

const disposeConnections = () => {
  group.value.clear()
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
  geometries.clear()
  materials.clear()
}

const buildConnections = () => {
  disposeConnections()
  const positions = getNodePositions(props.quality, props.radius * 1.025)

  connectionPairs.slice(0, qualitySettings[props.quality].connections).forEach(([startIndex, endIndex], index) => {
    const start = positions[startIndex]
    const end = positions[endIndex]
    if (!start || !end) return
    // El control se aleja del centro para que el arco rodee el globo y nunca lo atraviese.
    const arcHeight = props.radius + 0.28 + (index % 3) * 0.1
    const control = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight)
    const curve = new QuadraticBezierCurve3(start, control, end)
    const geometry = new BufferGeometry().setFromPoints(curve.getPoints(32))
    const material = new LineBasicMaterial({
      color: index === 2 ? globeColors.yellow : index % 4 === 0 ? globeColors.white : globeColors.cyan,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    geometries.add(geometry)
    materials.add(material)
    group.value.add(new Line(geometry, material))
  })
}

const reveal = () => {
  if (!props.active) return
  const targets = [...materials]
  if (props.reducedMotion) {
    targets.forEach((material, index) => material.opacity = index === 2 ? 0.4 : 0.46)
    return
  }
  targets.forEach((material, index) => {
    gsap.to(material, {
      opacity: index === 2 ? 0.38 : index % 3 === 0 ? 0.5 : 0.42,
      duration: 0.7,
      delay: index * 0.045,
      ease: 'power2.out',
    })
  })
}

watch([() => props.quality, () => props.radius], () => { buildConnections(); reveal() }, { immediate: true })
watch(() => props.active, reveal)

onBeforeUnmount(() => {
  gsap.killTweensOf([...materials])
  disposeConnections()
})
</script>

<template>
  <primitive :object="group" />
</template>
