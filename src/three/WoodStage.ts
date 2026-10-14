import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { FINISHES, paintWood, type FinishName } from './woodTexture'

/** Values driven from GSAP. The stage reads them every frame. */
export interface PanelState {
  rx: number
  ry: number
  rz: number
  x: number
  y: number
  z: number
  scale: number
  light: number
}

const mapCache = new Map<FinishName, { color: THREE.CanvasTexture; bump: THREE.CanvasTexture }>()

function getMaps(name: FinishName, anisotropy: number) {
  let maps = mapCache.get(name)
  if (!maps) {
    const painted = paintWood(FINISHES[name])
    const color = new THREE.CanvasTexture(painted.color)
    color.colorSpace = THREE.SRGBColorSpace
    color.anisotropy = anisotropy
    const bump = new THREE.CanvasTexture(painted.bump)
    bump.anisotropy = anisotropy
    maps = { color, bump }
    mapCache.set(name, maps)
  }
  return maps
}

export class WoodStage {
  readonly state: PanelState = { rx: 0, ry: 0, rz: 0, x: 0, y: 0, z: 0, scale: 1, light: 1 }
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private panel: THREE.Mesh<RoundedBoxGeometry, THREE.MeshPhysicalMaterial>
  private key: THREE.SpotLight
  private rim: THREE.PointLight
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  private raf = 0
  private visible = false
  private io: IntersectionObserver
  private ro: ResizeObserver
  private t0 = performance.now()
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, finish: FinishName = 'nogal') {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
    this.camera.position.set(0, 0, 9)

    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    this.scene.environmentIntensity = 0.35

    const maps = getMaps(finish, this.renderer.capabilities.getMaxAnisotropy())
    const material = new THREE.MeshPhysicalMaterial({
      map: maps.color,
      bumpMap: maps.bump,
      bumpScale: 1.6,
      roughness: FINISHES[finish].roughness,
      clearcoat: 0.25,
      clearcoatRoughness: 0.45,
      sheen: 0.4,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color('#ffd2a6'),
    })
    // Edge banding: the side faces get a slightly darker tone of the same material.
    const geometry = new RoundedBoxGeometry(1.5, 2.9, 0.16, 4, 0.025)
    this.panel = new THREE.Mesh(geometry, material)
    this.scene.add(this.panel)

    this.key = new THREE.SpotLight('#ffd9b0', 160, 30, 0.5, 0.7, 1.6)
    this.key.position.set(-4.5, 5, 6)
    this.scene.add(this.key)

    const fill = new THREE.DirectionalLight('#8aa0c0', 0.25)
    fill.position.set(5, -2, 4)
    this.scene.add(fill)

    this.rim = new THREE.PointLight('#ff8a3d', 40, 14, 1.8)
    this.rim.position.set(3, 1.5, -2.5)
    this.scene.add(this.rim)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas)
    this.resize()

    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible) this.loop()
      else cancelAnimationFrame(this.raf)
    })
    this.io.observe(canvas)

    window.addEventListener('pointermove', this.onPointer, { passive: true })
  }

  setFinish(name: FinishName) {
    const maps = getMaps(name, this.renderer.capabilities.getMaxAnisotropy())
    const m = this.panel.material
    m.map = maps.color
    m.bumpMap = maps.bump
    m.roughness = FINISHES[name].roughness
    m.clearcoat = name === 'negro' ? 0.05 : 0.25
    m.needsUpdate = true
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    // keep the panel framed on narrow screens
    this.camera.position.z = w / h < 0.8 ? 12.5 : 9
    this.camera.updateProjectionMatrix()
    this.render()
  }

  private loop = () => {
    if (!this.visible) return
    this.raf = requestAnimationFrame(this.loop)
    this.render()
  }

  private render() {
    const t = (performance.now() - this.t0) / 1000
    const p = this.pointer
    p.x += (p.tx - p.x) * 0.05
    p.y += (p.ty - p.y) * 0.05
    const s = this.state
    this.panel.rotation.set(s.rx + p.y * 0.08 + Math.sin(t * 0.6) * 0.02, s.ry + p.x * 0.14, s.rz)
    this.panel.position.set(s.x, s.y + Math.sin(t * 0.8) * 0.04, s.z)
    this.panel.scale.setScalar(s.scale)
    this.key.intensity = 160 * s.light
    this.rim.intensity = 40 * s.light
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.io.disconnect()
    this.ro.disconnect()
    window.removeEventListener('pointermove', this.onPointer)
    this.panel.geometry.dispose()
    this.panel.material.dispose()
    this.renderer.dispose()
  }
}
