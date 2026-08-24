<script setup lang="ts">
const TRACK_HEIGHT = 180
const THUMB_HEIGHT = 38
const THUMB_TRAVEL = TRACK_HEIGHT - THUMB_HEIGHT
const HIDE_DELAY = 800

const indicator = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)

let updateFrame: number | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const updateThumbPosition = () => {
  updateFrame = null
  if (!thumb.value) return

  const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const progress = scrollable > 0
    ? Math.min(1, Math.max(0, window.scrollY / scrollable))
    : 0

  thumb.value.style.transform = `translate3d(0, ${progress * THUMB_TRAVEL}px, 0)`
}

const scheduleThumbUpdate = () => {
  if (updateFrame !== null) return
  updateFrame = window.requestAnimationFrame(updateThumbPosition)
}

const showTemporarily = () => {
  indicator.value?.classList.add('scroll-indicator--visible')

  if (hideTimer !== null) globalThis.clearTimeout(hideTimer)
  hideTimer = globalThis.setTimeout(() => {
    hideTimer = null
    indicator.value?.classList.remove('scroll-indicator--visible')
  }, HIDE_DELAY)
}

const handleScroll = () => {
  showTemporarily()
  scheduleThumbUpdate()
}

onMounted(() => {
  scheduleThumbUpdate()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', scheduleThumbUpdate, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', scheduleThumbUpdate)
  if (updateFrame !== null) window.cancelAnimationFrame(updateFrame)
  if (hideTimer !== null) globalThis.clearTimeout(hideTimer)
})
</script>

<template>
  <div ref="indicator" class="scroll-indicator" aria-hidden="true">
    <div class="scroll-indicator__track">
      <div ref="thumb" class="scroll-indicator__thumb" />
    </div>
  </div>
</template>

<style scoped>
.scroll-indicator {
  position: fixed;
  z-index: 20;
  top: 50%;
  right: 18px;
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transform: translateY(-50%);
  transition: opacity 250ms ease;
}

.scroll-indicator--visible {
  opacity: 1;
}

.scroll-indicator__track {
  position: relative;
  width: 3px;
  height: 180px;
  border-radius: 999px;
  background: rgba(20, 24, 30, 0.12);
  pointer-events: none;
}

.scroll-indicator__thumb {
  position: absolute;
  top: 0;
  left: -1.5px;
  width: 6px;
  height: 38px;
  border-radius: 999px;
  background: var(--color-black);
  pointer-events: none;
  will-change: transform;
}

@media (pointer: coarse) {
  .scroll-indicator {
    display: none;
  }
}
</style>
