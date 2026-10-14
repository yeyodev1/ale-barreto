<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap } from '../composables/useSmoothScroll'

const slides = [
  { src: '/img/wall-oak', alt: 'Muro de roble con puerta integrada al ras junto a una escalera de vidrio', chip: 'Puerta oculta', meta: 'Al ras · 0 mm' },
  { src: '/img/closet-walnut', alt: 'Clóset de nogal con puertas corredizas y filetes de marquetería', chip: 'Clóset nogal', meta: '3 hojas · 2,8 m' },
  { src: '/img/bedroom-final', alt: 'Dormitorio con cabecero negro mate y luz LED cálida', chip: 'Cabecero + LED', meta: '2700 K' },
  { src: '/img/kitchen-black', alt: 'Cocina negra con isla revestida en nogal', chip: 'Isla de nogal', meta: 'Sinterizado negro' },
]
const thumbs = ['/img/door-classic-sm.webp', '/img/kitchen-nook-sm.webp', '/img/headboard-detail-sm.webp', '/img/closet-walnut-3-sm.webp', '/img/led-detail-sm.webp', '/img/wall-oak-2-sm.webp']

const root = ref<HTMLElement | null>(null)
const current = ref(0)

useGsap(root, () => {
  const items = gsap.utils.toArray<HTMLElement>('.pg__slide')
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => (current.value = Math.min(slides.length - 1, Math.floor(self.progress * slides.length * 0.999))),
    },
  })
  tl.fromTo('.pg__frame', { scale: 0.86 }, { scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
  items.forEach((el, i) => {
    if (i === 0) return
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, i)
      .fromTo(el.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 1, ease: 'power2.out' }, i)
  })
  tl.fromTo('.pg__strip', { xPercent: 10 }, { xPercent: -45, duration: slides.length }, 0)
    .fromTo('.pg__strip--l', { xPercent: -50 }, { xPercent: 5, duration: slides.length }, 0)
})
</script>

<template>
  <section id="detalles" ref="root" class="pg" :style="{ height: `${slides.length * 110 + 60}vh` }">
    <div class="pg__sticky">
      <div class="pg__rings" aria-hidden="true" />
      <h2 class="pg__caption">
        <span class="caps">Tan preciso,</span>
        <span class="pg__serif serif">que desaparece</span>
      </h2>

      <div class="pg__strip pg__strip--l" aria-hidden="true">
        <img v-for="t in thumbs.slice(0, 3)" :key="t" :src="t" alt="" loading="lazy" />
      </div>

      <div class="pg__frame">
        <figure v-for="(s, i) in slides" :key="s.src" class="pg__slide" :style="{ zIndex: i }">
          <img :src="`${s.src}.webp`" :srcset="`${s.src}-sm.webp 800w, ${s.src}.webp 1600w`" sizes="(max-width: 760px) 80vw, 40vw" :alt="s.alt" loading="lazy" />
          <figcaption class="pg__chip">
            <span class="pg__chip-dot" />
            <span>
              <strong>{{ s.chip }}</strong>
              <small>{{ s.meta }}</small>
            </span>
          </figcaption>
        </figure>
        <span class="pg__corner" aria-hidden="true" />
      </div>

      <div class="pg__strip" aria-hidden="true">
        <img v-for="t in thumbs.slice(3)" :key="t" :src="t" alt="" loading="lazy" />
      </div>

      <ol class="pg__count caps" aria-hidden="true">
        <li v-for="(s, i) in slides" :key="s.src" :class="{ on: i === current }">{{ String(i + 1).padStart(2, '0') }}</li>
      </ol>
      <p class="scroll-cue caps"><span class="scroll-cue__dot" />Scroll para continuar</p>
    </div>
  </section>
</template>

<style scoped>
.pg {
  position: relative;
  background: var(--ink-2);
}
.pg__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.pg__rings {
  position: absolute;
  left: -35vmax;
  bottom: -50vmax;
  width: 100vmax;
  height: 100vmax;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, rgba(201, 104, 44, 0.12) 0 4vmax, rgba(201, 104, 44, 0.04) 4vmax 8vmax);
  mask-image: radial-gradient(circle, #000 0%, transparent 68%);
  -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 68%);
}
.pg__caption {
  position: absolute;
  left: var(--gutter);
  top: 26svh;
  margin: 0;
  display: flex;
  flex-direction: column;
  z-index: 3;
}
.pg__serif {
  font-size: clamp(30px, 2.6vw, 44px);
  line-height: 1;
}
.pg__frame {
  position: relative;
  width: min(40vw, 62svh);
  aspect-ratio: 4 / 5;
  outline: 1px dashed rgba(242, 230, 212, 0.35);
  outline-offset: 6px;
  z-index: 2;
}
.pg__slide {
  position: absolute;
  inset: 0;
  margin: 0;
  overflow: hidden;
  background: var(--ink-3);
}
.pg__slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pg__chip {
  position: absolute;
  left: 18%;
  bottom: 18%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #4fe0c0;
  border-radius: 14px;
  background: rgba(10, 20, 18, 0.55);
  backdrop-filter: blur(10px);
  color: #c9fff1;
  box-shadow: 0 0 24px rgba(79, 224, 192, 0.25);
}
.pg__chip strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
}
.pg__chip small {
  font-size: 11px;
  opacity: 0.8;
}
.pg__chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4fe0c0;
  box-shadow: 0 0 10px #4fe0c0;
}
.pg__corner {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cream);
  z-index: 10;
}
.pg__strip {
  position: absolute;
  left: calc(50% + min(20vw, 31svh) + 24px);
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}
.pg__strip--l {
  left: auto;
  right: calc(50% + min(20vw, 31svh) + 24px);
  opacity: 0.55;
}
.pg__strip img {
  width: clamp(110px, 12vw, 200px);
  aspect-ratio: 3 / 4;
  object-fit: cover;
  filter: saturate(0.85) brightness(0.85);
}
.pg__count {
  position: absolute;
  left: var(--gutter);
  bottom: 26px;
  display: flex;
  gap: 14px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.pg__count li {
  opacity: 0.3;
  transition: opacity 0.4s;
}
.pg__count li.on {
  opacity: 1;
}
.pg .scroll-cue {
  margin: 0;
}

@media (max-width: 760px) {
  .pg__frame {
    width: 78vw;
  }
  .pg__caption {
    top: 88px;
  }
  .pg__strip,
  .pg__strip--l {
    display: none;
  }
  .pg .scroll-cue {
    display: none;
  }
}
</style>
