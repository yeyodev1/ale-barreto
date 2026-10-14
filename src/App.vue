<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppPreloader from './components/AppPreloader.vue'
import AppNav from './components/AppNav.vue'
import HeroSection from './components/HeroSection.vue'
import ManifestoSection from './components/ManifestoSection.vue'
import PrecisionGallery from './components/PrecisionGallery.vue'
import FeaturePanels from './components/FeaturePanels.vue'
import MaterialSection from './components/MaterialSection.vue'
import ProjectsRail from './components/ProjectsRail.vue'
import FinishPicker from './components/FinishPicker.vue'
import ProcessSection from './components/ProcessSection.vue'
import ContactSection from './components/ContactSection.vue'
import { initSmoothScroll, ScrollTrigger, startScroll, stopScroll } from './composables/useSmoothScroll'

const ready = ref(false)

onMounted(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  initSmoothScroll()
  stopScroll()
})

function onLoaded() {
  ready.value = true
  startScroll()
  ScrollTrigger.refresh()
}
</script>

<template>
  <AppPreloader @done="onLoaded" />
  <AppNav />
  <main>
    <HeroSection :ready="ready" />
    <ManifestoSection />
    <PrecisionGallery />
    <FeaturePanels />
    <MaterialSection />
    <ProjectsRail />
    <FinishPicker />
    <ProcessSection />
    <ContactSection />
  </main>
  <div class="grain" aria-hidden="true" />
</template>
