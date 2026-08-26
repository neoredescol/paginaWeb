<script setup lang="ts">
const route = useRoute()
const isMenuOpen = ref(false)
const isLightSurface = ref(false)
const isScrolled = ref(false)
let previousBodyOverflow = ''
let contrastFrame = 0

const navigation = [
  { label: 'HOME', to: '/' },
  { label: 'NOSOTROS', to: '/nosotros' },
  { label: 'SOLUCIONES', to: '/soluciones' },
  { label: 'CONTACTO', to: '/contacto' },
]

const isActive = (path: string) => route.path === path
const closeMenu = () => { isMenuOpen.value = false }
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

const updateSurfaceContrast = () => {
  cancelAnimationFrame(contrastFrame)
  contrastFrame = requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 12
    const sampleY = Math.min(window.innerHeight - 1, 112)
    const underlyingElement = document
      .elementsFromPoint(window.innerWidth * 0.65, sampleY)
      .find(element => !element.closest('.site-header'))
    isLightSurface.value = Boolean(underlyingElement?.closest('.about-page'))
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

watch(isMenuOpen, (open) => {
  if (open) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousBodyOverflow
  }
})

watch(() => route.fullPath, () => {
  closeMenu()
  nextTick(updateSurfaceContrast)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', updateSurfaceContrast, { passive: true })
  window.addEventListener('resize', updateSurfaceContrast, { passive: true })
  updateSurfaceContrast()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(contrastFrame)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', updateSurfaceContrast)
  window.removeEventListener('resize', updateSurfaceContrast)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <header class="site-header" :class="{ 'site-header--on-light': isLightSurface, 'site-header--scrolled': isScrolled, 'site-header--menu-open': isMenuOpen }">
    <NuxtLink class="site-header__brand" to="/" aria-label="Neo Redes, página de inicio" @click="closeMenu">
      <img src="/LOGOH.webp" alt="Neo Redes">
    </NuxtLink>

    <nav class="site-header__desktop-nav" aria-label="Navegación principal">
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        class="site-header__link"
        :class="{ 'site-header__link--active': isActive(item.to) }"
        :to="item.to"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <button
      class="site-header__menu-button"
      type="button"
      :aria-expanded="isMenuOpen"
      aria-controls="mobile-navigation"
      :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
      @click="toggleMenu"
    >
      <span class="site-header__menu-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>

    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" id="mobile-navigation" class="mobile-navigation">
        <nav aria-label="Navegación móvil">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            class="mobile-navigation__link"
            :class="{ 'mobile-navigation__link--active': isActive(item.to) }"
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            @click="closeMenu"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  --header-fg: var(--color-light);
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  width: 100%;
  height: var(--header-height);
  grid-template-columns: minmax(12rem, 1fr) auto;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3.5rem);
  padding-inline: var(--page-padding);
  color: var(--header-fg);
  background: transparent;
  transition: color 220ms ease, background-color 260ms ease, backdrop-filter 260ms ease;
}

.site-header__brand,
.site-header__desktop-nav,
.site-header__menu-button,
.mobile-navigation__link {
  font-family: var(--font-display);
  font-weight: 600;
}

.site-header__brand {
  position: relative;
  z-index: 1;
  width: fit-content;
  text-decoration: none;
}

.site-header__brand img {
  display: block;
  width: auto;
  height: clamp(3.2rem, 4.5vw, 4.8rem);
  object-fit: contain;
}

.site-header__desktop-nav {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.3vw, 2.75rem);
}

.site-header__link {
  position: relative;
  padding-block: 0.5rem;
  color: color-mix(in srgb, var(--header-fg) 60%, transparent);
  font-size: 0.7rem;
  letter-spacing: 0.075em;
  text-decoration: none;
  transition: color 180ms ease;
}

.site-header__link::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-cyan);
  content: '';
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: opacity 180ms ease, transform 180ms ease;
}

.site-header__link:hover,
.site-header__link:focus-visible,
.site-header__link--active {
  color: var(--header-fg);
}

.site-header--on-light { --header-fg: var(--color-black); }

.site-header--scrolled {
  --header-fg: var(--color-light);
  background: rgba(13, 17, 23, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.site-header__link--active::after {
  opacity: 1;
  transform: scaleX(1);
}

.site-header__menu-button {
  position: relative;
  z-index: 1;
  display: none;
  justify-self: end;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  padding: 0;
  border: 0;
  color: var(--header-fg);
  background: transparent;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.site-header__menu-icon {
  position: relative;
  display: block;
  width: 1.75rem;
  height: 1.25rem;
}

.site-header__menu-icon span {
  position: absolute;
  left: 0;
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
  transition: top 220ms ease, opacity 160ms ease, transform 220ms ease;
}

.site-header__menu-icon span:nth-child(1) { top: 0; }
.site-header__menu-icon span:nth-child(2) { top: calc(50% - 1px); }
.site-header__menu-icon span:nth-child(3) { top: calc(100% - 2px); }

.site-header__menu-button[aria-expanded='true'] .site-header__menu-icon span:nth-child(1) {
  top: calc(50% - 1px);
  transform: rotate(45deg);
}

.site-header__menu-button[aria-expanded='true'] .site-header__menu-icon span:nth-child(2) {
  opacity: 0;
}

.site-header__menu-button[aria-expanded='true'] .site-header__menu-icon span:nth-child(3) {
  top: calc(50% - 1px);
  transform: rotate(-45deg);
}

.mobile-navigation {
  position: fixed;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  height: 100dvh;
  min-width: 320px;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  padding: calc(var(--header-height) + env(safe-area-inset-top)) clamp(1.5rem, 7vw, 1.75rem) max(2rem, env(safe-area-inset-bottom));
  background: var(--color-black);
}

.mobile-navigation nav {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3.2vh, 2rem);
}

.mobile-navigation__link {
  padding-block: 0;
  color: rgba(242, 244, 247, 0.52);
  font-size: clamp(2.7rem, 11vw, 4.4rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
  text-decoration: none;
}

.mobile-navigation__link--active {
  color: var(--color-cyan);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 240ms ease, transform 240ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active .mobile-navigation__link,
.mobile-menu-leave-active .mobile-navigation__link {
  transition: opacity 240ms ease, transform 280ms ease;
}

.mobile-menu-enter-from .mobile-navigation__link,
.mobile-menu-leave-to .mobile-navigation__link {
  opacity: 0;
  transform: translateX(-25px);
}

@media (max-width: 767px) {
  .site-header {
    height: calc(var(--header-height) + env(safe-area-inset-top));
    display: flex;
    justify-content: space-between;
    padding-top: env(safe-area-inset-top);
    padding-inline: clamp(1.5rem, 7vw, 1.75rem);
  }

  .site-header--menu-open {
    --header-fg: var(--color-light);
    background: var(--color-black);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .site-header__desktop-nav {
    display: none;
  }

  .site-header__menu-button {
    display: grid;
    width: 2.875rem;
    height: 2.875rem;
  }

  .site-header__brand img {
    height: clamp(2.625rem, 11vw, 3.15rem);
  }

  .site-header__menu-icon { width: 1.8rem; height: 1.15rem; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .site-header__brand img {
    height: clamp(2.75rem, 5vw, 3.5rem);
  }
}
</style>
