// ==========================================================================
// CINEMATIC PARTICLE PROCEDURAL GEOMETRY GENERATOR
// Implements Fibonacci Celestial Globe, Ambient Field, and Recognizable Japanese Bonsai Tree.
// Engineered for flat Float32Array buffers with zero runtime allocations.
// ==========================================================================

export interface ParticleSOA {
  count: number;
  // Current dynamic state
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  size: Float32Array;
  alpha: Float32Array;
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
  isRect: Uint8Array;
  stagger: Float32Array;
  driftSpeed: Float32Array;
  driftPhase: Float32Array;

  // Target State 0: Ambient Cosmic Dust (Hero)
  s0x: Float32Array; s0y: Float32Array; s0z: Float32Array;

  // Target State 1: Fibonacci Celestial Sphere (About / Story)
  s1x: Float32Array; s1y: Float32Array; s1z: Float32Array; s1density: Float32Array;

  // Target State 2: White Section Ambient Kinetic Field
  s2x: Float32Array; s2y: Float32Array; s2z: Float32Array;

  // Target State 3: Recognizable Japanese Bonsai Tree Sculpture (Black Section)
  // Large scale (50-65% viewport height), thick visible roots, S-curved central trunk,
  // asymmetric branches, 5 layered cloud canopies, high contrast colors.
  s3x: Float32Array; s3y: Float32Array; s3z: Float32Array; s3part: Uint8Array; s3density: Float32Array; s3size: Float32Array;

  // Target State India: Geographic Silhouette & Interior Particle Map
  sIndiaX: Float32Array;
  sIndiaY: Float32Array;
  sIndiaZ: Float32Array;
  sIndiaIsBorder: Uint8Array;
  sIndiaDensity: Float32Array;

  // Target State HWI: Contours & Fill of the HWI Background Lettering
  sHwiX: Float32Array;
  sHwiY: Float32Array;
  sHwiZ: Float32Array;
  sHwiIsBorder: Uint8Array;
  sHwiDensity: Float32Array;

  // Target State 4: Team Ambient Field
  s4x: Float32Array; s4y: Float32Array; s4z: Float32Array;
}

export function createParticleSOA(N: number): ParticleSOA {
  return {
    count: N,
    x: new Float32Array(N),
    y: new Float32Array(N),
    z: new Float32Array(N),
    size: new Float32Array(N),
    alpha: new Float32Array(N),
    r: new Uint8Array(N),
    g: new Uint8Array(N),
    b: new Uint8Array(N),
    isRect: new Uint8Array(N),
    stagger: new Float32Array(N),
    driftSpeed: new Float32Array(N),
    driftPhase: new Float32Array(N),

    s0x: new Float32Array(N), s0y: new Float32Array(N), s0z: new Float32Array(N),
    s1x: new Float32Array(N), s1y: new Float32Array(N), s1z: new Float32Array(N), s1density: new Float32Array(N),
    sIndiaX: new Float32Array(N), sIndiaY: new Float32Array(N), sIndiaZ: new Float32Array(N),
    sIndiaIsBorder: new Uint8Array(N), sIndiaDensity: new Float32Array(N),
    sHwiX: new Float32Array(N), sHwiY: new Float32Array(N), sHwiZ: new Float32Array(N),
    sHwiIsBorder: new Uint8Array(N), sHwiDensity: new Float32Array(N),
    s2x: new Float32Array(N), s2y: new Float32Array(N), s2z: new Float32Array(N),
    s3x: new Float32Array(N), s3y: new Float32Array(N), s3z: new Float32Array(N), s3part: new Uint8Array(N), s3density: new Float32Array(N), s3size: new Float32Array(N),
    s4x: new Float32Array(N), s4y: new Float32Array(N), s4z: new Float32Array(N),
  };
}

// ==========================================================================
// 1. FAST INITIAL STATES: Hero Dust & Fibonacci Globe
// Instant generation (< 0.5ms) on startup to guarantee ZERO initial stutter
// ==========================================================================
export function initInitialStates(soa: ParticleSOA, width: number, height: number) {
  const N = soa.count;
  const centerX = width / 2;
  const centerY = height / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < N; i++) {
    soa.stagger[i] = Math.random() * 0.5;
    soa.driftSpeed[i] = 0.4 + Math.random() * 0.8;
    soa.driftPhase[i] = Math.random() * Math.PI * 2;
    soa.size[i] = 1.8 + Math.random() * 2.2;
    soa.isRect[i] = Math.random() > 0.6 ? 1 : 0;

    // State 0: Ambient Cosmic Dust (Hero)
    const aTheta = Math.random() * Math.PI * 2;
    const aDist = (0.2 + 0.8 * Math.sqrt(Math.random())) * Math.max(width, height) * 0.45;
    soa.s0x[i] = centerX + Math.cos(aTheta) * aDist;
    soa.s0y[i] = centerY + Math.sin(aTheta) * aDist * 0.6;
    soa.s0z[i] = (Math.random() - 0.5) * 200;

    // State 1: Fibonacci Celestial Sphere (About / Story)
    const sy = 1 - (i / (N - 1)) * 2;
    const sRadius = Math.sqrt(Math.max(0, 1 - sy * sy));
    const sTheta = goldenAngle * i;
    soa.s1x[i] = Math.cos(sTheta) * sRadius;
    soa.s1y[i] = sy;
    soa.s1z[i] = Math.sin(sTheta) * sRadius;
    const harmonic = Math.sin(sTheta * 3) * Math.cos(sy * 4);
    soa.s1density[i] = harmonic > -0.2 ? 1.0 : 0.32;

    // Initialize current positions to State 0
    soa.x[i] = soa.s0x[i];
    soa.y[i] = soa.s0y[i];
    soa.z[i] = soa.s0z[i];
  }

  // Precompute HWI positions immediately on frame 0 (takes < 2ms)
  populateHWIState(soa);
}

// ==========================================================================
// 1.5 ACCURATE GEOGRAPHIC INDIA SILHOUETTE & INTERIOR
// Continuous high-precision polygon perimeter spline + rejection-sampled interior.
// Pure geometric data without foreign territory or cartoon approximations.
// ==========================================================================
const INDIA_BOUNDARY_COORDS: [number, number][] = [
  // Kashmir / Ladakh
  [74.8, 35.5], [76.0, 36.0], [77.5, 35.8], [78.8, 35.2], [79.2, 34.0], [79.0, 32.8],
  // Himachal / Uttarakhand
  [78.5, 31.8], [79.2, 31.2], [80.2, 30.8], [80.8, 30.0], [80.9, 28.8],
  // Indo-Nepal border (UP/Bihar)
  [81.5, 28.5], [82.5, 28.0], [84.0, 27.5], [85.5, 27.0], [87.0, 26.6], [88.0, 26.5],
  // Sikkim
  [88.2, 27.2], [88.6, 27.8], [88.9, 27.6], [88.8, 27.0],
  // Bhutan border / Assam / Arunachal
  [89.5, 26.8], [91.0, 27.0], [92.0, 27.5], [93.5, 28.2], [95.0, 28.6], [96.5, 28.4], [97.3, 28.1],
  // Easternmost bend
  [97.4, 27.5], [96.8, 26.8], [95.8, 26.0],
  // Nagaland / Manipur
  [94.8, 25.2], [94.3, 24.2],
  // Mizoram loop
  [93.2, 23.0], [92.8, 22.0], [92.3, 22.2], [92.4, 23.5],
  // Tripura
  [91.8, 23.8], [91.3, 24.2], [92.0, 25.0],
  // Meghalaya / Assam
  [90.5, 25.2], [89.8, 25.8], [88.8, 25.5],
  // West Bengal / Sundarbans
  [88.8, 24.0], [88.8, 22.6], [88.5, 21.6],
  // Odisha
  [87.0, 21.4], [86.2, 20.3], [85.0, 19.3], [84.0, 18.5],
  // Andhra Pradesh
  [83.0, 17.6], [82.0, 16.5], [80.5, 15.5], [80.2, 14.0],
  // Tamil Nadu
  [80.1, 13.0], [79.8, 11.5], [79.5, 10.3], [79.1, 9.3], [78.0, 8.5], [77.53, 8.08],
  // Kerala
  [76.8, 8.6], [76.4, 9.6], [75.8, 11.4], [75.0, 12.5],
  // Karnataka / Goa
  [74.5, 13.8], [74.0, 15.0], [73.7, 15.6],
  // Maharashtra
  [73.2, 17.0], [72.88, 19.08], [72.7, 20.2],
  // Gujarat (Kathiawar & Kutch)
  [72.5, 21.2], [71.5, 20.7], [70.5, 21.0], [69.2, 22.0], [68.9, 22.5],
  [70.0, 23.0], [68.5, 23.6],
  [70.5, 24.4], [71.2, 24.6],
  // Rajasthan
  [70.5, 25.8], [69.8, 27.0], [70.5, 28.0], [71.8, 29.5],
  // Punjab / Jammu
  [73.8, 31.0], [74.5, 32.2], [74.2, 33.5], [74.5, 34.6], [74.8, 35.5]
];

function pointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function populateIndiaState(soa: ParticleSOA) {
  const N = soa.count;
  const centerLng = 81.0;
  const centerLat = 22.0;
  const spanLng = 97.4 - 68.2;
  const spanLat = 36.0 - 8.0;

  // Convert geographic coordinates to normalized [-1, 1] frame
  // -0.10 centers the bounding box horizontally; Y is inverted so North is -Y
  const normPoly: [number, number][] = INDIA_BOUNDARY_COORDS.map(([lng, lat]) => [
    ((lng - centerLng) / spanLng) * 1.85 - 0.10,
    -((lat - centerLat) / spanLat) * 2.0,
  ]);

  const numVertices = normPoly.length;

  // Precompute cumulative edge lengths for equidistant arc-length perimeter sampling
  const cumLens: number[] = [0];
  let totalLen = 0;
  for (let i = 0; i < numVertices; i++) {
    const p1 = normPoly[i];
    const p2 = normPoly[(i + 1) % numVertices];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    totalLen += len;
    cumLens.push(totalLen);
  }

  function getPointAtDist(d: number): [number, number] {
    const target = ((d % totalLen) + totalLen) % totalLen;
    let low = 0, high = cumLens.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (cumLens[mid] <= target) low = mid + 1;
      else high = mid - 1;
    }
    const idx = Math.max(0, high);
    const p1 = normPoly[idx % numVertices];
    const p2 = normPoly[(idx + 1) % numVertices];
    const segLen = cumLens[idx + 1] - cumLens[idx];
    const t = segLen > 0 ? (target - cumLens[idx]) / segLen : 0;
    return [
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ];
  }

  // 65% of particles trace the continuous perimeter outline for maximum silhouette recognition
  const borderCount = Math.floor(N * 0.65);
  const interiorCount = N - borderCount;

  const tempX = new Float32Array(N);
  const tempY = new Float32Array(N);
  const tempZ = new Float32Array(N);
  const tempIsBorder = new Uint8Array(N);
  const tempDensity = new Float32Array(N);

  // 1. High-precision equidistant boundary points
  for (let i = 0; i < borderCount; i++) {
    const d = (i / borderCount) * totalLen;
    const pt = getPointAtDist(d);
    tempX[i] = pt[0] + (Math.random() - 0.5) * 0.008;
    tempY[i] = pt[1] + (Math.random() - 0.5) * 0.008;
    tempZ[i] = (Math.random() - 0.5) * 6;
    tempIsBorder[i] = 1;
    tempDensity[i] = 1.0;
  }

  // 2. Uniform point-in-polygon interior sampling
  let accepted = 0;
  let attempts = 0;
  const maxAttempts = interiorCount * 35;

  while (accepted < interiorCount && attempts < maxAttempts) {
    attempts++;
    const rx = Math.random() * 1.8 - 0.9;
    const ry = Math.random() * 2.0 - 1.0;

    if (pointInPolygon(rx, ry, normPoly)) {
      const idx = borderCount + accepted;
      tempX[idx] = rx;
      tempY[idx] = ry;
      tempZ[idx] = (Math.random() - 0.5) * 16;
      tempIsBorder[idx] = 0;
      tempDensity[idx] = 0.55 + 0.45 * Math.random();
      accepted++;
    }
  }

  // Fallback if needed
  while (accepted < interiorCount) {
    const idx = borderCount + accepted;
    const pt = getPointAtDist(Math.random() * totalLen);
    tempX[idx] = pt[0] * 0.85;
    tempY[idx] = pt[1] * 0.85;
    tempZ[idx] = 0;
    tempIsBorder[idx] = 0;
    tempDensity[idx] = 0.5;
    accepted++;
  }

  // 3. Smooth particle pairing:
  // Sort globe particles by Y (-y1 in screen space) and India particles by tempY
  // This ensures particles migrate directly to their closest geographic latitude without crossing
  const globeIndices = Array.from({ length: N }, (_, i) => i).sort((a, b) => -soa.s1y[a] - (-soa.s1y[b]));
  const indiaIndices = Array.from({ length: N }, (_, i) => i).sort((a, b) => tempY[a] - tempY[b]);

  for (let k = 0; k < N; k++) {
    const gIdx = globeIndices[k];
    const iIdx = indiaIndices[k];

    soa.sIndiaX[gIdx] = tempX[iIdx];
    soa.sIndiaY[gIdx] = tempY[iIdx];
    soa.sIndiaZ[gIdx] = tempZ[iIdx];
    soa.sIndiaIsBorder[gIdx] = tempIsBorder[iIdx];
    soa.sIndiaDensity[gIdx] = tempDensity[iIdx];
  }
}

// ==========================================================================
// 1.5 TARGET STATE HWI: Contours & Dot-Matrix of HWI Background Lettering
// Reuses the exact SVG lettering geometry (900x340 viewBox) as particle target
// ==========================================================================
export function populateHWIState(soa: ParticleSOA) {
  const N = soa.count;
  const W = 900;
  const H = 340;

  const contourPoints: [number, number][] = [];
  const interiorPoints: [number, number][] = [];

  // 1. Attempt client-side canvas rasterization of HWI typography
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 280px "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('HWI', W * 0.5, H * 0.70);

        const imgData = ctx.getImageData(0, 0, W, H);
        const data = imgData.data;
        const step = 4; // 4px grid scan

        for (let y = 12; y < H - 12; y += step) {
          for (let x = 12; x < W - 12; x += step) {
            const idx = (y * W + x) * 4;
            const val = data[idx];
            if (val > 110) {
              // Edge detection: if any 4-neighbor is dark, this is an outline contour point
              const left = data[(y * W + (x - step)) * 4];
              const right = data[(y * W + (x + step)) * 4];
              const up = data[((y - step) * W + x) * 4];
              const down = data[((y + step) * W + x) * 4];

              const normX = (x - 450) / 450;
              const normY = (y - 170) / 170;

              if (left < 90 || right < 90 || up < 90 || down < 90) {
                contourPoints.push([normX, normY]);
              } else if (x % 8 === 0 && y % 8 === 0) {
                // Interior dot matrix point (matches SVG 6-8px pattern)
                interiorPoints.push([normX, normY]);
              }
            }
          }
        }
      }
    } catch {
      // Fallback to parametric geometry if canvas reading is restricted
    }
  }

  // 2. High-precision parametric fallback if canvas sampling didn't yield enough points
  if (contourPoints.length < 80) {
    contourPoints.length = 0;
    interiorPoints.length = 0;

    const sampleBox = (rx1: number, ry1: number, rx2: number, ry2: number, step = 0.024) => {
      for (let y = ry1; y <= ry2; y += step) {
        for (let x = rx1; x <= rx2; x += step) {
          const isEdge = x - rx1 < step * 1.3 || rx2 - x < step * 1.3 || y - ry1 < step * 1.3 || ry2 - y < step * 1.3;
          if (isEdge) {
            contourPoints.push([x, y]);
          } else {
            interiorPoints.push([x, y]);
          }
        }
      }
    };

    const sampleSegment = (x1: number, y1: number, x2: number, y2: number, thick: number, steps = 28) => {
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;
        for (let ox = -thick; ox <= thick; ox += 0.022) {
          const isEdge = Math.abs(ox - thick) < 0.016 || Math.abs(ox + thick) < 0.016 || s === 0 || s === steps;
          if (isEdge) {
            contourPoints.push([cx + ox, cy]);
          } else {
            interiorPoints.push([cx + ox, cy]);
          }
        }
      }
    };

    // Letter 'H': Left bar, right bar, crossbar
    sampleBox(-0.80, -0.60, -0.64, 0.42);
    sampleBox(-0.44, -0.60, -0.28, 0.42);
    sampleBox(-0.64, -0.16, -0.44, 0.00);

    // Letter 'W': 4 diagonal thick strokes
    sampleSegment(-0.20, -0.60, -0.11, 0.42, 0.05);
    sampleSegment(-0.11, 0.42, -0.01, -0.15, 0.045);
    sampleSegment(-0.01, -0.15, 0.09, 0.42, 0.045);
    sampleSegment(0.09, 0.42, 0.18, -0.60, 0.05);

    // Letter 'I': Central stem, top serif, bottom serif
    sampleBox(0.38, -0.60, 0.54, 0.42);
    sampleBox(0.30, -0.60, 0.62, -0.48);
    sampleBox(0.30, 0.30, 0.62, 0.42);
  }

  // Ensure arrays have at least 1 point
  if (contourPoints.length === 0) contourPoints.push([0, 0]);
  if (interiorPoints.length === 0) interiorPoints.push([0, 0]);

  // 3. Populate temporary buffers
  const borderCount = Math.floor(N * 0.60);
  const interiorCount = N - borderCount;

  const tempX = new Float32Array(N);
  const tempY = new Float32Array(N);
  const tempZ = new Float32Array(N);
  const tempIsBorder = new Uint8Array(N);
  const tempDensity = new Float32Array(N);

  for (let i = 0; i < borderCount; i++) {
    const pt = contourPoints[i % contourPoints.length];
    tempX[i] = pt[0] + (Math.random() - 0.5) * 0.006;
    tempY[i] = pt[1] + (Math.random() - 0.5) * 0.006;
    tempZ[i] = (Math.random() - 0.5) * 6;
    tempIsBorder[i] = 1;
    tempDensity[i] = 1.0;
  }

  for (let i = 0; i < interiorCount; i++) {
    const idx = borderCount + i;
    const pt = interiorPoints[i % interiorPoints.length];
    tempX[idx] = pt[0] + (Math.random() - 0.5) * 0.008;
    tempY[idx] = pt[1] + (Math.random() - 0.5) * 0.008;
    tempZ[idx] = (Math.random() - 0.5) * 12;
    tempIsBorder[idx] = 0;
    tempDensity[idx] = 0.55 + 0.45 * Math.random();
  }

  // 4. Smooth particle pairing:
  // Sort Globe particles along X (soa.s1x) and HWI targets along X (tempX).
  // This produces an organic West-to-East flow where the Western globe hemisphere flows into 'H',
  // the Central meridian flows into 'W', and the Eastern hemisphere flows into 'I'.
  const globeIndices = Array.from({ length: N }, (_, i) => i).sort((a, b) => {
    const dx = soa.s1x[a] - soa.s1x[b];
    if (Math.abs(dx) > 0.04) return dx;
    return soa.s1y[a] - soa.s1y[b];
  });
  const hwiIndices = Array.from({ length: N }, (_, i) => i).sort((a, b) => {
    const dx = tempX[a] - tempX[b];
    if (Math.abs(dx) > 0.04) return dx;
    return tempY[a] - tempY[b];
  });

  for (let k = 0; k < N; k++) {
    const gIdx = globeIndices[k];
    const hIdx = hwiIndices[k];

    soa.sHwiX[gIdx] = tempX[hIdx];
    soa.sHwiY[gIdx] = tempY[hIdx];
    soa.sHwiZ[gIdx] = tempZ[hIdx];
    soa.sHwiIsBorder[gIdx] = tempIsBorder[hIdx];
    soa.sHwiDensity[gIdx] = tempDensity[hIdx];
  }
}

// ==========================================================================
// 2. WHITE SECTION AMBIENT KINETIC FIELD
// Clean, low-noise ambient field framing the Two-Column layout
// ==========================================================================
export function populateWhiteSectionState(soa: ParticleSOA, width: number, height: number) {
  const N = soa.count;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const r = (0.25 + 0.75 * Math.sqrt(Math.random())) * Math.max(width, height) * 0.55;
    soa.s2x[i] = centerX + Math.cos(angle) * r;
    soa.s2y[i] = centerY + Math.sin(angle) * r * 0.75;
    soa.s2z[i] = (Math.random() - 0.5) * 120;
  }
}

// ==========================================================================
// 3. RECOGNIZABLE JAPANESE BONSAI TREE (Black Section Background)
// High-visibility, large sculptural environmental object:
// - Height: ~55-65% of viewport height
// - Visible thick surface roots (Nebari)
// - Strong S-curved central trunk with tapering
// - Asymmetrical primary branches (Sashi-eda, Uke-eda, Mae-eda)
// - 5 distinct layered cloud canopies (Tana pads)
// - Bold particle sizes (2.5px to 5px) for clear readability against black
// ==========================================================================
export function populateBonsaiTreeState(soa: ParticleSOA, width: number, height: number) {
  const N = soa.count;
  // Make the tree substantial: 60% of viewport height (minimum 520px, max 720px)
  const treeHeightTarget = Math.max(520, Math.min(height * 0.62, 720));
  const normScale = treeHeightTarget / 360; // unit multiplier

  const rootCount = Math.floor(N * 0.16);
  const trunkCount = Math.floor(N * 0.28);
  const branchCount = Math.floor(N * 0.20);
  const canopyCount = N - rootCount - trunkCount - branchCount;

  // ------------------------------------------------------------------------
  // A. VISIBLE SURFACE ROOTS (Nebari)
  // Splayed, thick root arms firmly grasping the ground plane
  // ------------------------------------------------------------------------
  const rootArms = [
    { start: [0, 60, 0], end: [-110, 95, 24], rStart: 22, rEnd: 7 },
    { start: [10, 62, 2], end: [95, 100, -18], rStart: 20, rEnd: 6.5 },
    { start: [-8, 65, -8], end: [-50, 108, -32], rStart: 16, rEnd: 5.5 },
    { start: [14, 65, 10], end: [55, 110, 28], rStart: 15, rEnd: 5 },
  ];

  for (let i = 0; i < rootCount; i++) {
    const arm = rootArms[i % rootArms.length];
    const t = Math.random();
    const rx = ((1 - t) * arm.start[0] + t * arm.end[0]) * normScale;
    const ry = ((1 - t) * arm.start[1] + t * arm.end[1]) * normScale;
    const rz = ((1 - t) * arm.start[2] + t * arm.end[2]) * normScale;

    const rad = ((1 - t) * arm.rStart + t * arm.rEnd) * normScale;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * rad;

    soa.s3x[i] = rx + Math.cos(angle) * dist;
    soa.s3y[i] = ry + Math.sin(angle) * dist * 0.6;
    soa.s3z[i] = rz + Math.sin(angle) * dist;
    soa.s3part[i] = 0; // roots
    soa.s3density[i] = 0.95;
    soa.s3size[i] = 2.4 + Math.random() * 1.6;
  }

  // ------------------------------------------------------------------------
  // B. STRONG CENTRAL TRUNK (Moyo-gi S-Curve)
  // Thick base tapering gracefully upward with unmistakable curved posture
  // ------------------------------------------------------------------------
  const trunkStart = rootCount;
  for (let i = trunkStart; i < trunkStart + trunkCount; i++) {
    const t = (i - trunkStart) / trunkCount; // 0 at base, 1 at apex
    // Vertical progression: base y = +60 down to apex y = -140
    const y = (60 - t * 200) * normScale;

    // Bold, unmistakable Moyo-gi S-curve
    const curveX = (-52 * Math.sin(t * Math.PI) + 26 * Math.sin(t * 2.2 * Math.PI)) * normScale;
    const curveZ = (20 * Math.sin(t * 1.6 * Math.PI) * Math.cos(t * Math.PI)) * normScale;

    // Tapering: 32px at base down to 9px at apex
    const radius = (32 * (1 - t * 0.70)) * normScale;
    const angle = Math.random() * Math.PI * 2;
    // High structural core density + outer bark texture
    const dist = Math.pow(Math.random(), 0.65) * radius;

    soa.s3x[i] = curveX + Math.cos(angle) * dist;
    soa.s3y[i] = y;
    soa.s3z[i] = curveZ + Math.sin(angle) * dist;
    soa.s3part[i] = 1; // trunk
    soa.s3density[i] = 1.0;
    soa.s3size[i] = 2.8 + Math.random() * 2.0;
  }

  // ------------------------------------------------------------------------
  // C. ASYMMETRIC PRIMARY BRANCHES
  // Strong dominant left branch (Sashi-eda), right balance branch (Uke-eda), depth branches
  // ------------------------------------------------------------------------
  const branches = [
    // 1. Primary Left Branch (Dominant horizontal sweep)
    { start: [-26, -8, 10], end: [-165, -42, 30], r: 16, rEnd: 5.5 },
    // 2. Primary Right Balance Branch
    { start: [20, -52, -10], end: [142, -78, -24], r: 14, rEnd: 5 },
    // 3. Upper Left Secondary Branch
    { start: [-14, -92, 8], end: [-95, -118, 18], r: 11, rEnd: 4.5 },
    // 4. Back Depth Branch
    { start: [8, -80, -12], end: [42, -104, -48], r: 10, rEnd: 4 },
    // 5. Crown Apex Branching
    { start: [-6, -125, 0], end: [-16, -162, 5], r: 9, rEnd: 4 },
  ];

  const branchStart = trunkStart + trunkCount;
  for (let i = branchStart; i < branchStart + branchCount; i++) {
    const b = branches[i % branches.length];
    const t = Math.random();
    const bx = ((1 - t) * b.start[0] + t * b.end[0]) * normScale;
    const by = ((1 - t) * b.start[1] + t * b.end[1]) * normScale;
    const bz = ((1 - t) * b.start[2] + t * b.end[2]) * normScale;

    const rad = ((1 - t) * b.r + t * b.rEnd) * normScale;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * rad;

    soa.s3x[i] = bx + Math.cos(angle) * dist;
    soa.s3y[i] = by + Math.sin(angle) * dist;
    soa.s3z[i] = bz + (Math.random() - 0.5) * rad;
    soa.s3part[i] = 2; // branches
    soa.s3density[i] = 0.90;
    soa.s3size[i] = 2.6 + Math.random() * 1.8;
  }

  // ------------------------------------------------------------------------
  // D. LAYERED BONSAI CLOUD CANOPIES (Tana Pads)
  // Distinct, well-defined horizontal cloud pads creating the signature silhouette
  // ------------------------------------------------------------------------
  const pads = [
    // 1. Left Low Cloud Pad (Large sweeping cloud)
    { cx: -155, cy: -46, cz: 28, rx: 68, ry: 22, rz: 44, weight: 0.28 },
    // 2. Right Mid Cloud Pad (Harmonious balance)
    { cx: 138, cy: -82, cz: -22, rx: 58, ry: 20, rz: 38, weight: 0.24 },
    // 3. Apex Crown Dome (Densest, majestic crown)
    { cx: -12, cy: -168, cz: 5, rx: 78, ry: 26, rz: 52, weight: 0.28 },
    // 4. Upper Left Cloud
    { cx: -92, cy: -122, cz: 18, rx: 48, ry: 18, rz: 34, weight: 0.12 },
    // 5. Rear Depth Cloud
    { cx: 38, cy: -106, cz: -46, rx: 42, ry: 16, rz: 30, weight: 0.08 },
  ];

  const canopyStart = branchStart + branchCount;
  for (let i = canopyStart; i < N; i++) {
    const r = Math.random();
    let acc = 0;
    let pad = pads[0];
    for (const p of pads) {
      acc += p.weight;
      if (r <= acc) { pad = p; break; }
    }

    // Dense core + outer starlight needles
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const rad = Math.pow(Math.random(), 0.62);

    const px = (pad.cx + Math.sin(phi) * Math.cos(theta) * pad.rx * rad) * normScale;
    const py = (pad.cy + Math.cos(phi) * pad.ry * rad * 0.75) * normScale;
    const pz = (pad.cz + Math.sin(phi) * Math.sin(theta) * pad.rz * rad) * normScale;

    soa.s3x[i] = px;
    soa.s3y[i] = py;
    soa.s3z[i] = pz;
    soa.s3part[i] = 3; // canopy
    soa.s3density[i] = 1.0;
    // Foliage has substantial, luminous particle size
    soa.s3size[i] = 3.0 + Math.random() * 2.2;
  }
}

// ==========================================================================
// 4. TEAM SECTION AMBIENT STATE
// ==========================================================================
export function populateTeamState(soa: ParticleSOA, width: number, height: number) {
  const N = soa.count;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < N; i++) {
    const tmAngle = Math.random() * Math.PI * 2;
    const tmDist = (0.2 + 0.75 * Math.random()) * Math.min(width, height) * 0.44;
    soa.s4x[i] = centerX + Math.cos(tmAngle) * tmDist;
    soa.s4y[i] = centerY + Math.sin(tmAngle) * tmDist * 0.7;
    soa.s4z[i] = (Math.random() - 0.5) * 140;
  }
}
