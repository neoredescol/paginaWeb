<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'SOLUCIONES | NEO REDES',
  meta: [{
    name: 'description',
    content: 'Soluciones de marketing, diseño web, automatización, producción audiovisual y talento para empresas y marcas.',
  }],
})

const pageRoot = ref<HTMLElement | null>(null)
const backgroundVideo = ref<HTMLVideoElement | null>(null)
let animationContext: gsap.Context | undefined
let animationMatch: gsap.MatchMedia | undefined
let plansTimeline: gsap.core.Timeline | undefined

const playBackgroundVideo = () => backgroundVideo.value?.play().catch(() => {})
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

onMounted(() => {
  if (!pageRoot.value) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('visibilitychange', handleVisibility)
  if (reducedMotion) backgroundVideo.value?.pause()
  else playBackgroundVideo()
  if (reducedMotion) return

  gsap.registerPlugin(ScrollTrigger)
  animationContext = gsap.context(() => {
    animationMatch = gsap.matchMedia()
    animationMatch.add({
      desktop: '(min-width: 1280px)',
      tablet: '(min-width: 768px) and (max-width: 1279px)',
      mobile: '(max-width: 767px)',
    }, (matchContext) => {
    const mobile = Boolean(matchContext.conditions?.mobile)
    const tablet = Boolean(matchContext.conditions?.tablet)
    const compactDesktop = !mobile && !tablet && window.innerHeight <= 960
    const shift = mobile ? 32 : Math.min(window.innerWidth * .1, 150)

    gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } })
      .from('.hero-word--left', { x: -shift, opacity: 0 }, .1)
      .from('.hero-word--right', { x: shift, opacity: 0 }, .25)
      .from('.solutions-hero__aside', { x: shift * .55, opacity: 0 }, .55)

    gsap.timeline({
      scrollTrigger: { trigger: '.solutions-hero', start: 'top top', end: 'bottom top', scrub: .65 },
    })
      .to('.solutions-hero__title', { x: mobile ? -15 : -45, scale: .95, opacity: .38, duration: 1 })
      .to('.solutions-hero__aside', { x: mobile ? 12 : 40, opacity: .35, duration: 1 }, '<')

    const serviceItems = gsap.utils.toArray<HTMLElement>('.service-name')
    if (mobile) {
      gsap.timeline({
        scrollTrigger: { trigger: '.enterprise-world', start: 'top 82%', end: 'bottom 24%', scrub: .6 },
      })
        .from('.enterprise-heading > *', { y: 20, opacity: 0, stagger: .12, duration: .65 })
        .from(serviceItems, { y: 24, opacity: 0, stagger: .3, duration: .65 }, '-=.15')
    } else {
      const serviceEnterX = tablet ? 34 : 90
      const serviceAlternateX = tablet ? 30 : 75
      const serviceExitX = tablet ? -24 : -45
      const serviceTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.enterprise-world', start: 'top top', end: 'bottom bottom', scrub: .72 },
      })
        .from('.enterprise-heading > *', { x: -60, opacity: 0, stagger: .12, duration: .55 })

      serviceItems.forEach((service, index) => {
        if (index === 0) {
          serviceTimeline.from(service, { x: serviceEnterX, opacity: 0, scale: .96, duration: .8 })
          return
        }
        const previous = serviceItems[index - 1]
        if (previous) serviceTimeline.to(previous, { x: serviceExitX, y: tablet ? -14 : -24, opacity: 0, scale: .97, duration: .48 })
        serviceTimeline.fromTo(
          service,
          { x: index % 2 ? serviceAlternateX : -serviceAlternateX, y: tablet ? 20 : 32, opacity: 0, scale: .97 },
          { x: 0, y: 0, opacity: 1, scale: 1, duration: .65, ease: 'power2.out' },
          '+=.08',
        )
      })
    }

    const categoryWords = gsap.utils.toArray<HTMLElement>('.model-category')
    gsap.timeline({
      scrollTrigger: { trigger: '.models-world', start: mobile ? 'top 84%' : 'top top', end: mobile ? 'bottom 22%' : 'bottom bottom', scrub: 1.15 },
      defaults: { ease: 'power2.out' },
    })
      .from('.models-heading', { scale: .94, opacity: 0, duration: 1 })
      .from('.models-alliance', { y: 18, opacity: 0, duration: .8 }, '-=.2')
      .from(categoryWords[0]!, { x: -shift * .7, opacity: 0, duration: .9 }, '-=.05')
      .from(categoryWords[1]!, { x: shift * .7, opacity: 0, duration: .9 }, '-=.08')
      .from(categoryWords[2]!, { y: mobile ? 30 : 55, opacity: 0, duration: .9 }, '-=.08')
      .from(categoryWords[3]!, { x: shift * .55, opacity: 0, duration: .9 }, '-=.08')
      .to({}, { duration: .55 })

    const planCards = gsap.utils.toArray<HTMLElement>('.plan-card')
    const planInners = planCards.map(card => card.querySelector<HTMLElement>('.plan-card__inner')).filter(Boolean) as HTMLElement[]
    const stackedPlans = tablet
    const finalCardWidth = mobile
      ? Math.min(window.innerWidth - (window.innerWidth >= 390 ? 48 : 40), 420)
      : tablet
        ? Math.min(window.innerWidth - 96, window.innerWidth * .46, 480)
          : Math.min(window.innerWidth * .205, 340)
    const minimumCardHeight = mobile
      ? 0
      : tablet
        ? Math.min(window.innerHeight * .7, 650)
        : Math.min(window.innerHeight * .64, 650)

    gsap.set(planCards, { width: finalCardWidth })
    const finalCardHeights = planCards.map((card) => {
      const front = card.querySelector<HTMLElement>('.plan-card__front')
      const content = front?.querySelector<HTMLElement>('.plan-card__content')
      const cta = front?.querySelector<HTMLElement>('.plan-card__cta')
      const frontStyles = front ? window.getComputedStyle(front) : null
      const verticalPadding = frontStyles
        ? Number.parseFloat(frontStyles.paddingTop) + Number.parseFloat(frontStyles.paddingBottom)
        : 0
      const premiumTabletSafety = tablet && card.classList.contains('plan-card--premium') ? 48 : 0
      const requiredHeight = (content?.scrollHeight ?? 0) + (cta?.offsetHeight ?? 0) + verticalPadding + 28 + premiumTabletSafety
      return Math.max(minimumCardHeight, requiredHeight)
    })
    const regularCardHeight = Math.max(...finalCardHeights.slice(0, 3))
    if (compactDesktop) {
      const sharedCardHeight = Math.max(...finalCardHeights)
      finalCardHeights.fill(sharedCardHeight)
    } else if (!mobile) {
      finalCardHeights.splice(0, 3, regularCardHeight, regularCardHeight, regularCardHeight)
    }

    if (mobile) {
      const rootStyles = window.getComputedStyle(document.documentElement)
      const headerHeight = Number.parseFloat(rootStyles.getPropertyValue('--header-height')) || 80
      const availableStageHeight = Math.max(window.innerHeight - headerHeight, 420)
      const cardBackHeight = finalCardWidth * (5609 / 3838)
      const entryRotations = [-5, 5, -4, 4]
      const exitRotations = [-6, 6, -6, 0]
      const exitX = [-28, 28, -26, 0]
      const readingTop = Math.max(16, Math.min(availableStageHeight * .1, 72))
      const bottomSafety = 14
      const readingData = finalCardHeights.map((cardHeight) => {
        const visibleCardHeight = availableStageHeight - readingTop - bottomSafety
        const overflow = Math.max(0, cardHeight - visibleCardHeight)
        return {
          startY: readingTop,
          endY: readingTop - overflow,
          duration: .9 + overflow / availableStageHeight * 1.55,
        }
      })

      gsap.set(planCards, {
        xPercent: -50,
        y: availableStageHeight + 48,
        width: finalCardWidth,
        height: cardBackHeight,
        rotationZ: index => entryRotations[index] ?? 0,
        scale: .94,
        opacity: .7,
        zIndex: index => index + 3,
      })
      gsap.set(planInners, { rotationY: 0 })

      const mobilePlansTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.plans-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: .85,
        },
        defaults: { ease: 'none' },
      })
      plansTimeline = mobilePlansTimeline

      mobilePlansTimeline
        .fromTo('.plans-heading', { y: 0, opacity: 1 }, { y: -18, opacity: .18, duration: .62, ease: 'power2.in' }, 0)

      let sequenceCursor = .18
      planCards.forEach((card, index) => {
        const inner = planInners[index]
        const reading = readingData[index]
        if (!inner || !reading) return

        const entryStart = sequenceCursor
        const entryDuration = .72
        const settleStart = entryStart + entryDuration
        const flipStart = settleStart + .16
        const readStart = flipStart + .48
        const exitStart = readStart + reading.duration

        mobilePlansTimeline
          .to(card, {
            y: reading.startY,
            rotationZ: 0,
            scale: 1,
            opacity: 1,
            duration: entryDuration,
            ease: 'power2.out',
          }, entryStart)
          .to(card, { y: reading.startY - 4, duration: .16, ease: 'power1.out' }, settleStart)
          .to(card, {
            height: finalCardHeights[index] ?? cardBackHeight,
            duration: .48,
            ease: 'power2.inOut',
          }, flipStart)
          .to(inner, { rotationY: 180, duration: .48, ease: 'power2.inOut' }, flipStart)
          .to(card, {
            y: reading.endY - (reading.endY === reading.startY ? 8 : 0),
            duration: reading.duration,
            ease: 'none',
          }, readStart)

        if (index < planCards.length - 1) {
          mobilePlansTimeline.to(card, {
            x: exitX[index] ?? 0,
            y: -finalCardHeights[index]! - 48,
            rotationZ: exitRotations[index] ?? 0,
            scale: .94,
            opacity: .38,
            duration: .72,
            ease: 'power2.in',
          }, exitStart)
          sequenceCursor = exitStart + .54
        } else {
          mobilePlansTimeline.to(card, { y: reading.endY - 12, duration: .3 }, exitStart)
          sequenceCursor = exitStart + .3
        }
      })

      const storyViewports = Math.min(6.5, Math.max(4.5, sequenceCursor * .38))
      gsap.set('.plans-section', { minHeight: availableStageHeight * (storyViewports + 1) })
      mobilePlansTimeline.to({}, { duration: .08 })
      return
    }

    if (stackedPlans) {
      const stackX = mobile ? [-18, -7, 7, 18] : [-28, -10, 10, 28]
      const stackY = [-3, -1, 1, 3]
      const stackRotation = [-5, -2, 2, 5]

      plansTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.plans-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: .75,
        },
        defaults: { ease: 'power2.inOut' },
      })

      gsap.set(planCards, {
        xPercent: -50,
        height: index => finalCardHeights[index] ?? minimumCardHeight,
        zIndex: index => planCards.length - index,
      })
      gsap.set(planInners, { rotationY: 0 })

      plansTimeline
        .fromTo('.plans-heading', { y: 0, opacity: 1 }, { y: 0, opacity: 1, duration: .08, ease: 'power2.out' }, 0)
        .fromTo(planCards, {
          yPercent: 105,
          x: 0,
          scale: .88,
          opacity: 0,
          rotationZ: 0,
        }, {
          yPercent: -43,
          scale: 1,
          opacity: 1,
          duration: .16,
          stagger: .016,
          ease: 'power3.out',
        }, .06)
        .to(planCards, {
          x: index => stackX[index] ?? 0,
          yPercent: index => -45 + (stackY[index] ?? 0),
          rotationZ: index => stackRotation[index] ?? 0,
          scale: index => 1 - index * .018,
          duration: .12,
          stagger: .012,
        }, .22)

      plansTimeline.to(planInners, {
        rotationY: 180,
        duration: .2,
        stagger: .045,
        ease: 'power2.inOut',
      }, .37)

      const cardsReadingStart = .57
      plansTimeline
        .to('.plans-heading', { y: 0, scale: .9, opacity: .18, duration: .1 }, .48)
        .to(planCards, {
          x: index => index === 0 ? 0 : 30 + index * 8,
          yPercent: -47,
          rotationZ: 0,
          scale: index => index === 0 ? 1 : .94 - index * .015,
          opacity: index => index === 0 ? 1 : .16,
          zIndex: index => planCards.length - index,
          duration: .12,
        }, cardsReadingStart)

      for (let index = 1; index < planCards.length; index += 1) {
        const previous = planCards[index - 1]
        const current = planCards[index]
        if (!previous || !current) continue
        const position = cardsReadingStart + .12 + (index - 1) * .16
        plansTimeline
          .to(previous, { x: -finalCardWidth * .72, yPercent: -50, scale: .9, opacity: 0, duration: .12 }, position)
          .to(current, { x: 0, yPercent: -47, scale: 1, opacity: 1, zIndex: 10 + index, duration: .12 }, position)
      }

      const premiumCard = planCards.at(-1)
      const premiumHeight = finalCardHeights.at(-1) ?? 0
      const headerHeight = Number.parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 96
      const premiumOverflow = Math.max(0, premiumHeight - (window.innerHeight - headerHeight - 32))
      if (premiumCard && premiumOverflow > 0) {
        plansTimeline.to(premiumCard, {
          y: -premiumOverflow,
          duration: Math.min(.75, Math.max(.38, premiumOverflow / window.innerHeight)),
          ease: 'none',
        })
      }
      plansTimeline.to({}, { duration: .12 })
      return
    }

    const fanGap = tablet ? Math.min(window.innerWidth * .06, 72) : Math.min(window.innerWidth * .115, 170)
    const finalGap = tablet
      ? Math.min(window.innerWidth * .105, 126)
      : compactDesktop
        ? finalCardWidth + 10
        : Math.min(window.innerWidth * .18, 360)
    const spreadFactors = [-1.5, -.5, .5, 1.5]
    const fanX = spreadFactors.map(factor => factor * fanGap)
    const fanY = [3, -2, -2, 3]
    const fanRotation = [-8, -3, 3, 8]
    const finalX = spreadFactors.map(factor => factor * finalGap)
    const finalY = [0, -1, -1, 0]

    plansTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.plans-section',
        start: 'top top',
        end: 'bottom bottom',
        scrub: .85,
      },
      defaults: { ease: 'power2.inOut' },
    })

    plansTimeline
      .fromTo('.plans-heading', { y: 0, opacity: 1 }, { y: 0, opacity: 1, duration: .1, ease: 'power2.out' }, 0)
      .fromTo(planCards, {
        xPercent: -50,
        yPercent: 115,
        scale: .85,
        opacity: 0,
        rotationZ: 0,
      }, {
        xPercent: -50,
        yPercent: -45,
        scale: 1,
        opacity: 1,
        duration: .19,
        stagger: .018,
        ease: 'power3.out',
      }, .08)
      .to(planCards, {
        xPercent: -50,
        x: index => fanX[index] ?? 0,
        yPercent: index => -45 + (fanY[index] ?? 0),
        rotationZ: index => fanRotation[index] ?? 0,
        scale: index => index === 1 ? 1 : .98,
        duration: .16,
        stagger: .018,
        ease: 'power2.out',
      }, .27)
      .to(planCards, {
        rotationZ: index => (fanRotation[index] ?? 0) * .45,
        yPercent: -47,
        duration: .11,
      }, .43)
      .to('.plan-card__inner', {
        rotationY: 180,
        duration: .2,
        stagger: .055,
        ease: 'power2.inOut',
      }, .52)
      .to(planCards, {
        xPercent: -50,
        x: index => finalX[index] ?? 0,
        yPercent: index => -50 + (finalY[index] ?? 0),
        rotationZ: 0,
        scale: 1,
        width: finalCardWidth,
        height: index => finalCardHeights[index] ?? minimumCardHeight,
        duration: .2,
        stagger: .018,
        ease: 'power2.out',
      }, .73)
      .to('.plans-heading', {
        y: compactDesktop ? 0 : -38,
        scale: compactDesktop ? .8 : .84,
        opacity: .46,
        duration: .14,
      }, .72)
      .to({}, { duration: .14 })
    })
  }, pageRoot.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
  animationMatch?.revert()
  plansTimeline = undefined
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
      <span id="planes-abiertos" class="plans-final-anchor" aria-hidden="true" />
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
.service-name { position: absolute; inset: 50% auto auto 0; width: 100%; transform: translateY(-50%); opacity: 0; font: 700 clamp(3.4rem, 6.7vw, 7.5rem)/.88 Montserrat, sans-serif; letter-spacing: -.065em; }
.service-name:first-child { opacity: 1; }
.service-name--long span { display: block; }
.service-name--long { font-size: clamp(3rem, 5.6vw, 6.5rem); }
.models-world { min-height: 245svh; }
.models-stage { position: sticky; top: 0; min-height: 100svh; display: grid; grid-template-columns: repeat(12, 1fr); align-items: center; gap: 2rem; }
.models-identity { grid-column: 3 / 11; grid-row: 1; }
.models-heading { display: flex; flex-direction: column; font-size: clamp(6rem, 14vw, 15rem); text-align: center; }
.models-heading { opacity: .24; }
.models-heading span:last-child { color: var(--cyan); }
.models-alliance { position: absolute; top: 11%; right: 6%; z-index: 3; font-family: Poppins, sans-serif; }
.models-alliance img { display: block; width: clamp(8.5rem, 12vw, 12rem); max-height: 10rem; object-fit: contain; object-position: left center; }
.model-categories { position: relative; z-index: 2; grid-column: 1 / 13; grid-row: 1; min-height: 68vh; }
.model-category { position: absolute; font: 700 clamp(2.8rem, 6vw, 6.7rem)/.9 Montserrat, sans-serif; letter-spacing: -.055em; }
.model-category:nth-child(1) { top: 8%; left: 2%; }
.model-category:nth-child(2) { top: 34%; right: 2%; }
.model-category:nth-child(3) { bottom: 22%; left: 9%; color: var(--cyan); }
.model-category:nth-child(4) { right: 15%; bottom: 2%; }
.plans-section { position: relative; min-height: 300svh; overflow: clip; scroll-margin-top: var(--header-height); background: transparent; }
.plans-final-anchor { position: absolute; top: calc(100% - 105svh); left: 0; width: 1px; height: 1px; scroll-margin-top: 0; pointer-events: none; }
.plans-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; perspective: 1400px; }
.plans-heading { position: absolute; top: max(calc(var(--header-height) + 1rem), clamp(6rem, 11vh, 8.5rem)); left: 50%; z-index: 2; display: flex; align-items: flex-start; gap: clamp(2rem, 5vw, 5rem); transform: translateX(-50%); transform-origin: left top; }
.plans-title { flex: 0 0 auto; font-size: clamp(3.6rem, 6.3vw, 7rem); }
.plans-title-line { display: block; }
.plans-title-line--two { color: var(--cyan); }
.plans-intro { width: min(25rem, 31vw); margin: .5rem 0 0; color: var(--muted); font: 500 clamp(.9rem, 1.15vw, 1.08rem)/1.65 Poppins, sans-serif; }
.plans-deck { position: absolute; z-index: 3; inset: 0; transform-style: preserve-3d; }
.plan-card { position: absolute; top: 61%; left: 50%; width: auto; height: clamp(21rem, 54vh, 32rem); aspect-ratio: 3838 / 5609; transform-origin: center center; will-change: transform, opacity, width, height; }
.plan-card__inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; will-change: transform; }
.plan-card__face { position: absolute; overflow: hidden; border: 1px solid rgba(242,244,247,.2); border-radius: clamp(1rem, 1.6vw, 1.5rem); backface-visibility: hidden; -webkit-backface-visibility: hidden; inset: 0; }
.plan-card__back { display: grid; place-items: center; border: 0; background: transparent; }
.plan-card__back img { display: block; width: 100%; height: 100%; object-fit: contain; }
.plan-card__front { display: flex; overflow: hidden; padding: clamp(.9rem, 1.15vw, 1.25rem); flex-direction: column; justify-content: space-between; color: var(--ink); background: #111820; transform: rotateY(180deg); }
.plan-card__front::before { position: absolute; top: 0; left: 0; width: 100%; height: .3rem; background: var(--cyan); content: ''; }
.plan-card--pro .plan-card__front { border-color: rgba(0,212,224,.8); }
.plan-card__content { display: flex; min-height: 0; flex: 1; flex-direction: column; }
.plan-card__subtitle { margin: .4rem 0 .75rem; color: var(--orange); font: 600 clamp(.48rem, .58vw, .6rem)/1.35 Poppins, sans-serif; letter-spacing: .14em; }
.plan-card__front h3 { margin: 0; font: 700 clamp(1.65rem, 2.35vw, 2.45rem)/.92 Montserrat, sans-serif; letter-spacing: -.06em; text-transform: uppercase; }
.plan-card__description { margin: clamp(.85rem, 1.8vh, 1.2rem) 0 0; color: var(--muted); font: 400 clamp(.64rem, .72vw, .76rem)/1.55 Poppins, sans-serif; }
.plan-card__price { display: flex; align-items: baseline; gap: .5rem; margin: 1rem 0 0; font-family: Poppins, sans-serif; }
.plan-card__price strong { color: var(--ink); font-size: clamp(1.25rem, 1.8vw, 1.8rem); line-height: 1; letter-spacing: -.045em; }
.plan-card__price span { color: var(--muted); font-size: .52rem; letter-spacing: .08em; }
.plan-card__features { margin: .7rem 0 0; padding: 0; color: var(--muted); font: 400 clamp(.5rem, .55vw, .61rem)/1.35 Poppins, sans-serif; list-style: none; }
.plan-card__features li { position: relative; padding-left: .85rem; }
.plan-card__features li::before { position: absolute; top: .62em; left: 0; width: .45rem; height: 1px; background: var(--cyan); content: ''; }
.plan-card__features li + li { margin-top: .35rem; }
.plan-card__cta { display: inline-flex; width: max-content; align-items: center; gap: .65rem; padding: 0 0 .4rem; margin-top: 1rem; border: 0; border-bottom: 1px solid currentColor; color: var(--ink); background: transparent; cursor: pointer; font: 600 clamp(.58rem, .7vw, .68rem)/1.3 Poppins, sans-serif; letter-spacing: .12em; text-decoration: none; transition: color .25s ease; }
.plan-card__cta:disabled { cursor: default; opacity: .4; }
.plan-card__cta span:last-child { color: var(--cyan); transition: transform .25s ease; }
.plan-card__cta:hover, .plan-card__cta:focus-visible { color: var(--cyan); outline: none; }
.plan-card__cta:hover span:last-child, .plan-card__cta:focus-visible span:last-child { transform: translate(3px,-3px); }
.plan-card__detail-content { min-height: 0; }
.plan-card__groups { display: grid; gap: .65rem; }
.plan-card__group h4 { margin: 0; color: var(--orange); font: 600 .58rem/1.4 Poppins, sans-serif; letter-spacing: .13em; }
.plan-card__group .plan-card__features { margin-top: .35rem; }
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
  .service-name, .service-name:nth-child(3), .service-name--long { position: static; display: block; width: 100%; max-width: 100%; min-height: 0; padding: 0; margin: 0 0 clamp(2.2rem, 9vw, 3.4rem); border: 0; opacity: 1 !important; transform: none !important; font-size: clamp(2.15rem, 10.5vw, 3.55rem); line-height: .92; letter-spacing: -.055em; }
  .service-name:nth-child(even) { padding-left: clamp(1.75rem, 12vw, 4rem); text-align: right; }
  .service-name:nth-child(3) { font-size: clamp(1.85rem, 9vw, 3rem); }
  .service-name--long { font-size: clamp(2rem, 9.8vw, 3.25rem); }
  .service-name--long span { display: block; }
  .service-name:last-child { margin-bottom: 0; }
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
  .plans-section { min-height: 520svh; padding: 0; overflow: clip; border-top: 1px solid rgba(242,244,247,.1); background: transparent; }
  .plans-final-anchor { top: calc(100% - 105svh); scroll-margin-top: 0; }
  .plans-stage { position: sticky; top: var(--header-height); height: calc(100dvh - var(--header-height)); min-height: 0; overflow: hidden; perspective: 1200px; }
  .plans-heading { position: absolute; top: 1rem; left: 50%; display: block; transform: translateX(-50%); }
  .plans-title { font-size: clamp(2.55rem, 11.5vw, 3.85rem); }
  .plans-intro { width: min(100%, 22rem); margin-top: .65rem; font-size: .82rem; line-height: 1.5; }
  .plans-deck { position: absolute; display: block; width: 100%; margin: 0; perspective: 1200px; inset: 0; }
  .plan-card { position: absolute; top: 0; left: 50%; width: min(calc(100vw - 2.5rem), 26.25rem); height: auto; min-height: 0; aspect-ratio: auto; transform-origin: center center; will-change: transform, opacity; }
  .plan-card__inner { width: 100%; height: 100%; }
  .plan-card__inner { -webkit-transform-style: preserve-3d; }
  .plan-card__back { overflow: visible; border-radius: 0; }
  .plan-card__back img { object-fit: contain; }
  .plan-card__front { position: absolute; min-height: 0; gap: 0; overflow: hidden; padding: 1.75rem; border-radius: 1.25rem; box-shadow: 0 1.25rem 3rem rgba(0,0,0,.22); }
  .plan-card__subtitle { margin: .15rem 0 .55rem; font-size: .75rem; }
  .plan-card__front h3 { font-size: clamp(2.125rem, 9vw, 2.75rem); }
  .plan-card__description { max-width: 30rem; margin-top: .65rem; font-size: .94rem; line-height: 1.48; }
  .plan-card__price { margin-top: 1rem; }
  .plan-card__price strong { font-size: clamp(1.875rem, 8vw, 2.375rem); }
  .plan-card__features { margin-top: .8rem; font-size: .875rem; line-height: 1.42; }
  .plan-card__features li { padding-left: 1rem; }
  .plan-card__features li + li { margin-top: .34rem; }
  .plan-card__cta { padding-bottom: .5rem; font-size: .875rem; }
  .plan-card__groups { gap: .72rem; margin-top: .8rem; }
  .plan-card__group { padding-top: .55rem; border-top: 1px solid rgba(242,244,247,.1); }
  .plan-card__group h4 { font-size: .75rem; }
  .plan-card__group .plan-card__features { margin-top: .35rem; font-size: .875rem; }
}

@media (min-width: 768px) and (max-width: 1279px) {
  .solutions-shell { width: calc(100% - clamp(4rem, 7vw, 6rem)); }
  .display-xl { font-size: clamp(5rem, 9vw, 8.5rem); }
  .display-lg { font-size: clamp(3.5rem, 6.4vw, 6rem); }
  .solutions-hero__layout { grid-template-columns: minmax(0, 2fr) minmax(12rem, .65fr); }
  .enterprise-stage { grid-template-columns: 40fr 60fr; gap: clamp(2rem, 4vw, 4rem); }
  .service-name { font-size: clamp(3.2rem, 6.2vw, 5.5rem); }
  .service-name:nth-child(3) { font-size: clamp(2.75rem, 5.35vw, 4.75rem); letter-spacing: -.075em; }
  .service-name--long { font-size: clamp(2.8rem, 5.3vw, 4.8rem); }
  .models-identity { grid-column: 2 / 12; }
  .models-heading { font-size: clamp(6.5rem, 13vw, 11rem); }
  .model-category { font-size: clamp(3rem, 5.6vw, 5.3rem); }
  .plans-section { min-height: 360svh; }
  .plans-heading { top: calc(var(--header-height) + 1rem); }
  .plans-title { font-size: clamp(3rem, 5.5vw, 4.8rem); }
  .plans-intro { font-size: .9rem; line-height: 1.5; }
  .plan-card__front { padding: 1.15rem; }
  .plan-card__subtitle { font-size: .7rem; }
  .plan-card__front h3 { font-size: clamp(1.8rem, 3.2vw, 2.2rem); }
  .plan-card__description { font-size: .84rem; line-height: 1.45; }
  .plan-card__features { font-size: .81rem; line-height: 1.38; }
  .plan-card__group h4 { font-size: .7rem; }
  .plan-card__cta { font-size: .76rem; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .solutions-hero__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    align-items: end;
    gap: 1.5rem;
  }
  .solutions-hero__title {
    width: 100%;
    font-size: clamp(4.4rem, 10.8vw, 6.1rem);
  }
  .solutions-hero__aside {
    max-width: 18rem;
    margin: 0;
    justify-self: end;
    font-size: .9rem;
    text-align: right;
  }
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
  .service-name { font-size: clamp(2.7rem, 5.5vw, 4rem); }
  .service-name--long { font-size: clamp(2.4rem, 4.8vw, 3.6rem); }
  .models-world { min-height: 220svh; }
  .models-heading { font-size: clamp(5rem, 10vw, 7.5rem); }
  .model-categories { min-height: 78svh; }
  .plans-heading { top: .75rem; }
  .plans-title { font-size: clamp(3rem, 5.6vw, 4.2rem); }
  .plans-section { min-height: 390svh; }
  .plan-card { top: 56%; height: min(72svh, 31rem); }
  .plan-card__front { padding: .9rem; }
  .plan-card__description { margin-top: .55rem; font-size: .78rem; }
  .plan-card__price { margin-top: .65rem; }
  .plan-card__features { margin-top: .5rem; font-size: .76rem; line-height: 1.28; }
  .plan-card__features li + li { margin-top: .22rem; }
  .plan-card__groups { gap: .4rem; }
  .plan-card__group .plan-card__features { margin-top: .2rem; }
}
@media (min-width: 1280px) and (max-height: 960px) {
  .enterprise-stage {
    top: var(--header-height);
    min-height: calc(100svh - var(--header-height));
    grid-template-columns: minmax(0, 43fr) minmax(0, 57fr);
    gap: clamp(2rem, 4vw, 4.5rem);
  }
  .enterprise-heading h2 { font-size: clamp(3.6rem, 5.1vw, 5.8rem); }
  .alliance-copy { margin-top: clamp(2rem, 4vh, 3rem); }
  .alliance-copy img { width: clamp(12rem, 18vw, 18rem); }
  .service-stage { min-height: min(60svh, 29rem); }
  .service-name { font-size: clamp(3.4rem, 4.9vw, 5.7rem); }
  .service-name--long { font-size: clamp(3rem, 4.35vw, 5rem); }
  .plans-title { font-size: clamp(3.5rem, 5.15vw, 5.8rem); }
  .plans-intro { width: min(24rem, 28vw); font-size: clamp(.82rem, 1vw, .98rem); }
  .plans-deck { transform: scale(.76); transform-origin: center center; }
}
@media (max-width: 390px) {
  .solutions-hero__title { font-size: 3.15rem; }
  .model-category { font-size: 2.7rem; }
  .service-name:nth-child(3) { font-size: 1.9rem; }
  .plans-heading { top: calc(var(--header-height) + .75rem); }
  .plans-title { font-size: clamp(2.35rem, 11.5vw, 3rem); }
  .plans-intro { max-width: 18rem; font-size: .78rem; }
  .plan-card { top: 0; width: calc(100vw - 2.5rem); }
  .plan-card__front { padding: 1.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .plans-section { min-height: auto; padding: 6rem 0; }
  .plans-stage { position: relative; height: auto; min-height: 0; overflow: visible; }
  .plans-heading { position: relative; top: auto; left: auto; display: block; transform: none; }
  .plans-intro { width: min(100%, 25rem); margin-top: 1.5rem; }
  .plans-deck { position: relative; display: flex; width: min(calc(100% - 2rem), 70rem); flex-wrap: wrap; gap: 1.5rem; margin: 4rem auto 0; inset: auto; }
  .plan-card { position: relative; top: auto; left: auto; height: min(50vh, 28rem); opacity: 1 !important; transform: none !important; }
  .plan-card__inner { transform: rotateY(180deg) !important; }
}
@media (max-width: 767px) and (prefers-reduced-motion: reduce) {
  .plans-section { min-height: auto; padding: 5rem 0; overflow: visible; }
  .plans-stage { position: relative; top: auto; height: auto; overflow: visible; }
  .plans-heading { position: relative; top: auto; left: auto; opacity: 1 !important; transform: none !important; }
  .plans-deck { position: relative; display: grid; width: calc(100% - 2.5rem); gap: 1.5rem; margin: 3rem auto 0; inset: auto; }
  .plan-card { position: relative; top: auto; left: auto; width: 100%; height: auto; opacity: 1 !important; transform: none !important; }
  .plan-card__inner { height: auto; transform: none !important; }
  .plan-card__back { display: none; }
  .plan-card__front { position: relative; height: auto; transform: none; }
}
</style>
