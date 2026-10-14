import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from './useSmoothScroll'

/** Runs `setup` inside a gsap.context scoped to `root`, reverted on unmount. */
export function useGsap(root: Ref<HTMLElement | null>, setup: (self: gsap.Context) => void) {
  let ctx: gsap.Context | undefined
  onMounted(() => {
    if (!root.value) return
    ctx = gsap.context(setup, root.value)
  })
  onBeforeUnmount(() => ctx?.revert())
}
