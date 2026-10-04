import { WORLD_HEIGHT, WORLD_WIDTH, placePositions } from './places';

// Geometria wyspy liczona w czasie budowania (deterministycznie, z ziarnem),
// więc przeglądarka dostaje gotowe ścieżki SVG bez żadnych obliczeń.

type Pt = [number, number];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Okresowy „szum” na okręgu: suma harmonicznych z losowymi fazami. */
function radialNoise(seed: number, harmonics: number[], amps: number[]) {
  const r = rng(seed);
  const phases = harmonics.map(() => r() * Math.PI * 2);
  return (theta: number) =>
    1 + harmonics.reduce((s, k, i) => s + amps[i] * Math.sin(k * theta + phases[i]), 0);
}

/** Zamknięta, gładka ścieżka (Catmull-Rom → krzywe Béziera). */
function smoothClosed(points: Pt[]): string {
  const n = points.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d} Z`;
}

interface Blob {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  noise: (t: number) => number;
}

const STEPS = 140;

function blobPoints(b: Blob, scale = 1, detail?: (t: number) => number): Pt[] {
  return Array.from({ length: STEPS }, (_, i) => {
    const t = (i / STEPS) * Math.PI * 2;
    const r = b.noise(t) * scale * (detail ? detail(t) : 1);
    return [b.cx + Math.cos(t) * b.rx * r, b.cy + Math.sin(t) * b.ry * r] as Pt;
  });
}

function inside(points: Pt[], [x, y]: Pt): boolean {
  let c = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function distToSegment([px, py]: Pt, [ax, ay]: Pt, [bx, by]: Pt): number {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// --- Wyspa ---
const island: Blob = {
  cx: 805,
  cy: 505,
  rx: 590,
  ry: 360,
  noise: radialNoise(7, [2, 3, 5, 7], [0.06, 0.05, 0.035, 0.02]),
};
// Drobne nieregularności linii brzegowej (zatoczki, cyple).
const coastDetail = radialNoise(11, [13, 19, 29], [0.018, 0.012, 0.008]);

const coast = blobPoints(island, 1, coastDetail);

export const islandShape = {
  shelfDeep: smoothClosed(blobPoints(island, 1.32)),
  shelf: smoothClosed(blobPoints(island, 1.16, coastDetail)),
  surf: smoothClosed(blobPoints(island, 1.035, coastDetail)),
  beach: smoothClosed(coast),
  grass: smoothClosed(blobPoints(island, 0.94, coastDetail)),
  meadow: smoothClosed(blobPoints(island, 0.8, radialNoise(17, [3, 4], [0.07, 0.05]))),
  isobaths: [1.5, 1.72, 1.98].map((s) => smoothClosed(blobPoints(island, s))),
};

// --- Góra (warstwice) między Hobby i Doświadczeniem ---
const mountain: Blob = {
  cx: 745,
  cy: 245,
  rx: 150,
  ry: 72,
  noise: radialNoise(23, [2, 3, 5], [0.08, 0.06, 0.04]),
};
// Każda wyższa warstwa jest mniejsza i przesunięta w górę, co daje wrażenie bryły.
export const mountainLayers = [1, 0.74, 0.5, 0.3, 0.14].map((s, i) =>
  smoothClosed(blobPoints({ ...mountain, cx: mountain.cx - i * 6, cy: mountain.cy - i * 9 }, s)),
);
const mountainCore = blobPoints(mountain, 1.05);

/** Szczyty rysowane na warstwicach: [x podstawy, y podstawy, szerokość, wysokość]. */
export const peaks: [number, number, number, number][] = [
  [672, 262, 70, 62],
  [812, 258, 76, 70],
  [740, 252, 96, 104],
];

// --- Jezioro i rzeka ---
const lake: Blob = {
  cx: 1110,
  cy: 445,
  rx: 70,
  ry: 40,
  noise: radialNoise(31, [2, 3], [0.1, 0.06]),
};
export const lakeShape = {
  shore: smoothClosed(blobPoints(lake, 1.18)),
  water: smoothClosed(blobPoints(lake, 1)),
};
const lakeArea = blobPoints(lake, 1.4);
export const riverPath = 'M1175,452 C1215,470 1240,440 1280,455 S1350,480 1395,470';

// --- Ścieżka między miejscami (ta sama kolejność co w grafice) ---
export const routeOrder = ['hobbies', 'experience', 'about', 'projects', 'contact'] as const;
const routePts: Pt[] = routeOrder.map((id) => {
  const p = placePositions.find((pl) => pl.id === id)!;
  return [p.x, p.y + 40];
});

/** Ścieżka jako łagodna krzywa przez wszystkie miejsca. */
export const routePath = (() => {
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(routePts[0][0])},${f(routePts[0][1])}`;
  for (let i = 0; i < routePts.length - 1; i++) {
    const p0 = routePts[Math.max(0, i - 1)];
    const p1 = routePts[i];
    const p2 = routePts[i + 1];
    const p3 = routePts[Math.min(routePts.length - 1, i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
})();

// --- Drzewa: losowane w obrębie trawy, z dala od miejsc, ścieżki, góry i jeziora ---
export interface Tree {
  x: number;
  y: number;
  s: number;
  kind: 'pine' | 'round';
  tone: number;
}

const grassPts = blobPoints(island, 0.9, coastDetail);
const placePts: Pt[] = placePositions.map((p) => [p.x, p.y]);
// Miejsca na budynki obok znaczników (patrz landmarks w IslandArt).
const landmarkPts: Pt[] = [
  [735, 430],
  [1075, 290],
  [1275, 585],
  [520, 228],
  [455, 845],
];

function clearOf(pt: Pt): boolean {
  if (!inside(grassPts, pt)) return false;
  if (inside(mountainCore, pt) || inside(lakeArea, pt)) return false;
  if (placePts.some(([x, y]) => Math.hypot(pt[0] - x, pt[1] - y) < 95)) return false;
  if (landmarkPts.some(([x, y]) => Math.hypot(pt[0] - x, pt[1] - y) < 70)) return false;
  for (let i = 0; i < routePts.length - 1; i++) {
    if (distToSegment(pt, routePts[i], routePts[i + 1]) < 38) return false;
  }
  return true;
}

// Skupiska lasu: drzewa gęstnieją wokół kilku „środków lasu”.
const groves: Pt[] = [
  [330, 420],
  [560, 610],
  [870, 560],
  [1000, 720],
  [1260, 400],
  [620, 300],
  [900, 230],
  [1200, 720],
];

export const trees: Tree[] = (() => {
  const r = rng(42);
  const out: Tree[] = [];
  let guard = 0;
  while (out.length < 170 && guard++ < 20000) {
    const g = groves[Math.floor(r() * groves.length)];
    const ang = r() * Math.PI * 2;
    const dist = Math.sqrt(r()) * 130;
    const pt: Pt = [g[0] + Math.cos(ang) * dist * 1.4, g[1] + Math.sin(ang) * dist * 0.8];
    if (!clearOf(pt)) continue;
    if (out.some((t) => Math.hypot(t.x - pt[0], t.y - pt[1]) < 20)) continue;
    out.push({
      x: Math.round(pt[0]),
      y: Math.round(pt[1]),
      s: 0.75 + r() * 0.5,
      kind: r() < 0.45 ? 'pine' : 'round',
      tone: Math.floor(r() * 3),
    });
  }
  // Rysujemy od góry do dołu, żeby bliższe drzewa zasłaniały dalsze.
  return out.sort((a, b) => a.y - b.y);
})();

// --- Skały w wodzie i małe wysepki ---
export const rocks: { x: number; y: number; s: number }[] = [
  { x: 150, y: 260, s: 1 },
  { x: 175, y: 285, s: 0.6 },
  { x: 1480, y: 300, s: 0.9 },
  { x: 1455, y: 330, s: 0.5 },
  { x: 1430, y: 760, s: 0.8 },
  { x: 230, y: 860, s: 0.7 },
  { x: 1040, y: 95, s: 0.6 },
];

const isletBlobs: Blob[] = [
  { cx: 1490, cy: 140, rx: 46, ry: 26, noise: radialNoise(51, [2, 3], [0.1, 0.08]) },
  { cx: 110, cy: 700, rx: 34, ry: 20, noise: radialNoise(53, [2, 3], [0.12, 0.06]) },
];
export const islets = isletBlobs.map((b) => ({
  shelf: smoothClosed(blobPoints(b, 1.45)),
  beach: smoothClosed(blobPoints(b, 1)),
  grass: smoothClosed(blobPoints({ ...b, cy: b.cy - 3 }, 0.78)),
}));

export { WORLD_HEIGHT, WORLD_WIDTH };
