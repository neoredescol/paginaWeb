<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { gsap } from 'gsap'
import {
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  SphereGeometry,
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
let shellGeometry: SphereGeometry | undefined
let shellMaterial: MeshBasicMaterial | undefined
let auraGeometry: SphereGeometry | undefined
let auraMaterial: MeshBasicMaterial | undefined
let pointsGeometry: BufferGeometry | undefined
let pointsMaterial: PointsMaterial | undefined

const disposeAtmosphere = () => {
  group.value.clear()
  shellGeometry?.dispose()
  shellMaterial?.dispose()
  auraGeometry?.dispose()
  auraMaterial?.dispose()
  pointsGeometry?.dispose()
  pointsMaterial?.dispose()
}

const buildAtmosphere = () => {
  disposeAtmosphere()
  shellGeometry = new SphereGeometry(props.radius * 1.08, 32, 24)
  shellMaterial = new MeshBasicMaterial({
    color: globeColors.cyan,
    side: BackSide,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  group.value.add(new Mesh(shellGeometry, shellMaterial))

  // Dos capas transparentes separan la silueta del fondo sin recurrir a bloom.
  auraGeometry = new SphereGeometry(props.radius * 1.16, 28, 20)
  auraMaterial = new MeshBasicMaterial({
    color: globeColors.darkCyan,
    side: BackSide,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  group.value.add(new Mesh(auraGeometry, auraMaterial))

  const count = qualitySettings[props.quality].atmospherePoints
  const positions = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const radius = props.radius * (1.12 + ((index * 37) % 19) / 100)
    const y = 1 - (index / Math.max(1, count - 1)) * 2
    const horizontal = Math.sqrt(1 - y * y)
    const angle = index * Math.PI * (3 - Math.sqrt(5))
    positions[index * 3] = Math.cos(angle) * horizontal * radius
    positions[index * 3 + 1] = y * radius
    positions[index * 3 + 2] = Math.sin(angle) * horizontal * radius
  }
  pointsGeometry = new BufferGeometry()
  pointsGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  pointsMaterial = new PointsMaterial({
    color: globeColors.cyan,
    size: 0.022,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  group.value.add(new Points(pointsGeometry, pointsMaterial))
}

const reveal = () => {
  if (!props.active || !shellMaterial || !auraMaterial || !pointsMaterial) return
  if (props.reducedMotion) {
    shellMaterial.opacity = 0.055
    auraMaterial.opacity = 0.025
    pointsMaterial.opacity = 0.24
    return
  }
  gsap.to(shellMaterial, { opacity: 0.065, duration: 0.75 })
  gsap.to(auraMaterial, { opacity: 0.035, duration: 1.05 })
  gsap.to(pointsMaterial, { opacity: 0.28, duration: 0.9 })
}

watch([() => props.quality, () => props.radius], () => { buildAtmosphere(); reveal() }, { immediate: true })
watch(() => props.active, reveal)

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  if (!props.active || !props.visible || props.reducedMotion) return
  group.value.rotation.y -= delta * 0.018
  group.value.rotation.z += delta * 0.006
})

onBeforeUnmount(() => {
  gsap.killTweensOf([shellMaterial, auraMaterial, pointsMaterial])
  disposeAtmosphere()
})
</script>

<template>
  <primitive :object="group" />
</template>
