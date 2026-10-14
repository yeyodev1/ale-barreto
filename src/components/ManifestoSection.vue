<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap } from '../composables/useSmoothScroll'
import { WoodStage } from '../three/WoodStage'

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
let stage: WoodStage | undefined

const title = 'Hecho a medida'.split('')

useGsap(root, () => {
  stage = new WoodStage(canvas.value!, 'nogal')
  const s = stage.state
  // start edge-on, like a board seen from its side
  Object.assign(s, { rx: 0.25, ry: 1.42, rz: -0.5, x: 0, y: 0, scale: 1.05, light: 0.85 })

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 1 },
  })

  tl.fromTo('.mf__a', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0)
    .to(s, { ry: 0.0, rz: 0.04, rx: 0.06, light: 1.1, duration: 1.4, ease: 'power2.inOut' }, 0)
    .to('.mf__a', { autoAlpha: 0, y: -30, duration: 0.5, stagger: 0.08 }, 1.6)
    .to(s, { ry: Math.PI * 2 - 0.35, rx: 1.12, rz: 0.2, y: -0.55, scale: 0.72, duration: 1.4, ease: 'power2.inOut' }, 1.6)
    .fromTo('.mf__char', { autoAlpha: 0, filter: 'blur(18px)', yPercent: 30 }, { autoAlpha: 1, filter: 'blur(0px)', yPercent: 0, duration: 0.8, stagger: 0.04 }, 2.3)
    .fromTo('.mf__code', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 2.9)
    .fromTo('.mf__b', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 3.1)
    .to(s, { ry: Math.PI * 2 + 0.25, duration: 1, ease: 'sine.inOut' }, 3.0)
    .to({}, { duration: 0.4 })
})

onBeforeUnmount(() => stage?.dispose())
</script>

<template>
  <section id="manifiesto" ref="root" class="mf">
    <div class="mf__sticky">
      <div class="mf__rings" aria-hidden="true" />
      <canvas ref="canvas" class="mf__canvas" aria-hidden="true" />

      <h2 class="mf__lead display mf__a">No es solo<br />un mueble.</h2>
      <p class="mf__side mf__a">
        Es el resultado de medir dos veces, cortar una vez y no aceptar ni un milímetro de más<sup>*</sup>
      </p>

      <div class="mf__headline">
        <h2 class="mf__title" aria-label="Hecho a medida">
          <span v-for="(c, i) in title" :key="i" class="mf__char" aria-hidden="true">{{ c === ' ' ? ' ' : c }}</span>
        </h2>
        <p class="mf__code caps">AB—01</p>
      </div>
      <p class="mf__b mf__note caps">Cada pieza se diseña<br />para un solo lugar.<br />El tuyo.</p>

      <p class="mf__foot caps"><span>*</span> Medición láser<br />en obra</p>
    </div>
  </section>
</template>

<style scoped>
.mf {
  position: relative;
  height: 520vh;
  background: var(--ink);
}
.mf__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}
.mf__rings {
  position: absolute;
  left: -30vmax;
  bottom: -40vmax;
  width: 90vmax;
  height: 90vmax;
  border-radius: 50%;
  background: repeating-radial-gradient(circle, rgba(201, 104, 44, 0.14) 0 3.2vmax, rgba(201, 104, 44, 0.05) 3.2vmax 6.4vmax);
  mask-image: radial-gradient(circle, #000 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 70%);
  filter: blur(2px);
}
.mf__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.mf__lead {
  position: absolute;
  left: calc(var(--gutter) + 6vw);
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  font-size: clamp(30px, 3.1vw, 54px);
  line-height: 0.95;
}
.mf__side {
  position: absolute;
  right: calc(var(--gutter) + 6vw);
  top: 50%;
  transform: translateY(-50%);
  max-width: 270px;
  margin: 0;
  font-size: clamp(16px, 1.3vw, 20px);
  font-weight: 500;
  line-height: 1.3;
}
.mf__side sup {
  color: var(--ember);
}
.mf__headline {
  position: absolute;
  top: 12svh;
  left: 0;
  right: 0;
  text-align: center;
}
.mf__title {
  margin: 0;
  font-family: var(--display);
  font-variation-settings: 'wdth' 100;
  font-weight: 700;
  letter-spacing: -0.045em;
  font-size: clamp(54px, 9.4vw, 170px);
  line-height: 0.9;
}
.mf__char {
  display: inline-block;
}
.mf__code {
  margin: 10px 0 0;
  padding-left: 30%;
  color: var(--ember);
  font-size: 13px;
}
.mf__note {
  position: absolute;
  right: calc(var(--gutter) + 12vw);
  bottom: 20svh;
  margin: 0;
  text-align: right;
  font-size: 12px;
}
.mf__foot {
  position: absolute;
  right: var(--gutter);
  bottom: 22px;
  margin: 0;
  text-align: right;
  font-size: 9.5px;
  color: var(--muted);
  border-top: 1px dotted var(--line);
  padding-top: 6px;
}
.mf__foot span {
  color: var(--ember);
}

@media (max-width: 760px) {
  .mf__lead {
    top: 16svh;
    transform: none;
    left: var(--gutter);
  }
  .mf__side {
    top: auto;
    bottom: 12svh;
    transform: none;
    right: var(--gutter);
    left: var(--gutter);
    max-width: none;
  }
  .mf__note {
    right: var(--gutter);
    bottom: 12svh;
  }
}
</style>
