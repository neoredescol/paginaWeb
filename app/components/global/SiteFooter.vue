<script setup lang="ts">
const navigation = [
  { label: 'HOME', to: '/' },
  { label: 'NOSOTROS', to: '/nosotros' },
  { label: 'SOLUCIONES', to: '/soluciones' },
  { label: 'CONTACTO', to: '/contacto' },
]

const whatsappMessage = encodeURIComponent('Hola, quiero información sobre los servicios de NEO REDES.')
const whatsappUrl = `https://wa.me/573205520676?text=${whatsappMessage}`
</script>

<template>
  <footer class="site-footer">
    <svg class="site-footer__lines" viewBox="0 0 800 500" aria-hidden="true">
      <path d="M-80 405C90 250 180 480 338 330S590 95 880 210" />
      <path d="M-120 455C80 300 185 515 365 355S625 145 900 250" />
      <path d="M30 80C195 5 300 175 480 80S710 45 830 5" />
      <circle cx="338" cy="330" r="5" />
      <circle cx="480" cy="80" r="5" />
    </svg>

    <div class="site-footer__main">
      <nav class="site-footer__pages" aria-label="Navegación del pie de página">
        <p class="site-footer__label">PÁGINAS</p>
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>

      <div class="site-footer__identity">
        <NuxtLink to="/" aria-label="Neo Redes, página de inicio">
          <img src="/LOGOC.webp" alt="Neo Redes">
        </NuxtLink>
        <p>CONECTAMOS IDEAS<br>GENERAMOS RESULTADOS</p>
      </div>

      <div class="site-footer__connect">
        <div class="site-footer__connect-group">
          <p class="site-footer__label site-footer__label--talk">HABLEMOS</p>
          <div class="site-footer__icons" aria-label="Canales de contacto">
            <a class="site-footer__icon site-footer__icon--whatsapp" :href="whatsappUrl" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Neo Redes">
              <img src="/iconow.png" alt="" aria-hidden="true">
            </a>
            <a class="site-footer__icon" href="mailto:neoredescol@gmail.com" aria-label="Enviar correo a Neo Redes">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
            </a>
          </div>
        </div>

        <div class="site-footer__connect-group">
          <p class="site-footer__label">CONECTA</p>
          <div class="site-footer__icons" aria-label="Redes sociales">
          <a class="site-footer__icon" href="https://www.instagram.com/neo_redes/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Neo Redes">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="fill" cx="17.5" cy="6.5" r="1"/></svg>
          </a>
          <a class="site-footer__icon site-footer__icon--facebook" href="https://www.facebook.com/neoredess" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Neo Redes">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h3l.5-3H14V8.1c0-.9.3-1.6 1.7-1.6H18V3.8c-.4-.1-1.7-.2-2.8-.2-2.8 0-4.7 1.7-4.7 4.8V10H8v3h2.5v8"/></svg>
          </a>
          <a class="site-footer__icon site-footer__icon--tiktok" href="https://www.tiktok.com/@neo_redes" target="_blank" rel="noopener noreferrer" aria-label="TikTok de Neo Redes">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4c.5 2.5 1.9 4 4 4.4V12a8.1 8.1 0 0 1-4-1.3v5.8a5.5 5.5 0 1 1-4.8-5.4v3.7a2.1 2.1 0 1 0 1.2 1.9V4H15Z"/></svg>
          </a>
          </div>
        </div>
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>© 2026 NEO REDES</p>
      <p class="site-footer__credit">
        Desarrolladores:
        <a href="https://nitro2tech.com" target="_blank" rel="noopener noreferrer">Nitro2Tech</a>
      </p>
      <div class="site-footer__legal" aria-label="Información legal">
        <NuxtLink to="/politica-de-privacidad">Política de privacidad</NuxtLink>
        <NuxtLink to="/tratamiento-de-datos">Tratamiento de datos</NuxtLink>
        <NuxtLink to="/terminos-y-condiciones">Términos y condiciones</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: clip;
  padding: clamp(4rem, 7vw, 6.5rem) calc(var(--page-padding) + env(safe-area-inset-right)) 2rem calc(var(--page-padding) + env(safe-area-inset-left));
  border-top: 1px solid rgba(242, 244, 247, 0.12);
  border-radius: clamp(2rem, 5vw, 5rem) clamp(2rem, 5vw, 5rem) 0 0;
  color: var(--color-light);
  background: var(--color-black);
}

.site-footer__lines {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.site-footer__lines path,
.site-footer__lines circle {
  fill: none;
  stroke: rgba(0, 212, 224, 0.08);
  stroke-width: 1.5;
}

.site-footer__lines circle { fill: rgba(0, 212, 224, 0.1); }
.site-footer__main, .site-footer__bottom { position: relative; z-index: 1; }

.site-footer__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(15rem, 1.35fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 6rem);
  width: 100%;
  max-width: 1600px;
  margin-inline: auto;
}

.site-footer__pages { display: flex; align-items: flex-start; flex-direction: column; }

.site-footer__label {
  margin: 0 0 1.5rem;
  color: rgba(242, 244, 247, 0.42);
  font-family: var(--font-display);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.16em;
}

.site-footer__pages a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  padding-block: 0.14rem;
  color: var(--color-light);
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.3;
  text-decoration: none;
  transition: color 220ms ease, transform 220ms ease;
}

.site-footer__pages a:hover,
.site-footer__pages a:focus-visible { color: var(--color-cyan); transform: translateX(0.3rem); }

.site-footer__identity { display: flex; align-items: center; flex-direction: column; text-align: center; }
.site-footer__identity > a { display: block; }

.site-footer__identity img {
  display: block;
  width: clamp(14rem, 18vw, 20rem);
  height: auto;
}

.site-footer__identity p {
  margin: clamp(1.25rem, 2.5vw, 2rem) 0 0;
  color: var(--color-cyan);
  font-family: var(--font-display);
  font-size: clamp(0.8rem, 1.05vw, 1rem);
  font-weight: 600;
  letter-spacing: 0.13em;
  line-height: 1.65;
}

.site-footer__connect { display: flex; width: min(100%, 15rem); justify-self: end; flex-direction: column; gap: 2.25rem; }
.site-footer__connect-group { width: 100%; }
.site-footer__connect-group .site-footer__label { margin-bottom: 1rem; }
.site-footer__label--talk { color: var(--color-orange); }
.site-footer__icons { display: flex; flex-wrap: wrap; gap: 0.7rem; max-width: 15rem; }

.site-footer__icon {
  display: grid;
  width: 3rem;
  height: 3rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(242, 244, 247, 0.2);
  border-radius: 50%;
  color: var(--color-light);
  text-decoration: none;
  transition: color 240ms ease, background-color 240ms ease, border-color 240ms ease, transform 240ms ease;
}

.site-footer__icon:not(.site-footer__icon--pending):hover,
.site-footer__icon:not(.site-footer__icon--pending):focus-visible {
  border-color: var(--color-cyan);
  color: var(--color-light);
  background: var(--color-cyan);
  transform: translateY(-3px);
}

.site-footer__icon--pending { color: rgba(242, 244, 247, 0.5); }
.site-footer__icon svg { width: 1.65rem; height: 1.65rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.6; }
.site-footer__icon img { display: block; width: 1.7rem; height: 1.7rem; object-fit: contain; }
.site-footer__icon svg .fill { fill: currentColor; stroke: none; }
.site-footer__icon--facebook svg path,
.site-footer__icon--tiktok svg path { fill: currentColor; stroke: none; }

.site-footer__bottom {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 1600px;
  margin-inline: auto;
  margin-top: clamp(3rem, 4vw, 4.5rem);
  padding-top: 1.75rem;
  border-top: 1px solid rgba(242, 244, 247, 0.12);
  color: rgba(242, 244, 247, 0.4);
  font-size: 0.66rem;
  letter-spacing: 0.05em;
}

.site-footer__bottom p { margin: 0; }
.site-footer__bottom > p:nth-child(2) { justify-self: center; }
.site-footer__credit a {
  color: var(--color-light);
  text-decoration: none;
  transition: color 200ms ease;
}
.site-footer__credit a:hover,
.site-footer__credit a:focus-visible { color: var(--color-cyan); }
.site-footer__legal { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.6rem 1.4rem; }
.site-footer__legal a { color: inherit; text-decoration: none; transition: color 180ms ease; }
.site-footer__legal a:hover,.site-footer__legal a:focus-visible { color: var(--color-cyan); outline: none; }

@media (min-width: 768px) and (max-width: 1279px) {
  .site-footer__main { grid-template-columns: 1fr 1.15fr; }
  .site-footer__identity { grid-column: 1 / -1; grid-row: 1; margin-bottom: 1.5rem; }
  .site-footer__pages { grid-column: 1; }
  .site-footer__connect { grid-column: 2; justify-self: end; }
}

@media (max-width: 767px) {
  .site-footer { contain: layout paint; padding-top: 3rem; padding-bottom: calc(1.5rem + env(safe-area-inset-bottom)); border-radius: 2.25rem 2.25rem 0 0; }
  .site-footer__main { grid-template-columns: 1fr; align-items: start; gap: 2.5rem; }
  .site-footer__identity, .site-footer__pages, .site-footer__connect { grid-column: 1; justify-self: stretch; }
  .site-footer__identity { grid-row: 1; margin: 0; }
  .site-footer__connect { grid-row: 2; width: 100%; flex-direction: row; gap: 2rem; }
  .site-footer__pages { grid-row: 3; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .3rem 1.25rem; }
  .site-footer__pages .site-footer__label { grid-column: 1 / -1; margin-bottom: .6rem; }
  .site-footer__identity img { width: min(56vw, 13rem); }
  .site-footer__identity p { margin-top: 1rem; }
  .site-footer__pages a { font-size: clamp(1.2rem, 5.8vw, 1.65rem); }
  .site-footer__icons { max-width: none; }
  .site-footer__icon { width: 2.8rem; height: 2.8rem; }
  .site-footer__bottom { grid-template-columns: 1fr; align-items: start; gap: .8rem; margin-top: 3rem; padding-top: 1.25rem; }
  .site-footer__bottom > p:nth-child(2) { justify-self: start; }
  .site-footer__legal { justify-content: flex-start; gap: .45rem 1rem; margin-top: 0.5rem; }
  .site-footer__lines { overflow: clip; }
}

@media (max-width: 390px) {
  .site-footer { padding-inline: calc(1.25rem + env(safe-area-inset-left)) calc(1.25rem + env(safe-area-inset-right)); }
  .site-footer__connect { flex-direction: column; gap: 1.75rem; }
  .site-footer__lines { display: none; }
}
</style>
