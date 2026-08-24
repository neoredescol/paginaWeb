<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { gsap } from 'gsap'
import { Group, Mesh, MeshBasicMaterial, SphereGeometry, type Material } from 'three'
import { getNodePositions, globeColors, type GlobeQuality } from './globeConfig'

const props = defineProps<{
  quality: GlobeQuality
  radius: number
  active: boolean
  reducedMotion: boolean
  visible: boolean
}>()

const group = shallowRef(new Group())
const halos: Array<{ mesh: Mesh, material: MeshBasicMaterial, offset: number }> = []
const primaryNodes: Array<{ mesh: Mesh, baseScale: number, offset: number }> = []
const geometries = new Set<SphereGeometry>()
const materials = new Set<Material>()

const disposeNodes = () => {
  group.value.clear()
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
  geometries.clear()
  materials.clear()
  halos.length = 0
  primaryNodes.length = 0
}

const buildNodes = () => {
  disposeNodes()
  const positions = getNodePositions(props.quality, props.radius * 1.025)
  const nodeGeometry = new SphereGeometry(props.quality === 'mobile' ? 0.055 : 0.05, 8, 8)
  const haloGeometry = new SphereGeometry(0.105, 10, 10)
  geometries.add(nodeGeometry).add(haloGeometry)

  const cyan = new MeshBasicMaterial({ color: globeColors.cyan, transparent: true, opacity: 0 })
  const white = new MeshBasicMaterial({ color: globeColors.white, transparent: true, opacity: 0 })
  const yellow = new MeshBasicMaterial({ color: globeColors.yellow, transparent: true, opacity: 0 })
  ;[cyan, white, yellow].forEach(material => materials.add(material))

  positions.forEach((position, index) => {
    const material = index === 2 || index === 8 ? yellow : index === 5 || index === 10 ? white : cyan
    const node = new Mesh(nodeGeometry, material)
    node.position.copy(position)
    const baseScale = index === 2 || index === 5 || index === 8 ? 1.45 : 1
    node.scale.setScalar(baseScale)
    group.value.add(node)
    if (baseScale > 1) primaryNodes.push({ mesh: node, baseScale, offset: index * 0.7 })

    if (index === 2 || index === 5 || index === 8) {
      const haloMaterial = new MeshBasicMaterial({
        color: index === 2 || index === 8 ? globeColors.yellow : globeColors.cyan,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      materials.add(haloMaterial)
      const halo = new Mesh(haloGeometry, haloMaterial)
      halo.position.copy(position)
      group.value.add(halo)
      halos.push({ mesh: halo, material: haloMaterial, offset: index * 0.8 })
    }
  })
}

const reveal = () => {
  if (!props.active) return
  if (props.reducedMotion) {
    materials.forEach(material => material.opacity = material instanceof MeshBasicMaterial ? 1 : material.opacity)
    halos.forEach(halo => halo.material.opacity = 0.2)
    return
  }
  gsap.to([...materials].filter(material => !halos.some(halo => halo.material === material)), {
    opacity: 1,
    duration: 0.55,
    stagger: 0.03,
  })
  gsap.to(halos.map(halo => halo.material), { opacity: 0.2, duration: 0.65 })
}

watch([() => props.quality, () => props.radius], () => { buildNodes(); reveal() }, { immediate: true })
watch(() => props.active, reveal)

const { onBeforeRender } = useLoop()
onBeforeRender(({ elapsed }) => {
  if (!props.visible || props.reducedMotion || !props.active) return
  halos.forEach((halo) => {
    const pulse = (Math.sin(elapsed * 0.8 + halo.offset) + 1) * 0.5
    halo.mesh.scale.setScalar(1 + pulse * 0.42)
    halo.material.opacity = 0.1 + (1 - pulse) * 0.16
  })
  primaryNodes.forEach((node) => {
    const pulse = (Math.sin(elapsed * 0.65 + node.offset) + 1) * 0.5
    node.mesh.scale.setScalar(node.baseScale + pulse * 0.16)
  })
})

onBeforeUnmount(() => {
  gsap.killTweensOf([...materials])
  disposeNodes()
})
</script>

<template>
  <primitive :object="group" />
</template>
