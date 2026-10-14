<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap } from '../composables/useSmoothScroll'
import { WoodStage } from '../three/WoodStage'
import { FINISHES, type FinishName } from '../three/woodTexture'

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const finish = ref<FinishName>('nogal')
const names = Object.keys(FINISHES) as FinishName[]
const notes: Record<FinishName, string> = {
  nogal: 'Cálido y profundo. El favorito para clósets y walk-ins.',
  roble: 'Claro, luminoso y sereno. Ideal para paredes y escaleras.',
  negro: 'Mate y silencioso. Para cocinas y dormitorios con carácter.',
}
let stage: WoodStage | undefined

useGsap(root, () => {
  stage = new WoodStage(canvas.value!, finish.value)
  Object.assign(stage.state, { rx: -0.1, ry: -0.5, rz: 0.08, y: -0.15, scale: 0.86 })
  gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    .fromTo(stage.state, { ry: -1.2 }, { ry: 0.9, ease: 'none' })
  gsap.fromTo('.fk__title', { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.value, start: 'top 55%' } })
})

function pick(name: FinishName) {
  if (!stage || name === finish.value) return
  finish.value = name
  const s = stage.state
  gsap.timeline()
    .to(s, { scale: 0.8, rz: s.rz + 0.12, duration: 0.25, ease: 'power2.in' })
    .call(() => stage?.setFinish(name))
    .to(s, { scale: 0.86, rz: 0.08, duration: 0.9, ease: 'elastic.out(1, 0.6)' })
}

onBeforeUnmount(() => stage?.dispose())
</script>

<template>
  <section ref="root" class="fk" aria-labelledby="fk-title">
    <p class="fk__kicker caps">Elige tu acabado</p>
    <h2 id="fk-title" class="fk__title display">Tu madera</h2>
    <canvas ref="canvas" class="fk__canvas" aria-hidden="true" />

    <div class="fk__controls">
      <div class="fk__pills" role="radiogroup" aria-label="Acabado">
        <button
          v-for="n in names"
          :key="n"
          type="button"
          role="radio"
          class="fk__pill caps"
          :aria-checked="finish === n"
          :class="{ on: finish === n }"
          @click="pick(n)"
        >
          <span class="fk__swatch" :style="{ background: `rgb(${FINISHES[n].light.join(',')})` }" />
          {{ FINISHES[n].label }}
        </button>
      </div>
      <p class="fk__note" aria-live="polite">{{ notes[finish] }}</p>
    </div>
  </section>
</template>

<style scoped>
.fk {
  position: relative;
  height: 100svh;
  min-height: 640px;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 60%, #2b1f16 0%, var(--ink) 65%);
  display: grid;
  place-items: center;
}
.fk__kicker {
  position: absolute;
  top: 22%;
  margin: 0;
}
.fk__title {
  position: absolute;
  top: 25%;
  margin: 0;
  font-size: clamp(40px, 12.5vw, 240px);
  white-space: nowrap;
  color: var(--cream);
}
.fk__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.fk__controls {
  position: absolute;
  bottom: 9svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 0 var(--gutter);
}
.fk__pills {
  display: flex;
  gap: 6px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(242, 230, 212, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid var(--line);
}
.fk__pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  transition: background 0.4s var(--ease-out), color 0.4s var(--ease-out);
}
.fk__pill.on {
  background: var(--cream);
  color: var(--ink);
}
.fk__pill:not(.on):hover {
  background: rgba(242, 230, 212, 0.12);
}
.fk__swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}
.fk__note {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  min-height: 1.4em;
}
</style>
