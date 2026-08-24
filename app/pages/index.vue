<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'NEO REDES | Marketing, Tecnología, Creatividad y Talento',
  meta: [
    {
      name: 'description',
      content: 'Neo Redes impulsa negocios y marcas mediante marketing digital, diseño web, automatización y soluciones creativas orientadas a resultados.',
    },
  ],
})

const pageRoot = ref<HTMLElement | null>(null)
const heroVideo = ref<HTMLVideoElement | null>(null)
const reelStory = ref<HTMLElement | null>(null)
const reelVideos = ref<HTMLVideoElement[]>([])

let storyTimeline: gsap.core.Timeline | null = null
let mediaContext: gsap.Context | null = null
let playbackObserver: IntersectionObserver | null = null
let heroIsVisible = false
let storyIsNear = false
let activeReel = -1
let reducedMotion = false

const setReelRef = (element: HTMLVideoElement | null, index: number) => {
  if (element) reelVideos.value[index] = element
}

const safePlay = (video?: HTMLVideoElement | null) => {
  if (!video || document.hidden) return
  video.play().catch(() => {})
}

const pauseReels = (except = -1) => {
  reelVideos.value.forEach((video, index) => {
    if (index !== except) video.pause()
  })
}

const setActiveReel = (index: number) => {
  if (activeReel === index) return
  activeReel = index
  pauseReels(index)
  if (storyIsNear && index >= 0) safePlay(reelVideos.value[index])
}

const handleVisibility = () => {
  if (document.hidden) {
    heroVideo.value?.pause()
    pauseReels()
    return
  }

  if (storyIsNear && activeReel >= 0) safePlay(reelVideos.value[activeReel])
  else if (heroIsVisible && !reducedMotion) safePlay(heroVideo.value)
}

const handleLogoPointer = (event: PointerEvent) => {
  const zone = event.currentTarget as HTMLElement
  const logo = zone.querySelector<HTMLElement>('.hero-logo-reveal')
  if (!logo) return
  const bounds = logo.getBoundingClientRect()

  logo.style.setProperty('--logo-x', `${event.clientX - bounds.left}px`)
  logo.style.setProperty('--logo-y', `${event.clientY - bounds.top}px`)
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  playbackObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === heroVideo.value) {
        heroIsVisible = entry.isIntersecting
        if (heroIsVisible && !storyIsNear && !reducedMotion) safePlay(heroVideo.value)
        else heroVideo.value?.pause()
      }

      if (entry.target === reelStory.value) {
        storyIsNear = entry.isIntersecting
        if (!storyIsNear) {
          pauseReels()
          if (heroIsVisible && !reducedMotion) safePlay(heroVideo.value)
        }
        else {
          heroVideo.value?.pause()
          if (!reducedMotion && activeReel >= 0) safePlay(reelVideos.value[activeReel])
        }
      }
    })
  }, { rootMargin: '0px', threshold: 0.01 })

  if (heroVideo.value) playbackObserver.observe(heroVideo.value)
  if (reelStory.value) playbackObserver.observe(reelStory.value)
  document.addEventListener('visibilitychange', handleVisibility)

  if (reducedMotion || !pageRoot.value || !reelStory.value) return

  mediaContext = gsap.context(() => {
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
        onLeave: () => pauseReels(),
        onLeaveBack: () => {
          pauseReels()
          if (!reducedMotion) safePlay(heroVideo.value)
        },
        onEnter: () => {
          heroVideo.value?.pause()
          setActiveReel(0)
        },
        onEnterBack: () => {
          heroVideo.value?.pause()
          setActiveReel(2)
        },
      },
    })

    timeline
      .fromTo('.reel-scene--one .reel-media', { autoAlpha: 0, y: '18svh', scale: 0.82, clipPath: 'inset(16% 0 16% 0)' }, { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)', duration: 18, ease: 'power3.out' }, 0)
      .fromTo('.reel-scene--one .reel-scene__title', { autoAlpha: 0, x: '-5vw' }, { autoAlpha: 1, x: 0, duration: 14, ease: 'power3.out' }, 3)
      .to('.reel-scene--one .reel-media', { x: '-35vw', y: '-5svh', scale: 0.7, rotation: -2, autoAlpha: 0.38, duration: 12, ease: 'power2.inOut' }, 36)
      .to('.reel-scene--one .reel-scene__title', { x: '-6vw', autoAlpha: 0, duration: 9 }, 36)
      .fromTo('.reel-scene--two .reel-media', { autoAlpha: 0, x: '-16vw', y: '14svh', scale: 0.82 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 12, ease: 'power3.out' }, 36)
      .fromTo('.reel-scene--two .reel-scene__title', { autoAlpha: 0, x: '5vw' }, { autoAlpha: 1, x: 0, duration: 11, ease: 'power3.out' }, 39)
      .to('.reel-scene--two .reel-media', { x: '10vw', y: '-16svh', scale: 0.72, rotation: 1.5, autoAlpha: 0.32, duration: 11, ease: 'power2.inOut' }, 64)
      .to('.reel-scene--two .reel-scene__title', { x: '6vw', autoAlpha: 0, duration: 9 }, 64)
      .fromTo('.reel-scene--three .reel-media', { autoAlpha: 0, x: '15vw', y: '22svh', scale: 0.78 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 11, ease: 'power3.out' }, 64)
      .fromTo('.reel-scene--three .reel-scene__title', { autoAlpha: 0, x: '-5vw' }, { autoAlpha: 1, x: 0, duration: 10, ease: 'power3.out' }, 67)
      .to('.reel-scene--three .reel-media', { x: '18vw', y: '-5svh', scale: 0.62, autoAlpha: 0.2, duration: 10, ease: 'power2.inOut' }, 90)
      .to('.reel-scene--three .reel-scene__title', { autoAlpha: 0, x: '-4vw', duration: 7 }, 90)
      .fromTo('.reel-story__closing', { autoAlpha: 0, y: '7svh' }, { autoAlpha: 1, y: 0, duration: 10, ease: 'power3.out' }, 90)

    storyTimeline = timeline
  }, pageRoot.value)
})

onBeforeUnmount(() => {
  storyTimeline?.scrollTrigger?.kill()
  storyTimeline?.kill()
  mediaContext?.revert()
  playbackObserver?.disconnect()
  document.removeEventListener('visibilitychange', handleVisibility)
  heroVideo.value?.pause()
  pauseReels()
  reelVideos.value = []
})

const services = [
  {
    title: 'MARKETING DIGITAL',
    description: 'Estrategia, contenido, redes sociales, diseño y publicidad.',
    to: '/soluciones#marketing',
    alignment: 'start',
  },
  {
    title: 'DISEÑO Y DESARROLLO WEB',
    description: 'Páginas web, landing pages y soluciones digitales.',
    to: '/soluciones#web',
    alignment: 'offset',
  },
  {
    title: 'IA & AUTOMATIZACIÓN',
    description: 'Tecnología aplicada a atención, ventas, captación y optimización de procesos.',
    to: '/soluciones#automatizacion',
    alignment: 'compact',
  },
  {
    title: 'NEO MODELS',
    description: 'Talento, producción audiovisual y creación de contenido para marcas.',
    to: '/soluciones#neo-models',
    alignment: 'wide',
  },
]
</script>

<template>
  <main ref="pageRoot" class="home">
    <section class="hero" aria-labelledby="hero-title">
      <video
        ref="heroVideo"
        class="hero__video"
        src="/Videos/Hero.mp4"
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
        </h1>
      </div>

      <div class="hero-logo-zone" aria-hidden="true" @pointermove="handleLogoPointer">
        <img class="hero-logo-reveal" src="/LogoRobt.webp" alt="">
      </div>
    </section>

    <section ref="reelStory" class="reel-story" aria-label="Historias audiovisuales de Neo Redes">
      <div class="reel-story__stage">
        <article class="reel-scene reel-scene--one">
          <h2 class="reel-scene__title">CONTENIDO<br>QUE <strong>CONECTA.</strong></h2>
          <div class="reel-media">
            <video
              :ref="(element) => setReelRef(element as HTMLVideoElement | null, 0)"
              src="/Videos/Reel1.mp4"
              muted
              loop
              playsinline
              preload="metadata"
            />
          </div>
        </article>

        <article class="reel-scene reel-scene--two">
          <div class="reel-media">
            <video
              :ref="(element) => setReelRef(element as HTMLVideoElement | null, 1)"
              src="/Videos/Reel2.mp4"
              muted
              loop
              playsinline
              preload="metadata"
            />
          </div>
          <h2 class="reel-scene__title">ESTRATEGIA<br>QUE <strong>MUEVE.</strong></h2>
        </article>

        <article class="reel-scene reel-scene--three">
          <h2 class="reel-scene__title">IDEAS QUE<br>GENERAN <strong>RESULTADOS.</strong></h2>
          <div class="reel-media">
            <video
              :ref="(element) => setReelRef(element as HTMLVideoElement | null, 2)"
              src="/Videos/Reel3.mp4"
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

    <section class="positioning" aria-labelledby="positioning-title">
      <div class="positioning__top">
        <p class="positioning__label">NEO REDES</p>
        <p class="positioning__slogan">CONECTAMOS IDEAS · GENERAMOS RESULTADOS</p>
      </div>

      <h2 id="positioning-title" class="positioning__title">
        <span>MARKETING · TECNOLOGÍA ·</span>
        <span>CREATIVIDAD · <strong>TALENTO</strong></span>
      </h2>

      <div class="positioning__bottom">
        <p>
          Integramos estrategia, contenido, publicidad, desarrollo web, automatización y talento creativo para ofrecer soluciones completas.
        </p>
        <NuxtLink to="/nosotros">CONOCER NEO REDES <span aria-hidden="true">↗</span></NuxtLink>
      </div>
    </section>

    <section class="home-services" aria-labelledby="services-title">
      <header class="home-services__header">
        <div class="home-services__label">
          <p>LO QUE HACEMOS</p>
          <span aria-hidden="true" />
        </div>
        <p id="services-title" class="home-services__intro">
          Soluciones que conectan estrategia, creatividad y tecnología.
        </p>
      </header>

      <div class="home-services__list">
        <NuxtLink
          v-for="service in services"
          :key="service.to"
          class="service-row"
          :class="`service-row--${service.alignment}`"
          :to="service.to"
        >
          <span class="service-row__line" aria-hidden="true" />
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <span class="service-row__arrow" aria-hidden="true">↗</span>
        </NuxtLink>
      </div>

      <div class="home-services__closing">
        <p>TODO LO QUE TU MARCA NECESITA,<br>EN UN MISMO LUGAR.</p>
        <NuxtLink to="/soluciones">
          EXPLORAR TODAS LAS SOLUCIONES <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  overflow-x: clip;
  overflow-y: visible;
  background: var(--color-black);
}

.hero {
  position: relative;
  min-height: calc(100svh - var(--header-height));
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
  z-index: 3;
  display: flex;
  width: min(62%, 70rem);
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
  font-size: clamp(0.62rem, 0.72vw, 0.74rem);
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
  font-size: clamp(3rem, 4.75vw, 8.5rem);
  font-weight: 700;
  letter-spacing: -0.068em;
  line-height: 0.91;
  text-transform: uppercase;
}

.hero__line {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  padding: 0.08em 0.02em 0.12em;
  margin: -0.08em -0.02em -0.04em;
}

.hero__line > span {
  display: block;
  animation: title-reveal 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero__line:nth-child(2) > span { animation-delay: 90ms; }
.hero__line:nth-child(3) > span { animation-delay: 180ms; }
.hero__line--offset,
.hero__line--dominant { margin-left: 0; }
.hero__line strong { color: var(--color-cyan); font-weight: inherit; }
.hero__line em { color: var(--color-orange); font-style: normal; }

.hero-logo-zone {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  width: 46%;
  height: 100%;
  --logo-x: 50%;
  --logo-y: 50%;
}

.hero-logo-reveal {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(18rem, 34vw, 42rem);
  max-width: 88%;
  max-height: 72svh;
  object-fit: contain;
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 180ms ease;
  -webkit-mask-image: radial-gradient(circle 130px at var(--logo-x) var(--logo-y), #000 0%, #000 45%, transparent 78%);
  mask-image: radial-gradient(circle 130px at var(--logo-x) var(--logo-y), #000 0%, #000 45%, transparent 78%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .hero-logo-zone:hover .hero-logo-reveal { opacity: 1; }
}

@media (hover: none), (pointer: coarse) {
  .hero-logo-zone { display: none; }
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
  inset: 0;
  display: grid;
  align-items: center;
  padding: calc(var(--header-height) + 2rem) var(--page-padding) 2rem;
  pointer-events: none;
}

.reel-scene--one,
.reel-scene--three {
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.62fr);
  gap: clamp(3rem, 8vw, 10rem);
}

.reel-scene--two {
  grid-template-columns: minmax(18rem, 0.65fr) minmax(0, 1fr);
  gap: clamp(3rem, 9vw, 11rem);
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
  justify-self: end;
  text-align: right;
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
  margin-right: clamp(1rem, 5vw, 6rem);
}

.reel-scene--one video { object-position: 54% center; }

.reel-scene--two .reel-media {
  width: clamp(19rem, 30vw, 33rem);
  height: min(72svh, 46rem);
  margin-left: clamp(1rem, 4vw, 5rem);
}

.reel-scene--two video { object-position: 44% center; }

.reel-scene--three .reel-media {
  width: clamp(22rem, 36vw, 39rem);
  height: min(62svh, 39rem);
  justify-self: end;
  margin-right: clamp(0rem, 2vw, 3rem);
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

.positioning {
  display: grid;
  min-height: 100svh;
  grid-template-rows: auto 1fr auto;
  padding: clamp(5rem, 10vw, 10rem) var(--page-padding);
  color: var(--color-black);
  background: var(--color-light);
}

.positioning__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.14em;
}

.positioning__top p { margin: 0; }
.positioning__label { color: var(--color-black); }
.positioning__slogan { color: rgba(13, 17, 23, 0.48); }

.positioning__title {
  align-self: center;
  margin: clamp(4rem, 8vw, 8rem) 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 6.4vw, 7.4rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.94;
  text-transform: uppercase;
}

.positioning__title span { display: block; }
.positioning__title span:last-child { margin-left: clamp(1rem, 8vw, 9rem); }
.positioning__title strong { color: var(--color-cyan); font-weight: inherit; }

.positioning__bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.72fr);
  align-items: end;
  gap: clamp(3rem, 8vw, 10rem);
  width: min(75rem, 82%);
  margin-left: auto;
}

.positioning__bottom p {
  max-width: 43rem;
  margin: 0;
  font-size: clamp(1.05rem, 1.6vw, 1.45rem);
  line-height: 1.65;
}

.positioning__bottom a {
  width: fit-content;
  justify-self: end;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--color-black);
  font-family: var(--font-display);
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-decoration: none;
  transition: color 200ms ease, border-color 200ms ease;
}

.positioning__bottom a:hover,
.positioning__bottom a:focus-visible { border-color: var(--color-cyan); color: var(--color-cyan); }

.home-services {
  padding: clamp(6rem, 10vw, 10rem) var(--page-padding);
  color: var(--color-light);
  background: var(--color-black);
}

.home-services__header {
  display: grid;
  grid-template-columns: minmax(12rem, 0.7fr) minmax(20rem, 1fr);
  align-items: end;
  gap: clamp(3rem, 8vw, 10rem);
  margin-bottom: clamp(5rem, 9vw, 9rem);
}

.home-services__label {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.home-services__label p {
  flex: 0 0 auto;
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.15em;
}

.home-services__label span {
  width: min(12rem, 15vw);
  height: 1px;
  background: rgba(242, 244, 247, 0.26);
}

.home-services__intro {
  max-width: 37rem;
  margin: 0;
  color: rgba(242, 244, 247, 0.68);
  font-size: clamp(1.15rem, 1.8vw, 1.65rem);
  line-height: 1.5;
}

.home-services__list {
  border-bottom: 1px solid rgba(242, 244, 247, 0.16);
}

.service-row {
  position: relative;
  display: grid;
  min-height: clamp(10rem, 14vw, 13.75rem);
  grid-template-columns: minmax(0, 1.55fr) minmax(16rem, 0.7fr) auto;
  align-items: center;
  gap: clamp(2rem, 5vw, 6rem);
  padding: clamp(2.5rem, 4vw, 4rem) 0;
  border-top: 1px solid rgba(242, 244, 247, 0.16);
  color: var(--color-light);
  text-decoration: none;
}

.service-row__line {
  position: absolute;
  top: -1px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-cyan);
  transition: width 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.service-row h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5.5vw, 6.5rem);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 0.91;
  text-transform: uppercase;
  transition: color 320ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}

.service-row--offset h3 { padding-left: clamp(2rem, 7vw, 8rem); }
.service-row--offset h3 { font-size: clamp(2.5rem, 3.8vw, 4.75rem); }
.service-row--compact h3 { font-size: clamp(2.6rem, 4.5vw, 5.5rem); }
.service-row--wide { grid-template-columns: minmax(0, 1.75fr) minmax(16rem, 0.55fr) auto; }

.service-row p {
  max-width: 27rem;
  margin: 0;
  color: rgba(242, 244, 247, 0.5);
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  line-height: 1.65;
  transition: color 320ms ease, opacity 320ms ease;
}

.service-row__arrow {
  color: rgba(242, 244, 247, 0.54);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.4vw, 2.5rem);
  transition: color 320ms ease, transform 320ms ease;
}

.service-row:focus-visible {
  outline: 2px solid var(--color-cyan);
  outline-offset: 0.5rem;
}

.home-services__closing {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 3rem;
  margin-top: clamp(5rem, 9vw, 9rem);
}

.home-services__closing p {
  margin: 0;
  color: rgba(242, 244, 247, 0.72);
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.2vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.15;
}

.home-services__closing a {
  padding-bottom: 0.55rem;
  border-bottom: 1px solid rgba(242, 244, 247, 0.5);
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-decoration: none;
  transition: color 250ms ease, border-color 250ms ease;
}

.home-services__closing a:hover,
.home-services__closing a:focus-visible {
  border-color: var(--color-orange);
  color: var(--color-orange);
}

@media (hover: hover) and (pointer: fine) {
  .service-row:hover .service-row__line { width: 100%; }
  .service-row:hover h3 { color: var(--color-cyan); transform: translateX(1.25rem); }
  .service-row:hover p { color: rgba(242, 244, 247, 0.85); }
  .service-row:hover .service-row__arrow { color: var(--color-orange); transform: translate(0.2rem, -0.2rem) rotate(5deg); }
}

@keyframes title-reveal {
  from { opacity: 0; transform: translateY(110%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(1.25rem); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1100px) {
  .positioning__bottom { width: 90%; }
  .service-row--offset h3 { padding-left: clamp(1rem, 3vw, 2.5rem); }
  .service-row h3 { font-size: clamp(2.7rem, 5.2vw, 4.2rem); }
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
    font-size: clamp(3rem, 14vw, 5.4rem);
    letter-spacing: -0.06em;
    line-height: 0.91;
  }

  .hero__line--offset,
  .hero__line--dominant { margin-left: 0; }

  .hero__line--dominant { font-size: 0.56em; }

  .hero-logo-zone { display: none; }

  .positioning {
    min-height: auto;
    padding-block: 6rem;
  }

  .positioning__top { align-items: flex-start; flex-direction: column; gap: 0.75rem; }
  .positioning__slogan { max-width: 18rem; line-height: 1.6; }

  .positioning__title {
    margin-block: 5rem;
    font-size: clamp(2.7rem, 12vw, 5rem);
    line-height: 0.98;
  }

  .positioning__title span,
  .positioning__title span:last-child { margin-left: 0; }

  .positioning__bottom {
    display: flex;
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    gap: 2.25rem;
    margin: 0;
  }

  .positioning__bottom a { justify-self: start; }

  .home-services {
    padding-block: 6rem;
  }

  .home-services__header {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 4.5rem;
  }

  .home-services__label span { width: 6rem; }
  .home-services__intro { max-width: 31rem; }

  .service-row,
  .service-row--wide {
    min-height: 0;
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
    padding-block: 3rem;
  }

  .service-row h3 {
    grid-column: 1;
    font-size: clamp(2.2rem, 10vw, 3.8rem);
    line-height: 0.95;
    overflow-wrap: normal;
    word-break: normal;
  }

  .service-row--offset h3 { padding-left: 0; }
  .service-row--offset h3,
  .service-row--compact h3 { font-size: clamp(2.2rem, 10vw, 3.8rem); }

  .service-row p {
    grid-column: 1;
    max-width: 30rem;
    color: rgba(242, 244, 247, 0.68);
  }

  .service-row__arrow {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
  }

  .home-services__closing {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 2.5rem;
    margin-top: 5rem;
  }

  .home-services__closing a { width: fit-content; }
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
    gap: 2rem;
    padding: calc(var(--header-height) + 1.5rem) var(--page-padding) 2rem;
  }

  .reel-scene__title,
  .reel-scene--two .reel-scene__title {
    align-self: stretch;
    justify-self: auto;
    font-size: clamp(2.7rem, 12vw, 4.5rem);
    text-align: left;
  }

  .reel-scene--two .reel-scene__title { order: 1; }
  .reel-scene--two .reel-media { order: 2; }

  .reel-scene .reel-media {
    width: min(72vw, 18rem);
    height: min(48svh, 25rem);
    margin: 0;
  }

  .reel-scene--one .reel-media,
  .reel-scene--three .reel-media { align-self: flex-end; }

  .reel-scene--two .reel-media { align-self: flex-start; }

  .reel-scene--three .reel-media {
    width: min(82vw, 20rem);
    height: min(43svh, 23rem);
  }

  .reel-story__closing {
    width: calc(100% - (2 * var(--page-padding)));
    font-size: clamp(2.4rem, 11vw, 4rem);
    text-align: left;
  }
}

@media (max-width: 900px) {
  .home-services {
    padding-block: clamp(5.5rem, 12vw, 7rem);
  }

  .home-services__header {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: clamp(4rem, 10vw, 5.5rem);
  }

  .home-services__label span {
    width: clamp(4rem, 18vw, 8rem);
  }

  .service-row,
  .service-row--wide {
    display: block;
    min-height: 0;
    padding-block: clamp(2.75rem, 8vw, 4rem);
  }

  .service-row h3,
  .service-row--offset h3,
  .service-row--compact h3 {
    width: calc(100% - 3.75rem);
    padding-left: 0;
    font-size: clamp(2.2rem, 8vw, 3.8rem);
    line-height: 0.96;
  }

  .service-row--compact h3 {
    font-size: clamp(1.95rem, 7.2vw, 3.4rem);
  }

  .service-row p {
    max-width: 34rem;
    margin-top: clamp(1.25rem, 3vw, 1.75rem);
    color: rgba(242, 244, 247, 0.7);
  }

  .service-row__arrow {
    position: absolute;
    top: clamp(2.75rem, 8vw, 4rem);
    right: 0;
  }

  .home-services__closing {
    grid-template-columns: 1fr;
    align-items: start;
    gap: 2.5rem;
  }

  .home-services__closing a {
    width: fit-content;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__eyebrow,
  .hero__line > span { animation: none; opacity: 1; transform: none; }

  .hero-logo-reveal { transition: none; }

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
}
</style>
