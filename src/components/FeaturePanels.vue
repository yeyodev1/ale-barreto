<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap } from '../composables/useSmoothScroll'

const panels = [
  {
    img: '/img/wall-oak',
    alt: 'Panelería de roble de piso a techo con puerta integrada',
    icon: 'door',
    kicker: 'Puertas que no se ven',
    body: 'Panelería de roble de piso a techo con la puerta integrada al ras. La única pista de que existe es la manija.',
    title: ['Eleva', 'cada pared'],
    formula: 'Δ junta ≈ 2 mm',
    formulaNote: 'Tolerancia constante, de piso a techo',
    pos: '50% 40%',
  },
  {
    img: '/img/edge-led',
    alt: 'Detalle de panel negro mate con luz LED cálida bañando la pared',
    icon: 'light',
    kicker: 'Luz que no se anuncia',
    body: 'Cinta LED cálida escondida tras el cabecero. Ves el resplandor, nunca la cinta. Ni un cable a la vista.',
    title: ['Ilumina', 'sin mostrarte'],
    formula: 'T = 2700 K',
    formulaNote: 'Temperatura de color para dormir mejor',
    pos: '50% 50%',
  },
  {
    img: '/img/closet-walnut-2',
    alt: 'Esquina de clóset de nogal con bandas de marquetería',
    icon: 'grain',
    kicker: 'Veta continua',
    body: 'Chapas de nogal natural casadas a mano para que la veta corra de puerta a puerta, y las bandas crucen la esquina sin cortarse.',
    title: ['Nogal,', 'sin interrupciones'],
    formula: 'veta ∥ veta',
    formulaNote: 'Hojas consecutivas del mismo tronco',
    pos: '50% 45%',
  },
  {
    img: '/img/kitchen-nook',
    alt: 'Repisas de roble con iluminación integrada sobre un desayunador',
    icon: 'shelf',
    kicker: 'Repisas con luz propia',
    body: 'Repisas de roble con perfil de luz embutido y una barra en voladizo que parece flotar sobre el porcelanato.',
    title: ['Cocinas que', 'dan ganas de quedarse'],
    formula: '∑ detalles = hogar',
    formulaNote: 'Nuestra única fórmula',
    pos: '50% 50%',
  },
]

const root = ref<HTMLElement | null>(null)

useGsap(root, () => {
  const els = gsap.utils.toArray<HTMLElement>('.fp__panel')
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  })
  els.forEach((el, i) => {
    const img = el.querySelector('.fp__img')
    const copy = el.querySelectorAll('.fp__in')
    const at = i * 2
    if (i > 0) {
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at - 1)
        .fromTo(img, { scale: 1.3, yPercent: 8 }, { scale: 1.12, yPercent: 0, duration: 1, ease: 'power2.out' }, at - 1)
        .to(els[i - 1].querySelector('.fp__img'), { yPercent: -10, duration: 1, ease: 'power2.inOut' }, at - 1)
    }
    tl.fromTo(img, { scale: i === 0 ? 1.15 : 1.12 }, { scale: 1, duration: 2 }, i === 0 ? 0 : at)
      .fromTo(copy, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, i === 0 ? 0 : at - 0.35)
    if (i < els.length - 1) tl.to(copy, { autoAlpha: 0, y: -24, duration: 0.35, stagger: 0.03 }, at + 1.2)
  })
})
</script>

<template>
  <section class="fp" aria-label="Detalles que nos definen">
    <div ref="root" class="fp__track" :style="{ height: `${panels.length * 150}vh` }">
      <div class="fp__sticky">
        <article v-for="(p, i) in panels" :key="p.kicker" class="fp__panel" :style="{ zIndex: i + 1 }">
          <img class="fp__img" :src="`${p.img}.webp`" :srcset="`${p.img}-sm.webp 800w, ${p.img}.webp 1600w`" sizes="100vw" :alt="p.alt" :style="{ objectPosition: p.pos }" loading="lazy" />
          <div class="fp__shade" />
          <div class="fp__aside">
            <span class="fp__icon fp__in" aria-hidden="true">
              <svg v-if="p.icon === 'door'" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="15" cy="12" r="1" /></svg>
              <svg v-else-if="p.icon === 'light'" viewBox="0 0 24 24"><path d="M4 15h16" /><path d="M7 11l-1-2M12 10V7M17 11l1-2" /></svg>
              <svg v-else-if="p.icon === 'grain'" viewBox="0 0 24 24"><path d="M6 3c2 4-2 8 0 12s0 6 0 6M12 3c2 4-2 8 0 12s0 6 0 6M18 3c2 4-2 8 0 12s0 6 0 6" /></svg>
              <svg v-else viewBox="0 0 24 24"><path d="M4 8h16M4 13h16M4 18h16" /></svg>
            </span>
            <p class="caps fp__kicker fp__in">{{ p.kicker }}</p>
            <p class="fp__body fp__in">{{ p.body }}</p>
          </div>
          <div class="fp__bottom">
            <div class="fp__rule fp__in" />
            <h3 class="fp__title display fp__in">{{ p.title[0] }}<br />{{ p.title[1] }}</h3>
          </div>
          <div class="fp__formula fp__in">
            <span class="caps">{{ p.formulaNote }}</span>
            <span class="serif fp__eq">{{ p.formula }}</span>
          </div>
          <span class="fp__index caps" aria-hidden="true">0{{ i + 1 }} / 0{{ panels.length }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fp {
  position: relative;
  background: var(--ink);
}
.fp__track {
  position: relative;
}
.fp__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}
.fp__panel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: var(--ink);
}
.fp__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}
.fp__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(20, 15, 11, 0.78) 0%, rgba(20, 15, 11, 0.35) 34%, rgba(20, 15, 11, 0) 55%),
    linear-gradient(0deg, rgba(20, 15, 11, 0.7) 0%, rgba(20, 15, 11, 0) 40%);
}
.fp__aside {
  position: absolute;
  left: var(--gutter);
  top: 92px;
  width: min(330px, 80vw);
}
.fp__icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(242, 230, 212, 0.16);
  backdrop-filter: blur(8px);
  margin-bottom: 40px;
}
.fp__icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--cream);
  stroke-width: 1.4;
  stroke-linecap: round;
}
.fp__kicker {
  margin: 0 0 12px;
  font-size: 12px;
}
.fp__body {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(242, 230, 212, 0.86);
}
.fp__bottom {
  position: absolute;
  left: var(--gutter);
  bottom: 34px;
  width: min(420px, 86vw);
}
.fp__rule {
  height: 1px;
  background: rgba(242, 230, 212, 0.35);
  margin-bottom: 22px;
}
.fp__title {
  margin: 0;
  text-align: right;
  font-size: clamp(26px, 2.5vw, 40px);
  line-height: 0.95;
}
.fp__formula {
  position: absolute;
  right: calc(var(--gutter) + 10px);
  bottom: 34px;
  display: flex;
  align-items: baseline;
  gap: 18px;
  text-align: right;
}
.fp__formula .caps {
  font-size: 10px;
  max-width: 150px;
}
.fp__eq {
  font-size: clamp(26px, 2.6vw, 42px);
  white-space: nowrap;
}
.fp__index {
  position: absolute;
  right: calc(var(--gutter) + 10px);
  top: 70px;
  color: rgba(242, 230, 212, 0.7);
}

@media (max-width: 760px) {
  .fp__shade {
    background: linear-gradient(180deg, rgba(20, 15, 11, 0.8) 0%, rgba(20, 15, 11, 0.2) 45%, rgba(20, 15, 11, 0.85) 100%);
  }
  .fp__formula {
    bottom: auto;
    top: 64svh;
    left: var(--gutter);
    right: auto;
    flex-direction: column-reverse;
    gap: 4px;
    text-align: left;
  }
  .fp__index {
    display: none;
  }
}
</style>
