<script setup lang="ts">
import { gsap } from 'gsap'

type CursorState = 'default' | 'link' | 'work' | 'cta'

const point = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const cursorState = ref<CursorState>('default')
const isActive = ref(false)
const hasMoved = ref(false)

let pointX: ReturnType<typeof gsap.quickTo> | undefined
let pointY: ReturnType<typeof gsap.quickTo> | undefined
let ringX: ReturnType<typeof gsap.quickTo> | undefined
let ringY: ReturnType<typeof gsap.quickTo> | undefined

const cursorLabel = computed(() => {
  if (cursorState.value === 'work') return 'VER ↗'
  if (cursorState.value === 'cta') return '↗'
  return ''
})

const setCursorState = (target: EventTarget | null) => {
  if (!(target instanceof Element) || !ring.value) return

  const interactive = target.closest<HTMLElement>('[data-cursor], a, button')
  const nextState = (interactive?.dataset.cursor || (interactive ? 'link' : 'default')) as CursorState

  if (nextState === cursorState.value) return
  cursorState.value = nextState

  const scales: Record<CursorState, number> = { default: 0.45, link: 0.68, work: 1, cta: 0.78 }
  gsap.to(ring.value, { scale: scales[nextState], duration: 0.35, ease: 'power3.out' })
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isActive.value) return

  if (!hasMoved.value) {
    hasMoved.value = true
    gsap.to([point.value, ring.value], { opacity: 1, duration: 0.2 })
  }

  pointX?.(event.clientX)
  pointY?.(event.clientY)
  ringX?.(event.clientX)
  ringY?.(event.clientY)
  setCursorState(event.target)
}

const hideCursor = () => {
  gsap.to([point.value, ring.value], { opacity: 0, duration: 0.2 })
  hasMoved.value = false
}

onMounted(() => {
  // El cursor solo sustituye al nativo cuando existe mouse preciso y el usuario acepta movimiento.
  const supportsCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reducesMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!supportsCursor || reducesMotion || !point.value || !ring.value) return

  isActive.value = true
  document.body.classList.add('custom-cursor-active')
  gsap.set([point.value, ring.value], { opacity: 0 })
  gsap.set(ring.value, { scale: 0.45 })

  // quickTo reutiliza internamente la tween y solo actualiza su destino.
  // Es preferible a crear una animación completa en cada movimiento del mouse.
  pointX = gsap.quickTo(point.value, 'x', { duration: 0.06, ease: 'power3.out' })
  pointY = gsap.quickTo(point.value, 'y', { duration: 0.06, ease: 'power3.out' })
  ringX = gsap.quickTo(ring.value, 'x', { duration: 0.35, ease: 'power3.out' })
  ringY = gsap.quickTo(ring.value, 'y', { duration: 0.35, ease: 'power3.out' })

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', hideCursor)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  document.documentElement.removeEventListener('mouseleave', hideCursor)
  document.body.classList.remove('custom-cursor-active')
  gsap.killTweensOf([point.value, ring.value])
})
</script>

<template>
  <div class="custom-cursor" aria-hidden="true">
    <span ref="ring" class="custom-cursor__ring" :class="`custom-cursor__ring--${cursorState}`">
      <span>{{ cursorLabel }}</span>
    </span>
    <span ref="point" class="custom-cursor__point" />
  </div>
</template>

<style scoped>
.custom-cursor {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .custom-cursor {
    display: block;
  }

  .custom-cursor__ring,
  .custom-cursor__point {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
    will-change: transform;
  }

  .custom-cursor__ring {
    display: grid;
    width: 4.5rem;
    height: 4.5rem;
    place-items: center;
    border: 1px solid var(--color-brand-cyan);
    border-radius: 50%;
    color: var(--color-white);
    background: color-mix(in srgb, var(--color-black) 84%, transparent);
    font-size: 0.62rem;
    font-weight: 650;
    letter-spacing: 0.06em;
  }

  .custom-cursor__ring--default,
  .custom-cursor__ring--link {
    background: transparent;
  }

  .custom-cursor__point {
    width: 0.38rem;
    height: 0.38rem;
    border-radius: 50%;
    background: var(--color-brand-yellow);
  }
}

:global(body.custom-cursor-active),
:global(body.custom-cursor-active *) {
  cursor: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .custom-cursor {
    display: none;
  }
}
</style>
