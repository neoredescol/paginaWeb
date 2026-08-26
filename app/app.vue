<script setup lang="ts">
import SiteFooter from './components/global/SiteFooter.vue'
import SiteHeader from './components/global/SiteHeader.vue'

const resetScrollPosition = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

onMounted(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  resetScrollPosition()
  window.addEventListener('pageshow', resetScrollPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('pageshow', resetScrollPosition)
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <div class="app-shell">
    <SiteHeader />
    <NuxtPage />
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

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
