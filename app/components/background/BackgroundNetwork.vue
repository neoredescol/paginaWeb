<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Points,
  PointsMaterial,
  Vector3,
} from 'three'
import { globeColors } from '../home/globe/globeConfig'

type Quality = 'desktop' | 'tablet' | 'mobile'
type RouteBlueprint = { layer: number, points: ReadonlyArray<readonly [number, number]> }

interface LayerConfig {
  duration: number
  phase: number
  direction: number
  parallax: number
  scrollStrength: number
  opacityRange: readonly [number, number]
}

interface LayerState {
  group: Group
  config: LayerConfig
  pointerOffsetX: number
  pointerOffsetY: number
  material?: LineBasicMaterial
}

const props = defineProps<{
  quality: Quality
  aspect: number
  activity: number
  speed: number
  pointerX: number
  pointerY: number
  scrollOffset: number
  darkSurface: boolean
  reducedMotion: boolean
}>()

const settings = {
  desktop: { routes: 8, samples: 42, particles: 4 },
  tablet: { routes: 5, samples: 34, particles: 3 },
  mobile: { routes: 3, samples: 26, particles: 2 },
} satisfies Record<Quality, { routes: number, samples: number, particles: number }>

const DEBUG_BACKGROUND = false
const root = shallowRef(new Group())
const layerConfigs: readonly LayerConfig[] = [
  { duration: 48, phase: 0.08, direction: -1, parallax: 0.04, scrollStrength: 0.035, opacityRange: [0.1, 0.2] },
  { duration: 34, phase: 0.46, direction: 1, parallax: 0.1, scrollStrength: 0.07, opacityRange: [0.16, 0.34] },
  { duration: 22, phase: 0.76, direction: -1, parallax: 0.18, scrollStrength: 0.12, opacityRange: [0.22, 0.46] },
]
const layers: LayerState[] = layerConfigs.map(config => ({
  group: new Group(),
  config,
  pointerOffsetX: 0,
  pointerOffsetY: 0,
}))
const geometries: BufferGeometry[] = []
const materials: Array<LineBasicMaterial | PointsMaterial> = []
const farCyan = new Color(globeColors.darkCyan)
const midCyan = new Color(globeColors.darkCyan).lerp(new Color(globeColors.cyan), 0.52)
const nearCyan = new Color(globeColors.cyan)
const particleRoutes: Array<{ curve: CatmullRomCurve3, layer: number, current: Vector3, progress: number, speed: number }> = []
const zAxis = new Vector3(0, 0, 1)
let terminalMaterial: PointsMaterial | undefined
let importantMaterial: PointsMaterial | undefined
let particleGeometry: BufferGeometry | undefined
let particleMaterial: PointsMaterial | undefined
let particleHaloMaterial: PointsMaterial | undefined
let elapsed = 0

// Las rutas principales se duplican con offsets mínimos dentro del mismo buffer.
// Así se perciben más gruesas sin depender de lineWidth ni añadir draw calls.
const primaryRouteIndexes = new Set([1, 2, 6])

// Los trazados viven sobre todo en bordes y diagonales amplias para dejar respirar al contenido central.
const routeBlueprints: RouteBlueprint[] = [
  { layer: 0, points: [[-1.18, 0.78], [-0.88, 0.94], [-0.48, 0.84], [-0.12, 0.96], [0.22, 0.82]] },
  { layer: 1, points: [[0.88, 1.12], [1.02, 0.72], [0.9, 0.28], [1.08, -0.12], [0.94, -0.58], [1.18, -0.88]] },
  { layer: 2, points: [[-1.16, -0.7], [-0.72, -0.88], [-0.3, -0.74], [0.08, -0.92], [0.52, -0.76], [1.16, -0.92]] },
  { layer: 1, points: [[-1.12, 0.38], [-0.9, 0.16], [-0.98, -0.18], [-0.76, -0.44], [-0.9, -0.82]] },
  { layer: 2, points: [[0.16, 1.08], [0.42, 0.78], [0.74, 0.72], [0.96, 0.46], [1.12, 0.16]] },
  { layer: 0, points: [[-0.56, -1.14], [-0.2, -0.94], [0.12, -1.02], [0.46, -0.86], [0.78, -1.04]] },
  { layer: 2, points: [[-1.12, 0.94], [-0.82, 0.64], [-0.6, 0.42], [-0.34, 0.5], [-0.12, 0.28]] },
  { layer: 1, points: [[0.84, 0.34], [1.06, 0.18], [0.92, -0.08], [1.08, -0.34], [1.2, -0.62]] },
]

const toWorld = ([x, y]: readonly [number, number], layer: number) => new Vector3(
  x * props.aspect * 4.85,
  y * 4.65,
  -layer * 0.7,
)

const disposeRoutes = () => {
  root.value.clear()
  layers.forEach((layer) => {
    layer.group.clear()
    layer.material = undefined
  })
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
  geometries.length = 0
  materials.length = 0
  particleRoutes.length = 0
  terminalMaterial = undefined
  importantMaterial = undefined
  particleGeometry = undefined
  particleMaterial = undefined
  particleHaloMaterial = undefined
}

const buildRoutes = () => {
  disposeRoutes()
  const current = settings[props.quality]
  const activeRoutes = routeBlueprints.slice(0, current.routes)
  const curves: CatmullRomCurve3[] = []
  const terminalPositions: number[] = []
  const importantPositions: number[] = []

  layers.forEach((layer, layerIndex) => {
    const linePositions: number[] = []
    activeRoutes.forEach((route, routeIndex) => {
      if (route.layer !== layerIndex) return
      const worldPoints = route.points.map(point => toWorld(point, layerIndex))
      const curve = new CatmullRomCurve3(worldPoints, false, 'catmullrom', 0.24)
      curves[routeIndex] = curve
      const sampled = curve.getPoints(current.samples)
      for (let index = 1; index < sampled.length; index += 1) {
        const start = sampled[index - 1]
        const end = sampled[index]
        if (!start || !end) continue
        linePositions.push(...start.toArray(), ...end.toArray())

        if (primaryRouteIndexes.has(routeIndex)) {
          const directionX = end.x - start.x
          const directionY = end.y - start.y
          const inverseLength = 1 / Math.max(0.0001, Math.hypot(directionX, directionY))
          const offsetX = -directionY * inverseLength * 0.012
          const offsetY = directionX * inverseLength * 0.012
          linePositions.push(
            start.x + offsetX, start.y + offsetY, start.z,
            end.x + offsetX, end.y + offsetY, end.z,
            start.x - offsetX, start.y - offsetY, start.z,
            end.x - offsetX, end.y - offsetY, end.z,
          )
        }
      }
      const first = sampled[0]
      const last = sampled.at(-1)
      if (!first || !last) return
      terminalPositions.push(...first.toArray(), ...last.toArray())
      if (routeIndex === 1 || routeIndex === 5) importantPositions.push(...last.toArray())
    })

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(linePositions, 3))
    const material = new LineBasicMaterial({
      color: layerIndex === 0 ? globeColors.darkCyan : layerIndex === 1 ? midCyan : globeColors.cyan,
      transparent: true,
      opacity: DEBUG_BACKGROUND ? 0.85 : layer.config.opacityRange[0],
      depthWrite: false,
    })
    geometries.push(geometry)
    materials.push(material)
    layer.material = material
    layer.group.add(new LineSegments(geometry, material))
    root.value.add(layer.group)
  })

  const terminalGeometry = new BufferGeometry()
  terminalGeometry.setAttribute('position', new Float32BufferAttribute(terminalPositions, 3))
  terminalMaterial = new PointsMaterial({
    color: globeColors.cyan,
    size: DEBUG_BACKGROUND ? 0.12 : 0.072,
    transparent: true,
    opacity: DEBUG_BACKGROUND ? 1 : 0.5,
    depthWrite: false,
  })
  geometries.push(terminalGeometry)
  materials.push(terminalMaterial)
  root.value.add(new Points(terminalGeometry, terminalMaterial))

  const importantGeometry = new BufferGeometry()
  importantGeometry.setAttribute('position', new Float32BufferAttribute(importantPositions, 3))
  importantMaterial = new PointsMaterial({
    color: globeColors.yellow,
    size: DEBUG_BACKGROUND ? 0.14 : 0.09,
    transparent: true,
    opacity: DEBUG_BACKGROUND ? 1 : 0.82,
    depthWrite: false,
  })
  geometries.push(importantGeometry)
  materials.push(importantMaterial)
  root.value.add(new Points(importantGeometry, importantMaterial))

  const particlePositions = new Float32Array(current.particles * 3)
  activeRoutes.slice(0, current.particles).forEach((_, index) => {
    const curve = curves[index]
    const route = activeRoutes[index]
    if (!curve || !route) return
    const progress = (index * 0.23) % 1
    const currentPosition = new Vector3()
    curve.getPointAt(progress, currentPosition).toArray(particlePositions, index * 3)
    particleRoutes.push({
      curve,
      layer: route.layer,
      current: currentPosition,
      progress,
      speed: 0.025 + index * 0.006,
    })
  })

  particleGeometry = new BufferGeometry()
  particleGeometry.setAttribute('position', new Float32BufferAttribute(particlePositions, 3))
  particleHaloMaterial = new PointsMaterial({
    color: globeColors.cyan,
    size: DEBUG_BACKGROUND ? 0.15 : 0.13,
    transparent: true,
    opacity: DEBUG_BACKGROUND ? 0.5 : 0.16,
    depthWrite: false,
  })
  particleMaterial = new PointsMaterial({
    color: globeColors.white,
    size: DEBUG_BACKGROUND ? 0.1 : 0.074,
    transparent: true,
    opacity: DEBUG_BACKGROUND ? 1 : 0.9,
    depthWrite: false,
  })
  materials.push(particleHaloMaterial, particleMaterial)
  root.value.add(new Points(particleGeometry, particleHaloMaterial))
  root.value.add(new Points(particleGeometry, particleMaterial))
}

watch([() => props.quality, () => props.aspect], buildRoutes, { immediate: true })

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  elapsed += props.reducedMotion ? 0 : delta
  const darkBoost = props.darkSurface ? 1.16 : 1

  layers.forEach((layer, index) => {
    const material = layer.material
    if (!material) return
    const { config, group } = layer
    // Una respiración lenta hace que el fondo tenga vida incluso sin interacción.
    const ambientPulse = props.reducedMotion ? 1 : 1 + Math.sin(elapsed * (0.22 + index * 0.035) + index) * 0.075
    const opacity = MathUtils.lerp(config.opacityRange[0], config.opacityRange[1], props.activity) * darkBoost * ambientPulse
    material.opacity = MathUtils.damp(material.opacity, Math.min(opacity, 0.58), 3, delta)
    const lightSurfaceColor = index === 0 ? farCyan : index === 1 ? midCyan : nearCyan
    const darkSurfaceColor = index === 0 ? midCyan : nearCyan
    material.color.lerp(props.darkSurface ? darkSurfaceColor : lightSurfaceColor, Math.min(1, delta * 2.5))
    // Cada capa cruza más de dos anchos de viewport. El wrap ocurre con la ruta fuera de pantalla.
    const progress = props.reducedMotion ? 0.5 : (elapsed / config.duration + config.phase) % 1
    const travelEdge = props.aspect * 9.33 * 1.22
    const travelX = MathUtils.lerp(-travelEdge, travelEdge, config.direction > 0 ? progress : 1 - progress)
    const diagonalY = props.reducedMotion || index !== 2 ? 0 : MathUtils.lerp(-0.26, 0.26, progress)

    // El cursor conserva damping propio y se suma como movimiento secundario al recorrido continuo.
    const pointerX = props.reducedMotion ? 0 : props.pointerX * config.parallax
    const pointerY = props.reducedMotion ? 0 : props.pointerY * config.parallax * 0.68
    layer.pointerOffsetX = MathUtils.damp(layer.pointerOffsetX, pointerX, 3.2, delta)
    layer.pointerOffsetY = MathUtils.damp(layer.pointerOffsetY, pointerY, 3.2, delta)
    const scrollY = props.reducedMotion ? 0 : props.scrollOffset * config.scrollStrength
    group.position.x = travelX + layer.pointerOffsetX
    group.position.y = layer.pointerOffsetY + scrollY + diagonalY
    const rotation = props.reducedMotion ? 0 : Math.sin(elapsed * 0.075 + index) * MathUtils.degToRad(0.7 + index * 0.35)
    group.rotation.z = MathUtils.damp(group.rotation.z, rotation, 2, delta)
  })

  if (terminalMaterial) {
    terminalMaterial.opacity = MathUtils.damp(terminalMaterial.opacity, MathUtils.lerp(0.34, 0.64, props.activity), 3, delta)
  }
  if (importantMaterial) {
    const pulse = props.reducedMotion ? 1 : 1 + (Math.sin(elapsed * 1.1) + 1) * 0.08
    importantMaterial.size = MathUtils.damp(importantMaterial.size, 0.09 * pulse, 3, delta)
    importantMaterial.opacity = MathUtils.damp(importantMaterial.opacity, 0.82, 3, delta)
  }

  const positions = particleGeometry?.getAttribute('position') as Float32BufferAttribute | undefined
  if (!positions || props.reducedMotion) return
  // Los pulsos reutilizan curvas y un único buffer; solo cambia la posición de 1–4 puntos por frame.
  particleRoutes.forEach((route, index) => {
    const layer = layers[route.layer]
    if (!layer) return
    route.progress = (route.progress + delta * route.speed * props.speed) % 1
    route.curve.getPointAt(route.progress, route.current)
    route.current.applyAxisAngle(zAxis, layer.group.rotation.z)
    route.current.x += layer.group.position.x
    route.current.y += layer.group.position.y
    positions.setXYZ(index, route.current.x, route.current.y, route.current.z)
  })
  positions.needsUpdate = true

  const occasionalPulse = Math.pow((Math.sin(elapsed * 0.72) + 1) * 0.5, 5)
  if (particleHaloMaterial) particleHaloMaterial.opacity = MathUtils.lerp(0.1, 0.34, occasionalPulse)
})

onBeforeUnmount(disposeRoutes)
</script>

<template>
  <primitive :object="root" />
</template>
