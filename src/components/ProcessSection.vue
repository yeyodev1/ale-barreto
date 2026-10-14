<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap } from '../composables/useSmoothScroll'

const steps = [
  { n: '01', title: 'Visita y medición', body: 'Vamos a tu espacio, escuchamos cómo lo vives y medimos cada pared, nivel y esquina.' },
  { n: '02', title: 'Diseño', body: 'Te presentamos la propuesta con materiales, acabados y distribución interior pensados para ti.' },
  { n: '03', title: 'Fabricación', body: 'Cortamos, enchapamos y armamos cada pieza según los planos aprobados. Sin atajos.' },
  { n: '04', title: 'Instalación', body: 'Instalamos, nivelamos y ajustamos hasta que cada puerta cierre como debe. Y limpiamos.' },
]

const root = ref<HTMLElement | null>(null)

useGsap(root, () => {
  gsap.fromTo('.ps__line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.ps__grid', start: 'top 75%', end: 'bottom 60%', scrub: true } })
  gsap.utils.toArray<HTMLElement>('.ps__step').forEach((el, i) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: i * 0.08, scrollTrigger: { trigger: '.ps__grid', start: 'top 70%' } })
  })
  gsap.fromTo('.ps__title .ps__w', { yPercent: 105 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.ps__title', start: 'top 80%' } })
})
</script>

<template>
  <section ref="root" class="ps" aria-labelledby="ps-title">
    <div class="ps__top">
      <p class="caps ps__kicker">Cómo trabajamos</p>
      <h2 id="ps-title" class="ps__title display">
        <span class="ps__m"><span class="ps__w">De la medida</span></span><br />
        <span class="ps__m"><span class="ps__w">a la <em class="serif">llave</em></span></span>
      </h2>
    </div>
    <div class="ps__grid">
      <div class="ps__line" aria-hidden="true" />
      <article v-for="s in steps" :key="s.n" class="ps__step">
        <span class="ps__dot" aria-hidden="true" />
        <p class="ps__n">{{ s.n }}</p>
        <h3 class="ps__h caps">{{ s.title }}</h3>
        <p class="ps__b">{{ s.body }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.ps {
  position: relative;
  padding: 160px var(--gutter) 150px;
  background: var(--ink);
}
.ps__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 100px;
  flex-wrap: wrap;
}
.ps__kicker {
  color: var(--ember);
  margin: 0;
}
.ps__title {
  margin: 0;
  text-align: right;
  font-size: clamp(48px, 8vw, 150px);
}
.ps__title em {
  font-size: 1.12em;
  letter-spacing: -0.02em;
  color: var(--oak);
}
.ps__m {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.06em;
}
.ps__w {
  display: inline-block;
}
.ps__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  padding-top: 34px;
}
.ps__line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--cream);
  opacity: 0.4;
  transform-origin: left;
}
.ps__dot {
  position: absolute;
  top: -38px;
  left: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--ember);
}
.ps__step {
  position: relative;
}
.ps__n {
  margin: 0 0 40px;
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(56px, 6vw, 104px);
  line-height: 0.9;
  color: var(--oak);
}
.ps__h {
  margin: 0 0 12px;
  font-size: 13px;
}
.ps__b {
  margin: 0;
  max-width: 300px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .ps__grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 60px;
  }
}
@media (max-width: 520px) {
  .ps__grid {
    grid-template-columns: 1fr;
  }
  .ps__title {
    text-align: left;
  }
}
</style>
