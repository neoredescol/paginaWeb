import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, _from, savedPosition) {
    const position = savedPosition
      ?? (to.hash
        ? { el: to.hash, behavior: 'auto' as const }
        : { left: 0, top: 0, behavior: 'auto' as const })

    return new Promise((resolve) => {
      window.setTimeout(() => resolve(position), 250)
    })
  },
} satisfies RouterConfig
