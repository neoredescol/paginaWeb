<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { responsiveConditions } from '~/utils/responsive'

useSeoMeta({
  title: 'Soluciones de Marketing Digital y Tecnología | NEO REDES',
  description: 'Descubre soluciones de marketing digital, diseño web, automatización, producción audiovisual y modelos para hacer crecer tu marca o empresa.',
  ogTitle: 'Soluciones de Marketing Digital y Tecnología | NEO REDES',
  ogDescription: 'Descubre soluciones de marketing digital, diseño web, automatización, producción audiovisual y modelos para hacer crecer tu marca o empresa.',
  ogUrl: 'https://neo-redes.com/soluciones',
  ogType: 'website',
  ogSiteName: 'NEO REDES',
  ogLocale: 'es_CO',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://neo-redes.com/soluciones' }],
})

const pageRoot = ref<HTMLElement | null>(null)
const backgroundVideo = ref<HTMLVideoElement | null>(null)
let disposePlans: (() => void) | undefined
let disposeNarrative: (() => void) | undefined

const playBackgroundVideo = () => {
  const video = backgroundVideo.value
  if (!video) return

  void video.play().catch((error: unknown) => {
    if (!import.meta.dev) return
    const name = typeof error === 'object' && error !== null && 'name' in error
      ? String((error as { name?: unknown }).name ?? 'UnknownError')
      : 'UnknownError'
    console.debug(`[video] Soluciones play failed: ${name}`)
  })
}
const handleVisibility = () => {
  if (document.hidden) backgroundVideo.value?.pause()
  else playBackgroundVideo()
}

const companyServices = [
  { name: 'MARKETING' },
  { name: 'DISEÑO WEB' },
  { name: 'AUTOMATIZACIÓN' },
  { name: 'PRODUCCIÓN AUDIOVISUAL', split: true },
  { name: 'MODELOS' },
]

const modelCategories = ['MODELOS', 'SERVICIOS', 'PORTAFOLIO', 'CASTING']
const iconic = { name: 'ICONIC', url: null as string | null }

interface PlanGroup {
  name: string
  features: string[]
}

interface Plan {
  eyebrow: string
  name: string
  description: string
  price: number
  currency: 'COP'
  billing: 'mes'
  features: string[]
  groups: PlanGroup[]
  cta: string
}

const plans: Plan[] = [
  {
    eyebrow: 'PARA EMPEZAR',
    name: 'Esencial',
    description: 'Todo lo que necesitas para comenzar a construir tu presencia digital.',
    price: 350000,
    currency: 'COP',
    billing: 'mes',
    features: ['2 Reels mensuales', '6 diseños gráficos', '10 historias mensuales', 'Programación de publicaciones', 'Administración básica de redes Facebook - Instagram', 'Hashtags estratégicos'],
    groups: [],
    cta: 'Elegir Esencial',
  },
  {
    eyebrow: 'MÁS CONTENIDO, MÁS RESULTADOS',
    name: 'Básico',
    description: 'Una presencia digital activa, ordenada y constante para impulsar tu negocio en redes sociales.',
    price: 590000,
    currency: 'COP',
    billing: 'mes',
    features: ['4 Reels mensuales', '8 diseños gráficos', '12 historias mensuales', 'Calendario de contenido básico', 'Programación de publicaciones', 'Administración básica de redes', 'Diseño de copies para publicaciones', 'Hashtags estratégicos', 'Informe mensual básico de resultados'],
    groups: [],
    cta: 'Elegir Básico',
  },
  {
    eyebrow: 'MÁS ALCANCE, MÁS OPORTUNIDADES, MÁS VENTAS',
    name: 'Pro',
    description: 'Una solución de marketing digital para acelerar tu crecimiento.',
    price: 950000,
    currency: 'COP',
    billing: 'mes',
    features: ['6 Reels mensuales', '10 diseños gráficos', '15 historias mensuales', 'Calendario de contenido básico', 'Programación de publicaciones', 'Administración completa de redes Instagram - Facebook - TikTok', 'Configuración completa de campañas', 'Diseño de copies para publicaciones', 'Hashtags estratégicos', 'Informe mensual de resultados', 'Informe de métricas'],
    groups: [],
    cta: 'Elegir Pro',
  },
  {
    eyebrow: 'ESTRATEGIA DIGITAL INTEGRAL',
    name: 'Premium',
    description: 'Una estrategia completa para posicionar y hacer crecer tu marca.',
    price: 1450000,
    currency: 'COP',
    billing: 'mes',
    features: [],
    groups: [
      { name: 'CREACIÓN DE CONTENIDO', features: ['8 Reels estratégicos mensuales', '12 diseños gráficos profesionales', '20 historias mensuales con enfoque en interacción', 'Diseño de contenido alineado con la identidad de marca'] },
      { name: 'GESTIÓN DE REDES SOCIALES', features: ['Calendario de contenido mensual', 'Programación y publicación de contenidos', 'Administración integral de Instagram, Facebook y TikTok', 'Gestión y optimización de perfiles digitales'] },
      { name: 'ESTRATEGIA Y CRECIMIENTO DIGITAL', features: ['Estrategia digital personalizada según objetivos del negocio', 'Campañas publicitarias en Meta Ads y Google Ads', 'Administración y optimización de Google Business Profile', 'Automatización y gestión inteligente de redes sociales'] },
      { name: 'MEDICIÓN Y POSICIONAMIENTO', features: ['Analítica digital y reportes de resultados', 'Branding e identidad corporativa', 'Recomendaciones estratégicas para mejorar la presencia online'] },
    ],
    cta: 'Elegir Premium',
  },
]

const formatPrice = (price: number) => `$${new Intl.NumberFormat('es-CO').format(price)}`
const planWhatsappUrl = (plan: Plan) => `https://wa.me/573205520676?text=${encodeURIComponent(`Hola, quiero información sobre el plan ${plan.name} de NEO REDES.`)}`

// Phase 3A owns only the narrative. The legacy plans context below stays separate.
onMounted(() => {
  if (!pageRoot.value) return
  gsap.registerPlugin(ScrollTrigger)
  let narrativeMatch: gsap.MatchMedia | undefined
  let frame = 0
  let disposed = false
  let firstBuild = true
  let resizeScroll: number | undefined
  const rebuild = () => {
    const scrollPosition = resizeScroll ?? window.scrollY
    narrativeMatch?.revert()
    narrativeMatch = gsap.matchMedia()
    narrativeMatch.add({ ...responsiveConditions, reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      if (context.conditions?.reduced || !pageRoot.value) return
      const root = pageRoot.value
      root.classList.add('narrative-ready')
      const mobile = Boolean(context.conditions?.mobile)
      const tablet = Boolean(context.conditions?.tablet)
      const low = Boolean(context.conditions?.low)
      const shift = () => mobile ? 24 : tablet ? 30 : Math.min(window.innerWidth * .035, context.conditions?.large ? 80 : 60)
      if (firstBuild && window.scrollY < 1) {
        gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } })
          .from('.hero-word--left', { x: () => -shift(), opacity: 0 }, .1)
          .from('.hero-word--right', { x: shift, opacity: 0 }, .25)
          .from('.solutions-hero__aside', { x: () => shift() * .55, opacity: 0 }, .55)
      }
      firstBuild = false
      gsap.timeline({ scrollTrigger: { trigger: '.solutions-hero', start: 'top top', end: 'bottom top', scrub: .65, invalidateOnRefresh: true } })
        .to('.solutions-hero__title', { x: () => -shift() * .5, scale: .95, opacity: .38, duration: 1 })
        .to('.solutions-hero__aside', { x: () => shift() * .4, opacity: .35, duration: 1 }, '<')

      const services = gsap.utils.toArray<HTMLElement>('.service-name', root)
      if (mobile) {
        gsap.from('.enterprise-heading > *', { y: 20, opacity: 0, stagger: .12, scrollTrigger: { trigger: '.enterprise-heading', start: 'top 90%', end: 'bottom 60%', scrub: .6, invalidateOnRefresh: true } })
        services.forEach((service, index) => gsap.from(service, {
          x: () => index % 2 ? -24 : 24, y: 16, opacity: 0,
          scrollTrigger: { trigger: service, start: 'top 95%', end: 'top 70%', scrub: .6, invalidateOnRefresh: true },
        }))
      } else {
        gsap.set(services, { yPercent: -50, y: 0, autoAlpha: 0 })
        const sequence = gsap.timeline({ scrollTrigger: { trigger: '.enterprise-world', start: 'top 65%', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true } })
          .from('.enterprise-heading > *', { x: () => -shift(), opacity: 0, stagger: .1, duration: .5 })
        services.forEach((service, index) => {
          if (index) sequence.to(services[index - 1]!, { x: () => -Math.min(shift(), 30), y: low ? -10 : -18, autoAlpha: 0, duration: .35 })
          sequence.fromTo(service, { x: () => (index % 2 ? -1 : 1) * Math.min(shift(), 32), autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: .6, ease: 'power2.out' })
          sequence.to({}, { duration: .25 })
        })
      }
      // Reveal NEO MODELS while the final MODELOS service is leaving the viewport.
      gsap.timeline({ scrollTrigger: { trigger: '.models-world', start: 'top 90%', end: mobile ? 'top 35%' : 'top top', scrub: .65, invalidateOnRefresh: true } })
        .from('.models-heading', { scale: .96, opacity: 0, duration: 1 })
        .from('.models-alliance', { y: low ? 10 : 18, opacity: 0, duration: .7 }, .25)
      const categories = gsap.utils.toArray<HTMLElement>('.model-category', root)
      if (mobile) {
        categories.forEach((category, index) => gsap.from(category, {
          x: () => index % 2 ? -24 : 24, opacity: 0,
          scrollTrigger: { trigger: category, start: 'top 95%', end: 'top 70%', scrub: .6, invalidateOnRefresh: true },
        }))
      } else {
        gsap.timeline({ scrollTrigger: { trigger: '.models-world', start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true } })
          .from(categories[0]!, { x: () => -shift() * .7, opacity: 0, duration: .8 })
          .from(categories[1]!, { x: () => shift() * .7, opacity: 0, duration: .8 }, '-=.2')
          .from(categories[2]!, { y: low ? 20 : 35, opacity: 0, duration: .8 }, '-=.2')
          .from(categories[3]!, { x: () => shift() * .55, opacity: 0, duration: .8 }, '-=.2')
      }
      return () => root.classList.remove('narrative-ready')
    }, pageRoot.value!)
    ScrollTrigger.refresh()
    window.scrollTo({ top: scrollPosition, behavior: 'instant' })
    ScrollTrigger.update()
    resizeScroll = undefined
  }
  const scheduleRebuild = () => {
    resizeScroll ??= window.scrollY
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => { if (!disposed) rebuild() })
  }
  window.addEventListener('resize', scheduleRebuild, { passive: true, capture: true })
  window.addEventListener('orientationchange', scheduleRebuild, { passive: true, capture: true })
  document.fonts.ready.then(() => { if (!disposed) scheduleRebuild() })
  rebuild()
  disposeNarrative = () => {
    disposed = true
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', scheduleRebuild, true)
    window.removeEventListener('orientationchange', scheduleRebuild, true)
    narrativeMatch?.revert()
  }
})

// Plans have an independent lifecycle: resizing them never reverts the 3A scenes.
onMounted(() => {
  const section = pageRoot.value?.querySelector<HTMLElement>('#planes')
  if (!section) return
  document.addEventListener('visibilitychange', handleVisibility)
  playBackgroundVideo()
  gsap.registerPlugin(ScrollTrigger)
  const stage = section.querySelector<HTMLElement>('.plans-stage')!
  const deck = section.querySelector<HTMLElement>('.plans-deck')!
  const cards = Array.from(section.querySelectorAll<HTMLElement>('.plan-card'))
  const inners = cards.map(card => card.querySelector<HTMLElement>('.plan-card__inner')!)
  let media: gsap.MatchMedia | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let disposed = false
  let pendingScroll: number | undefined
  let lastWidth = 0
  let lastHeight = 0
  let timeline: gsap.core.Timeline | undefined
  const viewportHeight = () => window.visualViewport?.height ?? window.innerHeight
  type PlansStoryState = {
    mode: 'desktop' | 'tablet' | 'mobile'
    phase: 'intro' | 'enter' | 'flip' | 'read' | 'exit' | 'final'
    activePlan: number
    localProgress: number
  }
  const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
  const captureStoryState = (current: gsap.core.Timeline, currentMode: PlansStoryState['mode']): PlansStoryState | undefined => {
    const time = current.time()
    const labels = current.labels
    const label = (name: string) => labels[name]
    if (time <= 0) return { mode: currentMode, phase: 'intro', activePlan: 0, localProgress: 0 }
    if (currentMode === 'desktop') {
      if (time < 1.55) return { mode: currentMode, phase: 'enter', activePlan: 0, localProgress: clamp01(time / 1.55) }
      if (time < 2.9) return { mode: currentMode, phase: 'flip', activePlan: 0, localProgress: clamp01((time - 1.55) / 1.35) }
      const end = current.duration()
      return { mode: currentMode, phase: time < end - .5 ? 'read' : 'final', activePlan: 3, localProgress: clamp01((time - 2.9) / Math.max(end - 2.9, .001)) }
    }
    for (let index = cards.length - 1; index >= 0; index -= 1) {
      const entry = label(`entry-${index}`) ?? (index === 0 ? .25 : undefined)
      const read = label(`read-${index}`)
      const cta = label(`cta-${index}`)
      if (entry === undefined || read === undefined || cta === undefined || time < entry) continue
      const nextEntry = label(`entry-${index + 1}`) ?? current.duration()
      if (time < read) return { mode: currentMode, phase: 'flip', activePlan: index, localProgress: clamp01((time - entry) / Math.max(read - entry, .001)) }
      if (time <= cta) return { mode: currentMode, phase: 'read', activePlan: index, localProgress: clamp01((time - read) / Math.max(cta - read, .001)) }
      if (time < nextEntry) return { mode: currentMode, phase: index === cards.length - 1 ? 'final' : 'exit', activePlan: index, localProgress: clamp01((time - cta) / Math.max(nextEntry - cta, .001)) }
    }
    return { mode: currentMode, phase: 'intro', activePlan: 0, localProgress: 0 }
  }
  const stateTime = (state: PlansStoryState, target: gsap.core.Timeline, targetMode: PlansStoryState['mode']) => {
    const labels = target.labels
    const label = (name: string) => labels[name]
    const index = Math.min(cards.length - 1, Math.max(0, state.activePlan))
    if (targetMode === 'desktop') {
      if (state.phase === 'intro' || state.phase === 'enter') return clamp01(state.localProgress) * 1.55
      if (state.phase === 'flip') return 1.55 + clamp01(state.localProgress) * 1.35
      const start = label('fronts') ?? 2.9
      const end = target.duration() - .5
      return start + clamp01(state.localProgress) * Math.max(end - start, .001)
    }
    const entry = label(`entry-${index}`) ?? (index === 0 ? .25 : 0)
    const read = label(`read-${index}`) ?? entry
    const cta = label(`cta-${index}`) ?? read
    if (state.phase === 'intro' || state.phase === 'enter') return entry * clamp01(state.localProgress)
    if (state.phase === 'flip') return read - .5 + clamp01(state.localProgress) * .5
    if (state.phase === 'read') return read + clamp01(state.localProgress) * Math.max(cta - read, .001)
    if (state.phase === 'exit') return cta + clamp01(state.localProgress) * Math.max((label(`entry-${index + 1}`) ?? cta) - cta, .001)
    return cta
  }
  const rebuild = () => {
    const savedScroll = pendingScroll ?? window.scrollY
    const previousTrigger = timeline?.scrollTrigger
    const previousMode = section.dataset.plansMode as PlansStoryState['mode'] | undefined
    const storyState = previousTrigger && previousMode && savedScroll >= previousTrigger.start && savedScroll <= previousTrigger.end
      ? captureStoryState(timeline!, previousMode) : undefined
    media?.revert()
    timeline = undefined
    media = gsap.matchMedia()
    media.add({ ...responsiveConditions, reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      if (context.conditions?.reduced) return
      const flags = context.conditions!
      // Phone-like landscape uses the vertical story; 1024x600 remains a tablet deck.
      const phoneLandscape = Boolean(flags.tablet && flags.veryLow && window.innerWidth / window.innerHeight >= 2)
      const mobile = Boolean(flags.mobile || phoneLandscape)
      const tablet = Boolean(flags.tablet && !phoneLandscape)
      const low = Boolean(flags.low)
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      gsap.set(section, { '--plans-header': `${headerHeight}px`, '--plans-viewport': `${viewportHeight()}px` })
      section.dataset.plansMode = mobile ? 'mobile' : tablet ? 'tablet' : 'desktop'
      const usableWidth = Math.min(stage.getBoundingClientRect().width || stage.clientWidth, document.documentElement.clientWidth || window.innerWidth)
      const horizontalMargin = mobile ? Math.min(48, Math.max(32, usableWidth * .105)) : tablet ? 96 : 64
      const desktopFit = (usableWidth - horizontalMargin - 3 * 16) / 4
      const compactMinimum = window.innerWidth <= 1280 ? 292 : 300
      const width = mobile ? Math.min(420, Math.max(260, usableWidth - horizontalMargin))
        : tablet ? Math.min(480, usableWidth * .56, usableWidth - horizontalMargin)
        : Math.max(flags.large ? 420 : compactMinimum, Math.min(flags.large ? 440 : flags.standard ? 350 : 330, desktopFit))
      const centerOffset = (usableWidth - (stage.getBoundingClientRect().width || usableWidth)) / 2
      gsap.set(cards, { width })
      const heights = cards.map(card => Math.ceil(card.querySelector<HTMLElement>('.plan-card__front')!.getBoundingClientRect().height))
      const backHeight = width * 5609 / 3838
      section.classList.add('plans-animated')
      const available = Math.max(1, deck.clientHeight)
      const inset = Math.min(20, available * .05)
      const readingHeight = available - inset * 2
      const overflow = heights.map(height => Math.max(0, height - readingHeight))
      // Reserve a small, measured travel allowance so Premium reaches its CTA before release.
      const premiumTravel = (mobile || tablet) ? Math.max(28, available * .1) : 0
      const backTop = Math.max(inset, (available - backHeight) / 2)
      const factors = [-1.5, -.5, .5, 1.5]
      const rotations = [-5, 5, -4, 4]
      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      timeline = tl
      const fronts = cards.map(card => card.querySelector<HTMLElement>('.plan-card__front')!)
      const updateFrontAccess = () => fronts.forEach((front, index) => {
        const faceVisible = Number(gsap.getProperty(inners[index]!, 'rotationY')) >= 90 && Number(gsap.getProperty(cards[index]!, 'opacity')) > .5
        front.inert = !faceVisible
      })
      tl.eventCallback('onUpdate', updateFrontAccess)
      gsap.set(cards, { xPercent: -50, x: centerOffset, y: available + (low ? 24 : 64), height: backHeight, autoAlpha: 0, zIndex: index => index + 2 })
      gsap.set(inners, { rotationY: 0 })
      updateFrontAccess()

      if (mobile) {
        // Entry, settle, flip, height-dependent reading, physical exit; reversible.
        let cursor = .35
        cards.forEach((card, index) => {
          const enter = cursor
          const settle = enter + .65
          const flip = settle + .16
          const read = flip + .5
          const travel = index === cards.length - 1 ? premiumTravel : 0
          const readDuration = 1 + (overflow[index]! + travel) / Math.max(readingHeight, 1) * 1.25
          const finish = read + readDuration
          gsap.set(card, { rotationZ: rotations[index], scale: .96 })
          tl.addLabel(`entry-${index}`, enter)
            .addLabel(`flip-${index}`, flip)
            .to(card, { y: backTop, autoAlpha: 1, scale: 1, rotationZ: 0, duration: .65, ease: 'power2.out' }, enter)
            .to(card, { y: backTop - 3, duration: .16 }, settle)
            .to(inners[index]!, { rotationY: 180, duration: .5, ease: 'power2.inOut' }, flip)
            .to(card, { height: heights[index], y: inset, duration: .25, ease: 'power2.out' }, flip + .25)
            .addLabel(`read-${index}`, read)
            .to(card, { y: inset - overflow[index]! - travel, duration: readDuration }, read)
            .addLabel(`cta-${index}`, finish)
            .to({}, { duration: .35 }, finish)
          if (index < cards.length - 1) {
            tl.to(card, { y: -heights[index]! - 40, x: index % 2 ? 24 : -24, rotationZ: rotations[index], scale: .96, autoAlpha: 0, duration: .7, ease: 'power2.in' }, finish + .35)
            cursor = finish + .35 + .7 * .8
          }
        })
      } else if (tablet) {
        // A shallow fan becomes a stack; each full-size front gets its own reading path.
        tl.to(cards, { y: backTop, autoAlpha: 1, duration: low ? .5 : .7, stagger: .05, ease: 'power2.out' }, .25)
          .to(cards, { x: index => factors[index]! * 18, rotationZ: index => factors[index]! * 2.5, duration: .4 }, 1)
          .to(inners, { rotationY: 180, duration: .55, stagger: .045, ease: 'power2.inOut' }, 1.5)
          .to(cards, { height: index => heights[index]!, y: inset, duration: .28 }, 1.78)
          .to(cards, { x: index => index * 18, rotationZ: 0, scale: 1, zIndex: index => 10 - index, autoAlpha: index => index ? .32 : 1, duration: .35 }, 2.25)
        tl.addLabel('entry-0', .25).addLabel('flip-0', 1.5)
        let cursor = 2.6
        cards.forEach((card, index) => {
          tl.addLabel(`entry-${index}`, cursor)
          if (index) {
            tl.to(cards[index - 1]!, { x: -width * .65, y: -heights[index - 1]! - 32, rotationZ: -5, autoAlpha: 0, duration: .6 }, cursor)
              .to(card, { x: 0, y: inset, autoAlpha: 1, zIndex: 15 + index, duration: .5 }, cursor + .12)
            cursor += .65
          }
          const travel = index === cards.length - 1 ? premiumTravel : 0
          const duration = 1 + (overflow[index]! + travel) / Math.max(readingHeight, 1) * 1.25
          tl.addLabel(`read-${index}`, cursor).to(card, { y: inset - overflow[index]! - travel, duration }, cursor)
            .addLabel(`cta-${index}`, cursor + duration).to({}, { duration: .35 }, cursor + duration)
          cursor += duration + .35
        })
      } else {
        // Same four-card composition, bounded separately for large/standard/compact.
        const fanGap = width * (flags.large ? .48 : flags.standard ? .4 : .32)
        const rotation = flags.large ? 4 : flags.standard ? 3 : 2
        const gap = flags.large ? 24 : flags.standard ? 20 : 16
        tl.addLabel('entry-0', .2).addLabel('flip-0', 1.55)
          .to(cards, { y: backTop, autoAlpha: 1, duration: low ? .5 : .75, stagger: .045, ease: 'power2.out' }, .2)
          .to(cards, { x: index => factors[index]! * fanGap, rotationZ: index => factors[index]! * rotation, duration: .4 }, 1)
          .to(inners, { rotationY: 180, duration: .6, stagger: .04, ease: 'power2.inOut' }, 1.55)
          .to(cards, { height: index => heights[index]!, duration: .3 }, 1.85)
          .to(cards, { x: index => factors[index]! * (width + gap), y: inset, rotationZ: 0, duration: .55, ease: 'power2.inOut' }, 2.35)
          .addLabel('fronts', 2.9)
        const maxOverflow = Math.max(...overflow)
        const duration = 1.3 + maxOverflow / Math.max(readingHeight, 1) * 1.25
        tl.to(cards, { y: index => inset - overflow[index]!, duration }, 3.25)
          .to({}, { duration: .5 })
        cards.forEach((_, index) => tl.addLabel(`cta-${index}`, 3.25 + duration))
      }
      // One timeline unit corresponds to a useful fraction of the reading viewport.
      const distance = tl.duration() * Math.max(available * .75, 180)
      gsap.set(section, { minHeight: stage.getBoundingClientRect().height + distance })
      ScrollTrigger.create({
        trigger: section, animation: tl,
        start: () => `top ${document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0}px`,
        end: () => `+=${distance}`, scrub: .65, invalidateOnRefresh: true,
      })
      const onFocus = (event: FocusEvent) => {
        const index = cards.findIndex(card => card.contains(event.target as Node))
        const trigger = tl.scrollTrigger
        if (index < 0 || !trigger) return
        const label = tl.labels[`cta-${index}`]
        if (label !== undefined) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * label / tl.duration(), behavior: 'instant' })
      }
      section.addEventListener('focusin', onFocus)
      return () => {
        section.removeEventListener('focusin', onFocus)
        fronts.forEach(front => { front.inert = false })
        section.classList.remove('plans-animated')
        delete section.dataset.plansMode
      }
    }, section)
    ScrollTrigger.refresh()
    const rebuiltTimeline = timeline as gsap.core.Timeline | undefined
    const trigger = rebuiltTimeline?.scrollTrigger
    const restoredTime = storyState && rebuiltTimeline ? stateTime(storyState, rebuiltTimeline, section.dataset.plansMode as PlansStoryState['mode']) : undefined
    const restoredScroll = restoredTime !== undefined && trigger
      ? trigger.start + (trigger.end - trigger.start) * clamp01(restoredTime / Math.max(rebuiltTimeline?.duration() ?? 1, .001))
      : savedScroll
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    window.scrollTo({ top: Math.min(maxScroll, Math.max(0, restoredScroll)), behavior: 'instant' })
    ScrollTrigger.update()
    pendingScroll = undefined
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight
  }
  const schedule = () => {
    // Ignore small browser-bar/visualViewport changes; rebuild significant geometry.
    const phoneViewport = window.innerWidth <= 767 || (window.innerWidth < 1280 && window.innerWidth / window.innerHeight >= 2)
    if (Math.abs(window.innerWidth - lastWidth) < 2 && Math.abs(window.innerHeight - lastHeight) < (phoneViewport ? 80 : 2)) return
    pendingScroll ??= window.scrollY
    clearTimeout(timer)
    timer = setTimeout(() => { if (!disposed) rebuild() }, 180)
  }
  const refreshContent = () => { pendingScroll ??= window.scrollY; clearTimeout(timer); timer = setTimeout(() => { if (!disposed) rebuild() }, 180) }
  window.addEventListener('resize', schedule, { passive: true, capture: true })
  window.addEventListener('orientationchange', refreshContent, { passive: true, capture: true })
  window.visualViewport?.addEventListener('resize', schedule, { passive: true })
  document.fonts.ready.then(() => { if (!disposed) refreshContent() })
  rebuild()
  disposePlans = () => {
    disposed = true
    clearTimeout(timer)
    window.removeEventListener('resize', schedule, true)
    window.removeEventListener('orientationchange', refreshContent, true)
    window.visualViewport?.removeEventListener('resize', schedule)
    media?.revert()
  }
})

onBeforeUnmount(() => {
  disposeNarrative?.()
  disposePlans?.()
  document.removeEventListener('visibilitychange', handleVisibility)
  backgroundVideo.value?.pause()
})
</script>

<template>
  <main ref="pageRoot" class="solutions-page">
    <div class="solutions-video" aria-hidden="true">
      <video
        ref="backgroundVideo"
        class="solutions-video__media"
        src="/Videos/nosotros1.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      />
      <div class="solutions-video__overlay" />
    </div>
    <section class="solutions-hero" aria-labelledby="solutions-title">
      <div class="solutions-shell solutions-hero__layout">
        <h1 id="solutions-title" class="display-xl solutions-hero__title" aria-label="Soluciones">
          <span class="hero-word hero-word--left">SOLU</span><span class="hero-word hero-word--right">CIONES<span class="orange-dot">.</span></span>
        </h1>
        <p class="solutions-hero__aside">PARA HACER<br><span>CRECER IDEAS.</span></p>
      </div>
    </section>

    <section class="enterprise-world" aria-labelledby="enterprise-title">
      <div class="solutions-shell enterprise-stage">
        <div class="enterprise-heading">
          <h2 id="enterprise-title" class="display-lg">SERVICIOS PARA<br><span>EMPRESAS</span></h2>
          <div class="alliance-copy">
            <p>EN ALIANZA CON</p>
            <a href="https://nitro2tech.com" target="_blank" rel="noopener noreferrer" aria-label="Visitar Nitro2Tech">
              <img src="/Alianzas/LOGON2T.webp" alt="Nitro2Tech">
            </a>
          </div>
        </div>

        <div class="service-stage" aria-label="Servicios para empresas">
          <div
            v-for="service in companyServices"
            :key="service.name"
            class="service-name"
            :class="{ 'service-name--long': service.split }"
          >
            <template v-if="service.split">
              <span>PRODUCCIÓN</span><span>AUDIOVISUAL</span>
            </template>
            <template v-else>{{ service.name }}</template>
          </div>
        </div>
      </div>
    </section>

    <section class="models-world" aria-labelledby="models-title">
      <div class="solutions-shell models-stage">
        <div class="models-identity">
          <h2 id="models-title" class="display-xl models-heading"><span>NEO</span><span>MODELS</span></h2>
          <div class="models-alliance">
            <p>EN ALIANZA CON</p>
            <a v-if="iconic.url" :href="iconic.url" target="_blank" rel="noopener noreferrer" aria-label="Visitar ICONIC">
              <img src="/Alianzas/ICONICBLANCO.webp" alt="ICONIC">
            </a>
            <img v-else src="/Alianzas/ICONICBLANCO.webp" alt="ICONIC">
          </div>
        </div>

        <div class="model-categories" aria-label="Áreas de Neo Models">
          <div v-for="category in modelCategories" :key="category" class="model-category">{{ category }}</div>
        </div>
      </div>
    </section>

    <section id="planes" class="plans-section" aria-labelledby="plans-title">
      <div class="plans-stage">
        <header class="solutions-shell plans-heading">
          <h2 id="plans-title" class="display-lg plans-title">
            <span class="plans-title-line plans-title-line--one">NUESTROS</span>
            <span class="plans-title-line plans-title-line--two">PLANES<span class="orange-dot">.</span></span>
          </h2>
          <p class="plans-intro">Soluciones pensadas para marcas, negocios y proyectos que quieren crecer.</p>
        </header>

        <div class="plans-deck" aria-label="Planes disponibles">
          <article
            v-for="plan in plans"
            :key="plan.name"
            class="plan-card"
            :class="{
              'plan-card--pro': plan.name === 'Pro',
              'plan-card--premium': plan.name === 'Premium',
            }"
          >
            <div class="plan-card__inner">
              <div class="plan-card__face plan-card__back">
                <img src="/Images/TARF.webp" alt="Reverso de tarjeta Neo Redes">
              </div>
              <div class="plan-card__face plan-card__front">
                <div class="plan-card__content">
                  <div>
                    <p class="plan-card__subtitle">{{ plan.eyebrow }}</p>
                    <h3>{{ plan.name }}</h3>
                    <p class="plan-card__description">{{ plan.description }}</p>
                    <p class="plan-card__price">
                      <strong>{{ formatPrice(plan.price) }}</strong>
                      <span>{{ plan.currency }} / {{ plan.billing }}</span>
                    </p>
                  </div>
                  <div class="plan-card__detail-content">
                    <div v-if="plan.groups.length" class="plan-card__groups">
                      <section v-for="group in plan.groups" :key="group.name" class="plan-card__group">
                        <h4>{{ group.name }}</h4>
                        <ul class="plan-card__features">
                          <li v-for="feature in group.features" :key="feature">{{ feature }}</li>
                        </ul>
                      </section>
                    </div>
                    <ul v-else class="plan-card__features">
                      <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
                    </ul>
                  </div>
                </div>
                <a class="plan-card__cta" :href="planWhatsappUrl(plan)" target="_blank" rel="noopener noreferrer">
                  <span>{{ plan.cta }}</span><span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.solutions-page {
  --ink: #f2f4f7;
  --muted: rgba(242, 244, 247, .68);
  --cyan: #00d4e0;
  --orange: #ff8a00;
  isolation: isolate;
  overflow: clip;
  background: #0d1117;
  color: var(--ink);
}
.solutions-page > section { position: relative; z-index: 1; }
.solutions-video { position: fixed; z-index: 0; inset: 0; overflow: hidden; pointer-events: none; }
.solutions-video__media, .solutions-video__overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
.solutions-video__media { object-fit: cover; object-position: 50% 50%; }
.solutions-video__overlay { background: #0d1117; opacity: .7; }
.solutions-shell { width: min(calc(100% - 8vw), 1600px); margin-inline: auto; }
.display-xl, .display-lg { margin: 0; font-family: Montserrat, sans-serif; font-weight: 700; }
.display-xl { font-size: clamp(5rem, 10.5vw, 11.5rem); line-height: .86; letter-spacing: -.07em; }
.display-lg { font-size: clamp(3.5rem, 6.8vw, 7.6rem); line-height: .9; letter-spacing: -.055em; }
.orange-dot { color: var(--orange); }
.solutions-hero { min-height: calc(100svh - var(--header-height)); display: grid; align-items: center; padding: clamp(2rem, 4vw, 4rem) 0; }
.solutions-hero__layout { display: grid; grid-template-columns: minmax(0, 2.2fr) minmax(14rem, .55fr); align-items: end; gap: 2rem; }
.solutions-hero__title { display: flex; white-space: nowrap; }
.hero-word { display: inline-block; }
.hero-word--right { color: var(--cyan); }
.solutions-hero__aside { margin: 0 0 .7rem; color: var(--muted); font: 600 clamp(.9rem, 1.25vw, 1.2rem)/1.45 Poppins, sans-serif; letter-spacing: .12em; }
.solutions-hero__aside span { color: var(--ink); }
.enterprise-world { min-height: 290svh; }
.enterprise-stage { position: sticky; top: 0; min-height: 100svh; display: grid; grid-template-columns: 42fr 58fr; gap: clamp(3rem, 6vw, 7rem); align-items: center; }
.enterprise-heading h2 span { color: var(--cyan); }
.alliance-copy { margin: clamp(3rem, 6vw, 6rem) 0 0 14%; font-family: Poppins, sans-serif; }
.alliance-copy p, .models-alliance p { margin: 0 0 .7rem; color: var(--muted); font-size: .72rem; font-weight: 600; letter-spacing: .16em; }
.alliance-copy a { display: inline-block; transition: opacity .25s ease; }
.alliance-copy a:hover, .alliance-copy a:focus-visible { opacity: .72; outline: none; }
.alliance-copy img { display: block; width: clamp(14rem, 22vw, 24rem); height: auto; object-fit: contain; }
.service-stage { position: relative; min-height: 34rem; }
.models-world { min-height: 245svh; }
.models-stage { position: sticky; top: 0; min-height: 100svh; display: grid; grid-template-columns: repeat(12, 1fr); align-items: center; gap: 2rem; }
.models-identity { grid-column: 3 / 11; grid-row: 1; }
.models-heading { display: flex; flex-direction: column; font-size: clamp(6rem, 14vw, 15rem); text-align: center; }
.models-heading { opacity: 1; }
.narrative-ready .models-heading { opacity: .24; }
.models-heading span:last-child { color: var(--cyan); }
.models-alliance { position: absolute; top: 11%; right: 6%; z-index: 3; font-family: Poppins, sans-serif; }
.models-alliance img { display: block; width: clamp(8.5rem, 12vw, 12rem); max-height: 10rem; object-fit: contain; object-position: left center; }
.model-categories { position: relative; z-index: 2; grid-column: 1 / 13; grid-row: 1; min-height: 68vh; }
.model-category { position: absolute; font: 700 clamp(2.8rem, 6vw, 6.7rem)/.9 Montserrat, sans-serif; letter-spacing: -.055em; }
.model-category:nth-child(1) { top: 8%; left: 2%; }
.model-category:nth-child(2) { top: 34%; right: 2%; }
.model-category:nth-child(3) { bottom: 22%; left: 9%; color: var(--cyan); }
.model-category:nth-child(4) { right: 15%; bottom: 2%; }
@media (max-width: 767px) {
  .solutions-page { overflow-x: clip; }
  .solutions-shell { width: calc(100% - 2.5rem); }
  .solutions-video__media { object-position: 54% 50%; }
  .display-xl { font-size: clamp(3.15rem, 14.5vw, 4.6rem); }
  .display-lg { font-size: clamp(2.65rem, 12vw, 4rem); }
  .solutions-hero { min-height: calc(100svh - var(--header-height)); align-items: stretch; padding: 2rem 0 3rem; }
  .solutions-hero__layout { display: flex; min-height: 100%; flex-direction: column; justify-content: center; align-items: stretch; gap: 2.25rem; }
  .solutions-hero__title { display: block; max-width: 100%; font-size: clamp(3rem, 14.2vw, 4.35rem); white-space: nowrap; }
  .solutions-hero__aside { align-self: flex-end; padding-left: 2rem; margin: 0; font-size: .78rem; line-height: 1.55; text-align: right; }
  .enterprise-world { min-height: auto; padding: 5.5rem 0 4.5rem; border-top: 1px solid rgba(242,244,247,.1); }
  .models-world { min-height: auto; padding: 4.5rem 0 5.5rem; border-top: 1px solid rgba(242,244,247,.1); }
  .enterprise-stage, .models-stage { position: static; min-height: 0; display: block; }
  .enterprise-heading h2 { width: auto; max-width: 9ch; line-height: .92; }
  .alliance-copy { display: block; padding: 0; margin: 2.25rem 0 3.5rem 8%; border: 0; }
  .alliance-copy p { margin: 0 0 .7rem; font-size: .65rem; }
  .alliance-copy img { width: min(17rem, 72vw); max-width: 100%; }
  .service-stage { min-height: 0; border: 0; }
  .models-identity { padding: 0; border-radius: 0; background: none; }
  .models-heading { padding: 0; font-size: clamp(4.6rem, 21vw, 7rem); line-height: .82; text-align: left; }
  .models-heading span:last-child { align-self: flex-end; }
  .models-alliance { position: static; display: block; padding: 0; margin: 2.5rem 0 4rem 10%; border: 0; opacity: 1; }
  .models-alliance p { margin: 0 0 .7rem; font-size: .65rem; }
  .models-alliance img { width: min(13rem, 52vw); max-height: 8rem; }
  .model-categories { display: block; min-height: 0; margin-top: 0; }
  .model-category { position: static; display: block; min-height: 0; padding: 0; margin: 0 0 clamp(2rem, 8vw, 3rem); border: 0; border-radius: 0; background: none; font-size: clamp(2.5rem, 11.8vw, 4rem); line-height: .9; letter-spacing: -.05em; }
  .model-category:nth-child(even) { padding-right: clamp(1rem, 8vw, 3rem); text-align: right; }
  .model-category:nth-child(3) { padding-left: clamp(1rem, 8vw, 3rem); border: 0; background: none; }
}

@media (min-width: 768px) and (max-width: 1279px) {
  .solutions-shell { width: calc(100% - clamp(4rem, 7vw, 6rem)); }
  .display-xl { font-size: clamp(5rem, 9vw, 8.5rem); }
  .display-lg { font-size: clamp(3.5rem, 6.4vw, 6rem); }
  .solutions-hero__layout { grid-template-columns: minmax(0, 2fr) minmax(12rem, .65fr); }
  .enterprise-stage { grid-template-columns: 40fr 60fr; gap: clamp(2rem, 4vw, 4rem); }
  .models-identity { grid-column: 2 / 12; }
  .models-heading { font-size: clamp(6.5rem, 13vw, 11rem); }
  .model-category { font-size: clamp(3rem, 5.6vw, 5.3rem); }
}


@media (min-width: 768px) and (max-width: 1279px) and (max-height: 700px) {
  .solutions-hero { min-height: calc(100svh - var(--header-height)); padding-block: 1rem; }
  .solutions-hero__title { font-size: clamp(4.2rem, 8vw, 6.2rem); }
  .enterprise-world { min-height: 260svh; }
  .enterprise-stage { min-height: 100svh; }
  .enterprise-heading h2 { font-size: clamp(2.7rem, 5.2vw, 4rem); }
  .alliance-copy { margin-top: 1.5rem; }
  .alliance-copy img { width: min(18vw, 10rem); }
  .service-stage { min-height: 21rem; }
  .models-world { min-height: 220svh; }
  .models-heading { font-size: clamp(5rem, 10vw, 7.5rem); }
  .model-categories { min-height: 78svh; }
}
@media (max-width: 390px) {
  .solutions-hero__title { font-size: 3.15rem; }
  .model-category { font-size: 2.7rem; }
}
/* Phase 3A: composition-relative geometry; all plans rules remain legacy (3B). */
.solutions-hero__layout { container-type: inline-size; }
.solutions-hero .solutions-hero__title { font-size: clamp(2.75rem, 10.8cqw, 11.5rem); }
.enterprise-stage { grid-template-columns: minmax(0, 42fr) minmax(0, 58fr); }
.enterprise-heading { min-width: 0; container-type: inline-size; }
.enterprise-heading h2 { font-size: clamp(2.5rem, 15cqw, 7.6rem); }
.alliance-copy img { max-width: 100%; }
.service-stage { container-type: inline-size; min-width: 0; padding-inline: 2rem; }
.service-name { position: relative; width: 100%; margin-block: 2rem; font: 700 clamp(1.85rem, 10.7cqw, 7.5rem)/.98 Montserrat, sans-serif; letter-spacing: -.065em; overflow-wrap: normal; }
.service-name--long span { display: block; }
.service-name--long { font-size: clamp(2rem, 12.2cqw, 6.5rem); }
.models-stage { padding-block: 1.5rem; }
.model-categories { min-height: min(68svh, 52rem); }
@media (min-width: 768px) {
  .enterprise-stage, .models-stage { top: var(--header-height); min-height: calc(100svh - var(--header-height)); }
  .enterprise-world { min-height: 260svh; }
  .models-world { min-height: 190svh; }
  .service-stage { min-height: min(60svh, 32rem); }
  .narrative-ready .service-name { position: absolute; top: 50%; left: 2rem; width: calc(100% - 4rem); margin: 0; }
}
@media (min-width: 2200px) {
  .solutions-hero__layout, .enterprise-stage, .models-stage { max-width: 100rem; }
  .models-heading { font-size: 15rem; }
  .models-alliance { top: max(2rem, calc((100% - 52rem) / 2)); }
}
@media (min-width: 1600px) and (max-width: 2199px) {
  .solutions-hero__layout { grid-template-columns: minmax(0, 1fr) 16rem; }
}
@media (min-width: 1280px) and (max-width: 1599px) {
  .solutions-hero__layout { grid-template-columns: minmax(0, 1fr) 14rem; gap: 1.5rem; }
  .solutions-hero .solutions-hero__title { font-size: clamp(5rem, 10cqw, 9rem); }
  .enterprise-stage { gap: 2rem; }
}
@media (min-width: 768px) and (max-width: 1279px) {
  .solutions-hero__layout { grid-template-columns: minmax(0, 1fr); align-content: center; gap: 1.5rem; }
  .solutions-hero .solutions-hero__title { font-size: clamp(4rem, 12cqw, 8.5rem); }
  .solutions-hero__aside { justify-self: end; margin: 0; text-align: right; }
  .enterprise-stage { grid-template-columns: minmax(0, 40fr) minmax(0, 60fr); gap: 1.5rem; }
  .service-stage { padding-inline: 1.25rem; }
  .narrative-ready .service-name { left: 1.25rem; width: calc(100% - 2.5rem); }
  .enterprise-heading h2 { font-size: clamp(2.35rem, 15cqw, 5rem); }
  .model-category { font-size: clamp(2.5rem, 5.6vw, 5.3rem); }
}
@media (max-width: 767px) {
  .solutions-hero .solutions-hero__title { font-size: clamp(2.6rem, 15.2cqw, 4.35rem); }
  .service-stage { padding-inline: 1.5rem; }
  .service-name { margin: 0 0 clamp(2.2rem, 9vw, 3.4rem); font-size: clamp(1.7rem, 10.7cqw, 3.55rem); }
  .service-name:nth-child(even) { text-align: right; }
  .service-name--long { font-size: clamp(2rem, 12.2cqw, 3.25rem); }
  .service-name:last-child { margin-bottom: 0; }
  .enterprise-world { padding-bottom: 2rem; }
  .models-world { padding-top: 2rem; padding-bottom: 3rem; }
  .models-stage { padding-block: 0; }
  .model-categories { min-height: 0; }
}
@media (max-width: 390px) {
  .solutions-hero .solutions-hero__title { font-size: clamp(2.6rem, 15.2cqw, 3.4rem); }
}
@media (min-width: 768px) and (max-height: 850px) {
  .enterprise-world { min-height: 235svh; }
  .models-world { min-height: 175svh; }
  .alliance-copy { margin-top: 1.5rem; }
  .models-alliance { top: 1rem; }
  .models-alliance img { width: clamp(6rem, 10vw, 9rem); max-height: 7rem; }
  .models-heading { font-size: clamp(5rem, min(13vw, 22svh), 12rem); }
  .model-categories { min-height: calc(100svh - var(--header-height) - 3rem); }
  .model-category { font-size: clamp(2.25rem, min(5.6vw, 9svh), 6rem); }
}
@media (min-width: 768px) and (max-height: 700px) {
  .solutions-hero { padding-block: 1rem; }
  .solutions-hero__layout { gap: 1rem; }
  .solutions-hero .solutions-hero__title { font-size: clamp(3rem, min(12cqw, 19svh), 8rem); }
  .enterprise-heading h2 { font-size: clamp(2.25rem, min(15cqw, 10svh), 4rem); }
  .alliance-copy { margin-top: 1rem; }
  .alliance-copy img { width: min(18vw, 12rem); }
  .enterprise-stage, .models-stage { padding-block: 1rem; }
  .service-stage { min-height: calc(100svh - var(--header-height) - 2rem); }
  .models-alliance img { max-height: 4rem; }
  .models-alliance p { font-size: .6rem; }
}
/* Progressive enhancement: no invisible/overlaid services without GSAP. */
.solutions-page:not(.narrative-ready) .enterprise-world,
.solutions-page:not(.narrative-ready) .models-world { min-height: 0; padding-block: 3rem; }
.solutions-page:not(.narrative-ready) .enterprise-stage,
.solutions-page:not(.narrative-ready) .models-stage { position: relative; top: auto; min-height: 0; }
.solutions-page:not(.narrative-ready) .models-stage { display: block; }
.solutions-page:not(.narrative-ready) .models-alliance { position: relative; top: auto; right: auto; margin: 2rem 0; }
.solutions-page:not(.narrative-ready) .model-categories { min-height: 0; }
.solutions-page:not(.narrative-ready) .model-category { position: relative; inset: auto; margin-block: 2rem; }
.solutions-page:not(.narrative-ready) .model-category:nth-child(even) { text-align: right; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
/* Plans: natural-height accessible fronts are the base; only enhancement makes a deck. */
.plans-section { position: relative; padding-block: 2rem; }
.plans-stage { position: relative; }
.plans-heading { position: relative; display: flex; align-items: start; gap: clamp(1rem, 3vw, 3rem); padding-block: 1rem; z-index: 2; }
.plans-title { flex: 0 0 auto; font-size: clamp(2.5rem, 4.5vw, 5rem); }
.plans-title-line { display: block; }
.plans-title-line--two { color: var(--cyan); }
.plans-intro { width: min(25rem, 35%); margin: .4rem 0 0; color: var(--muted); font: 500 clamp(.8rem, 1.05vw, 1rem)/1.5 Poppins, sans-serif; }
.plans-deck { position: relative; min-height: 0; padding-block: 1rem; }
.plan-card { position: relative; width: min(calc(100% - 2rem), 420px); margin: 0 auto 2rem; transform-origin: center center; }
.plan-card__inner { position: relative; width: 100%; height: auto; transform-style: preserve-3d; -webkit-transform-style: preserve-3d; }
.plan-card__face { border: 1px solid rgba(242,244,247,.2); border-radius: clamp(1rem, 1.6vw, 1.5rem); backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.plan-card__back { display: none; border: 0; background: transparent; }
.plan-card__back img { display: block; width: 100%; height: 100%; object-fit: contain; }
.plan-card__front { position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 1.25rem; padding: clamp(1rem, 1.3vw, 1.5rem); color: var(--ink); background: #111820; }
.plan-card--pro .plan-card__front { border-color: rgba(0,212,224,.8); }
.plan-card__content { display: flex; flex-direction: column; min-width: 0; }
.plan-card__subtitle { margin: .25rem 0 .65rem; color: var(--orange); font: 600 .7rem/1.4 Poppins, sans-serif; letter-spacing: .14em; }
.plan-card__front h3 { margin: 0; font: 700 clamp(1.8rem, 2.2vw, 2.45rem)/.98 Montserrat, sans-serif; letter-spacing: -.06em; text-transform: uppercase; }
.plan-card__description { margin: 1rem 0 0; color: var(--muted); font: 400 .9rem/1.5 Poppins, sans-serif; }
.plan-card__price { display: flex; flex-wrap: wrap; align-items: baseline; gap: .45rem; margin: 1rem 0 0; font-family: Poppins, sans-serif; }
.plan-card__price strong { color: var(--ink); font-size: 1.8rem; line-height: 1.1; letter-spacing: -.045em; }
.plan-card__price span { color: var(--muted); font-size: .65rem; letter-spacing: .08em; }
.plan-card__features { margin: .8rem 0 0; padding: 0; color: var(--muted); font: 400 .85rem/1.42 Poppins, sans-serif; list-style: none; }
.plan-card__features li { position: relative; padding-left: 1rem; }
.plan-card__features li::before { position: absolute; top: .62em; left: 0; width: .45rem; height: 1px; background: var(--cyan); content: ''; }
.plan-card__features li + li { margin-top: .35rem; }
.plan-card__cta { display: inline-flex; width: max-content; align-items: center; gap: .65rem; padding: 0 0 .4rem; border: 0; border-bottom: 1px solid currentColor; color: var(--ink); background: transparent; font: 600 .85rem/1.4 Poppins, sans-serif; letter-spacing: .12em; text-decoration: none; transition: color .25s ease; }
.plan-card__cta span:last-child { color: var(--cyan); transition: transform .25s ease; }
.plan-card__cta:hover, .plan-card__cta:focus-visible { color: var(--cyan); }
.plan-card__cta:hover span:last-child, .plan-card__cta:focus-visible span:last-child { transform: translate(3px,-3px); }
.plan-card__groups { display: grid; gap: .8rem; margin-top: .8rem; }
.plan-card__group h4 { margin: 0; color: var(--orange); font: 600 .7rem/1.4 Poppins, sans-serif; letter-spacing: .13em; }
.plan-card__group .plan-card__features { margin-top: .35rem; }
.plans-animated { padding: 0; }
.plans-animated .plans-stage { position: sticky; top: var(--plans-header); height: calc(var(--plans-viewport) - var(--plans-header)); display: flex; flex-direction: column; padding-bottom: env(safe-area-inset-bottom); }
.plans-animated .plans-heading { flex-shrink: 0; }
.plans-animated .plans-deck { flex: 1; padding: 0; overflow: clip; perspective: 1400px; }
.plans-animated .plan-card { position: absolute; top: 0; left: 50%; margin: 0; will-change: transform; }
.plans-animated .plan-card__inner { height: 100%; }
.plans-animated .plan-card__face { position: absolute; inset: 0; width: 100%; height: 100%; }
.plans-animated .plan-card__back { display: block; }
.plans-animated .plan-card__front { transform: rotateY(180deg); }
/* Compact, standard and large retain identical content scale within each range. */
@media (min-width: 2200px) {
  .plans-heading { max-width: 100rem; }
  .plans-title { font-size: 5rem; }
}
@media (min-width: 1600px) and (max-width: 2199px) {
  .plans-title { font-size: 4.25rem; }
}
@media (min-width: 1280px) and (max-width: 1599px) {
  .plans-title { font-size: 3.5rem; }
}
@media (min-width: 768px) and (max-width: 1279px) {
  .plans-title { font-size: clamp(2.75rem, 5vw, 4rem); }
  .plan-card__front { padding: 1.5rem; }
  .plan-card__front h3 { font-size: 2.25rem; }
  .plan-card__features { font-size: .9rem; }
}
.plans-section[data-plans-mode='mobile'] .plan-card__front { padding: clamp(1.25rem, calc(10vw - 1rem), 2rem); }
.plans-section[data-plans-mode='mobile'] .plan-card__front h3 { font-size: 2.125rem; }
.plans-section[data-plans-mode='mobile'] .plan-card__description { font-size: .94rem; }
.plans-section[data-plans-mode='mobile'] .plan-card__features { font-size: .875rem; }
.plans-section[data-plans-mode='mobile'] .plan-card__price strong { font-size: 1.875rem; }
@media (max-width: 767px) {
  .plans-heading { display: block; padding-block: max(.75rem, env(safe-area-inset-top)) .75rem; }
  .plans-title { font-size: clamp(2.25rem, 10vw, 3rem); }
  .plans-intro { width: 100%; margin-top: .5rem; font-size: .8rem; }
  .plan-card__front { padding: clamp(1.25rem, calc(10vw - 1rem), 2rem); }
  .plan-card__front h3 { font-size: 2.125rem; }
  .plan-card__features { font-size: .875rem; }
}
@media (max-width: 390px) {
  .plans-title { font-size: clamp(2rem, 9vw, 2.25rem); }
}
@media (max-height: 850px) {
  .plans-heading { padding-block: .75rem; }
}
@media (max-height: 700px) {
  .plans-heading { display: flex; gap: 1.25rem; padding-block: .5rem; }
  .plans-title { font-size: clamp(1.8rem, 4vw, 2.5rem); }
  .plans-intro { width: min(55%, 25rem); font-size: .78rem; }
}
@media (prefers-reduced-motion: reduce) {
  .plans-section { min-height: 0 !important; }
  .plans-stage { position: relative !important; top: auto !important; height: auto !important; }
}
</style>
