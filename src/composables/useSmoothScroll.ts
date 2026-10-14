import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis
  return lenis
}

export function scrollTo(target: string | number | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else if (typeof target === 'number') window.scrollTo({ top: target })
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView()
}

export function stopScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function startScroll() {
  lenis?.start()
  document.documentElement.style.overflow = ''
}

export { gsap, ScrollTrigger }
