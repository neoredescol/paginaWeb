<script setup lang="ts">
import { gsap } from 'gsap'
import {
  Box3,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
  type BufferGeometry,
  type Material,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { globeColors } from './globeConfig'

const props = defineProps<{
  active: boolean
  reducedMotion: boolean
}>()

const emit = defineEmits<{
  ready: [payload: { radius: number, meshes: string[], sourceSize: number[] }]
}>()

const model = shallowRef<Group | null>(null)
const modelMaterials: MeshPhysicalMaterial[] = []
const modelGeometries = new Set<BufferGeometry>()
let entryTween: gsap.core.Tween | undefined

const revealModel = () => {
  if (!model.value) return

  if (props.reducedMotion) {
    model.value.scale.setScalar(1)
    modelMaterials.forEach(material => material.opacity = 0.86)
    return
  }

  entryTween?.kill()
  model.value.scale.setScalar(0.88)
  entryTween = gsap.to(model.value.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.15,
    ease: 'power3.out',
  })
  gsap.to(modelMaterials, { opacity: 0.86, duration: 0.9, stagger: 0.04, ease: 'power2.out' })
}

onMounted(async () => {
  // GLTFLoader lee la geometría real del archivo público; no se sustituye por una esfera generada.
  const gltf = await new GLTFLoader().loadAsync('/models/ESFERA.glb')
  const loadedScene = gltf.scene
  const initialBox = new Box3().setFromObject(loadedScene)
  const sourceSize = initialBox.getSize(new Vector3())
  const sourceCenter = initialBox.getCenter(new Vector3())
  const targetDiameter = 3.2
  const scale = targetDiameter / Math.max(sourceSize.x, sourceSize.y, sourceSize.z)
  const meshes: string[] = []

  // El GLB viene desplazado: un grupo interno aplica juntos el centrado y la escala normalizada.
  loadedScene.position.copy(sourceCenter).multiplyScalar(-1)

  loadedScene.traverse((child) => {
    if (!(child instanceof Mesh)) return

    meshes.push(child.name || `Mesh-${meshes.length + 1}`)
    modelGeometries.add(child.geometry)
    const originalMaterials = Array.isArray(child.material) ? child.material : [child.material]
    originalMaterials.forEach(material => material.dispose())
    const material = new MeshPhysicalMaterial({
      color: globeColors.black,
      emissive: globeColors.cyan,
      emissiveIntensity: 0.3,
      metalness: 0.86,
      roughness: 0.2,
      clearcoat: 0.82,
      clearcoatRoughness: 0.16,
      sheen: 0.22,
      sheenColor: globeColors.darkCyan,
      sheenRoughness: 0.42,
      transparent: true,
      opacity: 0,
    })
    modelMaterials.push(material)
    child.material = material
  })

  const normalizedModel = new Group()
  normalizedModel.scale.setScalar(scale)
  normalizedModel.add(loadedScene)

  // El grupo exterior queda en escala 1 para que la entrada no destruya la escala calculada del GLB.
  const animatedModel = new Group()
  animatedModel.add(normalizedModel)
  model.value = animatedModel
  emit('ready', { radius: targetDiameter / 2, meshes, sourceSize: sourceSize.toArray() })
  if (props.active) revealModel()
})

watch(() => props.active, active => active && revealModel())

onBeforeUnmount(() => {
  entryTween?.kill()
  gsap.killTweensOf(modelMaterials)
  // El loader transfiere recursos WebGL al modelo; los liberamos cuando desaparece la escena.
  modelGeometries.forEach(geometry => geometry.dispose())
  modelMaterials.forEach(material => material.dispose())
})
</script>

<template>
  <primitive v-if="model" :object="model" />
</template>
