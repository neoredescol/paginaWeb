<script setup lang="ts">
interface LegalSection { id: string; title: string; paragraphs: string[]; items?: string[] }

const props = defineProps<{
  eyebrow: string
  titleTop: string
  titleAccent: string
  intro: string
  updatedAt: string
  sections: LegalSection[]
}>()

const activeSection = ref(props.sections[0]?.id ?? '')
let observer: IntersectionObserver | undefined

onMounted(() => {
  const targets = props.sections.map(section => document.getElementById(section.id)).filter(Boolean) as HTMLElement[]
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible[0]?.target.id) activeSection.value = visible[0].target.id
  }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })
  targets.forEach(target => observer?.observe(target))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main class="legal-page">
    <header class="legal-hero">
      <p class="legal-hero__eyebrow">{{ eyebrow }}</p>
      <h1><span>{{ titleTop }}</span><strong>{{ titleAccent }}<i>.</i></strong></h1>
      <div class="legal-hero__meta">
        <p>{{ intro }}</p>
        <p>Última actualización: {{ updatedAt }}</p>
      </div>
    </header>

    <div class="legal-layout">
      <nav class="legal-index" aria-label="Contenido del documento">
        <p>CONTENIDO</p>
        <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" :class="{ 'is-active': activeSection === section.id }">{{ section.title }}</a>
      </nav>

      <article class="legal-document">
        <section v-for="(section, index) in sections" :id="section.id" :key="section.id" class="legal-section">
          <p class="legal-section__number">{{ String(index + 1).padStart(2, '0') }}</p>
          <div>
            <h2>{{ section.title }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <ul v-if="section.items?.length">
              <li v-for="item in section.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style scoped>
.legal-page { --legal-width: min(calc(100% - (2 * var(--page-padding))), 1480px); overflow-x: clip; color: var(--color-light); background: var(--color-black); scroll-behavior: smooth; }
.legal-hero { width: var(--legal-width); margin-inline: auto; padding: clamp(4rem,7vw,7rem) 0 clamp(4rem,7vw,6.5rem); border-bottom: 1px solid rgba(242,244,247,.14); animation: legal-reveal .7s ease both; }
.legal-hero__eyebrow { margin: 0 0 1.5rem; color: rgba(242,244,247,.45); font: 600 .65rem/1.4 var(--font-body); letter-spacing: .2em; }
.legal-hero h1 { margin: 0; font: 700 clamp(3.8rem,6.5vw,7.5rem)/.88 var(--font-display); letter-spacing: -.065em; }
.legal-hero h1 span,.legal-hero h1 strong { display: block; font-weight: inherit; }
.legal-hero h1 strong { color: var(--color-cyan); }
.legal-hero h1 i { color: var(--color-orange); font-style: normal; }
.legal-hero__meta { display: grid; max-width: 56rem; grid-template-columns: minmax(0,1fr) auto; gap: 2rem; margin-top: clamp(2rem,4vw,3.5rem); color: rgba(242,244,247,.62); font: 400 clamp(.82rem,1vw,.96rem)/1.7 var(--font-body); }
.legal-hero__meta p { margin: 0; }
.legal-hero__meta p:last-child { color: rgba(242,244,247,.42); font-size: .72rem; white-space: nowrap; }
.legal-layout { display: grid; width: var(--legal-width); grid-template-columns: minmax(12rem,26%) minmax(0,1fr); gap: clamp(3rem,8vw,9rem); margin-inline: auto; padding: clamp(4rem,7vw,7rem) 0 clamp(6rem,10vw,10rem); }
.legal-index { position: sticky; top: calc(var(--header-height) + 2rem); display: flex; height: max-content; align-items: flex-start; flex-direction: column; gap: .62rem; }
.legal-index > p { margin: 0 0 .8rem; color: rgba(242,244,247,.38); font: 600 .62rem/1.4 var(--font-body); letter-spacing: .18em; }
.legal-index a { color: rgba(242,244,247,.48); font: 500 .75rem/1.45 var(--font-body); text-decoration: none; transition: color 180ms ease,transform 180ms ease; }
.legal-index a:hover,.legal-index a:focus-visible,.legal-index a.is-active { color: var(--color-cyan); outline: none; transform: translateX(.25rem); }
.legal-document { width: min(100%,54rem); max-width: 54rem; overflow-wrap: anywhere; animation: legal-reveal .65s .12s ease both; }
.legal-section { display: grid; grid-template-columns: 2rem minmax(0,1fr); gap: 1.25rem; scroll-margin-top: calc(var(--header-height) + 2rem); }
.legal-section + .legal-section { margin-top: clamp(3.5rem,6vw,5.5rem); padding-top: clamp(3rem,5vw,4.5rem); border-top: 1px solid rgba(242,244,247,.1); }
.legal-section__number { margin: .3rem 0 0; color: var(--color-orange); font: 600 .62rem/1.4 var(--font-body); letter-spacing: .12em; }
.legal-section h2 { margin: 0 0 1.4rem; font: 700 clamp(1.65rem,2.4vw,2.4rem)/1.08 var(--font-display); letter-spacing: -.04em; }
.legal-section p,.legal-section li { max-width: 68ch; color: rgba(242,244,247,.76); font: 400 clamp(.95rem,1.15vw,1.08rem)/1.8 var(--font-body); }
.legal-section p { margin: 0; }
.legal-section p + p { margin-top: 1rem; }
.legal-section ul { margin: 1.25rem 0 0; padding-left: 1.25rem; }
.legal-section li + li { margin-top: .55rem; }
.legal-section a { color: var(--color-cyan); overflow-wrap: anywhere; }
@keyframes legal-reveal { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@media (min-width: 1280px) and (max-width: 1599px) { .legal-page { --legal-width: min(calc(100% - clamp(3rem,6vw,6rem)),1400px); } .legal-layout { gap: clamp(2.5rem,5vw,6rem); padding-block: clamp(3.5rem,6vw,6rem) clamp(5rem,8vw,8rem); } .legal-hero h1 { font-size: clamp(3.8rem,6.2vw,6.5rem); } }
@media (min-width: 768px) and (max-width: 1279px) { .legal-page { --legal-width: min(calc(100% - clamp(4rem,8vw,6rem)),1120px); } .legal-hero { padding-block: clamp(3.5rem,7vw,6rem); } .legal-hero h1 { font-size: clamp(4rem,8vw,6.5rem); } .legal-layout { display: block; padding-block: clamp(3rem,6vw,5rem) clamp(5rem,9vw,8rem); } .legal-index { position: static; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .65rem 1.5rem; margin-bottom: clamp(3rem,6vw,5rem); } .legal-index > p { grid-column: 1/-1; } .legal-index a { font-size: .75rem; } .legal-document { width: min(100%,60rem); } .legal-section h2 { font-size: clamp(1.7rem,2.7vw,2.2rem); } }
@media (min-width: 768px) and (max-width: 1279px) and (max-height: 700px) { .legal-hero { padding-block: 2.5rem 3rem; } .legal-layout { padding-block: 2.5rem 4rem; } .legal-index { margin-bottom: 2.5rem; } .legal-section + .legal-section { margin-top: 3rem; padding-top: 2.5rem; } }
@media (max-width: 767px) { .legal-page { --legal-width: calc(100% - clamp(2.5rem,10vw,3.5rem) - env(safe-area-inset-left) - env(safe-area-inset-right)); } .legal-hero { padding: 3rem max(0px,env(safe-area-inset-right)) 3.5rem max(0px,env(safe-area-inset-left)); } .legal-hero h1 { font-size: clamp(2.7rem,12vw,4.5rem); } .legal-hero__meta { display: block; } .legal-hero__meta p:last-child { margin-top: 1rem; white-space: normal; overflow-wrap: anywhere; } .legal-layout { display: block; padding-top: 3rem; } .legal-index { position: static; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .65rem 1rem; margin-bottom: 3.5rem; } .legal-index > p { grid-column: 1/-1; } .legal-index a { font-size: .68rem; overflow-wrap: anywhere; } .legal-section { grid-template-columns: 1.5rem minmax(0,1fr); gap: .75rem; } .legal-section p,.legal-section li { font-size: .94rem; line-height: 1.75; } .legal-section + .legal-section { margin-top: 3.5rem; padding-top: 3rem; } }
@media (max-width: 390px) { .legal-index { grid-template-columns: 1fr; } .legal-index > p { grid-column: auto; } .legal-hero { padding-top: 2.5rem; } }
@media (prefers-reduced-motion: reduce) { .legal-page { scroll-behavior: auto; } .legal-hero,.legal-document { animation: none; } }
</style>
