<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero3DScene from '../components/home/Hero3DScene.vue'

// ============================================================================
// HERO
// ============================================================================

const {
  menuItems: heroMenuItems,
  hero: heroHero,
  heroOrb: heroHeroOrb,
  heroVideo: heroHeroVideo,
  menuPanel: heroMenuPanel,
  menuButton: heroMenuButton,
  closeButton: heroCloseButton,
  isMenuOpen: heroIsMenuOpen,
  prefersReducedMotion: heroPrefersReducedMotion,
  animationContext: heroAnimationContext,
  menuTimeline: heroMenuTimeline,
  previousBodyOverflow: heroPreviousBodyOverflow,
  parallaxLines: heroParallaxLines,
  orbX: heroOrbX,
  orbY: heroOrbY,
  handleHeroPointerMove: heroHandleHeroPointerMove,
  resetHeroParallax: heroResetHeroParallax,
  finishClosing: heroFinishClosing,
  openMenu: heroOpenMenu,
  closeMenu: heroCloseMenu,
  handleKeydown: heroHandleKeydown
} = (() => {
const menuItems = [
  ['01', 'INICIO', 'inicio'],
  ['02', 'SERVICIOS', 'servicios'],
  ['03', 'PROCESO', 'proceso'],
  ['04', 'TRABAJO', 'trabajo'],
  ['05', 'PLANES', 'planes'],
  ['06', 'CONTACTO', 'contacto'],
]

// ref conecta la sección renderizada con JavaScript sin buscar fuera de este componente.
const hero = ref<HTMLElement | null>(null)
const heroOrb = ref<HTMLElement | null>(null)
const heroVideo = ref<HTMLVideoElement | null>(null)
const menuPanel = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
// Este estado reactivo decide si Vue muestra u oculta el menú fullscreen.
const isMenuOpen = ref(false)
const prefersReducedMotion = ref(false)
let animationContext: gsap.Context | undefined
let menuTimeline: gsap.core.Timeline | undefined
let previousBodyOverflow = ''
let parallaxLines: Array<{
  x: ReturnType<typeof gsap.quickTo>
  y: ReturnType<typeof gsap.quickTo>
  max: number
}> = []
let orbX: ReturnType<typeof gsap.quickTo> | undefined
let orbY: ReturnType<typeof gsap.quickTo> | undefined

const handleHeroPointerMove = (event: PointerEvent) => {
  // Normalizamos el viewport a un rango -1..1 para aplicar límites de movimiento predecibles.
  const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2
  const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2

  parallaxLines.forEach((line) => {
    line.x(normalizedX * line.max)
    line.y(normalizedY * line.max * 0.5)
  })

  // El objeto abstracto recorre más distancia, pero con una respuesta mucho más lenta.
  orbX?.(normalizedX * 30)
  orbY?.(normalizedY * 20)
}

const resetHeroParallax = () => {
  parallaxLines.forEach((line) => {
    line.x(0)
    line.y(0)
  })
  orbX?.(0)
  orbY?.(0)
}

const finishClosing = (targetId?: string) => {
  isMenuOpen.value = false
  document.body.style.overflow = previousBodyOverflow

  if (targetId) {
    document.getElementById(targetId)?.scrollIntoView()
    window.history.replaceState(null, '', `#${targetId}`)
  } else {
    menuButton.value?.focus()
  }
}

const openMenu = async () => {
  if (isMenuOpen.value) return

  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isMenuOpen.value = true

  // nextTick espera a que Vue haya hecho visible el panel antes de medirlo y animarlo.
  await nextTick()

  if (prefersReducedMotion.value) {
    closeButton.value?.focus()
    return
  }

  menuTimeline?.kill()
  gsap.set('.menu-overlay__link, .menu-overlay__footer', { clearProps: 'opacity,transform' })
  // La timeline reúne la entrada del panel y de sus enlaces en una secuencia fácil de invertir visualmente.
  menuTimeline = gsap.timeline({ onComplete: () => closeButton.value?.focus() })
    .fromTo(menuPanel.value,
      { yPercent: -100 },
      { yPercent: 0, duration: 0.65, ease: 'power4.inOut' },
    )
    // stagger retrasa ligeramente cada enlace para crear ritmo sin alargar demasiado la apertura.
    .from('.menu-overlay__link', {
      yPercent: 110,
      duration: 0.65,
      ease: 'power4.out',
      stagger: 0.07,
    }, '-=0.22')
    .from('.menu-overlay__footer', {
      opacity: 0,
      y: 10,
      duration: 0.35,
    }, '-=0.28')
}

const closeMenu = (targetId?: string) => {
  if (!isMenuOpen.value) return

  if (prefersReducedMotion.value) {
    finishClosing(targetId)
    return
  }

  menuTimeline?.kill()
  menuTimeline = gsap.timeline({ onComplete: () => finishClosing(targetId) })
    .to('.menu-overlay__link, .menu-overlay__footer', {
      opacity: 0,
      y: -12,
      duration: 0.25,
      stagger: 0.025,
    })
    .to(menuPanel.value, {
      yPercent: -100,
      duration: 0.55,
      ease: 'power4.inOut',
    }, '-=0.08')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) closeMenu()

  if (event.key === 'Tab' && isMenuOpen.value && menuPanel.value) {
    const controls = Array.from(menuPanel.value.querySelectorAll<HTMLElement>('a, button'))
    const firstControl = controls[0]
    const lastControl = controls.at(-1)

    if (event.shiftKey && document.activeElement === firstControl) {
      event.preventDefault()
      lastControl?.focus()
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault()
      firstControl?.focus()
    }
  }
}

onMounted(() => {
  // Esperamos al montaje porque GSAP necesita que los elementos ya existan en el DOM.
  // Con movimiento reducido dejamos el contenido en su estado natural y completamente visible.
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('keydown', handleKeydown)
  if (heroVideo.value) {
    heroVideo.value.playbackRate = 0.75
    // Reduced motion conserva el fotograma del vídeo como textura, pero evita reproducirlo.
    if (prefersReducedMotion.value) heroVideo.value.pause()
  }
  if (prefersReducedMotion.value) return
  const root = hero.value
  if (!root) return

  // gsap.context() limita los selectores y permite limpiar toda la animación al desmontar.
  animationContext = gsap.context(() => {
    // Una timeline coordina varias entradas dentro de una única secuencia.
    const timeline = gsap.timeline()

    timeline
      .from('.navbar > *', {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
      })
      // yPercent desplaza cada texto un porcentaje de su propia altura; stagger separa sus inicios.
      .from('.hero__title-text', {
        yPercent: 110,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.13,
      }, '-=0.3')
      // "-=0.3" inicia este paso 0.3 s antes de que termine el anterior.
      .from('.hero__intro', {
        opacity: 0,
        y: 16,
        duration: 0.55,
        ease: 'power2.out',
      }, '-=0.45')
      .from('.hero__cta', {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.35')
      .from('.hero__index', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.15')
  }, root)

  const supportsPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (supportsPointer && heroOrb.value) {
    const maxMovements = [6, 10, 14] as const
    const lines = root.querySelectorAll<HTMLElement>('.hero__title-line')

    // quickTo suaviza objetivos que cambian muchas veces por segundo sin crear una tween por evento.
    parallaxLines = Array.from(lines).flatMap((line, index) => {
      const max = maxMovements[index]
      if (max === undefined) return []
      return [{
        x: gsap.quickTo(line, 'x', { duration: 0.65, ease: 'power3.out' }),
        y: gsap.quickTo(line, 'y', { duration: 0.8, ease: 'power3.out' }),
        max,
      }]
    })
    orbX = gsap.quickTo(heroOrb.value, 'x', { duration: 1.15, ease: 'power3.out' })
    orbY = gsap.quickTo(heroOrb.value, 'y', { duration: 1.15, ease: 'power3.out' })

    root.addEventListener('pointermove', handleHeroPointerMove, { passive: true })
    root.addEventListener('pointerleave', resetHeroParallax)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
  menuTimeline?.kill()
  hero.value?.removeEventListener('pointermove', handleHeroPointerMove)
  hero.value?.removeEventListener('pointerleave', resetHeroParallax)
  gsap.killTweensOf('.hero__title-line')
  gsap.killTweensOf(heroOrb.value)
  animationContext?.revert()
})

  return {
    menuItems,
    hero,
    heroOrb,
    heroVideo,
    menuPanel,
    menuButton,
    closeButton,
    isMenuOpen,
    prefersReducedMotion,
    animationContext,
    menuTimeline,
    previousBodyOverflow,
    parallaxLines,
    orbX,
    orbY,
    handleHeroPointerMove,
    resetHeroParallax,
    finishClosing,
    openMenu,
    closeMenu,
    handleKeydown
  }
})()

// ============================================================================
// MANIFESTO
// ============================================================================

const {
  TOTAL_FRAMES: manifestoTOTAL_FRAMES,
  INITIAL_FRAMES: manifestoINITIAL_FRAMES,
  manifesto: manifestoManifesto,
  canvas: manifestoCanvas,
  reducedMotion: manifestoReducedMotion,
  frameStatuses: manifestoFrameStatuses,
  frameImages: manifestoFrameImages,
  framePromises: manifestoFramePromises,
  animationContext: manifestoAnimationContext,
  resizeObserver: manifestoResizeObserver,
  idleHandle: manifestoIdleHandle,
  timeoutHandle: manifestoTimeoutHandle,
  requestedFrame: manifestoRequestedFrame,
  renderedFrame: manifestoRenderedFrame,
  destroyed: manifestoDestroyed,
  frameUrl: manifestoFrameUrl,
  clampFrame: manifestoClampFrame,
  drawFrame: manifestoDrawFrame,
  findNearestLoadedFrame: manifestoFindNearestLoadedFrame,
  loadFrame: manifestoLoadFrame,
  requestFrame: manifestoRequestFrame,
  resizeCanvas: manifestoResizeCanvas,
  progressiveFrames: manifestoProgressiveFrames,
  progressiveIndex: manifestoProgressiveIndex,
  scheduleProgressivePreload: manifestoScheduleProgressivePreload,
  createStory: manifestoCreateStory
} = (() => {
type FrameStatus = 'not-loaded' | 'loading' | 'loaded' | 'error'

const TOTAL_FRAMES = 120
const INITIAL_FRAMES = [0, 30, 60, 90, 119]
const manifesto = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const reducedMotion = ref(false)
const frameStatuses: FrameStatus[] = Array(TOTAL_FRAMES).fill('not-loaded')
const frameImages: Array<HTMLImageElement | null> = Array(TOTAL_FRAMES).fill(null)
const framePromises: Array<Promise<void> | null> = Array(TOTAL_FRAMES).fill(null)
let animationContext: gsap.Context | undefined
let resizeObserver: ResizeObserver | undefined
let idleHandle: number | undefined
let timeoutHandle: ReturnType<typeof setTimeout> | null = null
let requestedFrame = 0
let renderedFrame = -1
let destroyed = false

const frameUrl = (index: number) => `/Videos/Prueba1Frames/frame_${String(index + 1).padStart(4, '0')}.webp`
const clampFrame = (index: number) => Math.min(TOTAL_FRAMES - 1, Math.max(0, index))

const drawFrame = (index: number) => {
  const targetCanvas = canvas.value
  const image = frameImages[index]
  if (!targetCanvas || !image || frameStatuses[index] !== 'loaded') return

  const context = targetCanvas.getContext('2d')
  if (!context) return
  const imageRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = targetCanvas.width / targetCanvas.height
  const mobilePositionX = window.innerWidth < 640 ? 0.58 : 0.5
  let drawWidth = targetCanvas.width
  let drawHeight = targetCanvas.height

  if (imageRatio > canvasRatio) drawWidth = drawHeight * imageRatio
  else drawHeight = drawWidth / imageRatio

  const drawX = (targetCanvas.width - drawWidth) * mobilePositionX
  const drawY = (targetCanvas.height - drawHeight) * 0.5
  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  renderedFrame = index
  targetCanvas.dataset.frame = String(index)
}

const findNearestLoadedFrame = (target: number) => {
  for (let distance = 0; distance < TOTAL_FRAMES; distance += 1) {
    const previous = target - distance
    const next = target + distance
    if (previous >= 0 && frameStatuses[previous] === 'loaded') return previous
    if (next < TOTAL_FRAMES && frameStatuses[next] === 'loaded') return next
  }
  return -1
}

const loadFrame = (index: number) => {
  const safeIndex = clampFrame(index)
  if (frameStatuses[safeIndex] === 'loaded') return Promise.resolve()
  const existingPromise = framePromises[safeIndex]
  if (existingPromise) return existingPromise

  frameStatuses[safeIndex] = 'loading'
  const promise = new Promise<void>((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (destroyed) {
        resolve()
        return
      }
      frameStatuses[safeIndex] = 'loaded'
      frameImages[safeIndex] = image
      if (safeIndex === requestedFrame || renderedFrame < 0) drawFrame(safeIndex)
      resolve()
    }
    image.onerror = () => {
      frameStatuses[safeIndex] = 'error'
      resolve()
    }
    image.src = frameUrl(safeIndex)
  })
  framePromises[safeIndex] = promise
  return promise
}

const requestFrame = (index: number) => {
  const nextFrame = clampFrame(Math.round(index))
  if (nextFrame === requestedFrame && renderedFrame >= 0) return
  requestedFrame = nextFrame

  if (frameStatuses[nextFrame] === 'loaded') drawFrame(nextFrame)
  else {
    const nearestFrame = findNearestLoadedFrame(nextFrame)
    if (nearestFrame >= 0 && nearestFrame !== renderedFrame) drawFrame(nearestFrame)
    for (const offset of [0, -1, 1, -2, 2]) void loadFrame(nextFrame + offset)
  }
}

const resizeCanvas = () => {
  const targetCanvas = canvas.value
  if (!targetCanvas) return
  const bounds = targetCanvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1 : 1.5)
  const width = Math.max(1, Math.round(bounds.width * dpr))
  const height = Math.max(1, Math.round(bounds.height * dpr))
  if (targetCanvas.width === width && targetCanvas.height === height) return
  targetCanvas.width = width
  targetCanvas.height = height
  const nearestFrame = findNearestLoadedFrame(requestedFrame)
  if (nearestFrame >= 0) drawFrame(nearestFrame)
}

const progressiveFrames = Array.from({ length: TOTAL_FRAMES }, (_, index) => index)
  .filter(index => !INITIAL_FRAMES.includes(index))
let progressiveIndex = 0

const scheduleProgressivePreload = () => {
  if (destroyed || progressiveIndex >= progressiveFrames.length) return
  const loadNext = () => {
    while (progressiveIndex < progressiveFrames.length) {
      const index = progressiveFrames[progressiveIndex++]
      if (index === undefined) return
      if (frameStatuses[index] === 'not-loaded') {
        void loadFrame(index).finally(scheduleProgressivePreload)
        return
      }
    }
  }

  if ('requestIdleCallback' in window) {
    idleHandle = window.requestIdleCallback(loadNext, { timeout: 1200 })
  } else {
    timeoutHandle = globalThis.setTimeout(loadNext, 120)
  }
}

const createStory = () => {
  const root = manifesto.value
  if (!root || !canvas.value) return
  animationContext = gsap.context(() => {
    gsap.set('.manifesto__eyebrow', { autoAlpha: 0, y: 16 })
    gsap.set('.manifesto__scene--one .manifesto__line-text, .manifesto__scene--three .manifesto__line-text', {
      y: (_index, element: HTMLElement) => element.getBoundingClientRect().height * 1.1,
    })
    gsap.set('.manifesto__scene--two', { autoAlpha: 0, y: 32 })
    gsap.set('.manifesto__scene--three, .manifesto__shade--right, .manifesto__shade--full', { autoAlpha: 0 })

    const frameState = { frame: 0 }
    const scrollDistance = () => {
      if (window.innerWidth < 640) return window.innerHeight * 1.9
      if (window.innerWidth < 1024) return window.innerHeight * 2.1
      return window.innerHeight * 2.2
    }
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${scrollDistance()}`,
        pin: '.manifesto__stage',
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    timeline.to(frameState, {
      frame: TOTAL_FRAMES - 1,
      duration: 1,
      snap: { frame: 1 },
      onUpdate: () => requestFrame(frameState.frame),
    }, 0)

    timeline
      .to('.manifesto__eyebrow', { autoAlpha: 1, y: 0, duration: 0.055 }, 0.005)
      .to('.manifesto__scene--one .manifesto__line-text', {
        y: 0,
        duration: 0.085,
        stagger: 0.018,
        ease: 'power3.out',
      }, 0.015)
      .to('.manifesto__scene--one, .manifesto__shade--left', { autoAlpha: 0, yPercent: -5, duration: 0.08 }, 0.22)
      .to('.manifesto__scene--two, .manifesto__shade--right', { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.255)
      .to('.manifesto__scene--two, .manifesto__shade--right', { autoAlpha: 0, yPercent: -6, duration: 0.08 }, 0.52)
      .to('.manifesto__scene--three, .manifesto__shade--full', { autoAlpha: 1, duration: 0.035 }, 0.565)
      .to('.manifesto__scene--three .manifesto__line-text', {
        y: 0,
        duration: 0.095,
        stagger: 0.02,
        ease: 'power3.out',
      }, 0.575)
  }, root)

  ScrollTrigger.refresh()
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resizeObserver = new ResizeObserver(resizeCanvas)
  if (canvas.value) resizeObserver.observe(canvas.value)
  resizeCanvas()

  const initialFrame = reducedMotion.value ? 60 : 0
  requestedFrame = initialFrame
  await loadFrame(initialFrame)
  if (destroyed) return
  resizeCanvas()
  drawFrame(initialFrame)

  if (!reducedMotion.value) {
    createStory()
    INITIAL_FRAMES.filter(index => index !== initialFrame).forEach(index => void loadFrame(index))
    scheduleProgressivePreload()
  }
})

onBeforeUnmount(() => {
  destroyed = true
  animationContext?.revert()
  resizeObserver?.disconnect()
  if (idleHandle !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle)
  if (timeoutHandle !== null) globalThis.clearTimeout(timeoutHandle)
  frameImages.fill(null)
  framePromises.fill(null)
})

  return {
    TOTAL_FRAMES,
    INITIAL_FRAMES,
    manifesto,
    canvas,
    reducedMotion,
    frameStatuses,
    frameImages,
    framePromises,
    animationContext,
    resizeObserver,
    idleHandle,
    timeoutHandle,
    requestedFrame,
    renderedFrame,
    destroyed,
    frameUrl,
    clampFrame,
    drawFrame,
    findNearestLoadedFrame,
    loadFrame,
    requestFrame,
    resizeCanvas,
    progressiveFrames,
    progressiveIndex,
    scheduleProgressivePreload,
    createStory
  }
})()

// ============================================================================
// MARQUEE
// ============================================================================

const {
  marquee: marqueeMarquee,
  animationContext: marqueeAnimationContext
} = (() => {
const marquee = ref<HTMLElement | null>(null)
let animationContext: gsap.Context | undefined

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = marquee.value
  if (!root) return

  animationContext = gsap.context(() => {
    // No hay loop automático: scrub vincula ambas direcciones al avance real del usuario.
    gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
      .fromTo('.marquee__line--forward', { xPercent: -5 }, { xPercent: -25, ease: 'none' }, 0)
      .fromTo('.marquee__line--backward', { xPercent: -25 }, { xPercent: -5, ease: 'none' }, 0)
  }, root)
})

onBeforeUnmount(() => {
  animationContext?.revert()
})

  return {
    marquee,
    animationContext
  }
})()

// ============================================================================
// SERVICES
// ============================================================================

const {
  services: servicesServices,
  section: servicesSection,
  preview: servicesPreview,
  activeService: servicesActiveService,
  animationContext: servicesAnimationContext,
  removeListeners: servicesRemoveListeners,
  previewX: servicesPreviewX,
  previewY: servicesPreviewY,
  previewVisibilityTween: servicesPreviewVisibilityTween,
  preloadedImages: servicesPreloadedImages,
  hoveredServiceId: servicesHoveredServiceId,
  blockedByScroll: servicesBlockedByScroll,
  sectionIsVisible: servicesSectionIsVisible,
  previewVisible: servicesPreviewVisible,
  showPreview: servicesShowPreview,
  hidePreview: servicesHidePreview,
  updatePreviewPosition: servicesUpdatePreviewPosition
} = (() => {
interface Service {
  id: string
  name: string
  description: string
  image: string
}

const services: Service[] = [
  {
    id: 'social-media',
    name: 'GESTIÓN DE REDES SOCIALES',
    description: 'Presencia constante con una estrategia que habla el idioma de tu audiencia.',
    image: '/Images/GRS.webp',
  },
  {
    id: 'reels-video',
    name: 'REELS Y VIDEOS',
    description: 'Contenido pensado para detener el scroll y generar conexión.',
    image: '/Images/RYV.webp',
  },
  {
    id: 'photography',
    name: 'FOTOGRAFÍA PROFESIONAL',
    description: 'Imágenes que muestran el valor real de tus productos y servicios.',
    image: '/Images/FP.webp',
  },
  {
    id: 'graphic-design',
    name: 'DISEÑO GRÁFICO',
    description: 'Una identidad visual coherente que hace reconocible a tu marca.',
    image: '/Images/DG.webp',
  },
  {
    id: 'digital-advertising',
    name: 'PUBLICIDAD DIGITAL',
    description: 'Campañas orientadas a atraer oportunidades y generar resultados.',
    image: '/Images/PDM.webp',
  },
  {
    id: 'digital-strategy',
    name: 'ESTRATEGIA DIGITAL',
    description: 'Decisiones basadas en objetivos, datos y oportunidades reales.',
    image: '/Images/ED.webp',
  },
]

const section = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const activeService = ref<Service | null>(null)
let animationContext: gsap.Context | undefined
const removeListeners: Array<() => void> = []
let previewX: ReturnType<typeof gsap.quickTo> | undefined
let previewY: ReturnType<typeof gsap.quickTo> | undefined
let previewVisibilityTween: gsap.core.Tween | undefined
const preloadedImages: HTMLImageElement[] = []
let hoveredServiceId: string | null = null
let blockedByScroll = false
let sectionIsVisible = true
let previewVisible = false

const showPreview = (service: Service) => {
  const previewElement = preview.value
  if (
    !previewElement
    || blockedByScroll
    || !sectionIsVisible
    || hoveredServiceId !== service.id
    || (previewVisible && activeService.value?.id === service.id)
  ) return

  previewVisible = true
  previewVisibilityTween?.kill()
  activeService.value = service

  nextTick(() => {
    if (
      !previewVisible
      || blockedByScroll
      || !sectionIsVisible
      || hoveredServiceId !== service.id
      || activeService.value?.id !== service.id
    ) return

    previewVisibilityTween = gsap.fromTo(previewElement,
      { autoAlpha: 0, scale: 0.9, rotate: -3 },
      { autoAlpha: 1, scale: 1, rotate: 1.5, duration: 0.35, ease: 'power3.out' },
    )
  })
}

const hidePreview = (immediate = false) => {
  const previewElement = preview.value

  if (!previewElement) {
    previewVisible = false
    activeService.value = null
    return
  }

  if (!previewVisible) {
    if (immediate && activeService.value) {
      previewVisibilityTween?.kill()
      gsap.set(previewElement, { autoAlpha: 0, scale: 0.94, rotate: 0 })
      activeService.value = null
    }
    return
  }

  previewVisible = false
  previewVisibilityTween?.kill()

  if (immediate) {
    gsap.set(previewElement, { autoAlpha: 0, scale: 0.94, rotate: 0 })
    activeService.value = null
    return
  }

  previewVisibilityTween = gsap.to(previewElement, {
    autoAlpha: 0,
    scale: 0.94,
    rotate: 0,
    duration: 0.2,
    onComplete: () => {
      if (!previewVisible) activeService.value = null
    },
  })
}

const updatePreviewPosition = (event: MouseEvent) => {
  const root = section.value
  const previewElement = preview.value
  if (!root || !previewElement) return

  const containerRect = root.getBoundingClientRect()
  const previewRect = previewElement.getBoundingClientRect()
  const localX = event.clientX - containerRect.left
  const localY = event.clientY - containerRect.top
  const margin = 12
  const cursorGap = 28
  const placeOnLeft = localX + cursorGap + previewRect.width > containerRect.width - margin
  const preferredX = placeOnLeft
    ? localX - previewRect.width - cursorGap
    : localX + cursorGap
  const preferredY = localY + 24
  const maxX = Math.max(margin, containerRect.width - previewRect.width - margin)
  const maxY = Math.max(margin, containerRect.height - previewRect.height - margin)
  const x = Math.min(Math.max(preferredX, margin), maxX)
  const y = Math.min(Math.max(preferredY, margin), maxY)

  previewX?.(x)
  previewY?.(y)
}

onMounted(() => {
  services.forEach((service) => {
    const image = new Image()
    image.src = service.image
    preloadedImages.push(image)
  })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = section.value
  if (!root) return

  animationContext = gsap.context(() => {
    const items = gsap.utils.toArray<HTMLElement>('.service')
    const previewEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (previewEnabled && preview.value) {
      // quickTo mantiene una única tween por eje y actualiza su destino mientras se mueve el puntero.
      previewX = gsap.quickTo(preview.value, 'x', { duration: 0.45, ease: 'power3.out' })
      previewY = gsap.quickTo(preview.value, 'y', { duration: 0.45, ease: 'power3.out' })

      const handlePointerMove = (event: PointerEvent) => {
        updatePreviewPosition(event)
      }
      const handleSectionLeave = () => {
        hoveredServiceId = null
        hidePreview(true)
      }
      const handleScroll = () => {
        blockedByScroll = true
        hoveredServiceId = null
        if (!activeService.value && !previewVisible) return
        hidePreview(true)
      }
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        sectionIsVisible = Boolean(entry?.isIntersecting)
        if (sectionIsVisible) return
        hoveredServiceId = null
        hidePreview(true)
      }, { threshold: 0 })

      root.addEventListener('pointermove', handlePointerMove, { passive: true })
      root.addEventListener('pointerleave', handleSectionLeave)
      window.addEventListener('scroll', handleScroll, { passive: true })
      visibilityObserver.observe(root)

      removeListeners.push(() => {
        root.removeEventListener('pointermove', handlePointerMove)
        root.removeEventListener('pointerleave', handleSectionLeave)
        window.removeEventListener('scroll', handleScroll)
        visibilityObserver.disconnect()
      })
    }

    items.forEach((item, index) => {
      const service = services[index]
      if (!service) return
      const name = item.querySelector('.service__name')
      const description = item.querySelector('.service__description')
      const rule = item.querySelector('.service__rule')

      const enter = (event: PointerEvent) => {
        gsap.to(name, { x: 12, duration: 0.35, ease: 'power2.out' })
        gsap.to(description, { opacity: 1, y: -2, duration: 0.3 })
        gsap.to(rule, { scaleX: 0.97, opacity: 1, duration: 0.35, ease: 'power2.out' })

        if (previewEnabled && preview.value) {
          blockedByScroll = false
          hoveredServiceId = service.id
          updatePreviewPosition(event)
          showPreview(service)
        }
      }

      const leave = (event: PointerEvent) => {
        if (event.relatedTarget instanceof Node && item.contains(event.relatedTarget)) return

        gsap.to(name, { x: 0, duration: 0.35, ease: 'power2.out' })
        gsap.to(description, { opacity: 0.62, y: 0, duration: 0.3 })
        gsap.to(rule, { scaleX: 1, opacity: 0.28, duration: 0.35, ease: 'power2.out' })

        if (previewEnabled && preview.value) {
          if (hoveredServiceId === service.id) hoveredServiceId = null
          hidePreview()
        }
      }

      // pointerenter/pointerleave separan el estado de hover del seguimiento de posición.
      item.addEventListener('pointerenter', enter)
      item.addEventListener('pointerleave', leave)
      removeListeners.push(() => {
        item.removeEventListener('pointerenter', enter)
        item.removeEventListener('pointerleave', leave)
      })
    })
  }, root)
})

onBeforeUnmount(() => {
  removeListeners.forEach(remove => remove())
  hoveredServiceId = null
  blockedByScroll = true
  sectionIsVisible = false
  previewVisible = false
  activeService.value = null
  previewVisibilityTween?.kill()
  gsap.killTweensOf(preview.value)
  animationContext?.revert()
  preloadedImages.length = 0
})

  return {
    services,
    section,
    preview,
    activeService,
    animationContext,
    removeListeners,
    previewX,
    previewY,
    previewVisibilityTween,
    preloadedImages,
    hoveredServiceId,
    blockedByScroll,
    sectionIsVisible,
    previewVisible,
    showPreview,
    hidePreview,
    updatePreviewPosition
  }
})()

// ============================================================================
// PROCESS
// ============================================================================

const {
  TOTAL_FRAMES: processTOTAL_FRAMES,
  SOURCE_FPS: processSOURCE_FPS,
  DURATION_SECONDS: processDURATION_SECONDS,
  PLAYBACK_SPEED: processPLAYBACK_SPEED,
  WHEEL_DIRECTION_THRESHOLD: processWHEEL_DIRECTION_THRESHOLD,
  TOUCH_DIRECTION_THRESHOLD: processTOUCH_DIRECTION_THRESHOLD,
  EDGE_EPSILON: processEDGE_EPSILON,
  PROCESS_WORK_BOUNDARY_EPSILON: processPROCESS_WORK_BOUNDARY_EPSILON,
  AUTO_EXPANSION_THRESHOLD: processAUTO_EXPANSION_THRESHOLD,
  AUTO_EXPANSION_DELAY: processAUTO_EXPANSION_DELAY,
  AUTO_EXPANSION_DURATION: processAUTO_EXPANSION_DURATION,
  OUTRO_FADE_DURATION: processOUTRO_FADE_DURATION,
  INITIAL_FRAMES: processINITIAL_FRAMES,
  messages: processMessages,
  messageMotions: processMessageMotions,
  process: processProcess,
  processEndSentinel: processProcessEndSentinel,
  stage: processStage,
  visual: processVisual,
  canvas: processCanvas,
  introCopy: processIntroCopy,
  backdrop: processBackdrop,
  overlay: processOverlay,
  shade: processShade,
  messagesContainer: processMessagesContainer,
  outro: processOutro,
  outroText: processOutroText,
  mode: processMode,
  reducedMotion: processReducedMotion,
  frameStatuses: processFrameStatuses,
  frameImages: processFrameImages,
  framePromises: processFramePromises,
  resizeObserver: processResizeObserver,
  intersectionObserver: processIntersectionObserver,
  idleHandle: processIdleHandle,
  preloadTimeoutHandle: processPreloadTimeoutHandle,
  wheelResetHandle: processWheelResetHandle,
  resizeHandle: processResizeHandle,
  introDelayHandle: processIntroDelayHandle,
  transitionTimeline: processTransitionTimeline,
  expansionTimeline: processExpansionTimeline,
  textTimeline: processTextTimeline,
  outroTimeline: processOutroTimeline,
  messageElements: processMessageElements,
  requestedFrame: processRequestedFrame,
  renderedFrame: processRenderedFrame,
  masterPlayhead: processMasterPlayhead,
  transitionProgress: processTransitionProgress,
  direction: processDirection,
  wheelAccumulator: processWheelAccumulator,
  touchStartY: processTouchStartY,
  touchLastY: processTouchLastY,
  touchDirectionCommitted: processTouchDirectionCommitted,
  lastScrollY: processLastScrollY,
  tickerRunning: processTickerRunning,
  autoExpansionAvailable: processAutoExpansionAvailable,
  exitSide: processExitSide,
  introOrigin: processIntroOrigin,
  entryFromTopActive: processEntryFromTopActive,
  outroReverseInProgress: processOutroReverseInProgress,
  collapseAnimationActive: processCollapseAnimationActive,
  processAnchorY: processProcessAnchorY,
  previousScrollBehavior: processPreviousScrollBehavior,
  scrollBehaviorOverridden: processScrollBehaviorOverridden,
  destroyed: processDestroyed,
  frameUrl: processFrameUrl,
  clampFrame: processClampFrame,
  clamp: processClamp,
  isAtStart: processIsAtStart,
  isAtEnd: processIsAtEnd,
  getTransitionMetrics: processGetTransitionMetrics,
  cacheProcessAnchor: processCacheProcessAnchor,
  restoreProcessAnchor: processRestoreProcessAnchor,
  getTopEntryActivationScroll: processGetTopEntryActivationScroll,
  isProcessInViewport: processIsProcessInViewport,
  wouldReachTopEntryGate: processWouldReachTopEntryGate,
  setMode: processSetMode,
  drawCoverImage: processDrawCoverImage,
  drawFrame: processDrawFrame,
  findNearestLoadedFrame: processFindNearestLoadedFrame,
  loadFrame: processLoadFrame,
  requestFrame: processRequestFrame,
  resizeCanvas: processResizeCanvas,
  createTransitionTimeline: processCreateTransitionTimeline,
  rebuildTransitionTimeline: processRebuildTransitionTimeline,
  createOutroTimeline: processCreateOutroTimeline,
  createTextTimeline: processCreateTextTimeline,
  updateDiagnostics: processUpdateDiagnostics,
  applyTransitionProgress: processApplyTransitionProgress,
  updateExperience: processUpdateExperience,
  progressiveFrames: processProgressiveFrames,
  progressiveIndex: processProgressiveIndex,
  scheduleProgressivePreload: processScheduleProgressivePreload,
  updateMasterPlayhead: processUpdateMasterPlayhead,
  startTicker: processStartTicker,
  stopTicker: processStopTicker,
  restoreScrollBehavior: processRestoreScrollBehavior,
  cancelExpansionDelay: processCancelExpansionDelay,
  resetInputGuards: processResetInputGuards,
  startTopEntrySession: processStartTopEntrySession,
  resetForEntryFromTop: processResetForEntryFromTop,
  startAutomaticExpansion: processStartAutomaticExpansion,
  scheduleAutomaticExpansion: processScheduleAutomaticExpansion,
  startCollapseToIntro: processStartCollapseToIntro,
  enterInteractive: processEnterInteractive,
  enterOutro: processEnterOutro,
  reverseOutro: processReverseOutro,
  finishCollapse: processFinishCollapse,
  activateFreshTopEntryGate: processActivateFreshTopEntryGate,
  shouldCaptureScroll: processShouldCaptureScroll,
  canExitToPreviousSection: processCanExitToPreviousSection,
  canExitToWork: processCanExitToWork,
  returnFromOutroToInteractiveReverse: processReturnFromOutroToInteractiveReverse,
  releaseToWork: processReleaseToWork,
  getProcessWorkBoundaryScroll: processGetProcessWorkBoundaryScroll,
  wouldEnterProcessFromWork: processWouldEnterProcessFromWork,
  enterProcessFromWork: processEnterProcessFromWork,
  restartFromReturnedIntro: processRestartFromReturnedIntro,
  normalizeWheelDelta: processNormalizeWheelDelta,
  scheduleWheelAccumulatorReset: processScheduleWheelAccumulatorReset,
  handleWheel: processHandleWheel,
  handleTouchStart: processHandleTouchStart,
  handleTouchMove: processHandleTouchMove,
  handleTouchEnd: processHandleTouchEnd,
  handleKeydown: processHandleKeydown,
  handlePageScroll: processHandlePageScroll,
  handleViewportResize: processHandleViewportResize
} = (() => {
type FrameStatus = 'not-loaded' | 'loading' | 'loaded' | 'error'
type PlaybackDirection = -1 | 1
type ProcessMode = 'intro' | 'expanding' | 'interactive' | 'outro' | 'collapsing'
type ExitSide = 'none' | 'top' | 'bottom'
type IntroOrigin = 'fresh-top-entry' | 'returned-from-video'

const TOTAL_FRAMES = 236
const SOURCE_FPS = 13
const DURATION_SECONDS = (TOTAL_FRAMES - 1) / SOURCE_FPS
const PLAYBACK_SPEED = 1
const WHEEL_DIRECTION_THRESHOLD = 8
const TOUCH_DIRECTION_THRESHOLD = 22
const EDGE_EPSILON = 0.001
const PROCESS_WORK_BOUNDARY_EPSILON = 2
const AUTO_EXPANSION_THRESHOLD = 0.8
const AUTO_EXPANSION_DELAY = 550
const AUTO_EXPANSION_DURATION = 1.15
const OUTRO_FADE_DURATION = 0.48
const INITIAL_FRAMES = [0, 47, 94, 141, 188, 235]

const messages = [
  { id: 'idea', title: 'UNA IDEA.' },
  { id: 'analyze', title: 'ANALIZAMOS' },
  { id: 'strategy', title: 'UNA ESTRATEGIA.' },
  { id: 'design', title: 'DISEÑAMOS' },
  { id: 'create', title: 'CREAMOS' },
  { id: 'launch', title: 'LANZAMOS' },
  { id: 'result', title: 'UN RESULTADO.' },
  { id: 'optimize', title: 'OPTIMIZAMOS' },
]

const messageMotions = [
  { from: { xPercent: -2, yPercent: 18, scale: 0.97 }, drift: { xPercent: 1, yPercent: -2, scale: 1.01 }, to: { xPercent: 2, yPercent: -16, scale: 1.02 } },
  { from: { xPercent: 2, yPercent: -16, scale: 0.98 }, drift: { xPercent: -1, yPercent: 2, scale: 1.01 }, to: { xPercent: -2, yPercent: 16, scale: 1.02 } },
  { from: { xPercent: 2, yPercent: 18, scale: 0.96 }, drift: { xPercent: -1, yPercent: -2, scale: 1.01 }, to: { xPercent: -2, yPercent: -17, scale: 1.02 } },
  { from: { xPercent: -2, yPercent: -17, scale: 0.98 }, drift: { xPercent: 1, yPercent: 2, scale: 1.01 }, to: { xPercent: 2, yPercent: 16, scale: 1.02 } },
  { from: { xPercent: -2, yPercent: 17, scale: 0.97 }, drift: { xPercent: 1, yPercent: -2, scale: 1.01 }, to: { xPercent: 2, yPercent: -16, scale: 1.02 } },
  { from: { xPercent: 2, yPercent: -16, scale: 0.98 }, drift: { xPercent: -1, yPercent: 2, scale: 1.01 }, to: { xPercent: -2, yPercent: 16, scale: 1.02 } },
  { from: { xPercent: 2, yPercent: 17, scale: 0.96 }, drift: { xPercent: -1, yPercent: -2, scale: 1.01 }, to: { xPercent: -2, yPercent: -16, scale: 1.02 } },
  { from: { xPercent: -2, yPercent: -16, scale: 0.98 }, drift: { xPercent: 1, yPercent: 2, scale: 1.01 }, to: { xPercent: 2, yPercent: 16, scale: 1.02 } },
]

const process = ref<HTMLElement | null>(null)
const processEndSentinel = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const visual = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const introCopy = ref<HTMLElement | null>(null)
const backdrop = ref<HTMLElement | null>(null)
const overlay = ref<HTMLElement | null>(null)
const shade = ref<HTMLElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
const outro = ref<HTMLElement | null>(null)
const outroText = ref<HTMLElement | null>(null)
const mode = ref<ProcessMode>('intro')
const reducedMotion = ref(false)
const frameStatuses: FrameStatus[] = Array(TOTAL_FRAMES).fill('not-loaded')
const frameImages: Array<HTMLImageElement | null> = Array(TOTAL_FRAMES).fill(null)
const framePromises: Array<Promise<void> | null> = Array(TOTAL_FRAMES).fill(null)

let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let idleHandle: number | undefined
let preloadTimeoutHandle: ReturnType<typeof setTimeout> | null = null
let wheelResetHandle: ReturnType<typeof setTimeout> | null = null
let resizeHandle: ReturnType<typeof setTimeout> | null = null
let introDelayHandle: ReturnType<typeof setTimeout> | null = null
let transitionTimeline: gsap.core.Timeline | undefined
let expansionTimeline: gsap.core.Timeline | undefined
let textTimeline: gsap.core.Timeline | undefined
let outroTimeline: gsap.core.Timeline | undefined
let messageElements: HTMLElement[] = []
let requestedFrame = 0
let renderedFrame = -1
let masterPlayhead = 0
let transitionProgress = 0
let direction: PlaybackDirection = 1
let wheelAccumulator = 0
let touchStartY: number | null = null
let touchLastY: number | null = null
let touchDirectionCommitted = false
let lastScrollY = 0
let tickerRunning = false
let autoExpansionAvailable = true
let exitSide: ExitSide = 'none'
let introOrigin: IntroOrigin = 'fresh-top-entry'
let entryFromTopActive = false
let outroReverseInProgress = false
let collapseAnimationActive = false
let processAnchorY: number | null = null
let previousScrollBehavior = ''
let scrollBehaviorOverridden = false
let destroyed = false

const frameUrl = (index: number) => `/Videos/ProcesoFrames/frame_${String(index + 1).padStart(4, '0')}.webp`
const clampFrame = (index: number) => Math.min(TOTAL_FRAMES - 1, Math.max(0, index))
const clamp = (minimum: number, maximum: number, value: number) => Math.min(maximum, Math.max(minimum, value))
const isAtStart = () => masterPlayhead <= EDGE_EPSILON
const isAtEnd = () => masterPlayhead >= DURATION_SECONDS - EDGE_EPSILON

const getTransitionMetrics = () => {
  if (!process.value || !stage.value) return null
  const sectionBounds = process.value.getBoundingClientRect()
  const start = window.scrollY + sectionBounds.top
  const distance = Math.max(1, process.value.offsetHeight - stage.value.offsetHeight)
  return { start, end: start + distance, distance }
}

const cacheProcessAnchor = (metrics = getTransitionMetrics()) => {
  if (!metrics) return false
  processAnchorY = metrics.start
  return true
}

const restoreProcessAnchor = () => {
  if (processAnchorY === null || Math.abs(window.scrollY - processAnchorY) < 1) return
  window.scrollTo({ top: processAnchorY, behavior: 'auto' })
  lastScrollY = processAnchorY
}

const getTopEntryActivationScroll = () => {
  const metrics = getTransitionMetrics()
  if (!metrics) return null
  return Math.max(0, metrics.start - window.innerHeight * (1 - AUTO_EXPANSION_THRESHOLD))
}

const isProcessInViewport = () => {
  if (!stage.value) return false
  const bounds = stage.value.getBoundingClientRect()
  return bounds.bottom > 0 && bounds.top < window.innerHeight
}

const wouldReachTopEntryGate = (deltaY: number) => {
  const activationScroll = getTopEntryActivationScroll()
  const metrics = getTransitionMetrics()
  if (activationScroll === null || !metrics || deltaY <= 0) return false
  return window.scrollY <= metrics.end && window.scrollY + deltaY >= activationScroll
}

const setMode = (nextMode: ProcessMode) => {
  mode.value = nextMode
  if (stage.value) stage.value.dataset.mode = nextMode
}

const drawCoverImage = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
) => {
  const imageRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = targetCanvas.width / targetCanvas.height
  const positionX = window.innerWidth < 640 ? 0.62 : 0.5
  let drawWidth = targetCanvas.width
  let drawHeight = targetCanvas.height

  if (imageRatio > canvasRatio) drawWidth = drawHeight * imageRatio
  else drawHeight = drawWidth / imageRatio

  const drawX = (targetCanvas.width - drawWidth) * positionX
  const drawY = (targetCanvas.height - drawHeight) * 0.5
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
}

const drawFrame = (index: number) => {
  const targetCanvas = canvas.value
  const image = frameImages[index]
  if (!targetCanvas || !image || frameStatuses[index] !== 'loaded' || renderedFrame === index) return

  const context = targetCanvas.getContext('2d')
  if (!context) return

  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
  drawCoverImage(context, image, targetCanvas)
  renderedFrame = index
  targetCanvas.dataset.frame = String(index)
}

const findNearestLoadedFrame = (target: number) => {
  for (let distance = 0; distance < TOTAL_FRAMES; distance += 1) {
    const previous = target - distance
    const next = target + distance
    if (previous >= 0 && frameStatuses[previous] === 'loaded') return previous
    if (next < TOTAL_FRAMES && frameStatuses[next] === 'loaded') return next
  }
  return -1
}

const loadFrame = (index: number) => {
  const safeIndex = clampFrame(index)
  if (frameStatuses[safeIndex] === 'loaded') return Promise.resolve()
  const existingPromise = framePromises[safeIndex]
  if (existingPromise) return existingPromise

  frameStatuses[safeIndex] = 'loading'
  const promise = new Promise<void>((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (destroyed) {
        resolve()
        return
      }
      frameStatuses[safeIndex] = 'loaded'
      frameImages[safeIndex] = image
      if (safeIndex === requestedFrame || renderedFrame < 0) drawFrame(safeIndex)
      resolve()
    }
    image.onerror = () => {
      frameStatuses[safeIndex] = 'error'
      resolve()
    }
    image.src = frameUrl(safeIndex)
  })
  framePromises[safeIndex] = promise
  return promise
}

const requestFrame = (index: number) => {
  const nextFrame = clampFrame(index)
  requestedFrame = nextFrame

  if (frameStatuses[nextFrame] === 'loaded') drawFrame(nextFrame)
  else {
    const nearestFrame = findNearestLoadedFrame(nextFrame)
    if (nearestFrame >= 0) drawFrame(nearestFrame)
    const offsets = direction < 0 ? [0, -1, -2, 1, -3, 2, 3] : [0, 1, 2, -1, 3, -2, -3]
    offsets.forEach(offset => void loadFrame(nextFrame + offset))
  }
}

const resizeCanvas = () => {
  const targetCanvas = canvas.value
  if (!targetCanvas) return
  const bounds = targetCanvas.getBoundingClientRect()
  const maximumDpr = window.innerWidth < 640 ? 1.15 : 1.5
  const dpr = Math.min(window.devicePixelRatio || 1, maximumDpr)
  const width = Math.max(1, Math.round(bounds.width * dpr))
  const height = Math.max(1, Math.round(bounds.height * dpr))
  if (targetCanvas.width === width && targetCanvas.height === height) return

  targetCanvas.width = width
  targetCanvas.height = height
  renderedFrame = -1
  const nearestFrame = findNearestLoadedFrame(requestedFrame)
  if (nearestFrame >= 0) drawFrame(nearestFrame)
}

const createTransitionTimeline = () => {
  if (!visual.value || !introCopy.value || !backdrop.value || !overlay.value || !shade.value || !messagesContainer.value) return

  const timeline = gsap.timeline({ paused: true })
  timeline.to(introCopy.value, {
    autoAlpha: 0,
    xPercent: 12,
    yPercent: -8,
    clipPath: 'inset(0 0 100% 0)',
    duration: 0.58,
    ease: 'none',
  }, 0)
  timeline.to(visual.value, {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    duration: 1,
    ease: 'none',
  }, 0)
  timeline.to(backdrop.value, { autoAlpha: 0, duration: 0.68, ease: 'none' }, 0.32)
  timeline.fromTo(
    [overlay.value, shade.value],
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.22, ease: 'none', immediateRender: true },
    0.72,
  )
  timeline.fromTo(
    messagesContainer.value,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.1, ease: 'none', immediateRender: true },
    0.9,
  )

  transitionTimeline = timeline
  transitionTimeline.progress(transitionProgress, true)
}

const rebuildTransitionTimeline = () => {
  const targets = [visual.value, introCopy.value, backdrop.value, overlay.value, shade.value, messagesContainer.value]
    .filter((target): target is HTMLElement => Boolean(target))
  transitionTimeline?.kill()
  gsap.set(targets, { clearProps: 'all' })
  createTransitionTimeline()
  resizeCanvas()
  cacheProcessAnchor()
}

const createOutroTimeline = () => {
  if (!outro.value || !outroText.value) return

  gsap.set(outro.value, { autoAlpha: 0 })
  gsap.set(outroText.value, { autoAlpha: 0, yPercent: 115 })

  const timeline = gsap.timeline({ paused: true })
  timeline.fromTo(
    outro.value,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: OUTRO_FADE_DURATION, ease: 'power2.out', immediateRender: false },
    0,
  )
  timeline.fromTo(
    outroText.value,
    { autoAlpha: 0, yPercent: 115 },
    { autoAlpha: 1, yPercent: 0, duration: 0.48, ease: 'power4.out', immediateRender: false },
    OUTRO_FADE_DURATION * 0.72,
  )

  outroTimeline = timeline
  outroTimeline.progress(0, true)
}

const createTextTimeline = () => {
  if (messageElements.length === 0) return

  const timeline = gsap.timeline({ paused: true })
  const segmentDuration = 1 / messageElements.length
  const transitionDuration = segmentDuration * 0.13

  gsap.set(messageElements, { autoAlpha: 0 })

  messageElements.forEach((element, index) => {
    const motion = messageMotions[index]
    if (!motion) return

    const title = element.querySelector('.process__message-title')
    const start = index * segmentDuration
    const end = (index + 1) * segmentDuration
    const holdDuration = segmentDuration - transitionDuration * 2

    timeline.set(element, { autoAlpha: 1 }, start)
    timeline.fromTo(
      element,
      { ...motion.from, autoAlpha: 0 },
      { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 1, duration: transitionDuration, ease: 'power3.out', immediateRender: false },
      start,
    )
    timeline.fromTo(
      title,
      { yPercent: 112 },
      { yPercent: 0, duration: transitionDuration, ease: 'power4.out', immediateRender: false },
      start,
    )
    timeline.to(element, { ...motion.drift, duration: holdDuration, ease: 'none' }, start + transitionDuration)
    timeline.to(element, { ...motion.to, autoAlpha: 0, duration: transitionDuration, ease: 'power3.in' }, end - transitionDuration)
    timeline.set(element, { autoAlpha: 0 }, end)
  })

  textTimeline = timeline
  textTimeline.progress(0, true)
}

const updateDiagnostics = (progress = masterPlayhead / DURATION_SECONDS) => {
  if (!stage.value) return
  stage.value.dataset.mode = mode.value
  stage.value.dataset.exitSide = exitSide
  stage.value.dataset.introOrigin = introOrigin
  stage.value.dataset.autoExpansionArmed = String(autoExpansionAvailable)
  stage.value.dataset.transitionProgress = transitionProgress.toFixed(4)
  stage.value.dataset.masterProgress = progress.toFixed(4)
  stage.value.dataset.masterPlayhead = masterPlayhead.toFixed(3)
  stage.value.dataset.direction = String(direction)
  stage.value.dataset.playbackSpeed = PLAYBACK_SPEED.toFixed(1)
}

const applyTransitionProgress = (progress: number) => {
  transitionProgress = clamp(0, 1, progress)
  transitionTimeline?.progress(transitionProgress, true)
  updateDiagnostics()
}

const updateExperience = () => {
  const progress = clamp(0, 1, masterPlayhead / DURATION_SECONDS)
  const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1))
  textTimeline?.progress(progress, true)
  requestFrame(frameIndex)
  updateDiagnostics(progress)
}

const progressiveFrames = Array.from({ length: TOTAL_FRAMES }, (_, index) => index)
  .filter(index => !INITIAL_FRAMES.includes(index))
let progressiveIndex = 0

const scheduleProgressivePreload = () => {
  if (destroyed || progressiveIndex >= progressiveFrames.length) return
  const loadNext = () => {
    while (progressiveIndex < progressiveFrames.length) {
      const index = progressiveFrames[progressiveIndex++]
      if (index === undefined) return
      if (frameStatuses[index] === 'not-loaded') {
        void loadFrame(index).finally(scheduleProgressivePreload)
        return
      }
    }
  }

  if ('requestIdleCallback' in window) idleHandle = window.requestIdleCallback(loadNext, { timeout: 1200 })
  else preloadTimeoutHandle = globalThis.setTimeout(loadNext, 120)
}

const updateMasterPlayhead = (_time: number, deltaMilliseconds: number) => {
  if (mode.value !== 'interactive' || reducedMotion.value || destroyed) return

  const deltaTime = Math.min(deltaMilliseconds / 1000, 0.05)
  masterPlayhead = clamp(
    0,
    DURATION_SECONDS,
    masterPlayhead + direction * PLAYBACK_SPEED * deltaTime,
  )
  updateExperience()
  if (direction === 1 && isAtEnd()) enterOutro()
  else if (direction === -1 && isAtStart()) startCollapseToIntro()
}

const startTicker = () => {
  if (tickerRunning || reducedMotion.value) return
  tickerRunning = true
  gsap.ticker.add(updateMasterPlayhead)
}

const stopTicker = () => {
  if (!tickerRunning) return
  tickerRunning = false
  gsap.ticker.remove(updateMasterPlayhead)
}

const restoreScrollBehavior = () => {
  if (!scrollBehaviorOverridden) return
  document.documentElement.style.scrollBehavior = previousScrollBehavior
  scrollBehaviorOverridden = false
}

const cancelExpansionDelay = () => {
  if (introDelayHandle === null) return
  globalThis.clearTimeout(introDelayHandle)
  introDelayHandle = null
}

const resetInputGuards = () => {
  if (wheelResetHandle !== null) globalThis.clearTimeout(wheelResetHandle)
  wheelResetHandle = null
  wheelAccumulator = 0
  touchStartY = null
  touchLastY = null
  touchDirectionCommitted = false
}

const startTopEntrySession = () => {
  if (mode.value !== 'intro' || destroyed) return

  stopTicker()
  cancelExpansionDelay()
  resetInputGuards()
  masterPlayhead = 0
  direction = 1
  exitSide = 'none'
  introOrigin = 'fresh-top-entry'
  entryFromTopActive = true
  outroReverseInProgress = false
  collapseAnimationActive = false
  autoExpansionAvailable = true

  outroTimeline?.eventCallback('onReverseComplete', null)
  outroTimeline?.pause(0)
  textTimeline?.progress(0, true)
  requestFrame(0)
  applyTransitionProgress(0)
  cacheProcessAnchor()
  setMode('intro')
  updateDiagnostics(0)
}

const resetForEntryFromTop = () => {
  stopTicker()
  cancelExpansionDelay()
  expansionTimeline?.kill()
  expansionTimeline = undefined
  restoreScrollBehavior()
  resetInputGuards()

  masterPlayhead = 0
  direction = 1
  exitSide = 'top'
  introOrigin = 'fresh-top-entry'
  entryFromTopActive = false
  outroReverseInProgress = false
  collapseAnimationActive = false
  autoExpansionAvailable = true

  outroTimeline?.eventCallback('onReverseComplete', null)
  outroTimeline?.pause(0)
  textTimeline?.progress(0, true)
  requestFrame(0)
  applyTransitionProgress(0)
  cacheProcessAnchor()
  setMode('intro')
  updateDiagnostics(0)
}

const startAutomaticExpansion = () => {
  if (
    mode.value !== 'intro'
    || introOrigin !== 'fresh-top-entry'
    || !entryFromTopActive
    || !autoExpansionAvailable
    || destroyed
  ) return
  const metrics = getTransitionMetrics()
  if (!metrics) return
  cacheProcessAnchor(metrics)

  cancelExpansionDelay()
  autoExpansionAvailable = false
  entryFromTopActive = false
  collapseAnimationActive = false
  setMode('expanding')

  const animationState = { progress: transitionProgress }
  const scrollState = { y: window.scrollY }
  previousScrollBehavior = document.documentElement.style.scrollBehavior
  document.documentElement.style.scrollBehavior = 'auto'
  scrollBehaviorOverridden = true

  expansionTimeline?.kill()
  expansionTimeline = gsap.timeline({
    onComplete: () => {
      restoreScrollBehavior()
      window.scrollTo(0, metrics.end)
      applyTransitionProgress(1)
      enterInteractive(1)
    },
  })
  expansionTimeline.to(animationState, {
    progress: 1,
    duration: AUTO_EXPANSION_DURATION,
    ease: 'power3.inOut',
    onUpdate: () => applyTransitionProgress(animationState.progress),
  }, 0)
  expansionTimeline.to(scrollState, {
    y: metrics.end,
    duration: AUTO_EXPANSION_DURATION,
    ease: 'power3.inOut',
    onUpdate: () => window.scrollTo(0, scrollState.y),
  }, 0)
}

const scheduleAutomaticExpansion = () => {
  if (
    !autoExpansionAvailable
    || mode.value !== 'intro'
    || introOrigin !== 'fresh-top-entry'
    || !entryFromTopActive
    || introDelayHandle !== null
  ) return
  introDelayHandle = globalThis.setTimeout(() => {
    introDelayHandle = null
    startAutomaticExpansion()
  }, AUTO_EXPANSION_DELAY)
}

const startCollapseToIntro = () => {
  if (mode.value !== 'interactive' || direction !== -1 || !isAtStart() || collapseAnimationActive) return

  stopTicker()
  cancelExpansionDelay()
  resetInputGuards()
  autoExpansionAvailable = false
  entryFromTopActive = false
  collapseAnimationActive = true
  setMode('collapsing')

  previousScrollBehavior = document.documentElement.style.scrollBehavior
  document.documentElement.style.scrollBehavior = 'auto'
  scrollBehaviorOverridden = true

  const completeCollapse = () => {
    expansionTimeline?.eventCallback('onReverseComplete', null)
    restoreScrollBehavior()
    collapseAnimationActive = false
    finishCollapse()
  }

  if (expansionTimeline) {
    expansionTimeline.eventCallback('onReverseComplete', completeCollapse)
    expansionTimeline.timeScale(1).reverse()
    return
  }

  const metrics = getTransitionMetrics()
  if (!metrics) {
    completeCollapse()
    return
  }

  const animationState = { progress: transitionProgress }
  const scrollState = { y: window.scrollY }
  expansionTimeline = gsap.timeline({ onComplete: completeCollapse })
  expansionTimeline.to(animationState, {
    progress: 0,
    duration: AUTO_EXPANSION_DURATION,
    ease: 'power3.inOut',
    onUpdate: () => applyTransitionProgress(animationState.progress),
  }, 0)
  expansionTimeline.to(scrollState, {
    y: metrics.start,
    duration: AUTO_EXPANSION_DURATION,
    ease: 'power3.inOut',
    onUpdate: () => window.scrollTo(0, scrollState.y),
  }, 0)
}

const enterInteractive = (nextDirection: PlaybackDirection) => {
  applyTransitionProgress(1)
  direction = nextDirection
  exitSide = 'none'
  outroReverseInProgress = false
  setMode('interactive')
  startTicker()
  updateDiagnostics()
}

const enterOutro = () => {
  if (mode.value !== 'interactive') return
  stopTicker()
  masterPlayhead = DURATION_SECONDS
  requestFrame(TOTAL_FRAMES - 1)
  textTimeline?.progress(1, true)
  exitSide = 'none'
  outroReverseInProgress = false
  setMode('outro')
  updateDiagnostics(1)
  outroTimeline?.eventCallback('onReverseComplete', null)
  outroTimeline?.timeScale(1).play(0)
}

const reverseOutro = () => {
  if (mode.value !== 'outro' || outroReverseInProgress) return
  restoreProcessAnchor()
  stopTicker()
  masterPlayhead = DURATION_SECONDS
  direction = -1
  requestFrame(TOTAL_FRAMES - 1)
  textTimeline?.progress(1, true)
  exitSide = 'none'
  outroReverseInProgress = true
  updateDiagnostics(1)

  if (!outroTimeline) {
    enterInteractive(-1)
    return
  }

  outroTimeline.eventCallback('onReverseComplete', () => {
    outroTimeline?.eventCallback('onReverseComplete', null)
    outroReverseInProgress = false
    masterPlayhead = DURATION_SECONDS
    requestFrame(TOTAL_FRAMES - 1)
    enterInteractive(-1)
  })
  outroTimeline.timeScale(1.08).reverse()
}

const finishCollapse = () => {
  stopTicker()
  cancelExpansionDelay()
  resetInputGuards()
  masterPlayhead = 0
  direction = 1
  exitSide = 'none'
  introOrigin = 'returned-from-video'
  entryFromTopActive = false
  outroReverseInProgress = false
  collapseAnimationActive = false
  autoExpansionAvailable = false
  outroTimeline?.eventCallback('onReverseComplete', null)
  outroTimeline?.pause(0)
  requestFrame(0)
  textTimeline?.progress(0, true)
  applyTransitionProgress(0)
  setMode('intro')
  updateDiagnostics(0)
}

const activateFreshTopEntryGate = (deltaY: number) => {
  if (
    mode.value !== 'intro'
    || introOrigin !== 'fresh-top-entry'
    || entryFromTopActive
    || !wouldReachTopEntryGate(deltaY)
  ) return false

  const activationScroll = getTopEntryActivationScroll()
  if (activationScroll === null) return false

  startTopEntrySession()
  scheduleAutomaticExpansion()
  return true
}

const shouldCaptureScroll = (nextDirection: PlaybackDirection, deltaY = 0) => {
  if (nextDirection === -1 && canExitToPreviousSection()) return false
  if (exitSide === 'bottom') return false

  if (
    mode.value === 'expanding'
    || mode.value === 'interactive'
    || mode.value === 'outro'
    || mode.value === 'collapsing'
  ) return true

  if (mode.value !== 'intro' || nextDirection === -1) return false
  if (introOrigin === 'returned-from-video') return isProcessInViewport()
  return entryFromTopActive || wouldReachTopEntryGate(deltaY)
}

const canExitToPreviousSection = () => (
  mode.value === 'intro'
  && transitionProgress <= EDGE_EPSILON
  && isAtStart()
  && !collapseAnimationActive
)

const canExitToWork = () => mode.value === 'outro' && isAtEnd() && !outroReverseInProgress

const returnFromOutroToInteractiveReverse = () => {
  if (mode.value !== 'outro' || !isAtEnd()) return false
  restoreProcessAnchor()
  reverseOutro()
  return true
}

const releaseToWork = () => {
  if (!canExitToWork()) return false

  outroTimeline?.progress(1, true)
  exitSide = 'bottom'
  entryFromTopActive = false
  resetInputGuards()
  updateDiagnostics(1)
  return true
}

const getProcessWorkBoundaryScroll = () => {
  if (!processEndSentinel.value) return null
  return window.scrollY + processEndSentinel.value.getBoundingClientRect().top
}

const wouldEnterProcessFromWork = (deltaY: number) => {
  if (exitSide !== 'bottom' || deltaY >= 0) return false

  const lowerBoundary = getProcessWorkBoundaryScroll()
  if (lowerBoundary === null) return false

  const currentScroll = window.scrollY
  const isInsideWork = currentScroll >= lowerBoundary - PROCESS_WORK_BOUNDARY_EPSILON
  const crossesIntoProcess = currentScroll + deltaY < lowerBoundary
  return isInsideWork && crossesIntoProcess
}

const enterProcessFromWork = () => {
  if (exitSide !== 'bottom' || destroyed) return false

  const metrics = getTransitionMetrics()
  if (!metrics) return false
  cacheProcessAnchor(metrics)

  window.scrollTo({ top: metrics.start, behavior: 'auto' })
  applyTransitionProgress(1)
  masterPlayhead = DURATION_SECONDS
  direction = -1
  autoExpansionAvailable = false
  entryFromTopActive = false
  collapseAnimationActive = false
  requestFrame(TOTAL_FRAMES - 1)
  textTimeline?.progress(1, true)
  enterInteractive(-1)

  if (outroTimeline) {
    outroReverseInProgress = true
    outroTimeline.eventCallback('onReverseComplete', () => {
      outroTimeline?.eventCallback('onReverseComplete', null)
      outroReverseInProgress = false
      updateDiagnostics()
    })
    outroTimeline.timeScale(1.08).reverse()
  }

  updateDiagnostics(1)
  return true
}

const restartFromReturnedIntro = () => {
  if (mode.value !== 'intro' || introOrigin !== 'returned-from-video') return false
  startTopEntrySession()
  scheduleAutomaticExpansion()
  return true
}

const normalizeWheelDelta = (event: WheelEvent) => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight
  return event.deltaY
}

const scheduleWheelAccumulatorReset = () => {
  if (wheelResetHandle !== null) globalThis.clearTimeout(wheelResetHandle)
  wheelResetHandle = globalThis.setTimeout(() => {
    wheelAccumulator = 0
  }, 120)
}

const handleWheel = (event: WheelEvent) => {
  if (reducedMotion.value) return
  const deltaY = normalizeWheelDelta(event)
  if (deltaY === 0) return
  const inputDirection: PlaybackDirection = deltaY > 0 ? 1 : -1

  if (
    inputDirection === -1
    && mode.value === 'outro'
    && isProcessInViewport()
    && returnFromOutroToInteractiveReverse()
  ) {
    event.preventDefault()
    return
  }

  if (inputDirection === -1 && wouldEnterProcessFromWork(deltaY)) {
    event.preventDefault()
    enterProcessFromWork()
    return
  }

  if (
    inputDirection === 1
    && mode.value === 'intro'
    && introOrigin === 'returned-from-video'
  ) restartFromReturnedIntro()

  if (inputDirection === 1) activateFreshTopEntryGate(deltaY)
  if (!shouldCaptureScroll(inputDirection, deltaY)) return

  if (
    mode.value === 'intro'
    || mode.value === 'expanding'
    || mode.value === 'collapsing'
    || outroReverseInProgress
  ) {
    event.preventDefault()
    return
  }

  wheelAccumulator += deltaY
  scheduleWheelAccumulatorReset()

  if (Math.abs(wheelAccumulator) < WHEEL_DIRECTION_THRESHOLD) {
    event.preventDefault()
    return
  }

  const nextDirection: PlaybackDirection = wheelAccumulator > 0 ? 1 : -1
  wheelAccumulator = 0

  if (mode.value === 'outro') {
    if (nextDirection === 1 && releaseToWork()) return
    event.preventDefault()
    reverseOutro()
    return
  }

  if (nextDirection === 1 && isAtEnd()) {
    event.preventDefault()
    enterOutro()
    return
  }

  if (nextDirection === -1 && isAtStart()) {
    event.preventDefault()
    startCollapseToIntro()
    return
  }

  event.preventDefault()
  direction = nextDirection
  updateDiagnostics()
}

const handleTouchStart = (event: TouchEvent) => {
  if (reducedMotion.value) return
  const touchY = event.touches[0]?.clientY ?? null
  touchStartY = touchY
  touchLastY = touchY
  touchDirectionCommitted = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (reducedMotion.value || touchStartY === null || touchLastY === null) return
  const currentY = event.touches[0]?.clientY
  if (currentY === undefined) return

  const stepDeltaY = touchLastY - currentY
  const totalDeltaY = touchStartY - currentY
  touchLastY = currentY
  if (stepDeltaY === 0) return
  const stepDirection: PlaybackDirection = stepDeltaY > 0 ? 1 : -1

  if (
    stepDirection === -1
    && mode.value === 'outro'
    && isProcessInViewport()
    && returnFromOutroToInteractiveReverse()
  ) {
    event.preventDefault()
    return
  }

  if (stepDirection === -1 && wouldEnterProcessFromWork(stepDeltaY)) {
    event.preventDefault()
    enterProcessFromWork()
    return
  }

  if (
    stepDirection === 1
    && mode.value === 'intro'
    && introOrigin === 'returned-from-video'
  ) restartFromReturnedIntro()

  if (stepDirection === 1) activateFreshTopEntryGate(stepDeltaY)
  if (!shouldCaptureScroll(stepDirection, stepDeltaY)) return

  if (
    mode.value === 'intro'
    || mode.value === 'expanding'
    || mode.value === 'collapsing'
    || outroReverseInProgress
  ) {
    event.preventDefault()
    return
  }

  if (totalDeltaY === 0) return

  const nextDirection: PlaybackDirection = totalDeltaY > 0 ? 1 : -1

  if (mode.value === 'outro') {
    if (Math.abs(totalDeltaY) < TOUCH_DIRECTION_THRESHOLD) {
      event.preventDefault()
      return
    }

    if (nextDirection === 1 && releaseToWork()) return
    event.preventDefault()
    reverseOutro()
    return
  }

  if (nextDirection === 1 && isAtEnd()) {
    event.preventDefault()
    if (Math.abs(totalDeltaY) >= TOUCH_DIRECTION_THRESHOLD) {
      stopTicker()
      enterOutro()
    }
    return
  }

  event.preventDefault()

  if (nextDirection === -1 && isAtStart()) {
    if (Math.abs(totalDeltaY) >= TOUCH_DIRECTION_THRESHOLD) {
      startCollapseToIntro()
      touchStartY = currentY
    }
    return
  }

  if (!touchDirectionCommitted && Math.abs(totalDeltaY) >= TOUCH_DIRECTION_THRESHOLD) {
    touchDirectionCommitted = true
    direction = nextDirection
    updateDiagnostics()
  }
}

const handleTouchEnd = () => {
  touchStartY = null
  touchLastY = null
  touchDirectionCommitted = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (reducedMotion.value) return
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select, button, a[href], [contenteditable="true"]')) return

  const isSpace = event.key === ' '
  const isDown = event.key === 'ArrowDown'
    || event.key === 'PageDown'
    || event.key === 'End'
    || (isSpace && !event.shiftKey)
  const isUp = event.key === 'ArrowUp'
    || event.key === 'PageUp'
    || event.key === 'Home'
    || (isSpace && event.shiftKey)
  if (!isDown && !isUp) return

  const nextDirection: PlaybackDirection = isDown ? 1 : -1
  const keyboardDelta = nextDirection * window.innerHeight

  if (
    nextDirection === -1
    && mode.value === 'outro'
    && isProcessInViewport()
    && returnFromOutroToInteractiveReverse()
  ) {
    event.preventDefault()
    return
  }

  if (nextDirection === -1 && wouldEnterProcessFromWork(keyboardDelta)) {
    event.preventDefault()
    enterProcessFromWork()
    return
  }

  if (
    nextDirection === 1
    && mode.value === 'intro'
    && introOrigin === 'returned-from-video'
  ) restartFromReturnedIntro()

  if (nextDirection === 1) activateFreshTopEntryGate(keyboardDelta)
  if (!shouldCaptureScroll(nextDirection, keyboardDelta)) return

  if (mode.value === 'outro' && nextDirection === 1 && releaseToWork()) return

  event.preventDefault()
  if (
    mode.value === 'intro'
    || mode.value === 'expanding'
    || mode.value === 'collapsing'
    || outroReverseInProgress
  ) return

  if (mode.value === 'outro') {
    reverseOutro()
    return
  }

  if (nextDirection === 1 && isAtEnd()) {
    enterOutro()
    return
  }

  if (nextDirection === -1 && isAtStart()) {
    startCollapseToIntro()
    return
  }

  direction = nextDirection
  updateDiagnostics()
}

const handlePageScroll = () => {
  if (reducedMotion.value) return

  const previousScrollY = lastScrollY
  const currentScrollY = window.scrollY
  const scrollDelta = currentScrollY - previousScrollY
  lastScrollY = currentScrollY

  const topGateKeepsFullscreen = !canExitToPreviousSection()
    && (mode.value === 'interactive' || mode.value === 'outro')
    && processAnchorY !== null
    && currentScrollY < processAnchorY - 2

  if (topGateKeepsFullscreen) {
    restoreProcessAnchor()
    if (mode.value === 'outro' && scrollDelta < 0) returnFromOutroToInteractiveReverse()
    return
  }

  if (exitSide === 'bottom' && processEndSentinel.value) {
    const lowerBoundary = getProcessWorkBoundaryScroll()
    const crossedIntoProcess = lowerBoundary !== null
      && previousScrollY >= lowerBoundary - PROCESS_WORK_BOUNDARY_EPSILON
      && currentScrollY < lowerBoundary - PROCESS_WORK_BOUNDARY_EPSILON

    if (scrollDelta < 0 && crossedIntoProcess) enterProcessFromWork()
    return
  }

  if (processAnchorY !== null && window.scrollY > processAnchorY + 2) {
    window.scrollTo({ top: processAnchorY, behavior: 'auto' })
    lastScrollY = processAnchorY
  }
}

const handleViewportResize = () => {
  if (resizeHandle !== null) globalThis.clearTimeout(resizeHandle)
  resizeHandle = globalThis.setTimeout(rebuildTransitionTimeline, 140)
}

onMounted(async () => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!process.value || !stage.value || !visual.value || !canvas.value) return

  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(canvas.value)
  resizeCanvas()

  masterPlayhead = 0
  requestedFrame = 0
  await loadFrame(0)
  if (destroyed) return
  resizeCanvas()
  renderedFrame = -1
  drawFrame(0)

  if (!reducedMotion.value) {
    messageElements = gsap.utils.toArray<HTMLElement>('.process__message', process.value)
    createTextTimeline()
    createTransitionTimeline()
    createOutroTimeline()
    applyTransitionProgress(0)
    cacheProcessAnchor()
    updateExperience()
    INITIAL_FRAMES.slice(1).forEach(index => void loadFrame(index))
    scheduleProgressivePreload()

    lastScrollY = window.scrollY
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('scroll', handlePageScroll, { passive: true })
    window.addEventListener('resize', handleViewportResize, { passive: true })

    intersectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return

      if (entry.intersectionRatio < 0.2) {
        cancelExpansionDelay()
        entryFromTopActive = false

        const exitedTowardsPreviousSection = entry.boundingClientRect.top > 0
        if (mode.value === 'intro' && exitedTowardsPreviousSection) resetForEntryFromTop()
      }

      if (!entry.isIntersecting) stopTicker()
      else if (mode.value === 'interactive') startTicker()

      if (
        entry.intersectionRatio >= AUTO_EXPANSION_THRESHOLD
        && mode.value === 'intro'
        && introOrigin === 'fresh-top-entry'
      ) {
        if (!entryFromTopActive) startTopEntrySession()
        scheduleAutomaticExpansion()
      }
    }, { threshold: [0, 0.2, AUTO_EXPANSION_THRESHOLD] })
    intersectionObserver.observe(stage.value)
  }
})

onBeforeUnmount(() => {
  destroyed = true
  stopTicker()
  cancelExpansionDelay()
  expansionTimeline?.kill()
  transitionTimeline?.kill()
  textTimeline?.kill()
  outroTimeline?.kill()
  restoreScrollBehavior()
  intersectionObserver?.disconnect()
  resizeObserver?.disconnect()
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('touchcancel', handleTouchEnd)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handlePageScroll)
  window.removeEventListener('resize', handleViewportResize)
  if (idleHandle !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle)
  if (preloadTimeoutHandle !== null) globalThis.clearTimeout(preloadTimeoutHandle)
  if (wheelResetHandle !== null) globalThis.clearTimeout(wheelResetHandle)
  if (resizeHandle !== null) globalThis.clearTimeout(resizeHandle)
  frameImages.fill(null)
  framePromises.fill(null)
})

  return {
    TOTAL_FRAMES,
    SOURCE_FPS,
    DURATION_SECONDS,
    PLAYBACK_SPEED,
    WHEEL_DIRECTION_THRESHOLD,
    TOUCH_DIRECTION_THRESHOLD,
    EDGE_EPSILON,
    PROCESS_WORK_BOUNDARY_EPSILON,
    AUTO_EXPANSION_THRESHOLD,
    AUTO_EXPANSION_DELAY,
    AUTO_EXPANSION_DURATION,
    OUTRO_FADE_DURATION,
    INITIAL_FRAMES,
    messages,
    messageMotions,
    process,
    processEndSentinel,
    stage,
    visual,
    canvas,
    introCopy,
    backdrop,
    overlay,
    shade,
    messagesContainer,
    outro,
    outroText,
    mode,
    reducedMotion,
    frameStatuses,
    frameImages,
    framePromises,
    resizeObserver,
    intersectionObserver,
    idleHandle,
    preloadTimeoutHandle,
    wheelResetHandle,
    resizeHandle,
    introDelayHandle,
    transitionTimeline,
    expansionTimeline,
    textTimeline,
    outroTimeline,
    messageElements,
    requestedFrame,
    renderedFrame,
    masterPlayhead,
    transitionProgress,
    direction,
    wheelAccumulator,
    touchStartY,
    touchLastY,
    touchDirectionCommitted,
    lastScrollY,
    tickerRunning,
    autoExpansionAvailable,
    exitSide,
    introOrigin,
    entryFromTopActive,
    outroReverseInProgress,
    collapseAnimationActive,
    processAnchorY,
    previousScrollBehavior,
    scrollBehaviorOverridden,
    destroyed,
    frameUrl,
    clampFrame,
    clamp,
    isAtStart,
    isAtEnd,
    getTransitionMetrics,
    cacheProcessAnchor,
    restoreProcessAnchor,
    getTopEntryActivationScroll,
    isProcessInViewport,
    wouldReachTopEntryGate,
    setMode,
    drawCoverImage,
    drawFrame,
    findNearestLoadedFrame,
    loadFrame,
    requestFrame,
    resizeCanvas,
    createTransitionTimeline,
    rebuildTransitionTimeline,
    createOutroTimeline,
    createTextTimeline,
    updateDiagnostics,
    applyTransitionProgress,
    updateExperience,
    progressiveFrames,
    progressiveIndex,
    scheduleProgressivePreload,
    updateMasterPlayhead,
    startTicker,
    stopTicker,
    restoreScrollBehavior,
    cancelExpansionDelay,
    resetInputGuards,
    startTopEntrySession,
    resetForEntryFromTop,
    startAutomaticExpansion,
    scheduleAutomaticExpansion,
    startCollapseToIntro,
    enterInteractive,
    enterOutro,
    reverseOutro,
    finishCollapse,
    activateFreshTopEntryGate,
    shouldCaptureScroll,
    canExitToPreviousSection,
    canExitToWork,
    returnFromOutroToInteractiveReverse,
    releaseToWork,
    getProcessWorkBoundaryScroll,
    wouldEnterProcessFromWork,
    enterProcessFromWork,
    restartFromReturnedIntro,
    normalizeWheelDelta,
    scheduleWheelAccumulatorReset,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeydown,
    handlePageScroll,
    handleViewportResize
  }
})()

// ============================================================================
// WORK
// ============================================================================

const {
  projects: workProjects,
  work: workWork,
  world: workWorld,
  reducedMotion: workReducedMotion,
  SCROLL_RATIO: workSCROLL_RATIO,
  SCRUB: workSCRUB,
  animationContext: workAnimationContext,
  resizeObserver: workResizeObserver,
  horizontalDistance: workHorizontalDistance,
  verticalTravel: workVerticalTravel,
  viewportWidth: workViewportWidth,
  viewportHeight: workViewportHeight,
  measureWorld: workMeasureWorld,
  refreshMeasurements: workRefreshMeasurements
} = (() => {
const projects = [
  { id: 'rental', name: 'QUALITY RENTAL CAR', category: 'Movilidad' },
  { id: 'passos', name: 'DR. IVÁN DARÍO PASSOS', category: 'Salud' },
  { id: 'depilas', name: 'DEPILAS BY NATHALIA FIGUEROA', category: 'Belleza' },
  { id: 'nova', name: 'NOVA PERSIANAS', category: 'Hogar' },
] as const

const work = ref<HTMLElement | null>(null)
const world = ref<HTMLElement | null>(null)
const reducedMotion = ref(false)
const SCROLL_RATIO = 0.72
const SCRUB = 0.5

let animationContext: gsap.Context | undefined
let resizeObserver: ResizeObserver | undefined
let horizontalDistance = 0
let verticalTravel = 0
let viewportWidth = 0
let viewportHeight = 0

const measureWorld = () => {
  if (!work.value || !world.value || reducedMotion.value) return
  horizontalDistance = Math.max(0, world.value.scrollWidth - window.innerWidth)
  verticalTravel = Math.ceil(horizontalDistance * SCROLL_RATIO)
  work.value.style.height = `${window.innerHeight + verticalTravel}px`
  work.value.dataset.worldWidth = String(world.value.scrollWidth)
  work.value.dataset.horizontalDistance = String(horizontalDistance)
  work.value.dataset.verticalTravel = String(verticalTravel)
  work.value.dataset.sectionHeight = String(window.innerHeight + verticalTravel)
}

const refreshMeasurements = () => {
  if (window.innerWidth === viewportWidth && window.innerHeight === viewportHeight) return
  viewportWidth = window.innerWidth
  viewportHeight = window.innerHeight
  measureWorld()
  ScrollTrigger.refresh()
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion.value) return

  await nextTick()
  await document.fonts?.ready

  viewportWidth = window.innerWidth
  viewportHeight = window.innerHeight
  measureWorld()

  const root = work.value
  const canvas = world.value
  if (!root || !canvas) return

  animationContext = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${verticalTravel}`,
        scrub: SCRUB,
        invalidateOnRefresh: true,
        onLeave: (trigger) => {
          trigger.animation?.progress(1)
          gsap.set(canvas, { x: -horizontalDistance })
        },
        onEnterBack: (trigger) => {
          trigger.animation?.progress(1)
          gsap.set(canvas, { x: -horizontalDistance })
        },
      },
    })

    timeline.to(canvas, { x: () => -horizontalDistance, duration: 1 }, 0)

    gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((element) => {
      const depth = Number(element.dataset.depth ?? 1)
      timeline.to(element, { x: () => horizontalDistance * (1 - depth), duration: 1 }, 0)
    })

    gsap.utils.toArray<HTMLElement>('.project-cluster__art').forEach((art, index) => {
      timeline.to(art, { xPercent: index % 2 === 0 ? 4 : -4, duration: 1 }, 0)
    })

  }, root)

  resizeObserver = new ResizeObserver(refreshMeasurements)
  resizeObserver.observe(canvas)
  window.addEventListener('resize', refreshMeasurements, { passive: true })
  requestAnimationFrame(() => ScrollTrigger.refresh())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshMeasurements)
  resizeObserver?.disconnect()
  animationContext?.revert()
})

  return {
    projects,
    work,
    world,
    reducedMotion,
    SCROLL_RATIO,
    SCRUB,
    animationContext,
    resizeObserver,
    horizontalDistance,
    verticalTravel,
    viewportWidth,
    viewportHeight,
    measureWorld,
    refreshMeasurements
  }
})()

// ============================================================================
// TEAM
// ============================================================================

const {
  section: teamSection,
  animationContext: teamAnimationContext
} = (() => {
const section = ref<HTMLElement | null>(null)
let animationContext: gsap.Context | undefined

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !section.value) return

  animationContext = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
        invalidateOnRefresh: true,
        onLeave: (trigger) => trigger.animation?.progress(1),
        onEnterBack: (trigger) => trigger.animation?.progress(1),
      },
    })

    timeline
      .fromTo('.team__portrait', { autoAlpha: 0, y: 60, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, ease: 'power3.out', immediateRender: false }, 0)
      .fromTo('.team__logo', { autoAlpha: 0, y: 40, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, 0.22)
      .to('.team__portrait', { yPercent: -2.5, duration: 0.28, ease: 'none' }, 0.72)
      .to('.team__logo', { yPercent: -4, duration: 0.28, ease: 'none' }, 0.72)
  }, section.value)
})

onBeforeUnmount(() => animationContext?.revert())

  return {
    section,
    animationContext
  }
})()

// ============================================================================
// PLANS
// ============================================================================

const {
  plans: plansPlans,
  plansSection: plansPlansSection,
  prefersReducedMotion: plansPrefersReducedMotion,
  animationContext: plansAnimationContext,
  animateCta: plansAnimateCta
} = (() => {
interface PlanGroup {
  title?: string
  items: string[]
}

interface Plan {
  number: string
  eyebrow: string
  name: string
  description: string
  price: string
  unit: string
  cta: string
  featured?: boolean
  groups: PlanGroup[]
}

// Los planes viven como datos para que una sola plantilla mantenga consistente su estructura y responsive.
const plans: Plan[] = [
  {
    number: '01',
    eyebrow: 'PARA EMPEZAR',
    name: 'ESENCIAL',
    description: 'Todo lo que necesitas para comenzar a construir tu presencia digital.',
    price: '$350.000',
    unit: 'COP / mes',
    cta: 'ELEGIR ESENCIAL',
    groups: [{
      items: [
        '2 Reels mensuales',
        '6 diseños gráficos',
        '10 historias mensuales',
        'Programación de publicaciones',
        'Administración básica de redes: Facebook e Instagram',
        'Hashtags estratégicos',
      ],
    }],
  },
  {
    number: '02',
    eyebrow: 'MÁS CONTENIDO, MÁS RESULTADOS',
    name: 'BÁSICO',
    description: 'Una presencia digital activa, ordenada y constante para impulsar tu negocio en redes sociales.',
    price: '$590.000',
    unit: 'COP / mes',
    cta: 'ELEGIR BÁSICO',
    groups: [{
      items: [
        '4 Reels mensuales',
        '8 diseños gráficos',
        '12 historias mensuales',
        'Calendario de contenido básico',
        'Programación de publicaciones',
        'Administración básica de redes',
        'Diseño de copies para publicaciones',
        'Hashtags estratégicos',
        'Informe mensual básico de resultados',
      ],
    }],
  },
  {
    number: '03',
    eyebrow: 'MÁS ALCANCE, MÁS OPORTUNIDADES, MÁS VENTAS',
    name: 'PRO',
    description: 'Una solución de marketing digital para acelerar tu crecimiento.',
    price: '$950.000',
    unit: 'COP / mes',
    cta: 'ELEGIR PRO',
    featured: true,
    groups: [{
      items: [
        '6 Reels mensuales',
        '10 diseños gráficos',
        '15 historias mensuales',
        'Calendario de contenido básico',
        'Programación de publicaciones',
        'Administración completa de Instagram, Facebook y TikTok',
        'Configuración completa de campañas',
        'Diseño de copies para publicaciones',
        'Hashtags estratégicos',
        'Informe mensual de resultados',
        'Informe de métricas',
      ],
    }],
  },
  {
    number: '04',
    eyebrow: 'ESTRATEGIA DIGITAL INTEGRAL',
    name: 'PREMIUM',
    description: 'Una estrategia completa para posicionar y hacer crecer tu marca.',
    price: '$1.450.000',
    unit: 'COP / mes',
    cta: 'ELEGIR PREMIUM',
    groups: [
      {
        title: 'CREACIÓN DE CONTENIDO',
        items: [
          '8 Reels estratégicos mensuales',
          '12 diseños gráficos profesionales',
          '20 historias mensuales con enfoque en interacción',
          'Diseño de contenido alineado con la identidad de marca',
        ],
      },
      {
        title: 'GESTIÓN DE REDES SOCIALES',
        items: [
          'Calendario de contenido mensual',
          'Programación y publicación de contenidos',
          'Administración integral de Instagram, Facebook y TikTok',
          'Gestión y optimización de perfiles digitales',
        ],
      },
      {
        title: 'ESTRATEGIA Y CRECIMIENTO DIGITAL',
        items: [
          'Estrategia digital personalizada según objetivos del negocio',
          'Campañas publicitarias en Meta Ads y Google Ads',
          'Administración y optimización de Google Business Profile',
          'Automatización y gestión inteligente de redes sociales',
        ],
      },
      {
        title: 'MEDICIÓN Y POSICIONAMIENTO',
        items: [
          'Analítica digital y reportes de resultados',
          'Branding e identidad corporativa',
          'Recomendaciones estratégicas para mejorar la presencia online',
        ],
      },
    ],
  },
]

const plansSection = ref<HTMLElement | null>(null)
const prefersReducedMotion = ref(false)
let animationContext: gsap.Context | undefined

const animateCta = (event: MouseEvent | FocusEvent, active: boolean) => {
  if (prefersReducedMotion.value) return

  const link = event.currentTarget as HTMLElement
  const arrow = link.querySelector('.plan__cta-arrow')
  const line = link.querySelector('.plan__cta-line')

  // La información no cambia en hover; GSAP solo confirma que el CTA es interactivo.
  gsap.to(link, { x: active ? 4 : 0, duration: 0.3, ease: 'power2.out' })
  gsap.to(arrow, { x: active ? 4 : 0, y: active ? -3 : 0, duration: 0.3, ease: 'power2.out' })
  gsap.to(line, { scaleX: active ? 0.7 : 1, duration: 0.35, ease: 'power2.out' })
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) return
  const root = plansSection.value
  if (!root) return

  animationContext = gsap.context(() => {
    // ScrollTrigger inicia una timeline breve cuando la cabecera de planes entra en viewport.
    gsap.timeline({
      scrollTrigger: {
        trigger: '.plans__header',
        start: 'top 82%',
        once: true,
      },
    })
      .from('.plans__eyebrow', { opacity: 0, y: 12, duration: 0.4 })
      .from('.plans__title-text', {
        yPercent: 110,
        duration: 0.85,
        ease: 'power4.out',
        stagger: 0.1,
      }, '-=0.18')
      .from('.plans__intro', { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out' }, '-=0.35')

    // stagger reparte el inicio de los planes; PRO suma un scale mínimo mediante un valor dinámico.
    gsap.from('.plan', {
      opacity: 0,
      y: 42,
      scale: (_, target: HTMLElement) => target.classList.contains('plan--featured') ? 0.98 : 1,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.plans__grid',
        start: 'top 84%',
        once: true,
      },
    })
  }, root)
})

onBeforeUnmount(() => {
  animationContext?.revert()
})

  return {
    plans,
    plansSection,
    prefersReducedMotion,
    animationContext,
    animateCta
  }
})()

// ============================================================================
// FINAL CTA
// ============================================================================

const {
  finalSection: finalCtaFinalSection,
  cta: finalCtaCta,
  prefersReducedMotion: finalCtaPrefersReducedMotion,
  animationContext: finalCtaAnimationContext,
  ctaX: finalCtaCtaX,
  ctaY: finalCtaCtaY,
  arrowX: finalCtaArrowX,
  arrowY: finalCtaArrowY,
  animateCta: finalCtaAnimateCta,
  handleCtaMove: finalCtaHandleCtaMove,
  resetMagneticCta: finalCtaResetMagneticCta
} = (() => {
const finalSection = ref<HTMLElement | null>(null)
const cta = ref<HTMLAnchorElement | null>(null)
const prefersReducedMotion = ref(false)
let animationContext: gsap.Context | undefined
let ctaX: ReturnType<typeof gsap.quickTo> | undefined
let ctaY: ReturnType<typeof gsap.quickTo> | undefined
let arrowX: ReturnType<typeof gsap.quickTo> | undefined
let arrowY: ReturnType<typeof gsap.quickTo> | undefined

const animateCta = (active: boolean) => {
  if (prefersReducedMotion.value || !cta.value) return

  const arrow = cta.value.querySelector('.final-cta__arrow')
  const line = cta.value.querySelector('.final-cta__line')

  // Foco y hover conservan una respuesta clara incluso sin mover el mouse dentro del enlace.
  arrowX?.(active ? 3 : 0)
  arrowY?.(active ? -3 : 0)
  gsap.to(line, { scaleX: active ? 0.72 : 1, duration: 0.35, ease: 'power2.out' })
}

const handleCtaMove = (event: MouseEvent) => {
  if (prefersReducedMotion.value || !cta.value) return

  const bounds = cta.value.getBoundingClientRect()
  const normalizedX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2)
  const normalizedY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2)

  // El contenedor se acerca unos píxeles al mouse y la flecha recorre un plano ligeramente mayor.
  ctaX?.(normalizedX * 7)
  ctaY?.(normalizedY * 5)
  arrowX?.(normalizedX * 10)
  arrowY?.(normalizedY * 8)
}

const resetMagneticCta = () => {
  ctaX?.(0)
  ctaY?.(0)
  arrowX?.(0)
  arrowY?.(0)
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) return
  const root = finalSection.value
  if (!root) return

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cta.value) {
    const arrow = cta.value.querySelector('.final-cta__arrow')
    // quickTo aporta el retraso magnético actualizando destinos sin reiniciar cuatro tweens por movimiento.
    ctaX = gsap.quickTo(cta.value, 'x', { duration: 0.45, ease: 'power3.out' })
    ctaY = gsap.quickTo(cta.value, 'y', { duration: 0.45, ease: 'power3.out' })
    arrowX = gsap.quickTo(arrow, 'x', { duration: 0.35, ease: 'power3.out' })
    arrowY = gsap.quickTo(arrow, 'y', { duration: 0.35, ease: 'power3.out' })
  }

  animationContext = gsap.context(() => {
    // Esta timeline comienza cuando el CTA entra en viewport y coordina reveal, texto y enlace.
    gsap.timeline({
      scrollTrigger: {
        trigger: '.final-cta__content',
        start: 'top 78%',
        once: true,
      },
    })
      .from('.final-cta__title-text', {
        yPercent: 110,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.12,
      })
      .from('.final-cta__text', {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power2.out',
      }, '-=0.45')
      .from('.final-cta__link', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.32')
  }, root)
})

onBeforeUnmount(() => {
  gsap.killTweensOf([cta.value, cta.value?.querySelector('.final-cta__arrow')])
  animationContext?.revert()
})

  return {
    finalSection,
    cta,
    prefersReducedMotion,
    animationContext,
    ctaX,
    ctaY,
    arrowX,
    arrowY,
    animateCta,
    handleCtaMove,
    resetMagneticCta
  }
})()
</script>

<template>
  <UiCustomCursor />
  <main>
    <!-- HERO -->
    <section id="inicio" ref="heroHero" class="hero" aria-labelledby="hero-title">
        <video
          ref="heroHeroVideo"
          class="hero__video"
          src="/Videos/Hero1.mp4"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
          tabindex="-1"
        />
    
        <header class="navbar">
          <NuxtLink class="navbar__brand" to="/" aria-label="Neo Redes, inicio">
            NEO REDES
          </NuxtLink>
    
          <button
            ref="heroMenuButton"
            class="navbar__menu"
            type="button"
            aria-controls="main-menu"
            :aria-expanded="heroIsMenuOpen"
            aria-label="Abrir menú"
            @click="heroOpenMenu"
          >
            MENÚ
          </button>
        </header>
    
        <div ref="heroHeroOrb" class="hero__orb" aria-hidden="true"><span /></div>
        <Hero3DScene />
    
        <div class="hero__content">
          <h1 id="hero-title" class="hero__title">
            <span class="hero__title-line"><span class="hero__title-text">HACEMOS QUE</span></span>
            <span class="hero__title-line"><span class="hero__title-text">TU MARCA</span></span>
            <span class="hero__title-line"><span class="hero__title-text">SE MUEVA.</span></span>
          </h1>
    
          <div class="hero__aside">
            <p class="hero__intro">
              Estrategia, contenido y creatividad para marcas que quieren crecer.
            </p>
    
            <a class="hero__cta" href="#trabajo">
              VER NUESTRO TRABAJO <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
    
        <p class="hero__index" aria-hidden="true">01 — 06</p>
    
        <div
          id="main-menu"
          v-show="heroIsMenuOpen"
          ref="heroMenuPanel"
          class="menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación principal"
        >
          <header class="menu-overlay__header">
            <a href="#inicio" @click.prevent="heroCloseMenu('inicio')">NEO REDES</a>
            <button ref="heroCloseButton" type="button" @click="heroCloseMenu()">CERRAR</button>
          </header>
    
          <nav aria-label="Secciones de la página">
            <ul class="menu-overlay__list">
              <li v-for="item in heroMenuItems" :key="item[0]" class="menu-overlay__link-mask">
                <a class="menu-overlay__link" :href="`#${item[2]}`" @click.prevent="heroCloseMenu(item[2])">
                  <span>{{ item[0] }}</span>
                  <span>{{ item[1] }}</span>
                </a>
              </li>
            </ul>
          </nav>
    
          <div class="menu-overlay__footer">
            <span>MARKETING DIGITAL</span>
            <span>© 2026</span>
          </div>
        </div>
      </section>

    <!-- MANIFESTO -->
    <div class="manifesto-shell">
      <section
          id="manifiesto"
          ref="manifestoManifesto"
          class="manifesto"
          :class="{ 'manifesto--reduced': manifestoReducedMotion }"
          aria-labelledby="manifesto-title"
        >
          <div class="manifesto__stage">
            <canvas ref="manifestoCanvas" class="manifesto__canvas" aria-hidden="true" />
            <div class="manifesto__overlay" aria-hidden="true" />
            <div class="manifesto__shade manifesto__shade--left" aria-hidden="true" />
            <div class="manifesto__shade manifesto__shade--right" aria-hidden="true" />
            <div class="manifesto__shade manifesto__shade--full" aria-hidden="true" />
      
            <div class="manifesto__scene manifesto__scene--one">
              <p class="manifesto__eyebrow">NUESTRA FORMA DE HACER</p>
              <h2 id="manifesto-title" class="manifesto__title">
                <span class="manifesto__line"><span class="manifesto__line-text">NO HACEMOS</span></span>
                <span class="manifesto__line manifesto__line--accent"><span class="manifesto__line-text">CONTENIDO</span></span>
                <span class="manifesto__line"><span class="manifesto__line-text">POR HACER.</span></span>
              </h2>
            </div>
      
            <div class="manifesto__scene manifesto__scene--two">
              <p>Creamos ideas que hacen que las marcas se muevan.</p>
            </div>
      
            <div class="manifesto__scene manifesto__scene--three" aria-label="Estrategia antes que ruido.">
              <p class="manifesto__statement" aria-hidden="true">
                <span class="manifesto__line"><span class="manifesto__line-text">ESTRATEGIA</span></span>
                <span class="manifesto__line"><span class="manifesto__line-text">ANTES QUE</span></span>
                <span class="manifesto__line"><span class="manifesto__line-text">RUIDO<em>.</em></span></span>
              </p>
            </div>
          </div>
        </section>
    </div>

    <!-- MARQUEE -->
    <section
        ref="marqueeMarquee"
        class="marquee"
        aria-label="Ideas, estrategia, contenido y resultados. Creamos, movemos, medimos y crecemos."
      >
        <p class="marquee__line marquee__line--forward" aria-hidden="true">
          IDEAS — ESTRATEGIA — CONTENIDO — RESULTADOS — IDEAS — ESTRATEGIA — CONTENIDO — RESULTADOS —
        </p>
        <p class="marquee__line marquee__line--backward" aria-hidden="true">
          CREAMOS — MOVEMOS — MEDIMOS — CRECEMOS — CREAMOS — MOVEMOS — MEDIMOS — CRECEMOS —
        </p>
      </section>

    <!-- SERVICES -->
    <section id="servicios" ref="servicesSection" class="services" aria-labelledby="services-title">
        <header class="services__header">
          <p class="services__eyebrow">SERVICIOS — 06</p>
          <h2 id="services-title">LO QUE HACEMOS</h2>
          <p>Todo lo que tu marca necesita para crecer.</p>
        </header>
    
        <ol class="services__list">
          <li
            v-for="service in servicesServices"
            :key="service.id"
            class="service"
            :data-service-id="service.id"
          >
            <div class="service__content">
              <h3 class="service__name">{{ service.name }}</h3>
              <!-- La descripción siempre es visible: el hover mejora el énfasis, pero no bloquea contenido en táctil. -->
              <p class="service__description">{{ service.description }}</p>
            </div>
            <span class="service__rule" aria-hidden="true" />
          </li>
        </ol>
    
        <div
          v-show="servicesActiveService"
          ref="servicesPreview"
          class="service-preview"
          aria-hidden="true"
        >
          <img
            v-if="servicesActiveService"
            :key="servicesActiveService.image"
            :src="servicesActiveService.image"
            alt=""
          >
        </div>
      </section>

    <!-- PROCESS -->
    <section
        id="proceso"
        ref="processProcess"
        class="process"
        :class="[`process--${processMode}`, { 'process--reduced': processReducedMotion }]"
        aria-labelledby="process-title"
      >
        <div ref="processStage" class="process__stage">
          <div ref="processBackdrop" class="process__backdrop" aria-hidden="true" />
    
          <header ref="processIntroCopy" class="process__intro-copy">
            <h2 id="process-title">Una ruta clara para hacer crecer tu negocio.</h2>
            <p>Nos ocupamos de la estrategia y la ejecución para que tú puedas enfocarte en lo que mejor haces.</p>
          </header>
    
          <div ref="processVisual" class="process__visual">
            <canvas ref="processCanvas" class="process__canvas" aria-hidden="true" />
            <div ref="processOverlay" class="process__overlay" aria-hidden="true" />
            <div ref="processShade" class="process__shade" aria-hidden="true" />
    
            <div ref="processMessagesContainer" class="process__messages">
              <article
                v-for="message in processMessages"
                :key="message.id"
                class="process__message"
                :class="`process__message--${message.id}`"
              >
                <div class="process__title-mask">
                  <h3 class="process__message-title">{{ message.title }}</h3>
                </div>
              </article>
            </div>
    
            <div ref="processOutro" class="process__outro">
              <div class="process__outro-mask">
                <p ref="processOutroText" class="process__outro-text">
                  CONTINÚA EXPLORANDO <span class="process__outro-arrow">↓</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div ref="processProcessEndSentinel" class="process__end-sentinel" aria-hidden="true" />
      </section>

    <!-- WORK -->
    <section id="trabajo" ref="workWork" class="work" :class="{ 'work--reduced': workReducedMotion }" data-section="work" aria-labelledby="work-title">
        <div class="work__stage">
          <div ref="workWorld" class="work__world">
            <div class="work__atmosphere work__atmosphere--dark" aria-hidden="true" />
            <div class="work__atmosphere work__atmosphere--cyan" aria-hidden="true" />
    
            <header class="work__intro">
              <h2 id="work-title"><span>PROYECTOS</span><span>SELECCIONADOS</span></h2>
              <span class="work__intro-mark" aria-hidden="true" />
            </header>
    
            <article v-for="project in workProjects" :key="project.id" class="project-cluster" :class="`project-cluster--${project.id}`">
              <div class="project-cluster__media project-cluster__media--main" data-cursor="work" data-depth="1" aria-hidden="true">
                <div class="project-cluster__art" />
              </div>
              <div class="project-cluster__media project-cluster__media--secondary" data-depth="0.94" aria-hidden="true">
                <div class="project-cluster__art" />
              </div>
              <div class="project-cluster__meta" data-depth="1.045">
                <p>{{ project.category }}</p>
                <h3>{{ project.name }}</h3>
              </div>
            </article>
    
            <div class="work__breathing-space" aria-hidden="true"><span /></div>
          </div>
        </div>
      </section>

    <!-- TEAM -->
    <section ref="teamSection" class="team" data-section="team" aria-label="La persona detrás de Neo Redes">
        <div class="team__composition">
          <span class="team__accent" aria-hidden="true" />
          <div class="team__portrait">
            <img
              src="/Logos/David.webp"
              alt="David, la persona detrás de Neo Redes"
              loading="lazy"
              decoding="async"
            >
          </div>
          <div class="team__logo-reveal">
            <img
              class="team__logo"
              src="/Logos/LOGOBLANCO.webp"
              alt="Neo Redes"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>
      </section>

    <!-- PLANS -->
    <section id="planes" ref="plansPlansSection" class="plans" data-section="plans" aria-labelledby="plans-title">
        <header class="plans__header">
          <p class="plans__eyebrow">PLANES FLEXIBLES</p>
          <h2 id="plans-title" class="plans__title">
            <span class="plans__title-line"><span class="plans__title-text">MÁS CONTENIDO.</span></span>
            <span class="plans__title-line"><span class="plans__title-text">MÁS RESULTADOS.</span></span>
          </h2>
          <p class="plans__intro">Elige el plan que mejor se adapta al momento actual de tu negocio.</p>
        </header>
    
        <!-- v-for renderiza la misma estructura para cada plan y evita cuatro bloques difíciles de mantener. -->
        <div class="plans__grid">
          <article
            v-for="plan in plansPlans"
            :key="plan.number"
            class="plan"
            :class="{ 'plan--featured': plan.featured, 'plan--premium': plan.name === 'PREMIUM' }"
          >
            <header class="plan__header">
              <span class="plan__number">{{ plan.number }}</span>
              <p class="plan__eyebrow">{{ plan.eyebrow }}</p>
              <h3>{{ plan.name }}</h3>
              <p class="plan__description">{{ plan.description }}</p>
              <div class="plan__price">
                <strong>{{ plan.price }}</strong>
                <span>{{ plan.unit }}</span>
              </div>
            </header>
    
            <div class="plan__groups">
              <section v-for="group in plan.groups" :key="group.title || plan.name" class="plan__group">
                <h4 v-if="group.title">{{ group.title }}</h4>
                <ul>
                  <li v-for="item in group.items" :key="item">{{ item }}</li>
                </ul>
              </section>
            </div>
    
            <a
              class="plan__cta"
              href="#contacto"
              :aria-label="`${plan.cta}; ir a contacto`"
              @mouseenter="plansAnimateCta($event, true)"
              @mouseleave="plansAnimateCta($event, false)"
              @focus="plansAnimateCta($event, true)"
              @blur="plansAnimateCta($event, false)"
            >
              <span>{{ plan.cta }} <span class="plan__cta-arrow" aria-hidden="true">↗</span></span>
              <span class="plan__cta-line" aria-hidden="true" />
            </a>
          </article>
        </div>
      </section>

    <!-- FINAL CTA -->
    <section id="contacto" ref="finalCtaFinalSection" class="final-cta" aria-labelledby="final-cta-title">
        <div class="final-cta__content">
          <p class="final-cta__eyebrow">TU MARCA PUEDE SER LA SIGUIENTE</p>
    
          <h2 id="final-cta-title" class="final-cta__title">
            <span class="final-cta__title-line"><span class="final-cta__title-text">¿HACEMOS</span></span>
            <span class="final-cta__title-line"><span class="final-cta__title-text">QUE SE</span></span>
            <span class="final-cta__title-line"><span class="final-cta__title-text">MUEVA<em>?</em></span></span>
          </h2>
    
          <div class="final-cta__aside">
            <p class="final-cta__text">
              Cuéntanos qué quieres conseguir. Nosotros pensamos cómo hacerlo realidad.
            </p>
            <a
              ref="finalCtaCta"
              class="final-cta__link"
              href="#"
              data-cursor="cta"
              aria-label="Hablemos, contacto próximamente"
              @click.prevent
              @mouseenter="finalCtaAnimateCta(true)"
              @mousemove="finalCtaHandleCtaMove"
              @mouseleave="finalCtaAnimateCta(false); finalCtaResetMagneticCta()"
              @focus="finalCtaAnimateCta(true)"
              @blur="finalCtaAnimateCta(false)"
            >
              <span>HABLEMOS <span class="final-cta__arrow" aria-hidden="true">↗</span></span>
              <span class="final-cta__line" aria-hidden="true" />
            </a>
          </div>
        </div>
    
      </section>

    <HomeFooterSection />
  </main>
</template>

<style scoped>
/* ==========================================================================
   HERO
   ========================================================================== */

.hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  padding: 1.25rem clamp(1.25rem, 3vw, 3.5rem) 1.5rem;
  overflow: hidden;
  color: var(--color-black);
  background: color-mix(in srgb, var(--color-ivory) 94%, transparent);
}

.navbar {
  /* El header sigue perteneciendo al Hero, pero fixed lo mantiene disponible en toda la one page. */
  position: fixed;
  z-index: 90;
  top: 1.25rem;
  right: clamp(1.25rem, 3vw, 3.5rem);
  left: clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-white);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  mix-blend-mode: difference;
}

.navbar__brand {
  text-decoration: none;
}

.navbar__menu {
  padding: 0;
  border: 0;
  color: inherit;
  background: none;
  font: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}

.hero__content {
  position: relative;
  z-index: 3;
  display: grid;
  flex: 1;
  align-content: center;
  gap: clamp(2.5rem, 7vh, 6rem);
  padding-block: clamp(4rem, 11vh, 8rem) 3rem;
}

.hero__video {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.13;
  filter: saturate(0.7) contrast(1.08);
  mix-blend-mode: multiply;
  pointer-events: none;
}

.hero__orb {
  position: absolute;
  z-index: 1;
  top: 22%;
  right: -10%;
  width: clamp(16rem, 42vw, 42rem);
  aspect-ratio: 1;
  border-radius: 50%;
  opacity: 0.05;
  background: var(--color-brand-cyan);
  filter: blur(clamp(1.5rem, 4vw, 3.5rem));
  pointer-events: none;
  will-change: transform;
}

.hero__orb span {
  position: absolute;
  right: 22%;
  bottom: 18%;
  width: clamp(0.5rem, 1vw, 0.9rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color-brand-yellow);
}

.hero__title {
  margin: 0;
  font-size: clamp(2.9rem, 15.2vw, 12rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.84;
  text-wrap: nowrap;
}

.hero__title-line,
.hero__title-text {
  display: block;
}

.hero__title-line {
  overflow: hidden;
}

.hero__title-line:nth-child(2) {
  margin-left: clamp(0rem, 5vw, 5rem);
}

.hero__aside {
  display: grid;
  gap: 2rem;
}

.hero__intro {
  max-width: 25rem;
  margin: 0 0 0 auto;
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  line-height: 1.35;
}

.hero__cta {
  width: fit-content;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid currentColor;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-decoration: none;
}

.hero__cta span {
  display: inline-block;
  margin-left: 0.45rem;
  color: var(--color-brand-yellow);
  font-size: 1rem;
}

.hero__index {
  position: absolute;
  right: clamp(1.25rem, 3vw, 3.5rem);
  bottom: 1.5rem;
  margin: 0;
  color: var(--color-brand-cyan);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  z-index: 3;
}

@media (prefers-reduced-motion: reduce) {
  .hero__video {
    opacity: 0.1;
  }

  .hero__orb {
    will-change: auto;
  }
}

.menu-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  min-width: 320px;
  flex-direction: column;
  padding: 1.25rem clamp(1.25rem, 3vw, 3.5rem) 1.5rem;
  color: var(--color-white);
  background: var(--color-black);
}

.menu-overlay__header,
.menu-overlay__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.menu-overlay__header a {
  color: var(--color-brand-cyan);
  text-decoration: none;
}

.menu-overlay__header button {
  padding: 0;
  border: 0;
  color: inherit;
  background: none;
  font: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}

.menu-overlay nav {
  display: flex;
  flex: 1;
  align-items: center;
}

.menu-overlay__list {
  width: 100%;
  margin: 0;
  padding: 2rem 0;
  list-style: none;
}

.menu-overlay__link-mask {
  overflow: hidden;
}

.menu-overlay__link {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  align-items: baseline;
  padding-block: 0.3rem;
  font-size: clamp(2.25rem, 7.5vh, 5.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  text-decoration: none;
}

.menu-overlay__link > span:first-child {
  color: var(--color-brand-yellow);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.menu-overlay__link > span:last-child {
  transition: color 180ms ease;
}

.menu-overlay__link:hover > span:last-child,
.menu-overlay__link:focus-visible > span:last-child {
  color: var(--color-brand-cyan);
}

.menu-overlay__footer {
  color: var(--color-ivory);
  font-size: 0.62rem;
  font-weight: 500;
}

@media (min-width: 700px) {
  .hero {
    padding-top: 1.75rem;
    padding-bottom: 2rem;
  }

  .hero__content {
    grid-template-columns: minmax(0, 1fr) minmax(15rem, 26vw);
    align-items: end;
    gap: 2rem;
  }

  .navbar {
    top: 1.75rem;
  }

  .hero__title {
    grid-column: 1 / -1;
    font-size: clamp(5.8rem, 12.7vw, 12rem);
  }

  .hero__aside {
    grid-column: 2;
    gap: clamp(3rem, 7vh, 5rem);
  }

  .hero__intro {
    margin: 0;
  }

  .menu-overlay {
    padding-top: 1.75rem;
    padding-bottom: 2rem;
  }

  .menu-overlay__link {
    grid-template-columns: clamp(4rem, 9vw, 9rem) 1fr;
    padding-block: 0.15rem;
  }
}

@media (min-width: 1200px) {
  .hero__title {
    font-size: clamp(9rem, 11.3vw, 13.5rem);
  }
}

@media (max-height: 720px) and (min-width: 700px) {
  .hero__content {
    gap: 2rem;
    padding-block: 3rem 2rem;
  }

  .hero__aside {
    gap: 1.5rem;
  }
}

@media (max-width: 639px) {
  .hero__video {
    opacity: 0.08;
  }
}

/* ==========================================================================
   MANIFESTO
   ========================================================================== */

.manifesto {
  position: relative;
  z-index: 2;
  height: 100svh;
  isolation: isolate;
  color: var(--color-white);
  background: var(--color-black);
}

.manifesto__stage {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background: var(--color-black);
}

.manifesto__canvas,
.manifesto__overlay,
.manifesto__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.manifesto__canvas {
  z-index: 0;
  display: block;
}

.manifesto__overlay {
  z-index: 1;
  background: color-mix(in srgb, var(--color-black) 44%, transparent);
}

.manifesto__shade {
  z-index: 2;
  pointer-events: none;
}

.manifesto__shade--left {
  background: linear-gradient(90deg, color-mix(in srgb, var(--color-black) 72%, transparent), transparent 72%);
}

.manifesto__shade--right {
  background: linear-gradient(270deg, color-mix(in srgb, var(--color-black) 68%, transparent), transparent 70%);
}

.manifesto__shade--full {
  background: color-mix(in srgb, var(--color-black) 24%, transparent);
}

.manifesto__scene {
  position: absolute;
  z-index: 3;
  inset: 0;
  display: flex;
  padding: clamp(5rem, 8vw, 8rem) clamp(1.25rem, 3vw, 3.5rem);
}

.manifesto__scene--one {
  flex-direction: column;
  justify-content: space-between;
}

.manifesto__eyebrow {
  margin: 0 0 2rem auto;
  color: var(--color-brand-cyan);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

.manifesto__title,
.manifesto__statement {
  margin: 0;
  font-size: clamp(3rem, 10.6vw, 9.6rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 0.87;
  text-transform: uppercase;
}

.manifesto__line,
.manifesto__line-text {
  display: block;
}

.manifesto__line {
  overflow: hidden;
}

.manifesto__title .manifesto__line:nth-child(2) {
  text-align: right;
}

.manifesto__line--accent {
  color: var(--color-brand-cyan);
}

.manifesto__scene--two {
  align-items: center;
  justify-content: flex-end;
}

.manifesto__scene--two p {
  width: min(42vw, 34rem);
  margin: 0 7vw 0 0;
  font-size: clamp(1.5rem, 3.2vw, 3.2rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.manifesto__scene--three {
  align-items: center;
}

.manifesto__statement {
  width: 100%;
}

.manifesto__statement .manifesto__line:nth-child(2) {
  text-align: center;
}

.manifesto__statement .manifesto__line:last-child {
  text-align: right;
}

.manifesto__statement em {
  color: var(--color-brand-yellow);
  font-style: normal;
}

@media (max-width: 699px) {
  .manifesto__scene {
    padding-block: 5.5rem 3rem;
  }

  .manifesto__title,
  .manifesto__statement {
    font-size: clamp(2.5rem, 13vw, 4.1rem);
  }

  .manifesto__scene--two {
    align-items: flex-end;
  }

  .manifesto__scene--two p {
    width: min(88vw, 25rem);
    margin: 0 0 16vh;
    font-size: clamp(1.45rem, 7vw, 2.2rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .manifesto--reduced {
    height: auto;
  }

  .manifesto--reduced .manifesto__stage {
    height: auto;
    min-height: 100svh;
  }

  .manifesto--reduced .manifesto__canvas,
  .manifesto--reduced .manifesto__overlay,
  .manifesto--reduced .manifesto__shade {
    position: absolute;
  }

  .manifesto--reduced .manifesto__scene {
    position: relative;
    min-height: 80svh;
    opacity: 1;
    transform: none;
  }

  .manifesto--reduced .manifesto__eyebrow,
  .manifesto--reduced .manifesto__line-text {
    opacity: 1;
    transform: none;
  }
}

/* ==========================================================================
   MARQUEE
   ========================================================================== */

.marquee {
  display: grid;
  min-height: 65svh;
  align-content: center;
  gap: 0.15em;
  overflow: hidden;
  color: var(--color-ivory);
  background: color-mix(in srgb, var(--color-black) 100%, transparent);
}

.marquee__line {
  width: max-content;
  margin: 0;
  font-size: clamp(4rem, 11vw, 10rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.89;
  white-space: nowrap;
  will-change: transform;
}

.marquee__line--backward {
  color: var(--color-brand-cyan);
}

@media (prefers-reduced-motion: reduce) {
  .marquee__line {
    transform: translateX(-12%);
    will-change: auto;
  }
}

/* ==========================================================================
   SERVICES
   ========================================================================== */

.services {
  position: relative;
  overflow: clip;
  padding: clamp(6rem, 12vw, 11rem) clamp(1.25rem, 3vw, 3.5rem);
  isolation: isolate;
  color: var(--color-black);
  background: color-mix(in srgb, var(--color-ivory) 72%, transparent);
}

.services__header {
  display: grid;
  gap: 1.5rem;
  margin-bottom: clamp(5rem, 12vw, 10rem);
}

.services__eyebrow {
  color: var(--color-dark-cyan);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

.services__header h2,
.services__header p {
  margin: 0;
}

.services__header h2 {
  max-width: 12ch;
  font-size: clamp(3.5rem, 10vw, 9rem);
  letter-spacing: -0.045em;
  line-height: 0.88;
}

.services__header > p:last-child {
  max-width: 25rem;
  font-size: clamp(1.1rem, 1.6vw, 1.35rem);
  line-height: 1.4;
}

.services__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.service__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;
  align-items: baseline;
  padding-block: clamp(1.5rem, 3.5vw, 3rem);
}

.service__name {
  margin: 0;
  font-size: clamp(1.65rem, 4.3vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 0.98;
}

.service__description {
  grid-column: 1;
  max-width: 35rem;
  margin: 0.4rem 0 0;
  opacity: 0.62;
  font-size: clamp(0.9rem, 1.2vw, 1.05rem);
  line-height: 1.45;
}

.service__rule {
  display: block;
  height: 1px;
  opacity: 0.28;
  background: currentColor;
  transform-origin: left center;
}

.service-preview {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .service-preview {
    position: absolute;
    z-index: 20;
    top: 0;
    left: 0;
    display: block;
    width: clamp(13rem, 18vw, 17rem);
    aspect-ratio: 0.82;
    overflow: hidden;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .service-preview img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    animation: service-preview-image-in 0.2s ease-out;
  }
}

@keyframes service-preview-image-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (min-width: 800px) {
  .services__header {
    grid-template-columns: 1fr 1fr;
  }

  .services__eyebrow,
  .services__header h2 {
    grid-column: 1;
  }

  .services__header > p:last-child {
    grid-column: 2;
    grid-row: 2;
    align-self: end;
    justify-self: end;
  }

  .service__content {
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 28vw);
    column-gap: clamp(2rem, 5vw, 6rem);
  }

  .service__description {
    grid-column: 2;
    margin: 0;
  }
}

@media (hover: none) {
  .service__description {
    opacity: 1;
  }
}

/* ==========================================================================
   PROCESS
   ========================================================================== */

.process {
  position: relative;
  height: 100svh;
  isolation: isolate;
  color: var(--color-black);
  background: var(--color-black);
}

.process__stage {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background: var(--color-black);
}

.process.process--interactive,
.process.process--outro {
  z-index: 4;
}

.process--interactive .process__stage,
.process--outro .process__stage {
  height: calc(100svh + 2px);
}

.process__end-sentinel {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.process__backdrop {
  position: absolute;
  z-index: 0;
  inset: 0;
  background: var(--color-ivory);
}

.process__intro-copy {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: clamp(2rem, 5vw, 6rem);
  width: min(37vw, 35rem);
  transform: translateY(-50%);
  clip-path: inset(0);
  will-change: transform, opacity, clip-path;
}

.process__intro-copy h2 {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.75rem, 4.5vw, 5.4rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 0.92;
  text-wrap: balance;
}

.process__intro-copy p {
  max-width: 31rem;
  margin: clamp(1.5rem, 2.4vw, 2.4rem) 0 0;
  color: var(--color-dark-cyan);
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  line-height: 1.55;
}

.process__visual {
  --process-safe-x: clamp(3rem, 6vw, 7rem);
  --process-safe-y: clamp(4.5rem, 5vw, 6rem);
  position: absolute;
  z-index: 2;
  top: 18svh;
  left: clamp(1.5rem, 4vw, 4.5rem);
  width: min(51vw, 55rem);
  height: 64svh;
  overflow: hidden;
  border-radius: 0.65rem;
  background: var(--color-black) url('/Videos/ProcesoFrames/frame_0001.webp') center / cover no-repeat;
  will-change: top, left, width, height, border-radius;
}

.process__stage:is([data-mode='interactive'], [data-mode='outro']) .process__visual {
  min-width: calc(100% + 2px);
  min-height: 100%;
  margin-left: -1px;
}

.process__canvas,
.process__overlay,
.process__shade {
  position: absolute;
  top: -1px;
  left: -1px;
  width: calc(100% + 2px);
  height: calc(100% + 3px);
}

.process__messages {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.process__canvas {
  z-index: 0;
  display: block;
}

.process__overlay {
  z-index: 1;
  background: color-mix(in srgb, var(--color-black) 14%, transparent);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.process__shade {
  z-index: 2;
  background:
    radial-gradient(circle at 8% 8%, color-mix(in srgb, var(--color-black) 30%, transparent), transparent 38%),
    radial-gradient(circle at 92% 88%, color-mix(in srgb, var(--color-black) 34%, transparent), transparent 40%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.process__messages {
  z-index: 3;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  color: var(--color-white);
  pointer-events: none;
}

.process__message {
  position: absolute;
  right: var(--process-safe-x);
  left: var(--process-safe-x);
  width: auto;
  opacity: 0;
  visibility: hidden;
  will-change: transform, opacity;
}

.process__title-mask {
  overflow: hidden;
  margin: -0.14em -0.08em -0.1em;
  padding: 0.14em 0.08em 0.1em;
}

.process__message-title {
  margin: 0;
  color: var(--color-white);
  font-size: clamp(3rem, 7.3vw, 8.25rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.92;
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
  text-wrap: balance;
  text-shadow: 0 0.08em 0.35em color-mix(in srgb, var(--color-black) 42%, transparent);
  will-change: transform;
}

.process__message--idea { top: var(--process-safe-y); }
.process__message--analyze { top: 34%; text-align: right; }
.process__message--strategy { top: var(--process-safe-y); text-align: right; }
.process__message--strategy .process__message-title,
.process__message--result .process__message-title { font-size: clamp(2.8rem, 6.6vw, 7.5rem); }
.process__message--design { top: 43%; }
.process__message--create { bottom: var(--process-safe-y); }
.process__message--launch { top: 20%; text-align: right; }
.process__message--result { bottom: var(--process-safe-y); text-align: right; }
.process__message--optimize { top: 42%; }

.process__outro {
  position: absolute;
  z-index: 4;
  top: -1px;
  right: -1px;
  bottom: -2px;
  left: -1px;
  display: grid;
  place-items: center;
  padding: var(--process-safe-y) var(--process-safe-x);
  color: var(--color-white);
  background: var(--color-black);
  opacity: 0;
  visibility: hidden;
  text-align: center;
  pointer-events: none;
}

.process__outro-mask {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  margin-block: -0.14em -0.16em;
  padding-block: 0.14em 0.16em;
}

.process__outro-text {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.5rem, 5.2vw, 6rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 0.96;
  overflow-wrap: normal;
  word-break: normal;
  text-wrap: balance;
  will-change: transform, opacity;
}

.process__outro-arrow {
  display: inline-block;
  animation: process-outro-arrow 1.25s ease-in-out infinite alternate;
}

@keyframes process-outro-arrow {
  to { transform: translateY(0.14em); }
}

@media (max-width: 1023px) {
  .process__intro-copy { right: 2rem; width: 39vw; }
  .process__intro-copy h2 { font-size: clamp(2.6rem, 5vw, 4.2rem); }
  .process__visual { left: 2rem; width: 50vw; height: 60svh; top: 20svh; }
  .process__message-title { font-size: clamp(2.8rem, 9vw, 6rem); }
  .process__message--strategy .process__message-title,
  .process__message--result .process__message-title { font-size: clamp(2.65rem, 8vw, 5.4rem); }
}

@media (max-width: 639px) {
  .process__intro-copy {
    top: 10svh;
    right: 1.25rem;
    left: 1.25rem;
    width: auto;
    transform: none;
  }
  .process__intro-copy h2 { max-width: 22rem; font-size: clamp(2.4rem, 10.8vw, 3.55rem); line-height: 0.94; }
  .process__intro-copy p { max-width: 27rem; margin-top: 1.2rem; font-size: 0.95rem; line-height: 1.48; }
  .process__visual {
    --process-safe-x: 1.5rem;
    --process-safe-y: 4.75rem;
    top: 51svh;
    left: 1.25rem;
    width: calc(100% - 2.5rem);
    height: 41svh;
    border-radius: 0.5rem;
    background-position: 62% center;
  }
  .process__overlay { background: color-mix(in srgb, var(--color-black) 18%, transparent); }
  .process__shade {
    background:
      radial-gradient(circle at 10% 10%, color-mix(in srgb, var(--color-black) 38%, transparent), transparent 48%),
      radial-gradient(circle at 90% 90%, color-mix(in srgb, var(--color-black) 42%, transparent), transparent 48%);
  }
  .process__message-title { font-size: clamp(2.4rem, 12vw, 4rem); line-height: 0.94; }
  .process__message--strategy .process__message-title,
  .process__message--result .process__message-title { font-size: clamp(2.25rem, 10.8vw, 3.7rem); }
  .process__message--idea { top: var(--process-safe-y); }
  .process__message--analyze { top: 34%; }
  .process__message--strategy { top: var(--process-safe-y); }
  .process__message--design { top: 43%; }
  .process__message--create { bottom: var(--process-safe-y); }
  .process__message--launch { top: 20%; }
  .process__message--result { bottom: var(--process-safe-y); }
  .process__message--optimize { top: 42%; }
  .process__outro-text { font-size: clamp(2.35rem, 11vw, 3.8rem); }
}

@media (prefers-reduced-motion: reduce) {
  .process--reduced { height: 100svh; }
  .process--reduced .process__stage { position: relative; }
  .process--reduced .process__messages,
  .process--reduced .process__overlay,
  .process--reduced .process__shade,
  .process--reduced .process__outro { display: none; }
  .process__outro-arrow { animation: none; }
}

/* ==========================================================================
   WORK
   ========================================================================== */

.work { position: relative; min-height: 100svh; isolation: isolate; color: var(--color-black); background: var(--color-ivory); }
.work__stage { position: sticky; z-index: 1; top: 0; height: 100svh; overflow: hidden; }
.work__world { position: relative; width: 520vw; height: 100%; overflow: hidden; background: var(--color-ivory); will-change: transform; }
.work__atmosphere { position: absolute; z-index: 0; top: 0; bottom: 0; pointer-events: none; }
.work__atmosphere--dark { left: 162vw; width: 176vw; background: var(--color-black); clip-path: polygon(7% 0, 100% 0, 93% 100%, 0 100%); }
.work__atmosphere--cyan { left: 313vw; width: 126vw; background: var(--color-dark-cyan); clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%); }
.work__intro, .project-cluster, .work__breathing-space { position: absolute; z-index: 1; top: 0; height: 100%; }

.work__intro { left: 0; display: flex; width: 90vw; padding: clamp(1.5rem, 3vw, 3.5rem); flex-direction: column; justify-content: center; }
.work__intro h2 { position: relative; z-index: 1; margin: 0; font-size: clamp(5rem, 11.4vw, 12.5rem); letter-spacing: -.065em; line-height: .79; }
.work__intro h2 span { display: block; white-space: nowrap; }
.work__intro h2 span:last-child { margin-left: 8vw; }
.work__intro-mark { position: absolute; right: 2vw; bottom: 10vh; width: clamp(3.5rem, 6vw, 7rem); height: .5rem; background: var(--color-brand-yellow); }

.project-cluster { isolation: isolate; }
.project-cluster--rental { left: 82vw; width: 100vw; }
.project-cluster--passos { left: 178vw; width: 85vw; color: var(--color-white); }
.project-cluster--depilas { left: 270vw; width: 115vw; color: var(--color-white); }
.project-cluster--nova { left: 390vw; width: 105vw; color: var(--color-black); }
.project-cluster__media, .project-cluster__meta { position: absolute; }
.project-cluster__media { overflow: hidden; transform: translateZ(0); }
.project-cluster__art { position: absolute; inset: -6%; will-change: transform; }
.project-cluster__meta p, .project-cluster__meta h3 { margin: 0; }
.project-cluster__meta p { margin-bottom: .7rem; font-size: clamp(.62rem, .72vw, .8rem); letter-spacing: .11em; text-transform: uppercase; }
.project-cluster__meta h3 { max-width: 12ch; font-size: clamp(2.2rem, 4.4vw, 5.25rem); letter-spacing: -.055em; line-height: .9; }

.project-cluster--rental .project-cluster__media--main { top: 12vh; left: 11vw; width: clamp(28rem, 43vw, 52rem); height: 58vh; min-height: 30rem; background: var(--color-black); }
.project-cluster--rental .project-cluster__media--main .project-cluster__art::before { position: absolute; width: 58%; aspect-ratio: 1; border: clamp(1.2rem, 3vw, 3.5rem) solid var(--color-brand-cyan); border-radius: 50%; content: ''; inset: 50% auto auto 50%; transform: translate(-50%, -50%); }
.project-cluster--rental .project-cluster__media--secondary { right: 4vw; bottom: 8vh; width: 17vw; min-width: 12rem; aspect-ratio: 1.4; border: 1px solid var(--color-dark-cyan); background: var(--color-ivory); }
.project-cluster--rental .project-cluster__media--secondary .project-cluster__art { background: linear-gradient(90deg, transparent 47%, var(--color-brand-cyan) 47% 53%, transparent 53%); }
.project-cluster--rental .project-cluster__meta { top: 67vh; left: 19vw; }

.project-cluster--passos .project-cluster__media--main { top: 24vh; left: 21vw; width: clamp(24rem, 32vw, 40rem); height: 64vh; min-height: 31rem; background: var(--color-brand-cyan); }
.project-cluster--passos .project-cluster__media--main .project-cluster__art::before, .project-cluster--passos .project-cluster__media--main .project-cluster__art::after { position: absolute; background: var(--color-black); content: ''; inset: 50% 8% auto; height: 1px; }
.project-cluster--passos .project-cluster__media--main .project-cluster__art::before { transform: rotate(25deg); }
.project-cluster--passos .project-cluster__media--main .project-cluster__art::after { transform: rotate(-17deg); }
.project-cluster--passos .project-cluster__media--secondary { top: 9vh; right: 6vw; width: 19vw; min-width: 13rem; aspect-ratio: 1.65; border: 1px solid var(--color-brand-cyan); }
.project-cluster--passos .project-cluster__media--secondary .project-cluster__art { background: var(--color-black); }
.project-cluster--passos .project-cluster__media--secondary .project-cluster__art::after { position: absolute; inset: 18%; border: 1px solid var(--color-brand-cyan); content: ''; }
.project-cluster--passos .project-cluster__meta { top: 14vh; left: 2vw; width: 25vw; }

.project-cluster--depilas .project-cluster__media--main { top: 10vh; left: 19vw; width: clamp(34rem, 48vw, 60rem); height: 55vh; min-height: 28rem; border: 1px solid color-mix(in srgb, var(--color-white) 35%, transparent); background: var(--color-ivory); }
.project-cluster--depilas .project-cluster__media--main .project-cluster__art::before { position: absolute; inset: 18% 13%; border: clamp(.8rem, 1.8vw, 2rem) solid var(--color-black); content: ''; transform: rotate(-6deg); }
.project-cluster--depilas .project-cluster__media--secondary { right: 9vw; bottom: 7vh; width: 14vw; min-width: 10rem; aspect-ratio: .78; background: var(--color-brand-yellow); }
.project-cluster--depilas .project-cluster__media--secondary .project-cluster__art { inset: 12%; border: 1px solid var(--color-black); }
.project-cluster--depilas .project-cluster__meta { left: 9vw; bottom: 8vh; width: 42vw; }
.project-cluster--depilas .project-cluster__meta h3 { max-width: 14ch; }

.project-cluster--nova .project-cluster__media--main { top: 18vh; left: 13vw; width: clamp(30rem, 44vw, 55rem); height: 66vh; min-height: 32rem; background: var(--color-black); }
.project-cluster--nova .project-cluster__media--main .project-cluster__art::before { position: absolute; inset: 10%; border: clamp(.55rem, 1.5vw, 1.7rem) solid var(--color-brand-yellow); content: ''; }
.project-cluster--nova .project-cluster__media--main .project-cluster__art::after { position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: var(--color-brand-cyan); content: ''; }
.project-cluster--nova .project-cluster__media--secondary { top: 8vh; right: 5vw; width: 18vw; min-width: 12rem; aspect-ratio: 1.5; border: 1px solid var(--color-dark-cyan); background: var(--color-ivory); }
.project-cluster--nova .project-cluster__media--secondary .project-cluster__art { background: linear-gradient(var(--color-dark-cyan) 1px, transparent 1px); background-size: 100% 20%; }
.project-cluster--nova .project-cluster__meta { top: 12vh; left: 60vw; width: 33vw; }

.work__breathing-space { left: 486vw; width: 34vw; }
.work__breathing-space span { position: absolute; top: 50%; left: 30%; width: 8rem; height: 1px; background: var(--color-dark-cyan); }

@media (hover: hover) and (pointer: fine) {
  .project-cluster__media--main { transition: transform 500ms cubic-bezier(.22, 1, .36, 1); }
  .project-cluster__media--main:hover { transform: scale(.985); }
}

@media (max-width: 799px) {
  .work__world { width: 620vw; }
  .work__intro { left: 0; width: 96vw; min-width: 0; padding: 1.25rem; }
  .work__intro h2 { font-size: clamp(3.25rem, 16.5vw, 6rem); line-height: .83; }
  .work__intro h2 span:last-child { margin-left: 0; }
  .project-cluster--rental, .project-cluster--passos, .project-cluster--depilas, .project-cluster--nova { width: 118vw; min-width: 23rem; margin-left: 0; }
  .project-cluster--rental { left: 82vw; }
  .project-cluster--passos { left: 218vw; }
  .project-cluster--depilas { left: 352vw; }
  .project-cluster--nova { left: 486vw; }
  .project-cluster__media--secondary { display: none; }
  .project-cluster__meta h3 { max-width: 11ch; font-size: clamp(2rem, 11vw, 3.75rem); }
  .project-cluster--rental .project-cluster__media--main, .project-cluster--passos .project-cluster__media--main, .project-cluster--depilas .project-cluster__media--main, .project-cluster--nova .project-cluster__media--main { top: 17vh; left: 18vw; width: 76vw; min-width: 0; height: 50vh; min-height: 21rem; }
  .project-cluster--passos .project-cluster__media--main { top: 27vh; width: 62vw; }
  .project-cluster--depilas .project-cluster__media--main { top: 12vh; width: 84vw; height: 45vh; }
  .project-cluster--nova .project-cluster__media--main { top: 22vh; width: 74vw; height: 53vh; }
  .project-cluster--rental .project-cluster__meta, .project-cluster--passos .project-cluster__meta, .project-cluster--depilas .project-cluster__meta, .project-cluster--nova .project-cluster__meta { top: auto; right: auto; bottom: 7vh; left: 12vw; width: 86vw; }
  .work__atmosphere--dark { left: 190vw; width: 245vw; }
  .work__atmosphere--cyan { left: 420vw; width: 170vw; }
  .work__breathing-space { left: 598vw; width: 22vw; min-width: 7rem; }
}

@media (prefers-reduced-motion: reduce) {
  .work, .work--reduced { height: auto !important; padding: clamp(5rem, 12vw, 8rem) clamp(1.25rem, 3vw, 3.5rem); }
  .work__stage { position: relative; height: auto; overflow: visible; }
  .work__world { display: grid; width: 100%; height: auto; gap: clamp(5rem, 12vw, 9rem); overflow: visible; background: transparent; transform: none !important; }
  .work__atmosphere, .project-cluster__media--secondary, .work__breathing-space { display: none; }
  .work__intro, .project-cluster--rental, .project-cluster--passos, .project-cluster--depilas, .project-cluster--nova { position: relative; top: auto; left: auto; width: 100%; min-width: 0; height: auto; min-height: 0; margin: 0; color: var(--color-black); }
  .work__intro { padding: 0; }
  .work__intro h2 { font-size: clamp(3.25rem, 11.4vw, 10rem); }
  .work__intro-mark { display: none; }
  .project-cluster { display: grid; gap: 1.5rem; }
  .project-cluster .project-cluster__media--main, .project-cluster .project-cluster__meta { position: relative; inset: auto; width: 100%; min-width: 0; transform: none !important; }
  .project-cluster .project-cluster__media--main { height: min(72vw, 42rem); min-height: 20rem; }
  .project-cluster__meta h3 { font-size: clamp(2rem, 7vw, 5rem); }
}

/* ==========================================================================
   TEAM
   ========================================================================== */

.team {
  position: relative;
  z-index: 3;
  isolation: isolate;
  min-height: 120svh;
  overflow: hidden;
  color: var(--color-white);
  background: var(--color-black);
}

.team__composition {
  position: relative;
  display: grid;
  min-height: 110svh;
  place-items: center;
}

.team__composition::before {
  position: absolute;
  top: 12%;
  left: 50%;
  width: clamp(22rem, 43vw, 50rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color-dark-cyan);
  content: '';
  transform: translateX(-50%);
}

.team__portrait {
  position: absolute;
  z-index: 1;
  top: 14svh;
  left: 50%;
  width: clamp(26rem, 39vw, 46rem);
  height: 88svh;
  transform: translateX(-50%);
  transform-origin: center bottom;
}

.team__portrait img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.team__logo-reveal {
  position: absolute;
  z-index: 3;
  top: 5svh;
  left: 50%;
  width: clamp(13rem, 22vw, 25rem);
  overflow: hidden;
  transform: translateX(-50%);
}

.team__logo {
  display: block;
  width: 100%;
  height: auto;
  transform-origin: center top;
}

.team__accent {
  position: absolute;
  z-index: 4;
  right: clamp(1.5rem, 5vw, 5rem);
  bottom: 14svh;
  width: clamp(3rem, 6vw, 6rem);
  height: .55rem;
  background: var(--color-brand-yellow);
}

@media (max-width: 799px) {
  .team { min-height: 110svh; }
  .team__composition { min-height: 102svh; }
  .team__composition::before { top: 23%; width: 88vw; }
  .team__portrait { top: 17svh; width: 82vw; height: 82svh; }
  .team__logo-reveal { top: 8svh; width: min(48vw, 13rem); }
  .team__accent { bottom: 10svh; }
}

@media (prefers-reduced-motion: reduce) {
  .team { min-height: 100svh; }
  .team__portrait,
  .team__logo { opacity: 1 !important; visibility: visible !important; transform: none !important; }
  .team__portrait { transform: translateX(-50%) !important; }
}

/* ==========================================================================
   PLANS
   ========================================================================== */

.plans {
  padding: clamp(6rem, 12vw, 11rem) clamp(1.25rem, 3vw, 3.5rem);
  color: var(--color-black);
  background: color-mix(in srgb, var(--color-ivory) 88%, transparent);
}

.plans__header {
  display: grid;
  gap: 2rem;
  margin-bottom: clamp(6rem, 14vw, 12rem);
}

.plans__eyebrow,
.plans__intro {
  margin: 0;
}

.plans__eyebrow {
  color: var(--color-dark-cyan);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

.plans__title {
  margin: 0;
  font-size: clamp(2.05rem, 9.5vw, 9rem);
  letter-spacing: -0.045em;
  line-height: 0.89;
}

.plans__title-line,
.plans__title-text {
  display: block;
  white-space: nowrap;
}

.plans__title-line {
  overflow: hidden;
}

.plans__title-line:last-child {
  text-align: right;
}

.plans__intro {
  max-width: 28rem;
  margin-left: auto;
  font-size: clamp(1.05rem, 1.7vw, 1.4rem);
  line-height: 1.4;
}

.plans__grid {
  display: grid;
  gap: 3rem 1px;
}

.plan {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 2rem 0 0;
  border-top: 1px solid color-mix(in srgb, var(--color-black) 30%, transparent);
}

.plan--featured {
  padding: 2rem 1.25rem 1.5rem;
  border-color: var(--color-brand-cyan);
  color: var(--color-white);
  background: var(--color-black);
}

.plan__header {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1.2rem 0.75rem;
}

.plan__number,
.plan__eyebrow {
  font-size: 0.62rem;
  letter-spacing: 0.09em;
}

.plan__number {
  color: var(--color-brand-cyan);
}

.plan__eyebrow {
  margin: 0;
  line-height: 1.35;
}

.plan h3 {
  grid-column: 1 / -1;
  margin: 1rem 0 0;
  font-size: clamp(2.6rem, 5vw, 5rem);
  letter-spacing: -0.04em;
  line-height: 0.92;
}

.plan__description {
  grid-column: 1 / -1;
  max-width: 32rem;
  min-height: 4.5em;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
}

.plan__price {
  display: flex;
  grid-column: 1 / -1;
  align-items: baseline;
  gap: 0.7rem;
  padding-block: 1.25rem 2rem;
}

.plan__price strong {
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  letter-spacing: -0.05em;
}

.plan__price span {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
}

.plan__groups {
  display: grid;
  gap: 2.25rem;
  padding-block: 1.5rem 3rem;
  border-top: 1px solid color-mix(in srgb, currentColor 22%, transparent);
}

.plan__group h4 {
  margin: 0 0 1.25rem;
  color: var(--color-dark-cyan);
  font-size: 0.65rem;
  letter-spacing: 0.09em;
}

.plan__group ul {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.plan__group li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.88rem;
  line-height: 1.4;
}

.plan__group li::before {
  position: absolute;
  left: 0;
  color: var(--color-brand-cyan);
  content: '—';
}

.plan--featured .plan__group h4 {
  color: var(--color-brand-cyan);
}

.plan__cta {
  display: grid;
  width: fit-content;
  gap: 0.4rem;
  margin-top: auto;
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-decoration: none;
}

.plan__cta-arrow {
  display: inline-block;
  margin-left: 0.35rem;
  color: var(--color-brand-yellow);
  font-size: 1.15em;
}

.plan__cta-line {
  width: 100%;
  height: 1px;
  background: var(--color-brand-cyan);
  transform-origin: left center;
}

@media (min-width: 720px) {
  /* Dos columnas dan aire suficiente en tablet sin reducir el cuerpo de texto. */
  .plans__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .plan {
    padding-right: clamp(1.25rem, 3vw, 3rem);
    padding-left: clamp(1.25rem, 3vw, 3rem);
  }

  .plan--premium {
    grid-column: 1 / -1;
  }

  .plan--premium .plan__groups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1180px) {
  /* Los tres planes compactos se comparan en línea y PREMIUM ocupa todo el ancho para no comprimirse. */
  .plans__grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .plan:not(.plan--premium) {
    grid-column: span 2;
  }

  .plan--premium {
    display: grid;
    grid-template-columns: minmax(18rem, 0.8fr) 2fr;
    grid-column: 1 / -1;
    gap: 0 5rem;
  }

  .plan--premium .plan__groups {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .plan--premium .plan__cta {
    grid-column: 1;
  }
}

/* ==========================================================================
   FINAL CTA
   ========================================================================== */

.final-cta {
  color: var(--color-white);
  background: color-mix(in srgb, var(--color-dark-cyan) 84%, transparent);
}

.final-cta__content {
  min-height: 100svh;
  padding: clamp(6rem, 12vw, 11rem) clamp(1.25rem, 3vw, 3.5rem);
}

.final-cta__eyebrow {
  margin: 0 0 clamp(5rem, 13vh, 10rem);
  color: var(--color-brand-cyan);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

.final-cta__title {
  margin: 0;
  font-size: clamp(3.65rem, 14vw, 12rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.86;
}

.final-cta__title-line,
.final-cta__title-text {
  display: block;
}

.final-cta__title-line {
  overflow: hidden;
}

.final-cta__title-line:nth-child(2) {
  text-align: center;
}

.final-cta__title-line:last-child {
  text-align: right;
}

.final-cta__title em {
  color: var(--color-brand-yellow);
  font-style: normal;
}

.final-cta__aside {
  display: grid;
  gap: 2.5rem;
  margin-top: clamp(4rem, 10vh, 7rem);
}

.final-cta__text {
  max-width: 29rem;
  margin: 0 0 0 auto;
  color: var(--color-ivory);
  font-size: clamp(1.05rem, 1.7vw, 1.4rem);
  line-height: 1.4;
}

.final-cta__link {
  display: grid;
  width: fit-content;
  gap: 0.45rem;
  font-size: clamp(0.8rem, 1.1vw, 1rem);
  font-weight: 650;
  letter-spacing: 0.06em;
  text-decoration: none;
}

.final-cta__arrow {
  display: inline-block;
  margin-left: 0.4rem;
  color: var(--color-brand-yellow);
  font-size: 1.2em;
}

.final-cta__line {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--color-brand-cyan);
  transform-origin: left center;
}

@media (min-width: 760px) {
  .final-cta__aside {
    grid-template-columns: 1fr minmax(18rem, 30vw);
    align-items: end;
  }

  .final-cta__text {
    grid-column: 2;
    margin: 0;
  }

  .final-cta__link {
    grid-column: 1;
    grid-row: 1;
  }

}

/* ==========================================================================
   HOME COMPOSITION
   ========================================================================== */

/* Reserva en el flujo la escena de 100svh más el recorrido fijado de ScrollTrigger. */
.manifesto-shell {
  height: 320svh;
}

@media (max-width: 1023px) {
  .manifesto-shell {
    height: 310svh;
  }
}

@media (max-width: 639px) {
  .manifesto-shell {
    height: 290svh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .manifesto-shell {
    height: auto;
  }
}
</style>
