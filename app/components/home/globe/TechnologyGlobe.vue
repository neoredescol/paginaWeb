<script setup lang="ts">
import { gsap } from 'gsap'
import type { GlobeQuality } from './globeConfig'
import GlobeAtmosphere from './GlobeAtmosphere.vue'
import GlobeConnections from './GlobeConnections.vue'
import GlobeModel from './GlobeModel.vue'
import GlobeNodes from './GlobeNodes.vue'
import GlobeOrbits from './GlobeOrbits.vue'
import GlobeParticles from './GlobeParticles.vue'

const props = defineProps<{
  quality: GlobeQuality
  reducedMotion: boolean
  visible: boolean
}>()

const emit = defineEmits<{
  ready: [payload: { radius: number, meshes: string[], sourceSize: number[] }]
}>()

const radius = ref(0)
const atmosphereActive = ref(false)
const modelActive = ref(false)
const nodesActive = ref(false)
const connectionsActive = ref(false)
const particlesActive = ref(false)
const orbitsActive = ref(false)
let entrance: gsap.core.Timeline | undefined

const handleModelReady = (payload: { radius: number, meshes: string[], sourceSize: number[] }) => {
  radius.value = payload.radius
  emit('ready', payload)

  if (props.reducedMotion) {
    atmosphereActive.value = true
    modelActive.value = true
    nodesActive.value = true
    connectionsActive.value = true
    particlesActive.value = true
    orbitsActive.value = true
    return
  }

  // Una sola timeline escalona las capas sin bloquear el inicio de la animación ambiental.
  entrance = gsap.timeline()
    .call(() => atmosphereActive.value = true)
    .call(() => modelActive.value = true, [], '+=0.12')
    .call(() => nodesActive.value = true, [], '+=0.3')
    .call(() => connectionsActive.value = true, [], '+=0.22')
    .call(() => orbitsActive.value = true, [], '-=0.05')
    .call(() => particlesActive.value = true, [], '+=0.2')
}

onBeforeUnmount(() => entrance?.kill())
</script>

<template>
  <!-- Group mantiene modelo, red y atmósfera bajo la misma transformación del mundo. -->
  <TresGroup>
    <GlobeAtmosphere
      v-if="radius"
      :quality="quality"
      :radius="radius"
      :active="atmosphereActive"
      :reduced-motion="reducedMotion"
      :visible="visible"
    />
    <GlobeModel
      :active="modelActive"
      :reduced-motion="reducedMotion"
      @ready="handleModelReady"
    />
    <GlobeNodes
      v-if="radius"
      :quality="quality"
      :radius="radius"
      :active="nodesActive"
      :reduced-motion="reducedMotion"
      :visible="visible"
    />
    <GlobeConnections
      v-if="radius"
      :quality="quality"
      :radius="radius"
      :active="connectionsActive"
      :reduced-motion="reducedMotion"
    />
    <GlobeParticles
      v-if="radius"
      :quality="quality"
      :radius="radius"
      :active="particlesActive"
      :reduced-motion="reducedMotion"
      :visible="visible"
    />
    <GlobeOrbits
      v-if="radius"
      :quality="quality"
      :radius="radius"
      :active="orbitsActive"
      :reduced-motion="reducedMotion"
      :visible="visible"
    />
  </TresGroup>
</template>
