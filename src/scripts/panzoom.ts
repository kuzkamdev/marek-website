// Proste przesuwanie i przybliżanie „świata” wewnątrz okna (viewport).
// Bez zewnętrznych bibliotek: pointer events (mysz, dotyk, pióro), kółko myszy i gest szczypania.

export interface PanZoomOptions {
  minScale?: number;
  maxScale?: number;
  // Ile pikseli ruchu odróżnia przeciągnięcie od kliknięcia.
  dragThreshold?: number;
}

interface Point {
  x: number;
  y: number;
}

export class PanZoom {
  readonly viewport: HTMLElement;
  readonly world: HTMLElement;
  readonly worldWidth: number;
  readonly worldHeight: number;

  x = 0;
  y = 0;
  scale = 1;

  private minScale: number;
  private maxScale: number;
  private dragThreshold: number;
  private pointers = new Map<number, Point>();
  private dragStart: Point | null = null;
  private moved = false;
  private pinchStart: { distance: number; scale: number; center: Point } | null = null;
  private listeners = new Set<() => void>();

  constructor(viewport: HTMLElement, world: HTMLElement, options: PanZoomOptions = {}) {
    this.viewport = viewport;
    this.world = world;
    this.worldWidth = world.offsetWidth;
    this.worldHeight = world.offsetHeight;
    this.minScale = options.minScale ?? 0.2;
    this.maxScale = options.maxScale ?? 2.5;
    this.dragThreshold = options.dragThreshold ?? 6;

    viewport.addEventListener('pointerdown', this.onPointerDown);
    viewport.addEventListener('pointermove', this.onPointerMove);
    viewport.addEventListener('pointerup', this.onPointerUp);
    viewport.addEventListener('pointercancel', this.onPointerUp);
    viewport.addEventListener('wheel', this.onWheel, { passive: false });
    // Kliknięcie po przeciągnięciu nie może otwierać miejsca na mapie.
    viewport.addEventListener('click', this.onClickCapture, true);
    window.addEventListener('resize', () => this.clampAndApply());
  }

  /** Najmniejsza skala, przy której cały świat mieści się w oknie. */
  fitScale(): number {
    const { width, height } = this.viewport.getBoundingClientRect();
    return Math.min(width / this.worldWidth, height / this.worldHeight);
  }

  /** Pokazuje cały świat, wyśrodkowany. */
  fit(animate = false): void {
    const s = this.clampScale(this.fitScale());
    this.centerOn(this.worldWidth / 2, this.worldHeight / 2, s, animate);
  }

  /** Ustawia punkt świata (wx, wy) na środku okna w danej skali. */
  centerOn(wx: number, wy: number, scale = this.scale, animate = false): void {
    const { width, height } = this.viewport.getBoundingClientRect();
    this.scale = this.clampScale(scale);
    this.x = width / 2 - wx * this.scale;
    this.y = height / 2 - wy * this.scale;
    this.clampAndApply(animate);
  }

  /** Przybliża o współczynnik wokół punktu okna (domyślnie środek). */
  zoomBy(factor: number, origin?: Point, animate = false): void {
    const rect = this.viewport.getBoundingClientRect();
    const ox = origin ? origin.x - rect.left : rect.width / 2;
    const oy = origin ? origin.y - rect.top : rect.height / 2;
    const next = this.clampScale(this.scale * factor);
    const ratio = next / this.scale;
    this.x = ox - (ox - this.x) * ratio;
    this.y = oy - (oy - this.y) * ratio;
    this.scale = next;
    this.clampAndApply(animate);
  }

  panBy(dx: number, dy: number, animate = false): void {
    this.x += dx;
    this.y += dy;
    this.clampAndApply(animate);
  }

  onChange(listener: () => void): void {
    this.listeners.add(listener);
  }

  private clampScale(s: number): number {
    const min = Math.min(this.minScale, this.fitScale());
    return Math.min(this.maxScale, Math.max(min, s));
  }

  // Świat nie może uciec z okna: krawędź można przeciągnąć najwyżej o OVERSCROLL szerokości
  // okna do środka. Ten zapas pozwala też pokazać miejsce przy brzegu nad otwartą kartą.
  private clampAndApply(animate = false): void {
    const { width, height } = this.viewport.getBoundingClientRect();
    this.x = clampAxis(this.x, width, this.worldWidth * this.scale);
    this.y = clampAxis(this.y, height, this.worldHeight * this.scale);
    this.apply(animate);
  }

  private apply(animate: boolean): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.world.classList.toggle('is-animating', animate && !reduceMotion);
    this.world.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    this.world.dataset.scale = this.scale.toFixed(3);
    this.listeners.forEach((l) => l());
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) {
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.moved = false;
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinchStart = { distance: distance(a, b), scale: this.scale, center: midpoint(a, b) };
      this.moved = true;
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    const prev = this.pointers.get(e.pointerId);
    if (!prev) return;
    const current = { x: e.clientX, y: e.clientY };
    this.pointers.set(e.pointerId, current);

    if (this.pointers.size === 2 && this.pinchStart) {
      const [a, b] = [...this.pointers.values()];
      const target = this.pinchStart.scale * (distance(a, b) / this.pinchStart.distance);
      const center = midpoint(a, b);
      this.zoomBy(target / this.scale, center);
      return;
    }

    if (this.pointers.size === 1 && this.dragStart) {
      if (
        !this.moved &&
        Math.hypot(current.x - this.dragStart.x, current.y - this.dragStart.y) > this.dragThreshold
      ) {
        this.moved = true;
        this.viewport.setPointerCapture(e.pointerId);
        this.viewport.classList.add('is-dragging');
      }
      if (this.moved) this.panBy(current.x - prev.x, current.y - prev.y);
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinchStart = null;
    if (this.pointers.size === 0) {
      this.dragStart = null;
      this.viewport.classList.remove('is-dragging');
    }
  };

  private onClickCapture = (e: MouseEvent): void => {
    if (this.moved) {
      e.preventDefault();
      e.stopPropagation();
      this.moved = false;
    }
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.zoomBy(Math.exp(-e.deltaY * 0.0015), { x: e.clientX, y: e.clientY });
  };
}

const OVERSCROLL = 0.4;

function clampAxis(pos: number, view: number, size: number): number {
  const lo = Math.min(0, view - size) - view * OVERSCROLL;
  const hi = Math.max(0, view - size) + view * OVERSCROLL;
  return Math.min(hi, Math.max(lo, pos));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
