// https://nuxt.com/docs/api/configuration/nuxt-config
const isProduction = !import.meta.dev

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: !isProduction },
  modules: ['@tresjs/nuxt'],
  sourcemap: {
    client: !isProduction,
    server: !isProduction,
  },
  vite: {
    build: {
      sourcemap: !isProduction,
    },
  },
  nitro: {
    sourceMap: !isProduction,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
      },
      meta: [
        { name: 'application-name', content: 'NEO REDES' },
        { property: 'og:site_name', content: 'NEO REDES' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/ICONO.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Poppins:wght@400;500&display=swap',
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'NEO REDES',
            alternateName: 'Neo Redes',
            url: 'https://neo-redes.com/',
          }),
        },
      ],
    },
  },
})
