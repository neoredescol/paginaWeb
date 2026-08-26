<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  title: 'SOBRE NEO REDES | NEO REDES',
  meta: [{
    name: 'description',
    content: 'Neo Redes conecta marketing digital, tecnología, creatividad y automatización para impulsar negocios, marcas y empresas.',
  }],
})

const pageRoot = ref<HTMLElement | null>(null)
const backgroundVideo = ref<HTMLVideoElement | null>(null)
let animationContext: gsap.Context | undefined

const playBackgroundVideo = () => backgroundVideo.value?.play().catch(() => {})
const handleVisibility = () => {
  if (document.hidden) backgroundVideo.value?.pause()
  else playBackgroundVideo()
}

onMounted(() => {
  if (!pageRoot.value) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('visibilitychange', handleVisibility)
  if (reducedMotion) backgroundVideo.value?.pause()
  else playBackgroundVideo()
  if (reducedMotion) return

  gsap.registerPlugin(ScrollTrigger)
  animationContext = gsap.context(() => {
    const mobile = window.matchMedia('(max-width: 800px)').matches
    const heroShift = mobile ? 28 : window.innerWidth * .08
    const keywordShift = mobile ? 34 : window.innerWidth * .12
    const connectorPaths = gsap.utils.toArray<SVGPathElement>('.connector-path')
    gsap.set(connectorPaths, { strokeDasharray: 1, strokeDashoffset: 1 })

    gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } })
      .from('.hero-line--one', { x: -heroShift, opacity: 0 }, 0.12)
      .from('.hero-line--two', { x: heroShift, opacity: 0 }, 0.28)
      .from('.hero-ambient', { opacity: 0, duration: 1.4 }, 0.2)
      .from('.hero-kicker', { x: mobile ? 28 : 70, opacity: 0 }, 0.58)

    gsap.timeline({
      scrollTrigger: { trigger: pageRoot.value, start: 'top top', end: 'bottom bottom', scrub: .65 },
    })
      .to(connectorPaths, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
      .to('.hero-ambient', { x: -80, scale: 1.025, ease: 'none', duration: .12 }, 0)
      .to('.hero-line--one', { x: mobile ? -24 : -70, scale: .96, opacity: .38, duration: .12 }, 0)
      .to('.hero-line--two', { x: mobile ? 24 : 70, scale: .96, opacity: .38, duration: .12 }, 0)
      .to('.hero-kicker', { x: mobile ? -12 : -35, opacity: .45, duration: .1 }, .02)
      .to('.video-overlay', { opacity: .76, duration: .2, ease: 'none' }, .14)
      .to('.video-overlay', { opacity: .67, duration: .18, ease: 'none' }, .5)
      .to('.video-overlay', { opacity: .74, duration: .18, ease: 'none' }, .78)

    gsap.timeline({
      scrollTrigger: { trigger: '.growth-moment', start: 'top 82%', end: 'bottom 34%', scrub: .6 },
      defaults: { ease: 'power2.out' },
    })
      .from('.growth-line--one', { x: -heroShift, opacity: 0, duration: .8 })
      .from('.growth-line--two', { x: heroShift, opacity: 0, duration: .85 }, '-=.46')
      .from('.growth-line--three', { y: mobile ? 35 : 65, opacity: 0, scale: .96, duration: .8 }, '-=.42')
      .from('.growth-copy', { x: mobile ? 25 : 40, opacity: 0, duration: .72 }, '-=.25')

    gsap.timeline({
      scrollTrigger: { trigger: '.disciplines-moment', start: 'top 80%', end: 'bottom 28%', scrub: .7 },
      defaults: { ease: 'power2.inOut' },
    })
      .from('.discipline-word--strategy', { x: -keywordShift, opacity: 0, scale: .97, duration: .8 })
      .to('.discipline-word--strategy', { opacity: .42, scale: .98, duration: .35 })
      .from('.discipline-word--content', { x: keywordShift, opacity: 0, scale: .97, duration: .8 }, '-=.22')
      .to('.discipline-word--content', { opacity: .42, scale: .98, duration: .35 })
      .from('.discipline-word--technology', { y: mobile ? 38 : window.innerHeight * .12, opacity: 0, scale: .96, duration: .8 }, '-=.22')
      .from('.discipline-word--talent', { x: -keywordShift * .55, y: mobile ? 26 : 55, opacity: 0, duration: .75 }, '-=.32')
      .from('.disciplines-copy', { y: 30, opacity: 0, duration: .55 }, '-=.18')
      .to('.discipline-word--strategy', { x: -keywordShift * .7, opacity: 0, duration: .65 }, '+=.25')
      .to('.discipline-word--content', { x: keywordShift * .7, opacity: 0, duration: .65 }, '<')
      .to('.discipline-word--technology', { y: -55, opacity: .1, duration: .65 }, '<')
      .to('.discipline-word--talent', { y: 45, opacity: 0, duration: .65 }, '<')
      .from('.story-objective', { y: 42, opacity: 0, duration: .75 }, '-=.18')

    gsap.timeline({
      scrollTrigger: { trigger: '.people-story', start: 'top 82%', end: 'bottom 18%', scrub: .65 },
      defaults: { ease: 'power2.out' },
    })
      .from('.people-copy h2', { x: mobile ? -30 : -70, opacity: 0, duration: .75 })
      .from('.david-info > *', { y: 30, opacity: 0, stagger: .08, duration: .65 }, '-=.4')
      .from('.david-portrait img', { clipPath: 'inset(0 0 0 100%)', x: mobile ? 30 : 60, scale: .98, duration: 1 }, '-=.65')
      .to('.people-copy', { y: -30, duration: .7 }, '+=.2')
      .to('.david-portrait', { y: -15, duration: .7 }, '<')
      .to('.people-copy', { x: mobile ? -25 : -heroShift * .55, opacity: .3, duration: .75 }, '+=.15')
      .to('.david-portrait', { x: mobile ? 20 : heroShift * .5, opacity: .3, duration: .75 }, '<')

    if (window.matchMedia('(min-width: 801px)').matches) {
      const allianceWords = gsap.utils.toArray<HTMLElement>('.alliance-entry')
      const nitroAlliance = allianceWords[0]
      const modelAlliance = allianceWords[1]
      if (nitroAlliance && modelAlliance) {
        gsap.timeline({
          scrollTrigger: {
            trigger: '.alliances-stage',
            start: 'top top',
            end: 'bottom bottom',
          scrub: .65,
          },
        })
          .from('.alliances-title-line--one', { x: -heroShift, opacity: 0, duration: .65 })
          .from('.alliances-title-line--two', { x: heroShift, opacity: 0, duration: .65 }, '-=.4')
          .from('.alliance-entry--active .alliance-logo', { x: mobile ? 30 : heroShift, opacity: 0, scale: .96, duration: .65 })
          .from('.alliance-entry--active .body-lg', { y: 25, opacity: 0, duration: .5 }, '-=.22')
          .from('.alliance-entry--active .text-link', { y: 18, opacity: 0, duration: .45 }, '-=.2')
          .from('.nitro-person', { y: 35, opacity: 0, stagger: .12, duration: .62 }, '-=.18')
          .to(nitroAlliance, { x: mobile ? -30 : -heroShift * .75, autoAlpha: 0, scale: .96, duration: .72, ease: 'power2.inOut' }, '+=.5')
          .fromTo(
            modelAlliance,
            { x: mobile ? 30 : heroShift, y: 35, autoAlpha: 0, scale: .96 },
            { x: 0, y: 0, autoAlpha: 1, scale: 1, duration: .8, ease: 'power2.out' },
            '+=.12',
          )
          .from('.alliance-entry:not(.alliance-entry--active) .body-lg', { y: 25, opacity: 0, duration: .45 }, '-=.25')
      }
    } else {
      gsap.timeline({
        scrollTrigger: { trigger: '.alliances-stage', start: 'top 86%', end: 'bottom 22%', scrub: .6 },
        defaults: { ease: 'power2.out' },
      })
        .from('.alliances-title-line--one', { x: -30, opacity: 0, duration: .6 })
        .from('.alliances-title-line--two', { x: 30, opacity: 0, duration: .6 }, '-=.36')
        .from('.alliance-entry--active', { x: 30, opacity: 0, scale: .98, duration: .75 })
        .from('.alliance-entry:not(.alliance-entry--active)', { x: 30, y: 25, opacity: 0, scale: .98, duration: .75 }, '+=.3')
    }
  }, pageRoot.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
  document.removeEventListener('visibilitychange', handleVisibility)
  backgroundVideo.value?.pause()
})
</script>

<template>
  <main ref="pageRoot" class="nosotros-page">
    <div class="video-background" aria-hidden="true">
      <video
        ref="backgroundVideo"
        class="video-background__media"
        src="/Videos/nosotros.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      />
      <div class="video-overlay" />
    </div>
    <div class="connector-layer" aria-hidden="true">
      <svg class="connector-svg connector-svg--desktop" viewBox="0 0 1440 5000" preserveAspectRatio="none">
        <path class="connector-path" pathLength="1" d="M 1440 250 C 1190 300 1110 510 1210 690 C 1300 850 1120 1030 850 1090 C 620 1140 500 1320 590 1510 C 700 1730 1110 1660 1180 1920 C 1245 2160 850 2240 690 2430 C 500 2660 590 2980 910 3110 C 1130 3200 1190 3420 1020 3570 C 850 3720 630 3650 520 3870 C 400 4110 650 4300 900 4370 C 1110 4430 1220 4620 1080 4840" />
      </svg>
      <svg class="connector-svg connector-svg--mobile" viewBox="0 0 390 5000" preserveAspectRatio="none">
        <path class="connector-path" pathLength="1" d="M 345 160 C 300 420 330 700 280 920 C 235 1120 285 1350 315 1570 C 345 1810 245 2030 275 2260 C 305 2490 335 2720 270 2940 C 205 3160 245 3400 300 3600 C 345 3810 265 4060 285 4280 C 305 4510 335 4700 265 4890" />
      </svg>
    </div>
    <section class="about-hero" aria-labelledby="about-title">
      <div class="hero-ambient" aria-hidden="true">NEO</div>
      <div class="about-shell hero-layout">
        <h1 id="about-title" class="display-xl hero-title">
          <span class="hero-mask"><span class="hero-line--one">SOBRE</span></span>
          <span class="hero-mask"><span class="hero-line--two"><span class="hero-accent">NEO</span> REDES<span class="orange-dot">.</span></span></span>
        </h1>
        <p class="hero-kicker body-label">CONECTAMOS IDEAS.<br>GENERAMOS RESULTADOS.</p>
      </div>
    </section>

    <section class="editorial-story" aria-labelledby="growth-title">
      <div class="about-shell">
        <div class="growth-moment">
          <h2 id="growth-title" class="display-lg growth-statement">
            <span class="growth-line growth-line--one">AYUDAMOS A</span>
            <span class="growth-line growth-line--two">MARCAS Y EMPRESAS</span>
            <span class="growth-line growth-line--three">A CRECER.</span>
          </h2>
          <p class="body-lg growth-copy">
            Neo Redes integra marketing digital, tecnología, creatividad y automatización para desarrollar soluciones orientadas a resultados.
          </p>
        </div>

        <div class="disciplines-moment">
          <div class="discipline-composition" aria-label="Estrategia, contenido, tecnología y talento">
            <span class="display-lg discipline-word discipline-word--strategy">ESTRATEGIA</span>
            <span class="display-lg discipline-word discipline-word--content">CONTENIDO</span>
            <span class="display-lg discipline-word discipline-word--technology">TECNOLOGÍA</span>
            <span class="display-lg discipline-word discipline-word--talent">TALENTO</span>
          </div>
          <p class="body-lg disciplines-copy">
            Integramos estrategia, contenido, publicidad, desarrollo web, automatización y talento creativo para ofrecer soluciones completas.
          </p>
        </div>

        <p class="heading story-objective">
          Nuestro objetivo es acompañar a empresas y emprendedores en diferentes etapas de su crecimiento digital <span>desde una misma organización.</span>
        </p>
      </div>
    </section>

    <section class="people-story" aria-labelledby="people-title">
      <div class="david-background" aria-hidden="true">DAVID</div>
      <div class="about-shell people-layout">
        <div class="people-copy">
          <h2 id="people-title" class="display-lg">PERSONAS DETRÁS<br>DE LAS IDEAS.</h2>
          <div class="david-info">
            <h3 class="heading">DAVID CUASQUER</h3>
            <p class="body-lg">La persona detrás de Neo Redes.</p>
            <NuxtLink class="text-link" to="/soluciones#portafolio">VER NUESTRO TRABAJO <span aria-hidden="true">↗</span></NuxtLink>
          </div>
        </div>
        <figure class="david-portrait">
          <img src="/David.webp" alt="David Cuasquer" width="1024" height="1536">
        </figure>
      </div>
    </section>

    <section class="alliances-stage" aria-labelledby="alliances-title">
      <div class="about-shell alliances-sticky">
        <div class="alliances-heading">
          <h2 id="alliances-title" class="display-lg">
            <span class="alliances-title-line alliances-title-line--one">CRECEMOS</span>
            <span class="alliances-title-line alliances-title-line--two">CONECTANDO.</span>
          </h2>
        </div>
        <div class="alliances-flow">
          <article class="alliance-entry alliance-entry--active">
            <a class="alliance-logo-link" href="https://nitro2tech.com" target="_blank" rel="noopener noreferrer" aria-label="Visitar Nitro2Tech">
              <img class="alliance-logo alliance-logo--nitro" src="/Alianzas/LOGON2T.webp" alt="Nitro2Tech">
            </a>
            <p class="body-lg">Aliado tecnológico que aporta desarrollo web, automatización y soluciones digitales para proyectos orientados al crecimiento de marcas y empresas.</p>
            <a class="text-link" href="https://nitro2tech.com" target="_blank" rel="noopener noreferrer">CONOCE MÁS <span aria-hidden="true">↗</span></a>
            <div class="nitro-people" aria-label="Equipo de Nitro2Tech">
              <figure class="nitro-person">
                <img src="/Alianzas/NP.webp" alt="Nicolas Perez">
                <figcaption>Nicolas Perez</figcaption>
              </figure>
              <figure class="nitro-person">
                <img src="/Alianzas/SF.webp" alt="Felipe Cuasquer">
                <figcaption>Felipe Cuasquer</figcaption>
              </figure>
            </div>
          </article>
          <article class="alliance-entry">
            <img class="alliance-logo alliance-logo--iconic" src="/Alianzas/LOGOICONIC.webp" alt="ICONIC">
            <p class="body-lg">Talento e imagen para campañas, producción de contenido y proyectos de comunicación de marca.</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.nosotros-page {
  --paper: #0d1117;
  --ink: #f2f4f7;
  --muted: rgba(242, 244, 247, .72);
  --cyan: #00d4e0;
  --orange: #ff8a00;
  position: relative;
  overflow: clip;
  background: var(--paper);
  color: var(--ink);
}
.nosotros-page { isolation: isolate; }
.nosotros-page > section { position: relative; z-index: 2; }
.video-background { position: fixed; z-index: 0; inset: 0; overflow: hidden; pointer-events: none; }
.video-background__media, .video-overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
.video-background__media { object-fit: cover; object-position: 50% 50%; }
.video-overlay { background: #0d1117; opacity: .68; will-change: opacity; }
.connector-layer { position: absolute; z-index: 1; inset: 0; pointer-events: none; }
.connector-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.connector-svg--mobile { display: none; }
.connector-path { fill: none; stroke: var(--cyan); stroke-width: 2; vector-effect: non-scaling-stroke; opacity: .58; }
.about-shell { width: min(calc(100% - 8vw), 1600px); margin-inline: auto; }
.display-xl, .display-lg, .heading { margin: 0; font-family: Montserrat, sans-serif; font-weight: 700; }
.display-xl { font-size: clamp(5rem, 10vw, 11rem); line-height: .88; letter-spacing: -.065em; }
.display-lg { font-size: clamp(3.5rem, 6.8vw, 7.5rem); line-height: .9; letter-spacing: -.055em; }
.heading { font-size: clamp(2rem, 3.6vw, 4.25rem); line-height: .98; letter-spacing: -.045em; }
.body-lg { margin: 0; font: 500 clamp(1.08rem, 1.45vw, 1.42rem)/1.58 Poppins, sans-serif; }
.body-label { margin: 0; font: 600 clamp(.72rem, .85vw, .86rem)/1.5 Poppins, sans-serif; letter-spacing: .15em; }
.about-hero { min-height: clamp(36rem, 80svh, 49rem); padding: clamp(3rem, 5vw, 5rem) 0 clamp(3.5rem, 6vw, 6rem); }
.hero-layout { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 2fr) minmax(15rem, .78fr); align-items: end; gap: 1.5rem; }
.hero-title { width: min(100%, 11ch); }
.hero-mask { display: block; overflow: hidden; padding: .06em .08em .08em 0; }
.hero-mask > span { display: block; }
.hero-title .hero-line--two { color: var(--ink); }
.hero-accent { color: var(--cyan); }
.orange-dot { color: var(--orange); }
.hero-kicker { padding-bottom: .8rem; color: rgba(242, 244, 247, .78); }
.hero-ambient { position: absolute; top: 1%; right: -4vw; color: rgba(242,244,247,.035); font: 700 clamp(14rem, 34vw, 38rem)/1 Montserrat, sans-serif; letter-spacing: -.1em; pointer-events: none; }
.editorial-story { padding: clamp(5rem, 8vw, 8rem) 0 clamp(6rem, 9vw, 9rem); }
.growth-moment { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2rem; align-items: end; }
.growth-statement { grid-column: 1 / 10; }
.growth-line { display: block; }
.growth-line--three, .story-objective span, .alliances-title-line--two { color: var(--cyan); }
.growth-copy { grid-column: 7 / 12; margin-top: 2.5rem; }
.disciplines-moment { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2rem; margin-top: clamp(6rem, 10vw, 10rem); }
.discipline-composition { grid-column: 1 / 13; display: grid; grid-template-columns: repeat(12, 1fr); row-gap: clamp(1rem, 3vw, 3rem); }
.discipline-word { font-size: clamp(3rem, 7vw, 8rem); white-space: nowrap; }
.discipline-word--strategy { grid-column: 1 / 8; }
.discipline-word--content { grid-column: 7 / 13; justify-self: end; }
.discipline-word--technology { grid-column: 2 / 10; color: var(--cyan); }
.discipline-word--talent { grid-column: 8 / 13; justify-self: end; }
.disciplines-copy { grid-column: 9 / 13; margin-top: clamp(3rem, 6vw, 6rem); }
.story-objective { width: min(100%, 21ch); margin: clamp(7rem, 11vw, 11rem) 0 0 auto; font-size: clamp(2.7rem, 5vw, 5.8rem); }
.people-story { padding: clamp(6rem, 9vw, 9rem) 0 0; }
.people-layout { position: relative; z-index: 1; display: grid; grid-template-columns: 45fr 55fr; gap: clamp(2rem, 5vw, 6rem); align-items: end; }
.people-copy { align-self: center; padding-bottom: clamp(4rem, 8vw, 8rem); }
.eyebrow { margin-bottom: 1.5rem; color: var(--muted); }
.david-info { margin: clamp(3.5rem, 7vw, 7rem) 0 0 18%; }
.david-info .body-lg { margin: 1.25rem 0 2rem; color: var(--muted); }
.david-portrait { margin: 0; align-self: end; }
.david-portrait img { display: block; width: min(100%, 47rem); height: auto; margin-inline: auto; clip-path: inset(0); }
.david-background { position: absolute; left: -2vw; bottom: 2%; color: rgba(242,244,247,.025); font: 700 clamp(11rem, 27vw, 31rem)/.75 Montserrat, sans-serif; letter-spacing: -.08em; pointer-events: none; }
.text-link { display: inline-flex; align-items: center; gap: .7rem; padding-bottom: .4rem; border-bottom: 1px solid currentColor; color: var(--ink); font: 600 .76rem/1.4 Poppins, sans-serif; letter-spacing: .1em; text-decoration: none; transition: color .25s ease; }
.text-link span { color: var(--cyan); transition: transform .25s ease; }
.text-link:hover, .text-link:focus-visible { color: var(--cyan); outline: none; }
.text-link:hover span, .text-link:focus-visible span { transform: translate(3px,-3px); }
.alliances-stage { min-height: 320svh; padding-top: clamp(3rem, 5vw, 5rem); border-bottom: 1px solid rgba(242,244,247,.1); }
.alliances-sticky { position: sticky; top: 0; min-height: 100svh; display: grid; grid-template-columns: 42fr 58fr; gap: clamp(3rem, 7vw, 8rem); align-items: center; }
.alliances-title-line { display: block; }
.alliances-flow { position: relative; min-height: min(72svh, 47rem); }
.alliance-entry { position: absolute; inset: 50% 0 auto; min-height: 25rem; visibility: hidden; transform: translateY(calc(-50% + 8rem)) scale(.96); opacity: 0; transform-origin: left center; }
.alliance-entry--active { visibility: visible; opacity: 1; transform: translateY(-50%) scale(1); }
.alliance-logo-link { display: inline-block; transition: opacity .25s ease; }
.alliance-logo-link:hover, .alliance-logo-link:focus-visible { opacity: .72; outline: none; }
.alliance-logo { display: block; height: auto; object-fit: contain; object-position: left center; }
.alliance-logo--nitro { width: clamp(15rem, 26vw, 25rem); }
.alliance-logo--iconic { width: clamp(12rem, 19vw, 19rem); max-height: 16rem; }
.alliance-entry .body-lg { width: min(100%, 39rem); margin: 1.5rem 0 1.6rem; color: var(--muted); }
.nitro-people { display: grid; width: min(100%, 42rem); grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1.5rem, 4vw, 4rem); align-items: end; margin-top: 1.8rem; }
.nitro-person { margin: 0; text-align: center; }
.nitro-person img { display: block; width: 100%; height: clamp(13rem, 29svh, 22rem); object-fit: contain; object-position: center bottom; }
.nitro-person figcaption { margin-top: .65rem; color: var(--ink); font: 600 clamp(.72rem, .9vw, .88rem)/1.35 Poppins, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
@media (max-width: 800px) {
  .connector-svg--desktop { display: none; }
  .connector-svg--mobile { display: block; }
  .connector-path { stroke-width: 1.5; opacity: .62; }
  .about-shell { width: calc(100% - 2rem); }
  .video-background__media { object-position: 54% 50%; }
  .display-xl { font-size: clamp(3.3rem, 15vw, 6rem); line-height: .9; }
  .display-lg { font-size: clamp(3rem, 12.8vw, 5rem); }
  .heading { font-size: clamp(2rem, 9vw, 3rem); }
  .about-hero { min-height: 78svh; padding: clamp(2.75rem, 8vw, 3.5rem) 0 3rem; }
  .hero-layout { display: flex; min-height: calc(78svh - 6rem); flex-direction: column; justify-content: space-between; align-items: stretch; gap: 2rem; }
  .hero-title { width: 100%; }
  .hero-kicker { align-self: flex-end; margin-right: 2rem; }
  .hero-ambient { top: 10%; right: -18vw; }
  .growth-moment, .disciplines-moment { display: block; }
  .growth-copy { width: 88%; margin: 3rem 0 0 auto; }
  .disciplines-moment { margin-top: 7rem; }
  .discipline-composition { display: block; }
  .discipline-word { display: block; margin-bottom: .55rem; font-size: clamp(2.8rem, 12vw, 4.5rem); white-space: normal; }
  .discipline-word--content, .discipline-word--talent { text-align: right; }
  .disciplines-copy { width: 88%; margin: 3rem 0 0 auto; }
  .story-objective { margin-top: 7rem; font-size: clamp(2.45rem, 10vw, 3.8rem); }
  .people-story { padding-top: 6.5rem; }
  .people-layout { display: flex; flex-direction: column; gap: 2rem; }
  .people-copy { padding: 0; }
  .david-info { margin: 3rem 0 0; }
  .david-portrait { order: 2; width: 100%; }
  .david-portrait img { width: 100%; }
  .david-background { bottom: 5%; }
  .alliances-stage { min-height: auto; padding: 4rem 0 7rem; }
  .alliances-sticky { position: static; min-height: 0; display: block; }
  .alliances-heading { margin-bottom: 6rem; }
  .alliances-flow { min-height: 0; }
  .alliance-entry { position: static; min-height: 0; padding-right: 0; visibility: visible !important; transform: none !important; opacity: 1 !important; margin-bottom: 9rem; }
  .alliance-entry:last-child { margin-bottom: 0; }
  .alliance-logo--nitro { width: min(20rem, 78vw); }
  .alliance-logo--iconic { width: min(15rem, 58vw); }
  .nitro-people { gap: 1rem; }
  .nitro-person img { height: clamp(13rem, 58vw, 20rem); }
}
@media (max-width: 370px) {
  .hero-kicker { align-self: flex-start; margin-right: 0; }
  .discipline-word { font-size: 2.65rem; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation: none !important; transition: none !important; }
}
</style>
