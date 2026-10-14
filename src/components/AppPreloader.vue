<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '../composables/useSmoothScroll'

const emit = defineEmits<{ done: [] }>()
const root = ref<HTMLElement | null>(null)
const count = ref(0)

const critical = ['/img/hero.webp', '/img/closet-walnut.webp', '/img/wall-oak.webp']

function load(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = img.onerror = () => resolve()
    img.src = src
  })
}

onMounted(async () => {
  const counter = { v: 0 }
  let loaded = 0
  const total = critical.length + 1
  const bump = () => {
    loaded++
    gsap.to(counter, { v: (loaded / total) * 100, duration: 0.8, ease: 'power2.out', onUpdate: () => (count.value = Math.round(counter.v)) })
  }
  const minTime = new Promise((r) => setTimeout(r, prefersReducedMotion() ? 200 : 1400))
  await Promise.all([...critical.map((s) => load(s).then(bump)), document.fonts.ready.then(bump), minTime])
  await gsap.to(counter, { v: 100, duration: 0.4, onUpdate: () => (count.value = Math.round(counter.v)) })

  const tl = gsap.timeline()
  tl.to('.pre__meta, .pre__count', { yPercent: -110, duration: 0.7, ease: 'power3.in', stagger: 0.05 })
    .to('.pre__bar', { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '<')
    .to('.pre__shutter', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: 0.08 }, '-=0.1')
    .call(() => emit('done'), [], '-=0.7')
    .set(root.value, { display: 'none' })
})
</script>

<template>
  <div ref="root" class="pre" aria-hidden="true">
    <div class="pre__shutter" />
    <div class="pre__shutter pre__shutter--2">
      <div class="pre__inner">
        <div class="pre__clip"><p class="pre__meta caps">Ale Barreto Studio — Carpintería a medida</p></div>
        <div class="pre__clip">
          <p class="pre__count display">{{ String(count).padStart(3, '0') }}</p>
        </div>
        <div class="pre__track"><div class="pre__bar" :style="{ transform: `scaleX(${count / 100})` }" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pre {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}
.pre__shutter {
  position: absolute;
  inset: 0;
  background: var(--ember);
}
.pre__shutter--2 {
  background: var(--ink);
}
.pre__inner {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: var(--gutter);
}
.pre__clip {
  overflow: hidden;
}
.pre__meta {
  color: var(--muted);
  margin: 0 0 8px;
}
.pre__count {
  margin: 0;
  font-size: clamp(96px, 22vw, 340px);
  color: var(--cream);
  line-height: 0.82;
}
.pre__track {
  margin-top: 18px;
  height: 1px;
  background: var(--line);
}
.pre__bar {
  height: 100%;
  background: var(--cream);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}
</style>
