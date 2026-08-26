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
    const mobile = window.matchMedia('(max-width: 767px)').matches
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
      const serviceTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.enterprise-world', start: 'top top', end: 'bottom bottom', scrub: .72 },
      })
        .from('.enterprise-heading > *', { x: -60, opacity: 0, stagger: .12, duration: .55 })

      serviceItems.forEach((service, index) => {
        if (index === 0) {
          serviceTimeline.from(service, { x: 90, opacity: 0, scale: .96, duration: .8 })
          return
        }
        const previous = serviceItems[index - 1]
        if (previous) serviceTimeline.to(previous, { x: -45, y: -24, opacity: 0, scale: .97, duration: .48 })
        serviceTimeline.fromTo(
          service,
          { x: index % 2 ? 75 : -65, y: 32, opacity: 0, scale: .97 },
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
    if (mobile) {
      gsap.set('.plan-card__inner', { rotationY: 180 })
      return
    }
    const fanGap = mobile ? 18 : Math.min(window.innerWidth * .115, 170)
    const finalGap = mobile ? 24 : Math.min(window.innerWidth * .18, 360)
    const finalCardWidth = Math.min(window.innerWidth * .205, 340)
    const finalCardHeight = Math.min(window.innerHeight * .64, 650)
    const spreadFactors = [-1.5, -.5, .5, 1.5]
    const fanX = spreadFactors.map(factor => factor * fanGap)
    const fanY = mobile ? [-3, -1, 1, 3] : [3, -2, -2, 3]
    const fanRotation = [-8, -3, 3, 8]
    const finalX = spreadFactors.map(factor => factor * finalGap)
    const finalY = mobile ? [-8, -3, 3, 8] : [0, -1, -1, 0]

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
      .fromTo('.plans-heading', { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: .1, ease: 'power2.out' }, 0)
      .fromTo(planCards, {
        xPercent: -50,
        yPercent: mobile ? 105 : 115,
        scale: .85,
        opacity: 0,
        rotationZ: 0,
      }, {
        xPercent: -50,
        yPercent: mobile ? -39 : -45,
        scale: 1,
        opacity: 1,
        duration: .19,
        stagger: .018,
        ease: 'power3.out',
      }, .08)
      .to(planCards, {
        xPercent: -50,
        x: index => fanX[index] ?? 0,
        yPercent: index => (mobile ? -39 : -45) + (fanY[index] ?? 0),
        rotationZ: index => fanRotation[index] ?? 0,
        scale: index => index === 1 ? 1 : .98,
        duration: .16,
        stagger: .018,
        ease: 'power2.out',
      }, .27)
      .to(planCards, {
        rotationZ: index => (fanRotation[index] ?? 0) * .45,
        yPercent: mobile ? -42 : -47,
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
        yPercent: index => (mobile ? -50 : -43) + (finalY[index] ?? 0),
        rotationZ: 0,
        scale: mobile ? .92 : 1,
        width: finalCardWidth,
        height: finalCardHeight,
        duration: .2,
        stagger: .018,
        ease: 'power2.out',
      }, .73)
      .to('.plans-heading', {
        y: mobile ? -18 : -38,
        scale: mobile ? .86 : .84,
        opacity: .46,
        duration: .14,
      }, .72)
      .to({}, { duration: .14 })
  }, pageRoot.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
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
              <img src="/Alianzas/LOGOICONIC.webp" alt="ICONIC">
            </a>
            <img v-else src="/Alianzas/LOGOICONIC.webp" alt="ICONIC">
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
                <img src="/Images/Tar.webp" alt="Reverso de tarjeta Neo Redes">
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
.plans-heading { position: absolute; top: clamp(6rem, 11vh, 8.5rem); left: 50%; z-index: 2; display: flex; align-items: flex-start; gap: clamp(2rem, 5vw, 5rem); transform: translateX(-50%); transform-origin: left top; }
.plans-title { flex: 0 0 auto; font-size: clamp(3.6rem, 6.3vw, 7rem); }
.plans-title-line { display: block; }
.plans-title-line--two { color: var(--cyan); }
.plans-intro { width: min(25rem, 31vw); margin: .5rem 0 0; color: var(--muted); font: 500 clamp(.9rem, 1.15vw, 1.08rem)/1.65 Poppins, sans-serif; }
.plans-deck { position: absolute; z-index: 3; inset: 0; transform-style: preserve-3d; }
.plan-card { position: absolute; top: 61%; left: 50%; width: auto; height: clamp(21rem, 54vh, 32rem); aspect-ratio: 3838 / 5609; transform-origin: center center; will-change: transform, opacity, width, height; }
.plan-card__inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; will-change: transform; }
.plan-card__face { position: absolute; overflow: hidden; border: 1px solid rgba(242,244,247,.2); border-radius: clamp(1rem, 1.6vw, 1.5rem); backface-visibility: hidden; -webkit-backface-visibility: hidden; inset: 0; }
.plan-card__back { display: grid; place-items: center; background: #f2f4f7; }
.plan-card__back img { display: block; width: 100%; height: 100%; object-fit: contain; }
.plan-card__front { display: flex; overflow-y: auto; padding: clamp(.9rem, 1.15vw, 1.25rem); flex-direction: column; justify-content: space-between; color: var(--ink); background: #111820; scrollbar-color: rgba(0,212,224,.45) transparent; scrollbar-width: thin; transform: rotateY(180deg); }
.plan-card__front::before { position: absolute; top: 0; left: 0; width: 100%; height: .3rem; background: var(--cyan); content: ''; }
.plan-card--pro .plan-card__front { border-color: rgba(0,212,224,.8); }
.plan-card__content { display: flex; flex-direction: column; }
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
.plan-card__cta { display: inline-flex; width: max-content; align-items: center; gap: .65rem; padding: 0 0 .4rem; border: 0; border-bottom: 1px solid currentColor; color: var(--ink); background: transparent; cursor: pointer; font: 600 clamp(.58rem, .7vw, .68rem)/1.3 Poppins, sans-serif; letter-spacing: .12em; text-decoration: none; transition: color .25s ease; }
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
  .solutions-shell { width: calc(100% - 3rem); }
  .solutions-video__media { object-position: 54% 50%; }
  .display-xl { font-size: clamp(3.4rem, 14vw, 5.6rem); }
  .display-lg { font-size: clamp(3rem, 13vw, 5.2rem); }
  .solutions-hero { min-height: 70dvh; align-items: start; padding: clamp(2rem, 6vh, 3.25rem) 0 3.5rem; }
  .solutions-hero__layout { display: flex; min-height: 0; flex-direction: column; justify-content: flex-start; align-items: stretch; gap: clamp(2rem, 7vh, 4rem); }
  .solutions-hero__title { max-width: 100%; white-space: normal; }
  .solutions-hero__aside { align-self: flex-end; margin: 0; }
  .enterprise-world { min-height: auto; margin-top: -8dvh; padding: 4.5rem 0 5rem; }
  .models-world { min-height: auto; padding: 5rem 0; }
  .enterprise-stage, .models-stage { position: static; min-height: 0; display: block; }
  .enterprise-heading h2 { width: min-content; max-width: 100%; line-height: .9; }
  .alliance-copy { margin: 2.5rem 0 4.5rem; }
  .alliance-copy img { width: clamp(13.75rem, 70vw, 21.25rem); max-width: 100%; }
  .service-stage { min-height: 0; }
  .service-name { position: static; width: 100%; max-width: 100%; margin-bottom: clamp(3.5rem, 12vw, 6rem); transform: none !important; opacity: 1 !important; overflow-wrap: normal; font-size: clamp(2.4rem, 11.5vw, 4.2rem); line-height: .94; }
  .service-name:nth-child(3) { font-size: clamp(1.95rem, 9.25vw, 3.4rem); letter-spacing: -.055em; }
  .service-name--long { font-size: clamp(2.3rem, 10.6vw, 3.85rem); }
  .service-name:last-child { margin-bottom: 0; }
  .models-heading { font-size: clamp(5rem, 22vw, 8rem); text-align: left; }
  .models-alliance { position: static; margin: 2.5rem 0 5rem; opacity: 1; }
  .models-alliance img { width: min(14rem, 52vw); }
  .model-categories { min-height: 0; }
  .model-category { position: static; margin-bottom: 2.8rem; font-size: clamp(2.8rem, 13vw, 4.5rem); }
  .model-category:nth-child(even) { text-align: right; }
  .plans-section { min-height: auto; padding: 6rem 0; overflow: visible; }
  .plans-final-anchor { top: 0; scroll-margin-top: var(--header-height); }
  .plans-stage { position: relative; height: auto; overflow: visible; }
  .plans-heading { position: relative; top: auto; left: auto; display: block; transform: none; }
  .plans-title { font-size: clamp(3rem, 13vw, 4.7rem); }
  .plans-intro { width: min(100%, 22rem); margin-top: 1.25rem; font-size: .84rem; }
  .plans-deck { position: relative; display: grid; width: calc(100% - 2rem); gap: 1.25rem; margin: 3rem auto 0; inset: auto; }
  .plan-card { position: relative; top: auto; left: auto; width: 100%; height: auto; min-height: 36rem; aspect-ratio: auto; opacity: 1; transform: none !important; }
  .plan-card--premium { min-height: 55rem; }
  .plan-card__front { padding: 1.25rem; }
  .plan-card__subtitle { margin: .25rem 0 .55rem; font-size: .55rem; }
  .plan-card__front h3 { font-size: clamp(1.8rem, 9vw, 2.5rem); }
  .plan-card__description { margin-top: .75rem; font-size: .68rem; line-height: 1.5; }
  .plan-card__price { margin-top: .8rem; }
  .plan-card__price strong { font-size: 1.4rem; }
  .plan-card__features { font-size: .63rem; }
  .plan-card__cta { font-size: .58rem; }
  .plan-card__groups { gap: .8rem; }
  .plan-card__group .plan-card__features { font-size: .6rem; }
}
@media (max-width: 370px) {
  .solutions-hero__title { font-size: 3.15rem; }
  .model-category { font-size: 2.7rem; }
  .service-name:nth-child(3) { font-size: 1.9rem; }
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
</style>
