<script setup lang="ts">
const route = useRoute()
const isMenuOpen = ref(false)
let previousBodyOverflow = ''

const navigation = [
  { label: 'HOME', to: '/' },
  { label: 'NOSOTROS', to: '/nosotros' },
  { label: 'SOLUCIONES', to: '/soluciones' },
  { label: 'CONTACTO', to: '/contacto' },
]

const isActive = (path: string) => route.path === path
const closeMenu = () => { isMenuOpen.value = false }
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

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

watch(() => route.fullPath, closeMenu)

onMounted(() => window.addEventListener('keydown', handleKeydown))

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-header__brand" to="/" aria-label="Neo Redes, página de inicio" @click="closeMenu">
      <img src="/Logo.webp" alt="Neo Redes">
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

    <NuxtLink class="site-header__cta" to="/contacto">
      HABLEMOS <span aria-hidden="true">↗</span>
    </NuxtLink>

    <button
      class="site-header__menu-button"
      type="button"
      :aria-expanded="isMenuOpen"
      aria-controls="mobile-navigation"
      @click="toggleMenu"
    >
      {{ isMenuOpen ? 'CERRAR' : 'MENÚ' }}
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

        <NuxtLink class="mobile-navigation__cta" to="/contacto" @click="closeMenu">
          HABLEMOS <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  width: 100%;
  height: var(--header-height);
  grid-template-columns: minmax(9rem, 1fr) auto minmax(9rem, 1fr);
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3.5rem);
  padding-inline: var(--page-padding);
  border-bottom: 1px solid rgba(242, 244, 247, 0.08);
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(0.75rem);
  -webkit-backdrop-filter: blur(0.75rem);
}

.site-header__brand,
.site-header__desktop-nav,
.site-header__cta,
.site-header__menu-button,
.mobile-navigation__link,
.mobile-navigation__cta {
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
  height: clamp(2.125rem, 3vw, 2.75rem);
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
  color: rgba(242, 244, 247, 0.58);
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
  color: var(--color-light);
}

.site-header__link--active::after {
  opacity: 1;
  transform: scaleX(1);
}

.site-header__cta {
  position: relative;
  z-index: 1;
  justify-self: end;
  padding: 0.72rem 0.95rem;
  border: 1px solid rgba(0, 212, 224, 0.72);
  border-radius: 0.3rem;
  color: var(--color-cyan);
  font-size: 0.7rem;
  letter-spacing: 0.07em;
  text-decoration: none;
  transition: color 180ms ease, background-color 180ms ease;
}

.site-header__cta:hover,
.site-header__cta:focus-visible {
  color: var(--color-black);
  background: var(--color-cyan);
}

.site-header__menu-button {
  position: relative;
  z-index: 1;
  display: none;
  justify-self: end;
  padding: 0;
  border: 0;
  color: var(--color-light);
  background: transparent;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.mobile-navigation {
  position: fixed;
  z-index: 0;
  inset: 0;
  display: flex;
  min-width: 320px;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  padding: calc(var(--header-height) + 2rem) var(--page-padding) 2.5rem;
  background: var(--color-black);
}

.mobile-navigation nav {
  display: flex;
  flex-direction: column;
}

.mobile-navigation__link {
  padding-block: 0.45rem;
  color: rgba(242, 244, 247, 0.52);
  font-size: clamp(2.25rem, 11vw, 4rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
  text-decoration: none;
}

.mobile-navigation__link--active {
  color: var(--color-cyan);
}

.mobile-navigation__cta {
  width: fit-content;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-orange);
  color: var(--color-light);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-decoration: none;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 240ms ease, transform 240ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}

@media (max-width: 767px) {
  .site-header {
    display: flex;
    justify-content: space-between;
  }

  .site-header__desktop-nav,
  .site-header__cta {
    display: none;
  }

  .site-header__menu-button {
    display: block;
  }

  .site-header__brand img {
    height: 2rem;
  }
}
</style>
