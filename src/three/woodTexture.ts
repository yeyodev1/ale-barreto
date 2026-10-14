// Procedural rift-cut veneer, painted once on a canvas and used as colour + bump map.

export type FinishName = 'nogal' | 'roble' | 'negro'

export interface Finish {
  label: string
  dark: [number, number, number]
  light: [number, number, number]
  inlay: [number, number, number]
  roughness: number
  grain: number // how visible the figure is (0..1)
}

export const FINISHES: Record<FinishName, Finish> = {
  nogal: { label: 'Nogal', dark: [70, 38, 20], light: [150, 92, 52], inlay: [48, 26, 14], roughness: 0.5, grain: 1 },
  roble: { label: 'Roble', dark: [168, 122, 78], light: [226, 190, 146], inlay: [140, 98, 60], roughness: 0.58, grain: 0.75 },
  negro: { label: 'Negro mate', dark: [20, 19, 19], light: [42, 40, 39], inlay: [12, 12, 12], roughness: 0.82, grain: 0.35 },
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

function fbm(x: number, y: number) {
  let v = 0
  let amp = 0.5
  for (let i = 0; i < 4; i++) {
    v += amp * noise(x, y)
    x *= 2.03
    y *= 2.03
    amp *= 0.5
  }
  return v
}

export interface WoodMaps {
  color: HTMLCanvasElement
  bump: HTMLCanvasElement
}

/**
 * Paints a door-sized veneer panel (portrait). The inlay layout mirrors the studio's
 * walnut wardrobes: two horizontal bands near top and bottom plus vertical fillets.
 */
export function paintWood(finish: Finish, w = 512, h = 1024, seed = 3.7): WoodMaps {
  const color = document.createElement('canvas')
  const bump = document.createElement('canvas')
  color.width = bump.width = w
  color.height = bump.height = h
  const cctx = color.getContext('2d')!
  const bctx = bump.getContext('2d')!
  const cimg = cctx.createImageData(w, h)
  const bimg = bctx.createImageData(w, h)

  const [dr, dg, db] = finish.dark
  const [lr, lg, lb] = finish.light
  const [ir, ig, ib] = finish.inlay

  // inlay geometry in normalised units
  const bands = [0.13, 0.155, 0.845, 0.87]
  const fillets = [0.24, 0.76]
  const lineW = 0.006

  for (let y = 0; y < h; y++) {
    const v = y / h
    for (let x = 0; x < w; x++) {
      const u = x / w
      // book-matched leaves: mirror u inside each quarter so the figure repeats like real veneer
      const leaf = Math.floor(u * 4)
      const lu = leaf % 2 === 0 ? (u * 4) % 1 : 1 - ((u * 4) % 1)
      const warp = fbm(lu * 2.2 + seed, v * 0.9) * 2.4 + fbm(lu * 0.8, v * 3.5 + seed) * 0.5
      const g = lu * 9 + warp * 2.6
      const ring = Math.sin(g * Math.PI)
      const stripe = 0.5 + 0.5 * Math.sign(ring) * Math.pow(Math.abs(ring), 0.35)
      const broad = fbm(lu * 1.3 + seed * 2, v * 0.5)
      const fiber = noise(u * 380, v * 5 + seed) * 0.55 + noise(u * 1100, v * 12) * 0.45
      const leafTone = 0.94 + hash(leaf, seed) * 0.1
      let t = (stripe * 0.32 + broad * 0.68) * finish.grain + (1 - finish.grain) * 0.5
      t = Math.min(1, Math.max(0, t * leafTone + (fiber - 0.5) * 0.28 * Math.max(0.4, finish.grain)))

      let r = dr + (lr - dr) * t
      let gg = dg + (lg - dg) * t
      let b = db + (lb - db) * t
      let height = 150 + (fiber - 0.5) * 70 * finish.grain

      // cross-grain bands between the two band lines (veneer turned 90°)
      const inTopBand = v > bands[0] && v < bands[1]
      const inBotBand = v > bands[2] && v < bands[3]
      if (inTopBand || inBotBand) {
        const cg = fbm(v * 160, u * 2 + seed)
        const k = 0.78 + cg * 0.25
        r *= k
        gg *= k
        b *= k
      }

      // inlay lines (recessed, darker)
      let line = false
      for (const by of bands) if (Math.abs(v - by) < lineW * 0.5) line = true
      const inField = v < bands[0] || v > bands[3]
      for (const fx of fillets) if (inField && Math.abs(u - fx) < lineW) line = true
      if (line) {
        r = ir
        gg = ig
        b = ib
        height = 40
      }

      const i = (y * w + x) * 4
      cimg.data[i] = r
      cimg.data[i + 1] = gg
      cimg.data[i + 2] = b
      cimg.data[i + 3] = 255
      bimg.data[i] = bimg.data[i + 1] = bimg.data[i + 2] = height
      bimg.data[i + 3] = 255
    }
  }

  cctx.putImageData(cimg, 0, 0)
  bctx.putImageData(bimg, 0, 0)
  return { color, bump }
}
