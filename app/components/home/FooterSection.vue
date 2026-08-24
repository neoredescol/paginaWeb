<template>
  <footer class="footer">
    <div class="footer__topline">
      <span>MARKETING DIGITAL</span>
      <span aria-hidden="true">06 — 06</span>
    </div>

    <p class="footer__brand">NEO REDES<em>.</em></p>

    <div class="footer__links">
      <nav class="footer__nav" aria-label="Navegación del pie de página">
        <a href="#inicio">Inicio</a>
        <a href="#servicios">Servicios</a>
        <a href="#proceso">Proceso</a>
        <a href="#trabajo">Trabajo</a>
        <a href="#planes">Planes</a>
      </nav>

      <!-- Se mantienen como texto hasta disponer de URLs reales y evitar enlaces falsos. -->
      <div class="footer__social" aria-label="Redes sociales, enlaces próximamente">
        <span>Instagram</span>
        <span>WhatsApp</span>
      </div>
    </div>

    <p class="footer__legal">© 2026 NEO REDES</p>
  </footer>
</template>

<style scoped>
.footer {
  display: grid;
  gap: clamp(4rem, 9vw, 8rem);
  padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 3vw, 3.5rem) 2rem;
  color: var(--color-white);
  background: var(--color-black);
}

.footer__topline {
  display: flex;
  justify-content: space-between;
  color: var(--color-brand-cyan);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
}

.footer__brand {
  margin: 0;
  font-size: clamp(3.5rem, 15vw, 14rem);
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 0.82;
  text-wrap: nowrap;
}

.footer__brand em {
  color: var(--color-brand-yellow);
  font-style: normal;
}

.footer__links {
  display: grid;
  gap: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid color-mix(in srgb, var(--color-white) 18%, transparent);
}

.footer__nav,
.footer__social {
  display: grid;
  gap: 0.75rem;
  align-content: start;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
}

.footer__nav a {
  width: fit-content;
  text-decoration: none;
}

.footer__nav a:hover,
.footer__nav a:focus-visible {
  color: var(--color-brand-cyan);
}

.footer__social {
  color: var(--color-ivory);
}

.footer__legal {
  margin: 0;
  color: var(--color-ivory);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
}

@media (min-width: 700px) {
  .footer__links {
    grid-template-columns: 1fr 1fr;
  }

  .footer__social {
    justify-self: end;
    text-align: right;
  }
}
</style>
