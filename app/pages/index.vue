<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'NEO REDES',
  meta: [
    {
      name: 'description',
      content: 'Neo Redes impulsa negocios y marcas mediante marketing digital, diseño web, automatización y soluciones creativas orientadas a resultados.',
    },
  ],
})

const pageRoot = ref<HTMLElement | null>(null)
const heroSection = ref<HTMLElement | null>(null)
const heroVideo = ref<HTMLVideoElement | null>(null)
const heroLogoReveal = ref<HTMLImageElement | null>(null)
const reelStory = ref<HTMLElement | null>(null)
const homeContinuation = ref<HTMLElement | null>(null)
const alliesStory = ref<HTMLElement | null>(null)
const alliesCanvas = ref<HTMLCanvasElement | null>(null)
const reelVideos = ref<HTMLVideoElement[]>([])
const footerIsVisible = ref(false)

const reels = [
  { src: '/Videos/Reel1.mp4', scene: 'one', title: 'CONTENIDO', emphasis: 'QUE CONECTA.' },
  { src: '/Videos/Reel5.mp4', scene: 'two', title: 'ESTRATEGIA', emphasis: 'QUE MUEVE.' },
  { src: '/Videos/Reel6.mp4', scene: 'three', title: 'IDEAS QUE', emphasis: 'GENERAN RESULTADOS.' },
] as const

const whatsappMessage = encodeURIComponent('Hola, quiero información sobre los servicios de NEO REDES.')
const whatsappUrl = `https://wa.me/573205520676?text=${whatsappMessage}`

const brands = [
  { name: 'Ariana Art Studio', src: '/Empresas/ArianaBlanco.webp', needsSupport: true },
  { name: 'Depilas', src: '/Empresas/DepilasBlanco.webp', needsSupport: false },
  { name: 'Dispronatural', src: '/Empresas/Dispronatural1.webp', needsSupport: false },
  { name: 'Elixir Clínica Odontológica y Estética', src: '/Empresas/ClinicaElixir.webp', needsSupport: false },
  { name: 'Dr. Iván Darío Passos', src: '/Empresas/drivanpassos.webp', needsSupport: false },
  { name: 'Quality Rental Car', src: '/Empresas/Quality.webp', needsSupport: false },
  { name: 'Dra. Silvana Casanova', src: '/Empresas/silvanacasanova.webp', needsSupport: false },
  { name: 'Vertical', src: '/Empresas/VERTICALBLANCO.webp', needsSupport: false },
  { name: 'CEHANI ESE', src: '/Empresas/cehaniBLANCO.webp', needsSupport: false },
  { name: 'Nova Persianas', src: '/Empresas/NOVABLANCAS.webp', needsSupport: false },
] as const

const activeBrandIndex = ref(0)
const carouselPaused = ref(false)
let brandTimer: ReturnType<typeof setTimeout> | null = null
let dragStartX: number | null = null
let dragPointerId: number | null = null

const brandDistance = (index: number) => {
  let distance = index - activeBrandIndex.value
  const midpoint = brands.length / 2
  if (distance > midpoint) distance -= brands.length
  if (distance < -midpoint) distance += brands.length
  return distance
}

const clearBrandTimer = () => {
  if (brandTimer) clearTimeout(brandTimer)
  brandTimer = null
}

const scheduleBrandAutoplay = () => {
  clearBrandTimer()
  if (reducedMotion || carouselPaused.value || document.hidden) return
  brandTimer = setTimeout(() => {
    activeBrandIndex.value = (activeBrandIndex.value + 1) % brands.length
    scheduleBrandAutoplay()
  }, 5000)
}

const selectBrand = (direction: -1 | 1) => {
  activeBrandIndex.value = (activeBrandIndex.value + direction + brands.length) % brands.length
  scheduleBrandAutoplay()
}

const pauseBrandAutoplay = () => {
  carouselPaused.value = true
  clearBrandTimer()
}

const resumeBrandAutoplay = () => {
  carouselPaused.value = false
  scheduleBrandAutoplay()
}

const handleBrandPointerDown = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  dragStartX = event.clientX
  dragPointerId = event.pointerId
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  pauseBrandAutoplay()
}

const finishBrandDrag = (event: PointerEvent) => {
  if (dragStartX === null || dragPointerId !== event.pointerId) return
  const distance = event.clientX - dragStartX
  dragStartX = null
  dragPointerId = null
  if (Math.abs(distance) >= 45) selectBrand(distance < 0 ? 1 : -1)
  window.setTimeout(resumeBrandAutoplay, event.pointerType === 'touch' ? 1800 : 0)
}

let storyTimeline: gsap.core.Timeline | null = null
let logoRevealTimeline: gsap.core.Timeline | null = null
let continuationTimeline: gsap.core.Timeline | null = null
let alliesTimeline: gsap.core.Timeline | null = null
let mediaContext: gsap.Context | null = null
let mediaMatch: gsap.MatchMedia | null = null
let continuationContext: gsap.Context | null = null
let alliesContext: gsap.Context | null = null
let alliesPreloadObserver: IntersectionObserver | null = null
let progressiveFrameTimer: ReturnType<typeof setTimeout> | null = null
let playbackObserver: IntersectionObserver | null = null
let footerObserver: IntersectionObserver | null = null
let heroIsVisible = true
let reelStoryIsVisible = false
let activeReelIndex = 0
let reducedMotion = false

const ALLIES_FRAME_COUNT = 96
const alliesFrames: Array<HTMLImageElement | undefined> = new Array(ALLIES_FRAME_COUNT)
const alliesFrameState = { index: 0 }
let displayedAlliesFrame = -1

const alliesFrameSrc = (index: number) => `/Videos/Equipo1Frames/frame_${String(index + 1).padStart(4, '0')}.webp`

const nearestLoadedAlliesFrame = (target: number) => {
  if (alliesFrames[target]?.complete) return target
  for (let distance = 1; distance < ALLIES_FRAME_COUNT; distance += 1) {
    const before = target - distance
    const after = target + distance
    if (before >= 0 && alliesFrames[before]?.complete) return before
    if (after < ALLIES_FRAME_COUNT && alliesFrames[after]?.complete) return after
  }
  return -1
}

const drawAlliesFrame = (requestedIndex = alliesFrameState.index) => {
  const canvas = alliesCanvas.value
  if (!canvas) return
  const target = Math.max(0, Math.min(ALLIES_FRAME_COUNT - 1, Math.round(requestedIndex)))
  const loadedIndex = nearestLoadedAlliesFrame(target)
  if (loadedIndex < 0) return
  const image = alliesFrames[loadedIndex]
  const context = canvas.getContext('2d')
  if (!image || !context) return

  const bounds = canvas.getBoundingClientRect()
  const dpr = window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  const width = Math.max(1, Math.round(bounds.width * dpr))
  const height = Math.max(1, Math.round(bounds.height * dpr))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const focalX = window.innerWidth < 768 ? 0.44 : 0.5
  const focalY = window.innerWidth < 768 ? 0.5 : 0.52
  const x = (width - drawWidth) * focalX
  const y = (height - drawHeight) * focalY
  context.clearRect(0, 0, width, height)
  context.drawImage(image, x, y, drawWidth, drawHeight)
  canvas.dataset.frame = String(loadedIndex + 1)
  displayedAlliesFrame = loadedIndex
}

const loadAlliesFrame = (index: number) => {
  if (index < 0 || index >= ALLIES_FRAME_COUNT || alliesFrames[index]) return
  const image = new Image()
  alliesFrames[index] = image
  image.decoding = 'async'
  image.onload = () => {
    if (displayedAlliesFrame < 0 || index === Math.round(alliesFrameState.index)) drawAlliesFrame()
  }
  image.src = alliesFrameSrc(index)
}

const preloadAlliesFrames = () => {
  const priorityFrames = [...Array(8).keys(), 12, 24, 36, 48, 60, 72, 84, 95]
  priorityFrames.forEach(loadAlliesFrame)

  const remaining = [...Array(ALLIES_FRAME_COUNT).keys()].filter(index => !alliesFrames[index])
  const loadBatch = () => {
    remaining.splice(0, 8).forEach(loadAlliesFrame)
    if (remaining.length) progressiveFrameTimer = setTimeout(loadBatch, 120)
  }
  loadBatch()
}

const handleAlliesResize = () => drawAlliesFrame()

const setReelRef = (element: HTMLVideoElement | null, index: number) => {
  if (element) reelVideos.value[index] = element
}

const safePlay = (video?: HTMLVideoElement | null) => {
  if (!video || document.hidden) return
  video.play().catch(() => {})
}

const pauseAllReels = (except = -1) => {
  reelVideos.value.forEach((video, index) => {
    if (index !== except) video.pause()
  })
}

const syncReelPlayback = () => {
  if (document.hidden || !reelStoryIsVisible || reducedMotion) {
    pauseAllReels()
    return
  }

  pauseAllReels(activeReelIndex)
  safePlay(reelVideos.value[activeReelIndex])
}

const setActiveReel = (index: number) => {
  if (index < 0 || index >= reels.length || activeReelIndex === index) return
  activeReelIndex = index
  syncReelPlayback()
}

const syncHeroPlayback = () => {
  if (document.hidden || reducedMotion) {
    heroVideo.value?.pause()
    return
  }

  safePlay(heroVideo.value)
}

const handleVisibility = () => {
  syncHeroPlayback()
  syncReelPlayback()
  syncLogoReveal()
  scheduleBrandAutoplay()
}

const syncLogoReveal = () => {
  if (!logoRevealTimeline) return
  if (document.hidden || !heroIsVisible) logoRevealTimeline.pause()
  else logoRevealTimeline.resume()
}

const handleLogoPointer = (event: PointerEvent) => {
  const logo = heroLogoReveal.value
  if (!logo) return
  const bounds = logo.getBoundingClientRect()
  logo.style.setProperty('--cursor-x', `${event.clientX - bounds.left}px`)
  logo.style.setProperty('--cursor-y', `${event.clientY - bounds.top}px`)
  logo.style.setProperty('--cursor-opacity', '1')
}

const hideLogoPointerReveal = () => {
  heroLogoReveal.value?.style.setProperty('--cursor-opacity', '0')
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  playbackObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === heroSection.value) {
        heroIsVisible = entry.isIntersecting
        syncLogoReveal()
      }

      if (entry.target === reelStory.value) {
        reelStoryIsVisible = entry.isIntersecting
        syncHeroPlayback()
        syncReelPlayback()
      }
    })
  }, { rootMargin: '0px', threshold: 0.01 })

  if (heroSection.value) playbackObserver.observe(heroSection.value)
  if (reelStory.value) playbackObserver.observe(reelStory.value)
  document.addEventListener('visibilitychange', handleVisibility)

  const footer = document.querySelector('.site-footer')
  if (footer) {
    footerObserver = new IntersectionObserver(([entry]) => {
      footerIsVisible.value = Boolean(entry?.isIntersecting)
    }, { threshold: 0 })
    footerObserver.observe(footer)
  }

  scheduleBrandAutoplay()

  loadAlliesFrame(0)
  window.addEventListener('resize', handleAlliesResize)
  if (reducedMotion) {
    alliesFrameState.index = 47
    loadAlliesFrame(47)
  } else if (alliesStory.value) {
    alliesPreloadObserver = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return
      preloadAlliesFrames()
      alliesPreloadObserver?.disconnect()
    }, { rootMargin: '100% 0px', threshold: 0 })
    alliesPreloadObserver.observe(alliesStory.value)
  }

  if (reducedMotion || !pageRoot.value || !reelStory.value) return

  mediaContext = gsap.context(() => {
    mediaMatch = gsap.matchMedia()
    mediaMatch.add({
      compact: '(max-width: 767px), (min-width: 768px) and (max-width: 1279px) and (max-height: 700px)',
      regular: '(min-width: 768px) and (min-height: 701px), (min-width: 1280px)',
    }, (matchContext) => {
      const compactMotion = Boolean(matchContext.conditions?.compact)
    if (heroLogoReveal.value) {
      const mobileReveal = compactMotion
      const stepDuration = mobileReveal ? 2.7 : 2.4
      const [r0, r1, r2, r3, r4] = mobileReveal
        ? [88, 104, 78, 96, 88] as const
        : [145, 165, 128, 154, 145] as const
      const points = [
        { x: '65%', y: '28%', radius: r0, x2: '28%', y2: '68%', r2, x3: '76%', y3: '76%', r3: r2 * 0.72, opacity: 0.78 },
        { x: '38%', y: '45%', radius: r1, x2: '58%', y2: '22%', r2: r2 * 0.82, x3: '82%', y3: '54%', r3: r3 * 0.64, opacity: 1 },
        { x: '75%', y: '58%', radius: r2, x2: '24%', y2: '34%', r2: r3 * 0.78, x3: '48%', y3: '82%', r3: r1 * 0.58, opacity: 0.82 },
        { x: '52%', y: '72%', radius: r3, x2: '78%', y2: '26%', r2: r2 * 0.9, x3: '22%', y3: '58%', r3: r0 * 0.62, opacity: 0.96 },
        { x: '30%', y: '30%', radius: r1, x2: '68%', y2: '66%', r2: r0 * 0.76, x3: '84%', y3: '38%', r3: r2 * 0.68, opacity: 0.84 },
        { x: '65%', y: '28%', radius: r4, x2: '28%', y2: '68%', r2, x3: '76%', y3: '76%', r3: r2 * 0.72, opacity: 0.78 },
      ]

      const firstPoint = points[0]
      if (firstPoint) {
        gsap.set(heroLogoReveal.value, {
          '--logo-x': firstPoint.x,
          '--logo-y': firstPoint.y,
          '--logo-radius': `${firstPoint.radius}px`,
          '--bubble-2-x': firstPoint.x2,
          '--bubble-2-y': firstPoint.y2,
          '--bubble-2-radius': `${firstPoint.r2}px`,
          '--bubble-3-x': firstPoint.x3,
          '--bubble-3-y': firstPoint.y3,
          '--bubble-3-radius': `${firstPoint.r3}px`,
          opacity: firstPoint.opacity,
        })
      }

      logoRevealTimeline = gsap.timeline({ repeat: -1, paused: true })
      points.slice(1).forEach((point) => {
        logoRevealTimeline?.to(heroLogoReveal.value, {
          '--logo-x': point.x,
          '--logo-y': point.y,
          '--logo-radius': `${point.radius}px`,
          '--bubble-2-x': point.x2,
          '--bubble-2-y': point.y2,
          '--bubble-2-radius': `${point.r2}px`,
          '--bubble-3-x': point.x3,
          '--bubble-3-y': point.y3,
          '--bubble-3-radius': `${point.r3}px`,
          opacity: point.opacity,
          duration: stepDuration,
          ease: 'sine.inOut',
        })
      })
      syncLogoReveal()
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: reelStory.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: ({ progress }) => {
          if (progress < 0.42) setActiveReel(0)
          else if (progress < 0.70) setActiveReel(1)
          else setActiveReel(2)
        },
        onLeaveBack: () => {
          syncHeroPlayback()
          syncReelPlayback()
        },
        onEnter: () => {
          setActiveReel(0)
          syncHeroPlayback()
          syncReelPlayback()
        },
        onEnterBack: () => {
          setActiveReel(2)
          syncHeroPlayback()
          syncReelPlayback()
        },
      },
    })

    timeline
      .fromTo('.reel-scene--one .reel-media', { autoAlpha: 0, y: compactMotion ? 42 : '18svh', scale: 0.82, clipPath: 'inset(16% 0 16% 0)' }, { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)', duration: 18, ease: 'power3.out' }, 0)
      .fromTo('.reel-scene--one .reel-scene__title', { autoAlpha: 0, x: compactMotion ? -32 : '-5vw' }, { autoAlpha: 1, x: 0, duration: 14, ease: 'power3.out' }, 3)
      .to('.reel-scene--one .reel-media', { x: compactMotion ? -48 : '-35vw', y: compactMotion ? -18 : '-5svh', scale: 0.7, rotation: -2, autoAlpha: 0.38, duration: 12, ease: 'power2.inOut' }, 36)
      .to('.reel-scene--one .reel-scene__title', { x: compactMotion ? -28 : '-6vw', autoAlpha: 0, duration: 9 }, 36)
      .fromTo('.reel-scene--two .reel-media', { autoAlpha: 0, x: compactMotion ? -42 : '-16vw', y: compactMotion ? 34 : '14svh', scale: 0.82 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 12, ease: 'power3.out' }, 36)
      .fromTo('.reel-scene--two .reel-scene__title', { autoAlpha: 0, x: compactMotion ? 30 : '5vw' }, { autoAlpha: 1, x: 0, duration: 11, ease: 'power3.out' }, 39)
      .to('.reel-scene--two .reel-media', { x: compactMotion ? 36 : '10vw', y: compactMotion ? -38 : '-16svh', scale: 0.72, rotation: 1.5, autoAlpha: 0.32, duration: 11, ease: 'power2.inOut' }, 64)
      .to('.reel-scene--two .reel-scene__title', { x: compactMotion ? 28 : '6vw', autoAlpha: 0, duration: 9 }, 64)
      .fromTo('.reel-scene--three .reel-media', { autoAlpha: 0, x: compactMotion ? 42 : '15vw', y: compactMotion ? 44 : '22svh', scale: 0.78 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 11, ease: 'power3.out' }, 64)
      .fromTo('.reel-scene--three .reel-scene__title', { autoAlpha: 0, x: compactMotion ? -30 : '-5vw' }, { autoAlpha: 1, x: 0, duration: 10, ease: 'power3.out' }, 67)
      .to('.reel-scene--three .reel-media', { x: compactMotion ? 44 : '18vw', y: compactMotion ? -18 : '-5svh', scale: 0.62, autoAlpha: 0.2, duration: 10, ease: 'power2.inOut' }, 90)
      .to('.reel-scene--three .reel-scene__title', { autoAlpha: 0, x: compactMotion ? -24 : '-4vw', duration: 7 }, 90)
      .fromTo('.reel-story__closing', { autoAlpha: 0, y: '7svh' }, { autoAlpha: 1, y: 0, duration: 10, ease: 'power3.out' }, 90)

      storyTimeline = timeline
    })
  }, pageRoot.value)

  if (homeContinuation.value) {
    continuationContext = gsap.context(() => {
      continuationTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.brands-story',
          start: 'top 82%',
          end: 'bottom 38%',
          scrub: 0.55,
          onEnter: () => pauseAllReels(),
          onEnterBack: () => pauseAllReels(),
        },
      })
        .from('.brands-story__title, .brands-story__copy', {
          autoAlpha: 0,
          y: '8svh',
          duration: 18,
          stagger: 3,
          ease: 'power3.out',
        }, 0)
        .from('.brands-carousel', {
          autoAlpha: 0,
          x: '6vw',
          duration: 18,
          ease: 'power3.out',
        }, 8)
        .to('.brands-story__title, .brands-story__copy, .brands-carousel', {
          autoAlpha: 0.18,
          y: '-5svh',
          duration: 12,
          ease: 'power2.inOut',
        }, 27)

    }, homeContinuation.value)
  }

  if (alliesStory.value) {
    alliesContext = gsap.context(() => {
      alliesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: alliesStory.value,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.65,
        },
      })
        .to(alliesFrameState, {
          index: ALLIES_FRAME_COUNT - 1,
          duration: 1,
          ease: 'none',
          onUpdate: () => drawAlliesFrame(),
        }, 0)
        .fromTo('.ally-scene--nitro', {
          autoAlpha: 0,
          y: '2rem',
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.08,
          ease: 'power3.out',
        }, 0.1)
        .to('.ally-scene--nitro', {
          autoAlpha: 0,
          y: '-1.5rem',
          duration: 0.08,
          ease: 'power2.inOut',
        }, 0.28)
        .fromTo('.ally-scene--modelaje', {
          autoAlpha: 0,
          y: '2rem',
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.08,
          ease: 'power3.out',
        }, 0.42)
        .to('.ally-scene--modelaje', {
          autoAlpha: 0,
          y: '-1.5rem',
          duration: 0.08,
          ease: 'power2.inOut',
        }, 0.62)
        .to('.allies-heading', {
          autoAlpha: 0,
          x: '-2vw',
          duration: 0.1,
          ease: 'power2.inOut',
        }, 0.7)
        .fromTo('.allies-cta__title', {
          autoAlpha: 0,
          y: 50,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.08,
          ease: 'power3.out',
        }, 0.74)
        .fromTo('.allies-cta__link', {
          autoAlpha: 0,
          y: 30,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.08,
          ease: 'power3.out',
        }, 0.8)
    }, alliesStory.value)
  }
})

onBeforeUnmount(() => {
  clearBrandTimer()
  storyTimeline?.scrollTrigger?.kill()
  storyTimeline?.kill()
  logoRevealTimeline?.kill()
  mediaMatch?.revert()
  continuationTimeline?.scrollTrigger?.kill()
  continuationTimeline?.kill()
  alliesTimeline?.scrollTrigger?.kill()
  alliesTimeline?.kill()
  mediaContext?.revert()
  continuationContext?.revert()
  alliesContext?.revert()
  playbackObserver?.disconnect()
  footerObserver?.disconnect()
  alliesPreloadObserver?.disconnect()
  if (progressiveFrameTimer) clearTimeout(progressiveFrameTimer)
  alliesFrames.forEach(image => { if (image) image.onload = null })
  alliesFrames.fill(undefined)
  document.removeEventListener('visibilitychange', handleVisibility)
  window.removeEventListener('resize', handleAlliesResize)
  heroVideo.value?.pause()
  pauseAllReels()
  reelVideos.value = []
})
</script>

<template>
  <main ref="pageRoot" class="home">
    <section ref="heroSection" class="hero" aria-labelledby="hero-title">
      <video
        ref="heroVideo"
        class="hero__video"
        src="/Videos/Hero1.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
      />
      <div class="hero__overlay" aria-hidden="true" />

      <div class="hero__heading">
        <p class="hero__eyebrow"><span aria-hidden="true" /> MARKETING · TECNOLOGÍA · CREATIVIDAD</p>
        <h1 id="hero-title" class="hero__title" aria-label="Impulsamos marcas que quieren crecer.">
          <span class="hero__line"><span>IMPULSAMOS</span></span>
          <span class="hero__line hero__line--offset"><span>MARCAS QUE</span></span>
          <span class="hero__line hero__line--dominant"><span>QUIEREN <strong>CRECER<em>.</em></strong></span></span>
          <span class="hero__line hero__line--tablet"><span>QUIEREN</span></span>
          <span class="hero__line hero__line--tablet"><span><strong>CRECER<em>.</em></strong></span></span>
        </h1>
      </div>

      <div
        class="hero-logo-zone"
        aria-hidden="true"
        @pointermove="handleLogoPointer"
        @pointerleave="hideLogoPointerReveal"
      >
        <img ref="heroLogoReveal" class="hero-logo-reveal" src="/LogoRobt.webp" alt="">
      </div>
    </section>

    <section ref="reelStory" class="reel-story" aria-label="Historias audiovisuales de Neo Redes">
      <div class="reel-story__stage">
        <article
          v-for="(reel, index) in reels"
          :key="reel.src"
          class="reel-scene"
          :class="`reel-scene--${reel.scene}`"
        >
          <h2 class="reel-scene__title">{{ reel.title }}<br><strong>{{ reel.emphasis }}</strong></h2>
          <div class="reel-media">
            <video
              :ref="(element) => setReelRef(element as HTMLVideoElement | null, index)"
              :src="reel.src"
              muted
              loop
              playsinline
              preload="metadata"
            />
          </div>
        </article>

        <p class="reel-story__closing">CONECTAMOS IDEAS.<br><strong>GENERAMOS RESULTADOS.</strong></p>
      </div>
    </section>

    <div ref="homeContinuation" class="home-continuation">
      <section class="brands-story" aria-labelledby="brands-title">
        <div class="brands-story__content">
          <h2 id="brands-title" class="brands-story__title">
            <span>MARCAS QUE</span>
            <strong><span>CRECEN CON</span><span>NOSOTROS.</span></strong>
          </h2>
          <p class="brands-story__copy">Cada proyecto es una relación que construimos para avanzar juntos.</p>
        </div>

        <div
          class="brands-carousel"
          role="region"
          aria-label="Marcas que crecen con nosotros"
          @mouseenter="pauseBrandAutoplay"
          @mouseleave="resumeBrandAutoplay"
        >
          <div
            class="brands-carousel__viewport"
            @pointerdown="handleBrandPointerDown"
            @pointerup="finishBrandDrag"
            @pointercancel="finishBrandDrag"
          >
            <div
              v-for="(brand, index) in brands"
              :key="brand.src"
              class="brand-slide"
              :class="{
                'brand-slide--active': brandDistance(index) === 0,
                'brand-slide--adjacent': Math.abs(brandDistance(index)) === 1,
                'brand-slide--previous': brandDistance(index) === -1,
                'brand-slide--next': brandDistance(index) === 1,
                'brand-slide--supported': brand.needsSupport,
                'brand-slide--quality': brand.name === 'Quality Rental Car',
              }"
              :aria-hidden="brandDistance(index) !== 0"
            >
              <div class="brand-slide__surface">
                <img :src="brand.src" :alt="brand.name" draggable="false">
              </div>
            </div>
          </div>

          <div class="brands-carousel__footer">
            <button type="button" aria-label="Marca anterior" @click="selectBrand(-1)">←</button>
            <p aria-live="polite">{{ brands[activeBrandIndex]?.name }}</p>
            <button type="button" aria-label="Marca siguiente" @click="selectBrand(1)">→</button>
          </div>
        </div>
      </section>

      <section ref="alliesStory" class="allies-story" aria-labelledby="allies-title">
        <div class="allies-stage">
          <div class="allies-heading">
            <h2 id="allies-title" class="allies-stage__title">
              NO TRABAJAMOS<br><strong>SOLOS.</strong>
            </h2>
            <p class="allies-stage__copy">Una red de aliados que impulsa cada proyecto.</p>
          </div>

          <div class="allies-visual">
            <canvas ref="alliesCanvas" class="allies-visual__canvas" aria-label="Secuencia visual del equipo de Neo Redes" />
            <div class="allies-visual__shade" aria-hidden="true" />

            <article class="ally-scene ally-scene--nitro">
              <a class="ally-scene__logo-link" href="https://nitro2tech.com" target="_blank" rel="noopener noreferrer" aria-label="Visitar Nitro2Tech">
                <img class="ally-scene__logo ally-scene__logo--nitro" src="/Alianzas/LOGON2T.webp" alt="Nitro2Tech">
              </a>
              <p>Tecnología y desarrollo digital.</p>
            </article>

            <article class="ally-scene ally-scene--modelaje">
              <img class="ally-scene__logo ally-scene__logo--iconic" src="/Alianzas/ICONICBLANCO.webp" alt="ICONIC">
              <p>Talento, imagen y producción.</p>
            </article>

            <div class="allies-cta">
              <h2 class="allies-cta__title">
                TU PRÓXIMO PASO<br><strong>EMPIEZA AQUÍ.</strong>
              </h2>
              <NuxtLink class="allies-cta__link" to="/soluciones#planes-abiertos">
                <span class="allies-cta__copy">
                  <small>ELIGE CÓMO QUIERES CRECER</small>
                  <strong>CONOCE NUESTROS PLANES</strong>
                </span>
                <span class="allies-cta__arrow" aria-hidden="true">↗</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>

    <a
      class="home-whatsapp"
      :class="{ 'home-whatsapp--hidden': footerIsVisible }"
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar con NEO REDES por WhatsApp"
    >
      <img src="/iconow.png" alt="" aria-hidden="true">
    </a>
  </main>
</template>

<style scoped>
.home {
  margin-top: calc(var(--header-height) * -1);
  overflow-x: clip;
  overflow-y: visible;
  background: var(--color-black);
}

.home-whatsapp {
  position: fixed;
  z-index: 18;
  right: clamp(1.25rem, 2.5vw, 2.5rem);
  bottom: clamp(1.25rem, 2.5vw, 2.5rem);
  display: grid;
  width: clamp(3.75rem, 5vw, 4.75rem);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: var(--color-cyan);
  box-shadow: 0 0.8rem 2.4rem rgba(0, 0, 0, 0.34);
  transition: opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
}

.home-whatsapp::before {
  position: absolute;
  z-index: -1;
  inset: -0.45rem;
  border: 1px solid rgba(0, 212, 224, 0.42);
  border-radius: inherit;
  content: '';
  animation: whatsapp-pulse 2.4s ease-out infinite;
}

.home-whatsapp img {
  display: block;
  width: 58%;
  height: 58%;
  object-fit: contain;
}

.home-whatsapp:hover,
.home-whatsapp:focus-visible {
  filter: brightness(1.08);
  outline: 2px solid var(--color-light);
  outline-offset: 4px;
  box-shadow: 0 1rem 2.8rem rgba(0, 212, 224, 0.28);
  transform: translateY(-4px) scale(1.04);
}

.home-whatsapp--hidden {
  pointer-events: none;
  opacity: 0;
  transform: translateY(1.5rem) scale(0.82);
}

@keyframes whatsapp-pulse {
  0% { opacity: 0.75; transform: scale(0.88); }
  75%, 100% { opacity: 0; transform: scale(1.25); }
}

.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  padding: clamp(3rem, 7vh, 6rem) var(--page-padding);
  color: var(--color-light);
}

.hero__video,
.hero__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__video {
  z-index: 0;
  object-fit: cover;
  object-position: 54% center;
}

.hero__overlay {
  z-index: 1;
  background: rgba(13, 17, 23, 0.6);
  pointer-events: none;
}

.hero__heading {
  position: relative;
  z-index: 4;
  display: flex;
  width: min(64vw, 76rem);
  min-height: calc(100svh - var(--header-height) - clamp(6rem, 14vh, 12rem));
  flex-direction: column;
  justify-content: center;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0 0 clamp(1.75rem, 3vh, 2.75rem);
  color: rgba(242, 244, 247, 0.54);
  font-family: var(--font-display);
  font-size: clamp(0.68rem, 0.8vw, 0.82rem);
  font-weight: 600;
  letter-spacing: 0.13em;
  animation: fade-up 600ms ease both;
}

.hero__eyebrow span {
  width: 0.4rem;
  height: 0.4rem;
  flex: 0 0 auto;
  background: var(--color-orange);
}

.hero__title {
  margin: 0;
  color: var(--color-light);
  font-family: var(--font-display);
  font-size: clamp(5rem, 7.2vw, 9rem);
  font-weight: 700;
  letter-spacing: -0.068em;
  line-height: 0.91;
  text-transform: uppercase;
}

.hero__line {
  display: block;
  width: max-content;
  overflow: hidden;
  white-space: nowrap;
  padding: 0.08em 0.14em 0.12em 0.02em;
  margin: -0.08em -0.14em -0.04em -0.02em;
}

.hero__line > span {
  display: block;
  animation: title-reveal 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero__line:nth-child(2) > span { animation-delay: 90ms; }
.hero__line:nth-child(3) > span { animation-delay: 180ms; }
.hero__line--offset,
.hero__line--dominant { margin-left: 0; }
.hero__line--tablet { display: none; }
.hero__line strong { color: var(--color-cyan); font-weight: inherit; }
.hero__line em { color: var(--color-orange); font-style: normal; }

.hero-logo-zone {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  width: 46%;
  height: 100%;
}

.hero-logo-reveal {
  --logo-x: 65%;
  --logo-y: 28%;
  --logo-radius: 145px;
  --bubble-2-x: 28%;
  --bubble-2-y: 68%;
  --bubble-2-radius: 128px;
  --bubble-3-x: 76%;
  --bubble-3-y: 76%;
  --bubble-3-radius: 92px;
  --cursor-x: 50%;
  --cursor-y: 50%;
  --cursor-radius: 118px;
  --cursor-opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(18rem, 34vw, 42rem);
  max-width: 88%;
  max-height: 72svh;
  object-fit: contain;
  opacity: 0.78;
  transform: translate(-50%, -50%);
  -webkit-mask-image:
    radial-gradient(circle var(--cursor-radius) at var(--cursor-x) var(--cursor-y), rgb(0 0 0 / var(--cursor-opacity)) 0%, rgb(0 0 0 / var(--cursor-opacity)) 42%, transparent 76%),
    radial-gradient(circle var(--logo-radius) at var(--logo-x) var(--logo-y), #000 0%, #000 42%, transparent 76%),
    radial-gradient(circle var(--bubble-2-radius) at var(--bubble-2-x) var(--bubble-2-y), #000 0%, #000 38%, transparent 74%),
    radial-gradient(circle var(--bubble-3-radius) at var(--bubble-3-x) var(--bubble-3-y), #000 0%, #000 36%, transparent 72%);
  mask-image:
    radial-gradient(circle var(--cursor-radius) at var(--cursor-x) var(--cursor-y), rgb(0 0 0 / var(--cursor-opacity)) 0%, rgb(0 0 0 / var(--cursor-opacity)) 42%, transparent 76%),
    radial-gradient(circle var(--logo-radius) at var(--logo-x) var(--logo-y), #000 0%, #000 42%, transparent 76%),
    radial-gradient(circle var(--bubble-2-radius) at var(--bubble-2-x) var(--bubble-2-y), #000 0%, #000 38%, transparent 74%),
    radial-gradient(circle var(--bubble-3-radius) at var(--bubble-3-x) var(--bubble-3-y), #000 0%, #000 36%, transparent 72%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  pointer-events: none;
  will-change: opacity, -webkit-mask-image, mask-image;
}

.hero-logo-zone { pointer-events: auto; }

@media (hover: hover) and (pointer: fine) {
  .hero-logo-reveal { transition: --cursor-opacity 180ms ease; }
}

.reel-story {
  position: relative;
  height: 520svh;
  color: var(--color-light);
  background: var(--color-black);
}

.reel-story__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  background: var(--color-black);
}

.reel-scene {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  display: grid;
  width: min(100%, 94rem);
  align-items: center;
  padding: calc(var(--header-height) + 1rem) var(--page-padding) 1rem;
  pointer-events: none;
  transform: translateX(-50%);
}

.reel-scene--one,
.reel-scene--three {
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.62fr);
  gap: clamp(2.5rem, 5vw, 5rem);
}

.reel-scene--two {
  grid-template-columns: minmax(18rem, 0.65fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 5vw, 5rem);
}

.reel-scene__title {
  position: relative;
  z-index: 2;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 7vw, 8rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.9;
  text-transform: uppercase;
}

.reel-scene__title strong {
  color: var(--color-cyan);
  font-weight: inherit;
}

.reel-scene--two .reel-scene__title {
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  text-align: right;
}

.reel-scene--two .reel-media {
  grid-column: 1;
  grid-row: 1;
}

.reel-media {
  position: relative;
  z-index: 1;
  overflow: hidden;
  background: #080b0e;
}

.reel-media video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reel-scene--one .reel-media {
  width: clamp(18rem, 27vw, 30rem);
  height: min(68svh, 43rem);
  justify-self: end;
  margin-right: 0;
}

.reel-scene--one video { object-position: 54% center; }

.reel-scene--two .reel-media {
  width: clamp(19rem, 30vw, 33rem);
  height: min(72svh, 46rem);
  margin-left: 0;
}

.reel-scene--two video { object-position: 44% center; }

.reel-scene--three .reel-media {
  width: clamp(22rem, 36vw, 39rem);
  height: min(62svh, 39rem);
  justify-self: end;
  margin-right: 0;
}

.reel-scene--three video { object-position: 62% 42%; }

.reel-story__closing {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  width: min(90%, 70rem);
  margin: 0;
  color: var(--color-light);
  font-family: var(--font-display);
  font-size: clamp(3rem, 6.7vw, 7.5rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.93;
  text-align: center;
  transform: translate(-50%, -50%);
}

.reel-story__closing strong {
  color: var(--color-cyan);
  font-weight: inherit;
}

.home-continuation {
  position: relative;
  color: var(--color-light);
  background:
    linear-gradient(180deg, var(--color-black) 0%, #101820 38%, var(--color-black) 72%),
    var(--color-black);
}

.brands-story {
  position: relative;
  display: flex;
  min-height: 100svh;
  overflow: hidden;
  padding: clamp(4.5rem, 7vw, 7rem) var(--page-padding);
}

.brands-story {
  min-height: 88svh;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 0;
  padding-right: max(var(--page-padding), calc((100vw - 96rem) / 2));
  padding-left: max(var(--page-padding), calc((100vw - 96rem) / 2));
  background: var(--color-black);
}

.brands-story::before,
.allies-story::before {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 224, 0.4), transparent);
  content: '';
  inset: 0 var(--page-padding) auto;
}

.brands-story__content {
  position: relative;
  z-index: 2;
  display: flex;
  width: min(38rem, 100%);
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.5rem, 2.5vw, 2.5rem);
}

.brands-story__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(4rem, 7.5vw, 9rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.9;
  text-transform: uppercase;
}

.brands-story__title strong {
  color: var(--color-cyan);
  font-weight: inherit;
}

.brands-story__title { font-size: clamp(3.3rem, 4.7vw, 6.4rem); }

.brands-story__title > span,
.brands-story__title strong,
.brands-story__title strong span {
  display: block;
  white-space: nowrap;
}

.brands-story__copy {
  max-width: 25rem;
  margin: 0;
  color: rgba(242, 244, 247, 0.68);
  font-size: clamp(1rem, 1.35vw, 1.3rem);
  line-height: 1.65;
}

.brands-carousel {
  position: relative;
  z-index: 2;
  left: clamp(-6rem, -5vw, -3rem);
  width: calc(100% + var(--page-padding));
  margin-right: calc(-1 * var(--page-padding));
  user-select: none;
}

.brands-carousel__viewport {
  position: relative;
  height: clamp(19rem, 34vw, 29rem);
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
}

.brands-carousel__viewport:active { cursor: grabbing; }

.brand-slide {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: clamp(15rem, 28vw, 27rem);
  height: clamp(13rem, 20vw, 17.5rem);
  place-items: center;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.42);
  transition: transform 780ms cubic-bezier(0.22, 1, 0.36, 1), opacity 780ms ease-in-out;
}

.brand-slide--active {
  z-index: 2;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.brand-slide--adjacent {
  z-index: 1;
  opacity: 0;
}

.brand-slide--previous {
  transform: translate(calc(-50% - 25vw), -50%) scale(0.62);
  transition: none;
}
.brand-slide--next { transform: translate(calc(-50% + 25vw), -50%) scale(0.62); }

.brand-slide__surface {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  padding: clamp(0.5rem, 1.5vw, 1.25rem);
}

.brand-slide--supported .brand-slide__surface {
  background: radial-gradient(ellipse at center, rgba(242, 244, 247, 0.065), rgba(242, 244, 247, 0) 70%);
}

.brand-slide img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 17.5rem;
  object-fit: contain;
  pointer-events: none;
}

.brand-slide--quality img {
  width: 80%;
  height: 80%;
}

.brands-carousel__footer {
  display: grid;
  width: min(33rem, calc(100% - (2 * var(--page-padding))));
  min-height: 2.5rem;
  grid-template-columns: 2rem minmax(0, 1fr) 2rem;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
}

.brands-carousel__footer p {
  margin: 0;
  color: rgba(242, 244, 247, 0.54);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-align: center;
  text-transform: uppercase;
}

.brands-carousel__footer button {
  border: 0;
  padding: 0.25rem;
  color: rgba(242, 244, 247, 0.62);
  background: transparent;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: color 180ms ease, transform 180ms ease;
}

.brands-carousel__footer button:hover { color: var(--color-cyan); transform: translateX(2px); }
.brands-carousel__footer button:first-child:hover { transform: translateX(-2px); }
.brands-carousel__footer button:focus-visible { outline: 1px solid var(--color-cyan); outline-offset: 0.25rem; }

.allies-story {
  position: relative;
  height: 460svh;
  background: var(--color-black);
}

.allies-stage {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

.allies-heading {
  position: absolute;
  top: 48%;
  left: clamp(5rem, 8vw, 10rem);
  z-index: 3;
  width: min(43vw, 42rem);
  transform: translateY(-50%);
}

.allies-stage__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 7.3vw, 8.7rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.9;
  text-transform: uppercase;
}

.allies-stage__title strong { color: var(--color-cyan); font-weight: inherit; }

.allies-stage__copy {
  max-width: 25rem;
  margin: clamp(1.5rem, 2.5vw, 2.5rem) 0 0;
  color: rgba(242, 244, 247, 0.78);
  font-size: clamp(0.95rem, 1.2vw, 1.15rem);
  line-height: 1.55;
}

.allies-visual {
  position: absolute;
  z-index: 0;
  overflow: hidden;
  inset: 0;
}

.allies-visual__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.allies-visual__shade {
  position: absolute;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(13, 17, 23, 0.56) 0%, rgba(13, 17, 23, 0.3) 34%, transparent 62%),
    rgba(13, 17, 23, 0.28);
  pointer-events: none;
  inset: 0;
}

.ally-scene {
  position: absolute;
  top: 35%;
  right: clamp(5rem, 9vw, 11rem);
  z-index: 2;
  width: min(34vw, 31rem);
  opacity: 0;
  text-align: right;
}

.ally-scene--modelaje { top: auto; right: clamp(7rem, 14vw, 16rem); bottom: 19%; }

.ally-scene__logo-link { display: inline-block; }

.ally-scene__logo {
  display: block;
  height: auto;
  margin-left: auto;
  object-fit: contain;
}

.ally-scene__logo--nitro { width: clamp(14rem, 22vw, 24rem); }
.ally-scene__logo--iconic { width: clamp(10rem, 16vw, 16rem); max-height: 13rem; }

.ally-scene p {
  margin: 0.8rem 0 0;
  color: rgba(242, 244, 247, 0.82);
  font-size: clamp(0.9rem, 1.2vw, 1.15rem);
}

.allies-cta {
  position: absolute;
  top: 52%;
  left: 50%;
  z-index: 3;
  display: flex;
  width: min(70rem, calc(100% - (2 * var(--page-padding))));
  align-items: center;
  flex-direction: column;
  gap: clamp(2.5rem, 4vw, 4rem);
  text-align: center;
  transform: translate(-50%, -50%);
}

.allies-cta__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(4rem, 7.2vw, 8.5rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.9;
  text-transform: uppercase;
}

.allies-cta__title strong { color: var(--color-cyan); font-weight: inherit; }

.allies-cta__link {
  position: relative;
  display: grid;
  width: min(42rem, 100%);
  min-height: 6rem;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  padding: 1.15rem 1.2rem 1.15rem 1.65rem;
  border: 1px solid rgba(0, 212, 224, 0.48);
  border-radius: 999px;
  color: var(--color-light);
  background: rgba(13, 17, 23, 0.76);
  box-shadow: 0 1.25rem 3.5rem rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
  font-family: var(--font-display);
  text-align: left;
  text-decoration: none;
  transition: border-color 320ms ease, box-shadow 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.allies-cta__link::before {
  position: absolute;
  z-index: 0;
  background: linear-gradient(105deg, rgba(0, 212, 224, 0.16), rgba(0, 212, 224, 0.04));
  content: '';
  inset: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.allies-cta__link::after {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 5rem;
  height: 2px;
  background: var(--color-orange);
  content: '';
  transform: translateX(-100%);
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.allies-cta__link > span {
  position: relative;
  z-index: 2;
}

.allies-cta__copy { display: flex; flex-direction: column; gap: 0.35rem; }
.allies-cta__copy small { color: var(--color-cyan); font-size: clamp(0.52rem, 0.65vw, 0.62rem); font-weight: 600; letter-spacing: 0.18em; }
.allies-cta__copy strong { font-size: clamp(0.75rem, 1vw, 0.92rem); font-weight: 700; letter-spacing: 0.1em; }

.allies-cta__arrow {
  display: grid;
  width: 3.55rem;
  height: 3.55rem;
  place-items: center;
  border-radius: 50%;
  color: var(--color-black);
  background: var(--color-cyan);
  font-size: 1.35rem;
  transition: color 260ms ease, background 260ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.allies-cta__link:hover,
.allies-cta__link:focus-visible {
  border-color: var(--color-cyan);
  box-shadow: 0 1.6rem 4rem rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(0, 212, 224, 0.12);
  transform: translateY(-4px);
}

.allies-cta__link:hover::before,
.allies-cta__link:focus-visible::before { transform: scaleX(1); }

.allies-cta__link:hover::after,
.allies-cta__link:focus-visible::after { transform: translateX(calc(42rem - 5rem)); }

.allies-cta__link:hover .allies-cta__arrow,
.allies-cta__link:focus-visible .allies-cta__arrow {
  color: var(--color-cyan);
  background: var(--color-light);
  transform: rotate(45deg);
}

.allies-cta__link:focus-visible {
  outline: 2px solid var(--color-orange);
  outline-offset: 0.45rem;
}

@keyframes title-reveal {
  from { opacity: 0; transform: translateY(110%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(1.25rem); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .hero__heading { width: 72%; }
  .hero__eyebrow { max-width: 25rem; font-size: clamp(.66rem, .78vw, .76rem); }
  .hero__title { font-size: clamp(4.5rem, 7vw, 6.3rem); }
  .hero-logo-zone { right: -1%; width: 34%; }
  .hero-logo-reveal { width: min(31vw, 24rem); max-width: 94%; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .hero__heading { width: 68%; }
  .hero__eyebrow { max-width: 22rem; font-size: clamp(.62rem, 1.05vw, .72rem); line-height: 1.45; }
  .hero__title { font-size: clamp(4.4rem, 8vw, 5.75rem); }
  .hero__line--dominant { display: none; }
  .hero__line--tablet { display: block; }
  .hero-logo-zone { top: 14%; right: -1%; width: 34%; height: 76%; }
  .hero-logo-reveal { width: min(31vw, 22rem); max-width: 94%; max-height: 62svh; }
}

@media (min-width: 768px) and (max-width: 1100px) {

  .brands-story { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 1.5rem; }

  .brands-story__title { font-size: clamp(2.7rem, 5vw, 4.1rem); }
  .brand-slide { width: clamp(13rem, 29vw, 19rem); }
  .brand-slide--previous { transform: translate(calc(-50% - 24vw), -50%) scale(0.6); }
  .brand-slide--next { transform: translate(calc(-50% + 24vw), -50%) scale(0.6); }

  .allies-heading { left: 3.5rem; }
  .allies-stage__title { font-size: clamp(3.5rem, 7vw, 5.2rem); }
  .ally-scene { right: 4rem; }
  .ally-scene--modelaje { right: 7rem; }
  .ally-scene__logo--nitro { width: clamp(14rem, 28vw, 20rem); }
  .ally-scene__logo--iconic { width: clamp(10rem, 19vw, 14rem); }
  .allies-cta__title { font-size: clamp(3.6rem, 7vw, 5.5rem); }
}

@media (max-width: 767px) {
  .hero {
    min-height: calc(100svh - var(--header-height));
    padding-block: 3.5rem;
  }

  .hero__video {
    object-position: 56% center;
  }

  .hero__heading { width: 100%; }
  .hero__eyebrow { max-width: 18rem; line-height: 1.5; }

  .hero__title {
    font-size: clamp(2.2rem, 9.7vw, 4rem);
    letter-spacing: -0.06em;
    line-height: 0.91;
  }

  .hero__line--offset,
  .hero__line--dominant { margin-left: 0; }

  .hero-logo-zone {
    top: 52%;
    width: 56%;
    height: 48%;
  }

  .hero-logo-reveal {
    --logo-radius: 88px;
    --bubble-2-radius: 68px;
    --bubble-3-radius: 48px;
    --cursor-radius: 82px;
    width: min(64vw, 22rem);
    max-width: 94%;
    max-height: 52svh;
  }
}

@media (max-width: 767px) {
  .reel-story { height: 440svh; }

  .reel-story__stage {
    min-height: 42rem;
  }

  .reel-scene,
  .reel-scene--one,
  .reel-scene--two,
  .reel-scene--three {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: clamp(1rem, 3vh, 2rem);
    padding: calc(var(--header-height) + .75rem) var(--page-padding) 1.5rem;
  }

  .reel-scene__title,
  .reel-scene--two .reel-scene__title {
    align-self: stretch;
    justify-self: auto;
    font-size: clamp(2.05rem, 10.5vw, 4.5rem);
    text-align: left;
  }

  .reel-scene--two .reel-scene__title { order: 1; }
  .reel-scene--two .reel-media { order: 2; }

  .reel-scene .reel-media {
    width: min(72vw, 18rem);
    height: min(43svh, 25rem);
    margin: 0;
  }

  .reel-scene--one .reel-media,
  .reel-scene--three .reel-media { align-self: flex-end; }

  .reel-scene--two .reel-media { align-self: flex-start; }

  .reel-scene--three .reel-media {
    width: min(82vw, 20rem);
    height: min(40svh, 23rem);
  }

  .reel-story__closing {
    width: calc(100% - (2 * var(--page-padding)));
    font-size: clamp(2.4rem, 11vw, 4rem);
    text-align: left;
  }

  .brands-story {
    min-height: auto;
    overflow: hidden;
    padding-block: clamp(7rem, 24vw, 10rem);
  }

  .brands-story {
    min-height: 92svh;
    display: block;
  }

  .brands-story__content {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 2.5rem;
  }

  .brands-story__title {
    width: 100%;
    font-size: clamp(2.65rem, 12vw, 4rem);
    line-height: 0.93;
  }

  .brands-story__title { font-size: clamp(2.2rem, 10.2vw, 3.4rem); }

  .brands-story__copy {
    max-width: 24rem;
    font-size: 1rem;
  }

  .brands-carousel {
    left: 0;
    width: calc(100% + (2 * var(--page-padding)));
    margin-right: calc(-1 * var(--page-padding));
    margin-left: calc(-1 * var(--page-padding));
    margin-top: clamp(2.5rem, 10vw, 4rem);
  }

  .brands-carousel__viewport {
    height: clamp(14rem, 66vw, 18rem);
  }

  .brand-slide {
    width: min(74vw, 20rem);
    height: clamp(11rem, 54vw, 15rem);
    transform: translate(-50%, -50%) scale(0.4);
  }

  .brand-slide--active {
    transform: translate(-50%, -50%) scale(1);
  }

  .brand-slide--adjacent {
    opacity: 0;
  }

  .brand-slide--previous { transform: translate(calc(-50% - 54vw), -50%) scale(0.58); }
  .brand-slide--next { transform: translate(calc(-50% + 54vw), -50%) scale(0.58); }

  .brands-carousel__footer {
    width: calc(100% - (2 * var(--page-padding)));
  }

  .brands-carousel__footer p {
    font-size: 0.62rem;
    letter-spacing: 0.1em;
  }

  .allies-story {
    height: 420svh;
    padding: 0;
  }

  .allies-stage {
    position: sticky;
    top: 0;
    display: block;
    height: 100svh;
    overflow: hidden;
    padding: 0;
  }

  .allies-heading {
    top: 31%;
    left: var(--page-padding);
    width: calc(100% - (2 * var(--page-padding)));
  }

  .allies-stage__title {
    font-size: clamp(3rem, 13vw, 5.2rem);
    line-height: 0.9;
  }

  .allies-stage__copy { max-width: 19rem; margin-top: 1.25rem; font-size: 0.9rem; }

  .allies-visual {
    height: 100%;
    margin: 0;
  }

  .allies-visual__shade {
    background:
      linear-gradient(180deg, rgba(13, 17, 23, 0.44), transparent 34%, transparent 68%, rgba(13, 17, 23, 0.5)),
      rgba(13, 17, 23, 0.34);
  }

  .ally-scene { top: auto; right: var(--page-padding); bottom: 14%; width: 84%; }
  .ally-scene--modelaje { right: auto; bottom: 17%; left: var(--page-padding); text-align: left; }
  .ally-scene__logo { max-width: 78vw; }
  .ally-scene--modelaje .ally-scene__logo { margin-right: auto; margin-left: 0; }
  .ally-scene__logo--nitro { width: clamp(13rem, 68vw, 20rem); }
  .ally-scene__logo--iconic { width: clamp(9rem, 43vw, 13rem); }

  .allies-cta {
    top: 53%;
    width: calc(100% - (2 * var(--page-padding)));
    gap: 2.5rem;
  }

  .allies-cta__title { font-size: clamp(2.6rem, 11vw, 4rem); }

  .allies-cta__link {
    min-height: 4.5rem;
    gap: 1rem;
    padding: 0.7rem 0.7rem 0.7rem 1.15rem;
  }
  .allies-cta__copy small { font-size: 0.47rem; }
  .allies-cta__copy strong { font-size: 0.63rem; }
  .allies-cta__arrow { width: 3rem; height: 3rem; }
}

@media (min-width: 768px) and (max-width: 1279px) and (max-height: 700px) {
  .hero { min-height: 100svh; padding: calc(var(--header-height) + .5rem) var(--page-padding) 1rem; }
  .hero__heading { width: 72%; min-height: calc(100svh - var(--header-height) - 1.5rem); }
  .hero__eyebrow { max-width: 24rem; margin-bottom: clamp(1rem, 2.5vh, 1.5rem); font-size: clamp(.58rem, .75vw, .7rem); }
  .hero__title { max-width: none; font-size: clamp(3.4rem, min(6.2vw, 11vh), 5.3rem); }
  .hero__line--dominant { display: block; }
  .hero__line--tablet { display: none; }
  .hero-logo-zone { top: 17%; right: -1%; width: 29%; height: 72%; }
  .hero-logo-reveal { width: min(24vw, 17rem); max-width: 96%; max-height: 62svh; }

  .reel-story { height: 400svh; }
  .reel-scene,
  .reel-scene--one,
  .reel-scene--two,
  .reel-scene--three {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;
    padding: calc(var(--header-height) + .5rem) var(--page-padding) 1rem;
  }
  .reel-scene__title,
  .reel-scene--two .reel-scene__title { position: static; width: min(52%, 26rem); font-size: clamp(2.1rem, 5vw, 3.25rem); text-align: left; }
  .reel-scene .reel-media,
  .reel-scene--three .reel-media { position: static; width: min(28vw, 14rem); height: min(68svh, 18rem); margin: 0; }
  .reel-story__closing { width: min(70%, 36rem); font-size: clamp(2rem, 4.8vw, 3.25rem); text-align: left; }

  .brands-story { min-height: 100svh; padding-block: 3rem; }
  .brands-story__title { font-size: clamp(2.5rem, 5vw, 3.5rem); }
  .brands-carousel__viewport { height: min(56svh, 17rem); }

  .allies-story { height: 380svh; }
  .allies-stage__title { font-size: clamp(2.6rem, 5.5vw, 3.8rem); }
  .allies-heading { top: 22%; }
  .ally-scene { bottom: 9%; }
  .ally-scene__logo--nitro { width: min(24vw, 14rem); }
  .ally-scene__logo--iconic { width: min(17vw, 10rem); }
  .allies-cta { top: 46%; gap: 1.25rem; }
  .allies-cta__title { font-size: clamp(2.3rem, 5vw, 3.4rem); }
}

@media (max-width: 390px) {
  .hero { padding-inline: clamp(1.1rem, 5vw, 1.35rem); }
  .hero__eyebrow { font-size: .55rem; letter-spacing: .12em; }
  .hero__title { font-size: clamp(2rem, 10vw, 2.45rem); }
  .reel-scene,
  .reel-scene--one,
  .reel-scene--two,
  .reel-scene--three { padding-inline: clamp(1.1rem, 5vw, 1.35rem); }
  .reel-scene__title,
  .reel-scene--two .reel-scene__title { font-size: clamp(1.95rem, 10vw, 2.45rem); }
  .allies-stage__title { font-size: clamp(2.55rem, 12vw, 3.2rem); }
  .allies-cta__title { font-size: clamp(2.2rem, 10.5vw, 2.8rem); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__eyebrow,
  .hero__line > span { animation: none; opacity: 1; transform: none; }

  .hero-logo-reveal {
    --logo-x: 52%;
    --logo-y: 48%;
    --logo-radius: 145px;
    opacity: 0.86 !important;
  }

  .reel-story {
    height: auto;
    padding: 5rem var(--page-padding);
  }

  .reel-story__stage {
    position: static;
    display: grid;
    height: auto;
    gap: 6rem;
    overflow: visible;
  }

  .reel-scene {
    position: static;
    display: grid;
    left: auto;
    width: 100%;
    min-height: 75svh;
    padding: 0;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
  }

  .reel-scene__title,
  .reel-media {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
  }

  .reel-story__closing {
    position: static;
    width: 100%;
    opacity: 1 !important;
    text-align: left;
    transform: none !important;
  }

  .brands-story__title,
  .brands-story__copy,
  .brands-carousel,
  .allies-stage__title,
  .allies-heading,
  .allies-stage__copy,
  .ally-scene,
  .allies-cta,
  .allies-cta__title,
  .allies-cta__link {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
  }

  .brand-slide { transition-duration: 0.01ms; }

  .allies-story { height: auto; padding: clamp(6rem, 12vw, 9rem) var(--page-padding); }
  .allies-stage { position: static; display: block; height: auto; overflow: visible; padding: 0; }
  .allies-heading { position: relative; top: auto; left: auto; width: 100%; }
  .allies-visual { position: relative; display: grid; height: auto; gap: 2.5rem; overflow: visible; margin: 4rem 0 0; inset: auto; }
  .allies-visual__canvas { width: 100%; aspect-ratio: 16 / 9; }
  .allies-visual__shade { display: none; }
  .ally-scene,
  .ally-scene--modelaje { position: relative; top: auto; right: auto; bottom: auto; width: 100%; opacity: 1 !important; text-align: left; }
  .allies-cta { position: relative; top: auto; left: auto; width: 100%; }
}

@media (max-width: 767px) and (prefers-reduced-motion: reduce) {
  .hero-logo-reveal { --logo-radius: 92px; }
}
</style>
