<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ScrollTrigger, scrollTo } from '../composables/useSmoothScroll'

const links = [
  { id: 'intro', label: 'Intro' },
  { id: 'detalles', label: 'Detalles' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'contacto', label: 'Contacto' },
]

const active = ref('intro')
const progress = ref(0)
let triggers: ScrollTrigger[] = []

onMounted(() => {
  requestAnimationFrame(() => {
    triggers = links.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && (active.value = id),
      }),
    )
    triggers.push(
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => (progress.value = self.progress),
      }),
    )
  })
})

onBeforeUnmount(() => triggers.forEach((t) => t.kill()))
</script>

<template>
  <header class="nav">
    <a href="#intro" class="nav__brand" aria-label="Ale Barreto Studio, inicio" @click.prevent="scrollTo(0)">
      ALE BARRETO<span class="nav__studio">studio</span>
    </a>
    <nav aria-label="Secciones">
      <ul class="nav__links">
        <li v-for="l in links" :key="l.id">
          <a
            :href="`#${l.id}`"
            class="caps"
            :class="{ 'is-active': active === l.id }"
            :aria-current="active === l.id ? 'true' : undefined"
            @click.prevent="scrollTo(`#${l.id}`)"
          >{{ l.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
  <div class="rail" aria-hidden="true">
    <div class="rail__thumb" :style="{ transform: `translateY(${progress * (100 / 0.16 - 100)}%)` }" />
  </div>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px var(--gutter);
  color: var(--cream);
  mix-blend-mode: difference;
}
.nav__brand {
  font-family: var(--display);
  font-variation-settings: 'wdth' 118;
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.02em;
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.nav__studio {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: 17px;
  letter-spacing: 0;
}
.nav__links {
  display: flex;
  gap: 22px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav__links a {
  position: relative;
  padding: 4px 0;
  opacity: 0.85;
  transition: opacity 0.3s;
}
.nav__links a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-image: linear-gradient(90deg, currentColor 50%, transparent 0);
  background-size: 3px 1px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease-out);
}
.nav__links a:hover,
.nav__links a.is-active {
  opacity: 1;
}
.nav__links a:hover::after,
.nav__links a.is-active::after {
  transform: scaleX(1);
}

.rail {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  z-index: 50;
  pointer-events: none;
}
.rail__thumb {
  height: 16%;
  width: 100%;
  background: var(--cream);
  border-radius: 3px 0 0 3px;
  opacity: 0.9;
  mix-blend-mode: difference;
}

@media (max-width: 640px) {
  .nav__links {
    gap: 14px;
  }
  .nav__links li:nth-child(2) {
    display: none;
  }
  .nav__brand {
    font-size: 14px;
  }
  .nav__studio {
    display: none;
  }
}
</style>
