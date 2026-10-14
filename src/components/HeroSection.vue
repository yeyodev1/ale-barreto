<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap, scrollTo } from '../composables/useSmoothScroll'

const props = defineProps<{ ready: boolean }>()
const root = ref<HTMLElement | null>(null)
let intro: gsap.core.Timeline | undefined

useGsap(root, () => {
  // intro, waits for the preloader
  intro = gsap.timeline({ paused: true, delay: 0.15 })
  intro
    .from('.hero__media img', { scale: 1.25, duration: 2.2, ease: 'expo.out' })
    .from('.hero__letter', { yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: 0.045 }, 0.1)
    .from('.hero__fade', { autoAlpha: 0, y: 18, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.6)

  if (props.ready) intro.play()

  // scroll-out
  gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__media', { yPercent: 22, scale: 1.08, ease: 'none' }, 0)
    .to('.hero__title', { yPercent: -40, ease: 'none' }, 0)
    .to('.hero__shade', { opacity: 1, ease: 'none' }, 0)
})

watch(
  () => props.ready,
  (v) => v && intro?.play(),
)

const word = 'ALE BARRETO'.split('')
</script>

<template>
  <section id="intro" ref="root" class="hero">
    <div class="hero__media">
      <img src="/img/hero.webp" alt="Mesa de trabajo del estudio con muestras de chapa de nogal, roble y laminado negro" fetchpriority="high" />
    </div>
    <div class="hero__shade" />

    <div class="hero__top">
      <h1 class="hero__title display" aria-label="Ale Barreto Studio">
        <span v-for="(l, i) in word" :key="i" class="hero__mask"><span class="hero__letter">{{ l === ' ' ? ' ' : l }}</span></span>
      </h1>
      <p class="hero__kicker caps hero__fade">Hecho para tu casa.<br />No para un catálogo.</p>
    </div>

    <p class="hero__lede hero__fade">
      Diseñamos y fabricamos clósets, cocinas, dormitorios y revestimientos
      <em class="serif">milímetro a milímetro</em>, para que cada pieza parezca que siempre estuvo ahí.
    </p>

    <div class="hero__card hero__fade">
      <p class="hero__card-title display">Diseño y<br />carpintería<br />a medida</p>
      <div class="hero__card-rule" />
      <p class="hero__card-note">El estudio que esconde puertas en las paredes y luz detrás de los cabeceros.</p>
    </div>

    <a href="#proyectos" class="hero__chip hero__fade" @click.prevent="scrollTo('#proyectos')">
      <img src="/img/closet-walnut-sm.webp" alt="" />
      <span class="caps">Ver<br />proyectos</span>
    </a>

    <p class="hero__tag caps hero__fade" aria-hidden="true">● AB—01 / Studio</p>

    <button class="scroll-cue hero__fade" type="button" @click="scrollTo('#manifiesto')">
      <span class="scroll-cue__dot" />
      <span class="caps">Scroll para continuar</span>
    </button>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100svh;
  min-height: 620px;
  overflow: hidden;
  color: var(--cream);
}
.hero__media {
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: transform;
}
.hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 60% 50%;
}
.hero__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(20, 15, 11, 0.55) 0%, rgba(20, 15, 11, 0) 38%),
    linear-gradient(0deg, rgba(20, 15, 11, 0.55) 0%, rgba(20, 15, 11, 0) 35%);
}
.hero__shade {
  position: absolute;
  inset: 0;
  background: var(--ink);
  opacity: 0;
  pointer-events: none;
}

.hero__top {
  position: absolute;
  top: 58px;
  left: var(--gutter);
  right: var(--gutter);
}
.hero__title {
  margin: 0;
  font-size: clamp(36px, 13.4vw, 250px);
  white-space: nowrap;
  display: flex;
  will-change: transform;
}
.hero__mask {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.04em;
}
.hero__letter {
  display: inline-block;
}
.hero__kicker {
  position: absolute;
  right: 0.4vw;
  bottom: -6px;
  transform: translateY(100%);
  margin: 0;
  text-align: right;
}

.hero__lede {
  position: absolute;
  left: var(--gutter);
  top: 40%;
  max-width: 360px;
  margin: 0;
  font-size: clamp(16px, 1.35vw, 20px);
  line-height: 1.32;
  font-weight: 500;
  text-shadow: 0 1px 24px rgba(0, 0, 0, 0.35);
}
.hero__lede .serif {
  font-size: 1.15em;
}

.hero__card {
  position: absolute;
  left: var(--gutter);
  bottom: calc(var(--gutter) + 8px);
  width: 210px;
  padding: 14px 14px 16px;
  background: rgba(242, 230, 212, 0.14);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  border: 1px solid rgba(242, 230, 212, 0.18);
}
.hero__card-title {
  margin: 0 0 54px;
  font-size: 15px;
  line-height: 1;
  letter-spacing: -0.01em;
}
.hero__card-rule {
  height: 1px;
  background: rgba(242, 230, 212, 0.35);
  margin-bottom: 12px;
}
.hero__card-note {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.3;
  text-align: right;
}

.hero__chip {
  position: absolute;
  right: var(--gutter);
  bottom: calc(var(--gutter) + 8px);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 5px;
  border: 1px solid var(--ember);
  background: rgba(20, 15, 11, 0.55);
  backdrop-filter: blur(8px);
  transition: background 0.4s var(--ease-out);
}
.hero__chip img {
  width: 54px;
  height: 54px;
  object-fit: cover;
}
.hero__chip:hover {
  background: var(--ember);
}

.hero__tag {
  position: absolute;
  right: var(--gutter);
  top: 50%;
  margin: 0;
  writing-mode: vertical-rl;
  transform: translateY(-50%);
  padding: 14px 7px;
  background: var(--cream);
  color: var(--ink);
}

@media (max-width: 760px) {
  .hero__top {
    top: 88px;
  }
  .hero__lede {
    left: var(--gutter);
    right: var(--gutter);
    top: auto;
    bottom: 240px;
    max-width: none;
  }
  .hero__card {
    width: 170px;
  }
  .hero__card-title {
    margin-bottom: 28px;
  }
  .hero__tag {
    display: none;
  }
  .scroll-cue {
    display: none;
  }
}
</style>
