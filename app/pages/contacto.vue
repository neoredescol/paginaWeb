<script setup lang="ts">
import { gsap } from 'gsap'

useHead({
  title: 'NEO REDES',
  meta: [{ name: 'description', content: 'Hablemos de tu próximo proyecto. Contacta con NEO REDES por WhatsApp, correo o redes sociales.' }],
})

const pageRoot = ref<HTMLElement | null>(null)
const backgroundWord = ref<HTMLElement | null>(null)
let animationContext: gsap.Context | undefined

const socialLinks = [
  { name: 'Instagram', label: 'Instagram de NEO REDES', href: 'https://www.instagram.com/neo_redes/' },
  { name: 'Facebook', label: 'Facebook de NEO REDES', href: 'https://www.facebook.com/neoredess' },
  { name: 'TikTok', label: 'TikTok de NEO REDES', href: 'https://www.tiktok.com/@neo_redes' },
] as const

const handlePointerMove = (event: PointerEvent) => {
  if (!backgroundWord.value || window.innerWidth <= 767) return
  const x = ((event.clientX / window.innerWidth) - .5) * 18
  const y = ((event.clientY / window.innerHeight) - .5) * 12
  gsap.to(backgroundWord.value, { x, y, duration: 1.2, ease: 'power2.out', overwrite: 'auto' })
}

onMounted(() => {
  if (!pageRoot.value) return
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animationContext = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.contact-eyebrow', { y: -20, opacity: 0, duration: .65 })
        .from('.contact-title__line', { x: '-7vw', opacity: 0, duration: .9, stagger: .09 }, '-=.3')
        .from('.contact-intro', { y: 18, opacity: 0, duration: .6 }, '-=.45')
        .from('.contact-method', { x: 42, opacity: 0, duration: .7, stagger: .12 }, '-=.65')
        .from('.contact-socials__label', { y: 12, opacity: 0, duration: .45 }, '-=.35')
        .from('.contact-social', { y: 15, opacity: 0, duration: .45, stagger: .07 }, '-=.3')
    }, pageRoot.value)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
  }
})

onBeforeUnmount(() => {
  animationContext?.revert()
  window.removeEventListener('pointermove', handlePointerMove)
})
</script>

<template>
  <main ref="pageRoot" class="contact-page">
    <div class="contact-video" aria-hidden="true">
      <video class="contact-video__media" src="/Videos/Contacto.mp4" autoplay muted loop playsinline preload="metadata" />
      <div class="contact-video__overlay" />
    </div>
    <div class="contact-ambient" aria-hidden="true">
      <span ref="backgroundWord" class="contact-ambient__word">CONTACTO</span>
      <span class="contact-ambient__line contact-ambient__line--one" />
      <span class="contact-ambient__line contact-ambient__line--two" />
    </div>

    <div class="contact-shell">
      <section class="contact-message" aria-labelledby="contact-title">
        <p class="contact-eyebrow">CONTACTO<span>.</span></p>
        <h1 id="contact-title" class="contact-title">
          <span class="contact-title__line">¿HABLAMOS</span>
          <span class="contact-title__line">DE TU PRÓXIMO</span>
          <span class="contact-title__line contact-title__line--accent">PROYECTO<span>?</span></span>
        </h1>
        <p class="contact-intro">Cuéntanos qué tienes en mente. Estamos listos para escucharte.</p>
      </section>

      <section class="contact-channels" aria-label="Canales de contacto">
        <div class="contact-method">
          <p class="contact-method__label">WHATSAPP</p>
          <a href="https://wa.me/573205520676" target="_blank" rel="noopener noreferrer" aria-label="Hablar con NEO REDES por WhatsApp">
            <span class="contact-method__identity">
              <span class="contact-method__icon contact-method__icon--whatsapp"><img src="/iconow.png" alt="" aria-hidden="true"></span>
              <span><strong>ESCRÍBENOS</strong><small>Respuesta directa por WhatsApp</small></span>
            </span>
            <span class="contact-method__arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="contact-method">
          <p class="contact-method__label">CORREO</p>
          <a href="mailto:neoredescol@gmail.com" aria-label="Enviar correo a NEO REDES">
            <span class="contact-method__identity">
              <span class="contact-method__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
              </span>
              <span><strong>ENVÍANOS UN CORREO</strong><small>Cuéntanos sobre tu proyecto</small></span>
            </span>
            <span class="contact-method__arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="contact-socials">
          <p class="contact-socials__label">SÍGUENOS</p>
          <div class="contact-socials__links">
            <a v-for="social in socialLinks" :key="social.name" class="contact-social" :class="`contact-social--${social.name.toLowerCase()}`" :href="social.href" target="_blank" rel="noopener noreferrer" :aria-label="social.label">
              <svg v-if="social.name === 'Instagram'" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="fill" cx="17.5" cy="6.5" r="1"/></svg>
              <svg v-else-if="social.name === 'Facebook'" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-3H14V8.1c0-.9.3-1.6 1.7-1.6H18V3.8c-.4-.1-1.7-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.8V10H8v3h2.5v8"/></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4c.5 2.5 1.9 4 4 4.4V12a8.1 8.1 0 0 1-4-1.3v5.8a5.5 5.5 0 1 1-4.8-5.4v3.7a2.1 2.1 0 1 0 1.2 1.9V4H15Z"/></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.contact-page { position: relative; isolation: isolate; display: grid; min-height: calc(100svh - var(--header-height)); align-items: center; overflow: hidden; color: var(--color-light); background: var(--color-black); }
.contact-video { position: absolute; z-index: -3; overflow: hidden; pointer-events: none; inset: 0; }
.contact-video__media,.contact-video__overlay { position: absolute; width: 100%; height: 100%; inset: 0; }
.contact-video__media { opacity: .96; object-fit: cover; object-position: center; }
.contact-video__overlay { background: linear-gradient(90deg,rgba(13,17,23,.67) 0%,rgba(13,17,23,.47) 48%,rgba(13,17,23,.58) 100%), linear-gradient(180deg,rgba(13,17,23,.2),rgba(13,17,23,.52)); }
.contact-ambient { position: absolute; z-index: -1; overflow: hidden; pointer-events: none; inset: 0; }
.contact-ambient__word { position: absolute; top: 48%; left: 50%; color: transparent; font-family: var(--font-display); font-size: clamp(10rem,22vw,26rem); font-weight: 700; letter-spacing: -.08em; line-height: .8; opacity: .035; -webkit-text-stroke: 1px var(--color-light); transform: translate(-50%,-50%); white-space: nowrap; }
.contact-ambient__line { position: absolute; height: 1px; background: linear-gradient(90deg,transparent,rgba(0,212,224,.18),transparent); transform: rotate(-10deg); }
.contact-ambient__line--one { top: 28%; left: 48%; width: 55%; }
.contact-ambient__line--two { right: 45%; bottom: 22%; width: 42%; transform: rotate(14deg); }
.contact-shell { display: grid; width: min(calc(100% - (2 * var(--page-padding))),1600px); grid-template-columns: minmax(0,1.35fr) minmax(20rem,.65fr); align-items: center; gap: clamp(4rem,9vw,10rem); margin-inline: auto; padding-block: clamp(3rem,7vh,6rem); }
.contact-eyebrow { margin: 0 0 clamp(1.5rem,3vh,2.5rem); color: rgba(242,244,247,.52); font: 600 .68rem/1.3 var(--font-body); letter-spacing: .22em; }
.contact-eyebrow span { color: var(--color-orange); }
.contact-title { margin: 0; font: 700 clamp(4rem,7vw,8rem)/.91 var(--font-display); letter-spacing: -.065em; }
.contact-title__line { display: block; }
.contact-title__line--accent { color: var(--color-cyan); }
.contact-title__line--accent > span { color: var(--color-orange); }
.contact-intro { width: min(31rem,85%); margin: clamp(1.75rem,3.5vh,3rem) 0 0; color: rgba(242,244,247,.62); font: 400 clamp(.85rem,1vw,1rem)/1.7 var(--font-body); }
.contact-channels { display: flex; flex-direction: column; }
.contact-method + .contact-method { margin-top: clamp(2.3rem,5vh,4rem); }
.contact-method__label,.contact-socials__label { margin: 0 0 .8rem; color: rgba(242,244,247,.42); font: 600 .61rem/1.3 var(--font-body); letter-spacing: .18em; }
.contact-method a { position: relative; display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1.5rem; overflow-wrap: anywhere; padding-bottom: .85rem; color: var(--color-light); font: 600 clamp(1.15rem,1.65vw,1.75rem)/1.25 var(--font-display); letter-spacing: -.025em; text-decoration: none; transition: color 240ms ease,transform 240ms ease; }
.contact-method__identity { display: flex; min-width: 0; align-items: center; gap: 1rem; }
.contact-method__identity > span:last-child { display: flex; min-width: 0; flex-direction: column; gap: .28rem; }
.contact-method__identity strong { font: 600 clamp(.95rem,1.25vw,1.25rem)/1.2 var(--font-display); letter-spacing: .02em; }
.contact-method__identity small { color: rgba(242,244,247,.5); font: 400 clamp(.63rem,.75vw,.75rem)/1.4 var(--font-body); letter-spacing: .01em; transition: color 240ms ease; }
.contact-method__icon { display: grid; width: 3.15rem; height: 3.15rem; flex: 0 0 auto; place-items: center; border: 1px solid rgba(242,244,247,.2); border-radius: 50%; transition: border-color 240ms ease,background 240ms ease; }
.contact-method__icon svg { width: 1.55rem; height: 1.55rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; }
.contact-method__icon img { display: block; width: 1.7rem; height: 1.7rem; object-fit: contain; }
.contact-method a::after { position: absolute; right: 0; bottom: 0; left: 0; height: 1px; background: rgba(242,244,247,.2); content: ''; }
.contact-method a::before { position: absolute; z-index: 1; bottom: 0; left: 0; width: 100%; height: 1px; background: var(--color-cyan); content: ''; transform: scaleX(0); transform-origin: left; transition: transform 320ms cubic-bezier(.22,1,.36,1); }
.contact-method__arrow { flex: 0 0 auto; color: var(--color-cyan); font-size: 1.2em; transition: transform 240ms ease; }
.contact-method a:hover,.contact-method a:focus-visible { color: var(--color-cyan); outline: none; transform: translateX(4px); }
.contact-method a:hover .contact-method__icon,.contact-method a:focus-visible .contact-method__icon { border-color: rgba(0,212,224,.7); background: rgba(0,212,224,.08); }
.contact-method a:hover .contact-method__identity small,.contact-method a:focus-visible .contact-method__identity small { color: rgba(242,244,247,.72); }
.contact-method a:hover::before,.contact-method a:focus-visible::before { transform: scaleX(1); }
.contact-method a:hover .contact-method__arrow,.contact-method a:focus-visible .contact-method__arrow { transform: translate(3px,-3px); }
.contact-socials { margin-top: clamp(3.5rem,8vh,6rem); }
.contact-socials__links { display: flex; gap: .75rem; }
.contact-social { display: grid; width: 3rem; height: 3rem; place-items: center; border-bottom: 1px solid rgba(242,244,247,.22); color: rgba(242,244,247,.78); text-decoration: none; transition: color 220ms ease,border-color 220ms ease,transform 220ms ease; }
.contact-social:hover,.contact-social:focus-visible { border-color: var(--color-cyan); color: var(--color-cyan); outline: none; transform: translateY(-3px); }
.contact-social svg { width: 1.65rem; height: 1.65rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.55; }
.contact-social svg .fill { fill: currentColor; stroke: none; }
.contact-social--facebook svg path,.contact-social--tiktok svg path { fill: currentColor; stroke: none; }
@media (max-width: 1024px) { .contact-shell { grid-template-columns: minmax(0,1.05fr) minmax(19rem,.75fr); gap: 4rem; } .contact-title { font-size: clamp(3.6rem,7vw,5rem); } }
@media (max-width: 767px) { .contact-page { min-height: auto; overflow: hidden; } .contact-video__media { opacity: .9; object-position: 58% center; } .contact-video__overlay { background: linear-gradient(180deg,rgba(13,17,23,.55),rgba(13,17,23,.7)); } .contact-shell { display: block; width: calc(100% - (2 * var(--page-padding))); padding: 2.5rem 0 4.5rem; } .contact-title { font-size: clamp(2.7rem,12.2vw,4.1rem); line-height: .93; } .contact-intro { width: 100%; margin-top: 1.5rem; font-size: .82rem; } .contact-channels { margin-top: 4rem; } .contact-method + .contact-method { margin-top: 2.5rem; } .contact-method a { font-size: clamp(1.05rem,5vw,1.35rem); } .contact-method__icon { width: 2.85rem; height: 2.85rem; } .contact-method__identity { gap: .8rem; } .contact-socials { margin-top: 3.5rem; } .contact-ambient__word { top: 22%; font-size: 30vw; } .contact-ambient__line--one { top: 17%; left: 20%; width: 90%; } .contact-ambient__line--two { right: 25%; bottom: 12%; width: 90%; } }
@media (min-width: 768px) and (max-width: 900px) and (min-height: 700px) { .contact-page { min-height: auto; } .contact-shell { display: block; width: calc(100% - clamp(4rem,8vw,6rem)); padding-block: 4rem 6rem; } .contact-title { font-size: clamp(4.4rem,9vw,6rem); } .contact-intro { max-width: 32rem; } .contact-channels { width: min(100%,34rem); margin: 5rem 0 0 auto; } }
@media (min-width: 768px) and (max-width: 1279px) and (max-height: 600px) { .contact-shell { grid-template-columns: minmax(0,1.15fr) minmax(17rem,.85fr); gap: clamp(2rem,5vw,4rem); padding-block: 1.5rem; } .contact-title { font-size: clamp(2.7rem,5.2vw,4rem); } .contact-eyebrow { margin-bottom: 1rem; } .contact-intro { margin-top: 1rem; font-size: .75rem; } .contact-method + .contact-method { margin-top: 1.25rem; } .contact-method__icon { width: 2.6rem; height: 2.6rem; } .contact-socials { margin-top: 1.5rem; } }
@media (max-width: 390px) { .contact-shell { width: calc(100% - 2.5rem); } .contact-title { font-size: clamp(2.2rem,11.5vw,2.75rem); } .contact-method a { gap: .75rem; font-size: .98rem; } .contact-method__identity small { font-size: .6rem; } }
@media (prefers-reduced-motion: reduce) { .contact-video__media { display: none; } .contact-ambient__word { transform: translate(-50%,-50%) !important; } }
</style>
