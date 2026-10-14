<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useGsap } from '../composables/useGsap'
import { gsap, prefersReducedMotion } from '../composables/useSmoothScroll'
import { site, waLink } from '../data/site'

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const form = reactive({ name: '', type: 'Clóset', message: '' })
const types = ['Clóset', 'Cocina', 'Dormitorio', 'Revestimiento', 'Puertas', 'Otro']
const copied = ref(false)

function submit() {
  const text = `Hola, soy ${form.name || '—'}. Me interesa un proyecto de: ${form.type}.\n${form.message}`.trim()
  window.open(waLink(text), '_blank', 'noopener')
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* clipboard blocked: nothing to do */
  }
}

useGsap(root, () => {
  gsap.fromTo('.ct__line', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.ct__statement', start: 'top 75%' } })
  gsap.fromTo('.ct__fade', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.ct__statement', start: 'top 55%' } })
})

// Falling wood shavings
let raf = 0
let io: IntersectionObserver | undefined
let onResize: (() => void) | undefined
onMounted(() => {
  const c = canvas.value!
  const ctx = c.getContext('2d')!
  const dpr = Math.min(window.devicePixelRatio, 2)
  const palette = ['#6e4024', '#8a5530', '#b07a4a', '#d6b48a', '#4a2a17']
  let w = 0
  let h = 0
  const resize = () => {
    w = c.clientWidth
    h = c.clientHeight
    c.width = w * dpr
    c.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  onResize = resize
  window.addEventListener('resize', resize)
  const count = w < 700 ? 26 : 60
  const flakes = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: 0.3 + Math.random() * 0.9,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.02,
    len: 6 + Math.random() * 16,
    c: palette[(Math.random() * palette.length) | 0],
    sway: Math.random() * 10,
  }))
  const reduced = prefersReducedMotion()
  let running = false
  const tick = (t: number) => {
    ctx.clearRect(0, 0, w, h)
    for (const f of flakes) {
      if (!reduced) {
        f.y += 0.35 * f.z
        f.x += Math.sin(t * 0.0006 + f.sway) * 0.25 * f.z
        f.r += f.vr
        if (f.y > h + 20) {
          f.y = -20
          f.x = Math.random() * w
        }
      }
      ctx.save()
      ctx.translate(f.x, f.y)
      ctx.rotate(f.r)
      // fake 3D tumble: squash the chip along x as it spins
      ctx.scale(Math.max(0.12, Math.abs(Math.cos(f.r * 3 + f.sway))), 1)
      ctx.globalAlpha = 0.3 + f.z * 0.55
      ctx.fillStyle = f.c
      ctx.beginPath()
      ctx.roundRect(-f.len * 0.22 * f.z, -f.len * 0.5 * f.z, f.len * 0.44 * f.z, f.len * f.z, f.len * 0.2 * f.z)
      ctx.fill()
      ctx.fillStyle = 'rgba(255, 220, 180, 0.18)'
      ctx.fillRect(-f.len * 0.04 * f.z, -f.len * 0.42 * f.z, f.len * 0.05 * f.z, f.len * 0.84 * f.z)
      ctx.restore()
    }
    if (running && !reduced) raf = requestAnimationFrame(tick)
  }
  io = new IntersectionObserver(([e]) => {
    running = e.isIntersecting
    cancelAnimationFrame(raf)
    if (running) raf = requestAnimationFrame(tick)
  })
  io.observe(c)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  io?.disconnect()
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section id="contacto" ref="root" class="ct">
    <canvas ref="canvas" class="ct__canvas" aria-hidden="true" />

    <div class="ct__mark display" aria-hidden="true">AB</div>

    <div class="ct__statement">
      <h2 class="ct__h display">
        <span class="ct__m"><span class="ct__line">Si podemos esconder</span></span>
        <span class="ct__m"><span class="ct__line">una puerta en una pared,</span></span>
      </h2>
      <p class="ct__h ct__h--2 display">
        <span class="ct__m"><span class="ct__line">imagina lo que haremos</span></span>
        <span class="ct__m"><span class="ct__line">con tu casa.</span></span>
      </p>
      <a :href="waLink('Hola, quiero cotizar un proyecto a medida.')" target="_blank" rel="noopener" class="ct__cta caps ct__fade">Escríbenos por WhatsApp</a>
    </div>

    <div class="ct__bottom">
      <div class="ct__card ct__fade">
        <p class="caps ct__card-k">Hecho a medida <span>♥</span><br />en {{ site.city }}</p>
        <p class="caps">Comparte con alguien<br />que está remodelando</p>
        <button type="button" class="ct__copy caps" @click="copyUrl">{{ copied ? 'Copiado' : 'Copiar URL' }}</button>
      </div>

      <form class="ct__form ct__fade" @submit.prevent="submit">
        <p class="caps ct__form-k">Cuéntanos tu proyecto</p>
        <label class="sr-only" for="ct-name">Tu nombre</label>
        <input id="ct-name" v-model="form.name" class="ct__input" type="text" placeholder="Tu nombre" autocomplete="name" />
        <div class="ct__types" role="radiogroup" aria-label="Tipo de proyecto">
          <button
            v-for="t in types"
            :key="t"
            type="button"
            role="radio"
            :aria-checked="form.type === t"
            class="ct__type caps"
            :class="{ on: form.type === t }"
            @click="form.type = t"
          >{{ t }}</button>
        </div>
        <label class="sr-only" for="ct-msg">Mensaje</label>
        <div class="ct__row">
          <input id="ct-msg" v-model="form.message" class="ct__input" type="text" placeholder="Medidas, ciudad, idea…" />
          <button type="submit" class="ct__send" aria-label="Enviar por WhatsApp">→</button>
        </div>
      </form>

      <div class="ct__links ct__fade">
        <div>
          <p class="caps ct__muted">Proyectos nuevos</p>
          <a class="caps" :href="`mailto:${site.email}`">{{ site.email }}</a>
        </div>
        <div>
          <p class="caps ct__muted">Síguenos</p>
          <a class="caps" :href="site.instagram" target="_blank" rel="noopener">Instagram {{ site.instagramHandle }}</a>
        </div>
      </div>
    </div>

    <footer class="ct__foot caps">
      <span>© {{ new Date().getFullYear() }} {{ site.name }}</span>
      <span class="ct__muted">Clósets · Cocinas · Dormitorios · Revestimientos · Puertas</span>
    </footer>
  </section>
</template>

<style scoped>
.ct {
  position: relative;
  min-height: 100svh;
  background: #0e0a07;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 120px var(--gutter) 22px;
}
.ct__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.ct__mark {
  position: absolute;
  left: 32%;
  top: 130px;
  font-size: 64px;
  line-height: 0.8;
  color: var(--cream);
}
.ct__statement {
  position: relative;
  align-self: flex-end;
  text-align: right;
  max-width: 820px;
}
.ct__h {
  margin: 0;
  font-size: clamp(26px, 3.2vw, 50px);
  line-height: 0.98;
  letter-spacing: -0.03em;
}
.ct__h--2 {
  margin-top: 26px;
  padding-left: 40px;
}
.ct__m {
  display: block;
  overflow: hidden;
}
.ct__line {
  display: block;
}
.ct__cta {
  display: inline-block;
  margin-top: 36px;
  padding: 14px 22px;
  border-radius: 999px;
  background: var(--ember);
  color: var(--ink);
  transition: background 0.4s var(--ease-out), transform 0.4s var(--ease-out);
}
.ct__cta:hover {
  background: var(--cream);
  transform: translateY(-2px);
}

.ct__bottom {
  position: relative;
  margin-top: auto;
  padding-top: 90px;
  display: grid;
  grid-template-columns: 240px 1fr 260px;
  gap: 48px;
  align-items: end;
}
.ct__card {
  border: 1px dashed var(--line);
  padding: 16px;
  display: grid;
  gap: 12px;
  font-size: 10px;
}
.ct__card p {
  margin: 0;
}
.ct__card-k {
  color: var(--ember);
}
.ct__copy {
  justify-self: end;
  padding: 7px 12px;
  border: 1px dotted var(--cream);
  border-radius: 999px;
  font-size: 9.5px;
}
.ct__form {
  display: grid;
  gap: 14px;
  max-width: 520px;
}
.ct__form-k {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
}
.ct__input {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--line);
  color: var(--cream);
  font: inherit;
  font-size: 14px;
  padding: 10px 0;
  outline: none;
  transition: border-color 0.3s;
}
.ct__input:focus {
  border-color: var(--cream);
}
.ct__input::placeholder {
  color: var(--muted);
}
.ct__types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ct__type {
  padding: 7px 11px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 10px;
  transition: background 0.3s, color 0.3s;
}
.ct__type.on {
  background: var(--cream);
  color: var(--ink);
}
.ct__row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.ct__send {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--cream);
  font-size: 18px;
  transition: background 0.3s, color 0.3s;
}
.ct__send:hover {
  background: var(--cream);
  color: var(--ink);
}
.ct__links {
  display: grid;
  gap: 20px;
}
.ct__links p {
  margin: 0 0 4px;
}
.ct__links a:hover {
  color: var(--ember);
}
.ct__muted {
  color: var(--muted);
}
.ct__foot {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 60px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 10px;
}

@media (max-width: 960px) {
  .ct__bottom {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .ct__mark {
    left: var(--gutter);
    top: 90px;
    font-size: 44px;
  }
  .ct__statement {
    margin-top: 80px;
  }
}
</style>
