import { Vector3 } from 'three'

export type GlobeQuality = 'desktop' | 'tablet' | 'mobile'

// Three.js necesita valores de color concretos: este mapa replica los tokens definidos en app.vue.
export const globeColors = {
  cyan: '#00ccea',
  yellow: '#fcb015',
  black: '#050708',
  ivory: '#f3f1ea',
  white: '#f5f7f7',
  darkCyan: '#0e3e44',
} as const

export const qualitySettings = {
  desktop: { nodes: 14, connections: 9, particles: 5, atmospherePoints: 80, orbits: 2 },
  tablet: { nodes: 10, connections: 6, particles: 4, atmospherePoints: 52, orbits: 2 },
  mobile: { nodes: 7, connections: 4, particles: 2, atmospherePoints: 28, orbits: 1 },
} satisfies Record<GlobeQuality, {
  nodes: number
  connections: number
  particles: number
  atmospherePoints: number
  orbits: number
}>

const nodeCoordinates = [
  [58, -30], [34, 18], [12, -68], [-18, -28], [-42, 20], [5, 72],
  [42, 112], [-28, 125], [66, 155], [-61, -92], [20, 148], [-8, -145],
  [48, -118], [-35, 62],
] as const

export const connectionPairs = [
  [0, 2], [1, 4], [2, 5], [0, 3], [3, 7], [6, 8], [8, 10], [9, 11], [12, 13],
] as const

export const getNodePositions = (quality: GlobeQuality, radius: number) => nodeCoordinates
  .slice(0, qualitySettings[quality].nodes)
  .map(([latitude, longitude]) => {
    const phi = (90 - latitude) * Math.PI / 180
    const theta = (longitude + 180) * Math.PI / 180

    // Latitud y longitud mantienen cada nodo pegado a una posición estable de la superficie.
    return new Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    )
  })
