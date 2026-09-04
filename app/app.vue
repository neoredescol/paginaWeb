<script setup lang="ts">
import SiteFooter from './components/global/SiteFooter.vue'
import SiteHeader from './components/global/SiteHeader.vue'

const nuxtApp = useNuxtApp()
const router = useRouter()
const routeTransitionActive = ref(false)
const initialLoadActive = ref(true)
const brandSequenceActive = ref(false)
const routeTransitionMask = ref<HTMLElement>()
const transitionMaskActive = computed(() => initialLoadActive.value || routeTransitionActive.value)

let transitionFrame = 0
let transitionRun = 0
let transitionStartedAt = 0
let historyNavigation = false
let brandSequenceFinished = false
let destinationReady = false
let expectedScrollTop: number | undefined
let expectedHash = ''
let cancelMaskWait: (() => void) | undefined

const finishTransitionIfReady = () => {
  if (!transitionMaskActive.value || !brandSequenceFinished || !destinationReady) return
  const run = transitionRun

  transitionFrame = requestAnimationFrame(() => {
    transitionFrame = requestAnimationFrame(() => {
      if (run === transitionRun) {
        historyNavigation = false
        brandSequenceActive.value = false
        initialLoadActive.value = false
        routeTransitionActive.value = false
      }
    })
  })
}

const handleBrandSequenceEnd = (event: AnimationEvent) => {
  if (event.animationName !== 'brand-line-travel') return
  brandSequenceFinished = true
  finishTransitionIfReady()
}

const waitUntilMaskIsOpaque = async () => {
  await nextTick()
  const mask = routeTransitionMask.value
  if (!mask || Number.parseFloat(getComputedStyle(mask).opacity) >= 0.99) return

  await new Promise<void>((resolve) => {
    let settled = false
    let fallback = 0
    const finish = () => {
      if (settled) return
      settled = true
      mask.removeEventListener('transitionend', handleTransitionEnd)
      window.clearTimeout(fallback)
      if (cancelMaskWait === finish) cancelMaskWait = undefined
      resolve()
    }
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === mask && event.propertyName === 'opacity') finish()
    }

    cancelMaskWait = finish
    mask.addEventListener('transitionend', handleTransitionEnd)
    fallback = window.setTimeout(finish, 180)
  })
}

const stopTransition = () => {
  transitionRun += 1
  cancelAnimationFrame(transitionFrame)
  cancelMaskWait?.()
  historyNavigation = false
  brandSequenceFinished = false
  destinationReady = false
  brandSequenceActive.value = false
  initialLoadActive.value = false
  routeTransitionActive.value = false
}

const handlePopState = () => {
  historyNavigation = true
}

const removeBeforeEach = router.beforeEach(async (to, from) => {
  if (to.path === from.path) return
  if (routeTransitionActive.value) return false

  transitionRun += 1
  cancelAnimationFrame(transitionFrame)
  transitionStartedAt = performance.now()
  brandSequenceFinished = false
  destinationReady = false
  expectedScrollTop = to.hash ? undefined : 0
  expectedHash = to.hash
  routeTransitionActive.value = true
  await nextTick()
  brandSequenceActive.value = true
  await waitUntilMaskIsOpaque()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    brandSequenceFinished = true
  }
  return true
})

const removeAfterEach = router.afterEach((_to, _from, failure) => {
  if (failure) stopTransition()
})

const removeRouterError = router.onError(stopTransition)

const removePageFinish = nuxtApp.hook('page:finish', () => {
  if (!routeTransitionActive.value) return
  const run = transitionRun

  const finishWhenReady = () => {
    if (run !== transitionRun || !routeTransitionActive.value) return

    let positionReady = historyNavigation
      ? performance.now() - transitionStartedAt >= 300
      : expectedScrollTop === undefined
    if (!historyNavigation && expectedScrollTop !== undefined) {
      positionReady = Math.abs(window.scrollY - expectedScrollTop) < 2
    } else if (!historyNavigation && expectedHash) {
      const target = document.querySelector<HTMLElement>(expectedHash)
      if (target) {
        const targetTop = window.scrollY + target.getBoundingClientRect().top
        positionReady = Math.abs(window.scrollY - targetTop) < 2
      }
    }

    if (!positionReady) {
      transitionFrame = requestAnimationFrame(finishWhenReady)
      return
    }

    destinationReady = true
    finishTransitionIfReady()
  }

  void nextTick().then(() => {
    transitionFrame = requestAnimationFrame(() => {
      transitionFrame = requestAnimationFrame(finishWhenReady)
    })
  })
})

onMounted(async () => {
  window.addEventListener('popstate', handlePopState)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    brandSequenceFinished = true
    destinationReady = true
    finishTransitionIfReady()
    return
  }

  await document.fonts.ready
  await nextTick()
  destinationReady = true
  brandSequenceActive.value = true
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handlePopState)
  removeBeforeEach()
  removeAfterEach()
  removeRouterError()
  removePageFinish()
  cancelMaskWait?.()
  cancelAnimationFrame(transitionFrame)
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <div class="app-shell">
    <SiteHeader />
    <NuxtPage />
    <div
      ref="routeTransitionMask"
      class="route-transition-mask"
      :class="{
        'is-active': transitionMaskActive,
        'is-sequencing': brandSequenceActive,
      }"
      aria-hidden="true"
    >
      <div class="brand-loader">
        <div class="brand-loader__identity">
          <strong><span>NEO</span> REDES</strong>
          <small>CONECTAMOS IDEAS · GENERAMOS RESULTADOS</small>
        </div>
        <div
          class="brand-loader__line"
          @animationend="handleBrandSequenceEnd"
        >
          <i class="brand-loader__node brand-loader__node--one" />
          <i class="brand-loader__node brand-loader__node--two" />
          <i class="brand-loader__node brand-loader__node--three" />
          <i class="brand-loader__spark" />
        </div>
      </div>
    </div>
    <SiteFooter />
  </div>
</template>

<style>
:root {
  --color-black: #0d1117;
  --color-cyan: #00d4e0;
  --color-orange: #ff8a00;
  --color-light: #f2f4f7;
  --font-display: 'Montserrat', sans-serif;
  --font-body: 'Poppins', sans-serif;
  --page-padding: clamp(1.25rem, 4vw, 5rem);
  --section-gap: clamp(5rem, 10vw, 10rem);
  --header-height: clamp(5.5rem, 7vw, 6.75rem);

  color: var(--color-light);
  background: var(--color-black);
  font-family: var(--font-body);
  font-synthesis: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#__nuxt {
  min-height: 100%;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--color-black);
}

img,
video {
  -webkit-user-drag: none;
  user-select: none;
}

body {
  min-width: 320px;
  color: var(--color-light);
  overflow-x: hidden;
}

.app-shell {
  display: flex;
  min-height: 100svh;
  flex-direction: column;
}

.app-shell > main {
  width: 100%;
  flex: 1;
  padding-top: var(--header-height);
}

button,
a {
  font: inherit;
}

a {
  color: inherit;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
}

.placeholder-page {
  display: grid;
  min-height: 100svh;
  place-items: center;
  padding: 2rem var(--page-padding);
}

.placeholder-page h1 {
  margin: 0;
  font-size: clamp(2.5rem, 8vw, 6rem);
  letter-spacing: -0.04em;
}

.route-transition-mask {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--color-black);
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 340ms cubic-bezier(.22, 1, .36, 1);
}

.route-transition-mask.is-active {
  opacity: 1;
  pointer-events: auto;
  transition-duration: 160ms;
  transition-timing-function: ease;
}

.brand-loader {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 12rem;
  place-items: center;
}

.brand-loader__identity {
  display: grid;
  position: relative;
  z-index: 2;
  gap: clamp(.55rem, 1vw, .85rem);
  justify-items: center;
  color: var(--color-light);
  opacity: 0;
  clip-path: inset(0 100% 0 0);
}

.is-sequencing .brand-loader__identity {
  animation: brand-identity-reveal 440ms cubic-bezier(.22, 1, .36, 1) 330ms both;
}

.brand-loader__identity strong {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4.75rem);
  font-weight: 800;
  line-height: .92;
  letter-spacing: -.055em;
}

.brand-loader__identity strong span {
  color: var(--color-cyan);
}

.brand-loader__identity small {
  max-width: calc(100vw - 2.5rem);
  font-size: clamp(.55rem, 1vw, .78rem);
  font-weight: 600;
  letter-spacing: clamp(.13em, .35vw, .28em);
  line-height: 1.5;
  color: var(--color-orange);
  opacity: .82;
  text-align: center;
}

.brand-loader__line {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 0;
  width: clamp(12rem, 30vw, 32rem);
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-cyan) 18%, var(--color-cyan) 82%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-cyan) 70%, transparent), 0 0 24px color-mix(in srgb, var(--color-cyan) 28%, transparent);
  opacity: 0;
  transform: translate3d(-120%, -50%, 0);
}

.is-sequencing .brand-loader__line {
  animation: brand-line-travel 680ms cubic-bezier(.45, 0, .25, 1) 160ms both;
}

.brand-loader__node,
.brand-loader__spark {
  position: absolute;
  top: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.brand-loader__node {
  width: clamp(.3rem, .55vw, .5rem);
  aspect-ratio: 1;
  border: 1px solid var(--color-cyan);
  background: var(--color-black);
  box-shadow: 0 0 10px color-mix(in srgb, var(--color-cyan) 65%, transparent);
}

.brand-loader__node--one { left: 24%; }
.brand-loader__node--two { left: 52%; }
.brand-loader__node--three { left: 78%; }

.brand-loader__spark {
  right: 7%;
  width: .3rem;
  aspect-ratio: 1;
  background: var(--color-orange);
  box-shadow: 0 0 12px var(--color-orange);
}

@keyframes brand-line-travel {
  0% { opacity: 0; transform: translate3d(-120%, -50%, 0); }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { opacity: 0; transform: translate3d(calc(100vw + 20%), -50%, 0); }
}

@keyframes brand-identity-reveal {
  0% { opacity: 0; clip-path: inset(0 100% 0 0); }
  100% { opacity: 1; clip-path: inset(0 0 0 0); }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .brand-loader__identity {
    opacity: 1;
    clip-path: none;
  }

  .brand-loader__line {
    display: none;
  }
}
</style>
