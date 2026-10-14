<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap, ScrollTrigger, scrollTo } from '../composables/useSmoothScroll'

type Card =
  | { kind: 'hero'; title: string[]; img: string; alt: string; label: string; bg: string }
  | { kind: 'photo'; img: string; alt: string; label: string; w: number }
  | { kind: 'type'; big: string; small: string; img: string; alt: string; bg: string }

const cards: Card[] = [
  { kind: 'hero', title: ['Clósets que', 'llegan al techo'], img: '/img/closet-walnut', alt: 'Clóset de nogal de piso a techo', label: 'Clósets', bg: '#b4501f' },
  { kind: 'photo', img: '/img/closet-walnut-3', alt: 'Vista lateral del clóset de nogal con bandas horizontales', label: 'Marquetería en esquina', w: 30 },
  { kind: 'type', big: 'Cocinas', small: 'Negro sinterizado + nogal', img: '/img/kitchen-black', alt: 'Cocina negra con isla de nogal', bg: '#2a2018' },
  { kind: 'photo', img: '/img/kitchen-nook', alt: 'Desayunador con repisas iluminadas', label: 'Repisas iluminadas', w: 30 },
  { kind: 'hero', title: ['Dormitorios', 'que se apagan solos'], img: '/img/bedroom-final', alt: 'Dormitorio con cabecero negro mate', label: 'Dormitorios', bg: '#3a2a1e' },
  { kind: 'photo', img: '/img/bedroom-frame-2', alt: 'Cama negra mate con tablas de madera', label: 'Base de cama a medida', w: 30 },
  { kind: 'type', big: 'Paredes', small: 'Revestimiento de roble', img: '/img/wall-oak-2', alt: 'Muro de roble en escalera', bg: '#8a5a33' },
  { kind: 'photo', img: '/img/door-classic', alt: 'Puerta clásica de madera con molduras', label: 'Puertas clásicas', w: 30 },
]

const root = ref<HTMLElement | null>(null)

useGsap(root, () => {
  const mm = gsap.matchMedia()
  mm.add('(min-width: 761px)', () => {
    const track = root.value!.querySelector<HTMLElement>('.pr__track')!
    const distance = () => track.scrollWidth - window.innerWidth
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: '.pr__pin',
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })
    gsap.utils.toArray<HTMLElement>('.pr__card img').forEach((img) => {
      gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img.closest('.pr__card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
    })
    gsap.utils.toArray<HTMLElement>('.pr__big').forEach((el) => {
      gsap.fromTo(el, { xPercent: 30 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: el.closest('.pr__card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
    })
    ScrollTrigger.refresh()
  })
})
</script>

<template>
  <section id="proyectos" ref="root" class="pr">
    <div class="pr__pin">
      <header class="pr__head">
        <p class="caps">Proyectos</p>
        <p class="caps pr__head-r">Instalados, no renderizados</p>
      </header>
      <div class="pr__track">
        <article
          v-for="(c, i) in cards"
          :key="i"
          class="pr__card"
          :class="`pr__card--${c.kind}`"
          :style="c.kind === 'photo' ? { '--w': `${c.w}vw` } : { '--bg': c.bg }"
        >
          <template v-if="c.kind === 'hero'">
            <div class="pr__hero-media">
              <img :src="`${c.img}.webp`" :srcset="`${c.img}-sm.webp 800w, ${c.img}.webp 1600w`" sizes="40vw" :alt="c.alt" loading="lazy" />
            </div>
            <h3 class="pr__hero-title">{{ c.title[0] }}<br />{{ c.title[1] }}</h3>
            <p class="caps pr__label">{{ c.label }}</p>
          </template>
          <template v-else-if="c.kind === 'photo'">
            <div class="pr__photo">
              <img :src="`${c.img}.webp`" :srcset="`${c.img}-sm.webp 800w, ${c.img}.webp 1600w`" sizes="30vw" :alt="c.alt" loading="lazy" />
            </div>
            <p class="caps pr__label">{{ c.label }}</p>
          </template>
          <template v-else>
            <div class="pr__type-media">
              <img :src="`${c.img}.webp`" :srcset="`${c.img}-sm.webp 800w, ${c.img}.webp 1600w`" sizes="45vw" :alt="c.alt" loading="lazy" />
            </div>
            <p class="pr__big display">{{ c.big }}</p>
            <p class="caps pr__label">{{ c.small }}</p>
          </template>
        </article>
        <div class="pr__end">
          <p class="serif">¿El tuyo es<br />el siguiente?</p>
          <a href="#contacto" class="caps pr__end-link" @click.prevent="scrollTo('#contacto')">Cuéntanos tu espacio →</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pr {
  position: relative;
  background: var(--ink-2);
}
.pr__pin {
  height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pr__head {
  display: flex;
  justify-content: space-between;
  padding: 64px var(--gutter) 14px;
  margin: 0 var(--gutter);
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid var(--line);
}
.pr__head-r {
  color: var(--muted);
}
.pr__track {
  flex: 1;
  display: flex;
  gap: 10px;
  padding: 22px var(--gutter) 64px;
  width: max-content;
  will-change: transform;
}
.pr__card {
  position: relative;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
}
.pr__card img {
  width: 116%;
  max-width: none;
  height: 100%;
  margin-left: -8%;
  object-fit: cover;
}
.pr__label {
  position: absolute;
  left: 18px;
  bottom: 16px;
  margin: 0;
  z-index: 2;
}

.pr__card--hero {
  width: 62vw;
  background: radial-gradient(circle at 30% 70%, color-mix(in oklab, var(--bg), #ffb070 25%), var(--bg) 60%);
}
.pr__hero-media {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 46%;
  overflow: hidden;
}
.pr__hero-title {
  position: absolute;
  left: 22px;
  top: 22px;
  max-width: 50%;
  margin: 0;
  font-family: var(--display);
  font-variation-settings: 'wdth' 100;
  font-weight: 700;
  font-size: clamp(32px, 3.6vw, 64px);
  letter-spacing: -0.035em;
  line-height: 0.98;
}

.pr__card--photo {
  width: var(--w);
}
.pr__photo {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.pr__photo::after,
.pr__type-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(20, 15, 11, 0.6), transparent 35%);
}
.pr__type-media::after {
  background:
    linear-gradient(180deg, rgba(20, 15, 11, 0.55), transparent 40%),
    linear-gradient(0deg, rgba(20, 15, 11, 0.6), transparent 35%);
}

.pr__card--type {
  width: 46vw;
  background: var(--bg);
}
.pr__type-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.pr__big {
  position: absolute;
  left: 0;
  top: 18px;
  margin: 0;
  font-size: clamp(64px, 9vw, 170px);
  white-space: nowrap;
  z-index: 2;
  color: var(--cream);
  text-shadow: 0 2px 40px rgba(20, 15, 11, 0.35);
}

.pr__end {
  width: 34vw;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 26px;
  padding: 0 4vw;
}
.pr__end .serif {
  margin: 0;
  font-size: clamp(40px, 4.4vw, 80px);
  line-height: 0.95;
}
.pr__end-link {
  align-self: flex-start;
  padding: 14px 20px;
  border: 1px solid var(--cream);
  border-radius: 999px;
  transition: background 0.4s var(--ease-out), color 0.4s var(--ease-out);
}
.pr__end-link:hover {
  background: var(--cream);
  color: var(--ink);
}

@media (max-width: 760px) {
  .pr__pin {
    height: auto;
  }
  .pr__track {
    width: auto;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 40px;
  }
  .pr__card,
  .pr__card--hero,
  .pr__card--type,
  .pr__card--photo {
    width: 100%;
    height: 78svh;
  }
  .pr__card img {
    width: 100%;
    margin: 0;
  }
  .pr__hero-media {
    width: 100%;
    top: 40%;
  }
  .pr__end {
    width: 100%;
    padding: 60px 0;
  }
}
</style>
