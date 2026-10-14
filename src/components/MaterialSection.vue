<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap } from '../composables/useSmoothScroll'

const root = ref<HTMLElement | null>(null)
const word = 'oficio'.split('')

useGsap(root, () => {
  // 1. brand word fades in the dark, then the macro walnut swallows the screen
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: '.ms__zoom', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  })
    .fromTo('.ms__brand', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 0.22, scale: 1, duration: 1 })
    .fromTo('.ms__macro', { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 55%)', duration: 1.6, ease: 'power2.in' }, 0.8)
    .fromTo('.ms__macro img', { scale: 1.7, rotate: -4 }, { scale: 1.05, rotate: 0, duration: 2.6, ease: 'power2.out' }, 0.8)
    .fromTo('.ms__macro-copy > *', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15 }, 2.1)
    .to({}, { duration: 0.5 })

  // 2. cream "oficio" section
  gsap.fromTo(
    '.ms__char',
    { yPercent: 110 },
    { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.ms__craft', start: 'top 55%' } },
  )
  gsap.fromTo('.ms__craft-bg', { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.ms__craft', start: 'top bottom', end: 'bottom top', scrub: true } })
  gsap.fromTo('.ms__craft .ms__fade', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.ms__craft', start: 'top 45%' } })
})
</script>

<template>
  <section ref="root" class="ms" aria-label="Material y oficio">
    <div class="ms__zoom">
      <div class="ms__sticky">
        <p class="ms__brand display" aria-hidden="true">Ale Barreto</p>
        <div class="ms__macro">
          <img src="/img/macro-walnut.webp" srcset="/img/macro-walnut-sm.webp 1200w, /img/macro-walnut.webp 2400w" sizes="100vw" alt="Macro de chapa de nogal con luz rasante" loading="lazy" />
          <div class="ms__macro-copy">
            <p class="caps">Míralo de cerca</p>
            <p class="ms__macro-big serif">La veta no se imprime.<br />Se elige.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="ms__craft">
      <img class="ms__craft-bg" src="/img/macro-oak.webp" srcset="/img/macro-oak-sm.webp 1200w, /img/macro-oak.webp 2400w" sizes="100vw" alt="" loading="lazy" />
      <p class="ms__eyebrow caps ms__fade">Diseño · Fabricación · Instalación</p>
      <div class="ms__wordwrap">
        <p class="ms__pre caps ms__fade">Paciencia, madera y</p>
        <h2 class="ms__word" aria-label="Oficio">
          <span v-for="(c, i) in word" :key="i" class="ms__mask" aria-hidden="true"><span class="ms__char">{{ c }}</span></span>
        </h2>
      </div>
      <p class="ms__copy ms__fade">
        Elegimos cada chapa, cada canto y cada herraje pensando en cómo se verá dentro de diez años,
        no solo el día de la entrega. Lo que no se ve, también se termina.
      </p>
      <p class="scroll-cue caps ms__cue"><span class="scroll-cue__dot" />Scroll para continuar</p>
    </div>
  </section>
</template>

<style scoped>
.ms__zoom {
  position: relative;
  height: 340vh;
  background: var(--ink);
}
.ms__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.ms__brand {
  margin: 0;
  font-size: clamp(60px, 13vw, 240px);
  color: var(--cream);
  white-space: nowrap;
}
.ms__macro {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.ms__macro img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ms__macro-copy {
  position: absolute;
  left: var(--gutter);
  bottom: 40px;
}
.ms__macro-copy .caps {
  margin: 0 0 10px;
  color: var(--oak);
}
.ms__macro-big {
  margin: 0;
  font-size: clamp(38px, 5vw, 86px);
  line-height: 0.95;
}

.ms__craft {
  position: relative;
  min-height: 115svh;
  overflow: hidden;
  background: #f1e2cc;
  color: #1a120c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px var(--gutter);
}
.ms__craft-bg {
  position: absolute;
  inset: -12% 0;
  width: 100%;
  height: 124%;
  object-fit: cover;
  opacity: 0.55;
  mix-blend-mode: multiply;
}
.ms__eyebrow {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: 10px;
  white-space: nowrap;
}
.ms__wordwrap {
  position: relative;
}
.ms__pre {
  margin: 0 0 0 0.6vw;
  font-size: 13px;
}
.ms__word {
  margin: 0;
  font-family: var(--display);
  font-variation-settings: 'wdth' 92;
  font-weight: 700;
  font-size: clamp(110px, 27vw, 520px);
  letter-spacing: -0.06em;
  line-height: 0.8;
  display: flex;
}
.ms__mask {
  display: inline-block;
  overflow: hidden;
  padding: 0.02em 0 0.06em;
}
.ms__char {
  display: inline-block;
}
.ms__copy {
  position: relative;
  max-width: 400px;
  margin: 46px auto 0;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
}
.ms__cue {
  margin: 0;
  color: #1a120c;
}
</style>
