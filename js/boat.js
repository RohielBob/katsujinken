import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const host = document.getElementById('stage');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
catch (e) { host.insertAdjacentHTML('beforeend', '<p class="meta" style="position:absolute;left:16px;bottom:16px">La 3D n\'est pas disponible sur cet appareil.</p>'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.prepend(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
const hemi = new THREE.HemisphereLight(0xffffff, 0xbdb2ff, 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(-3.5, 7, 4.5); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 6; sun.shadow.bias = -0.0004;
Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 20 });
sun.shadow.camera.updateProjectionMatrix();
scene.add(sun);

const root = new THREE.Group(); scene.add(root);
const turn = new THREE.Group(); root.add(turn);
const solid = new THREE.Group(); turn.add(solid);
const wire = new THREE.Group(); wire.visible = false; turn.add(wire);

// Coque paramétrique (proportions SL86, L/B = 4,2)
const L = 6;
function sec(u) {
  const bMax = 0.715;
  const b = u < 0.45 ? bMax * (0.9 + 0.1 * Math.sin(u / 0.45 * Math.PI / 2)) : bMax * Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.45) / 0.55, 2)));
  const sheer = 0.40 + 0.22 * u * u;
  let keel = -0.30;
  if (u > 0.68) { const t = (u - 0.68) / 0.32; keel = -0.30 + (sheer * 0.5 + 0.30) * t * t; }
  const dead = (16 + 24 * Math.pow(u, 1.5)) * Math.PI / 180;
  const c = b * 0.86;
  const chineY = Math.min(keel + c * Math.tan(dead), sheer - 0.04);
  return { x: -L / 2 + u * L, b, c, keel, chineY, sheer };
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function strip(rows) {
  const pos = [], idx = [], m = rows[0].length;
  rows.forEach(r => r.forEach(v => pos.push(v.x, v.y, v.z)));
  for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < m - 1; j++) { const a = i * m + j, b = a + 1, c = a + m, d = c + 1; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const N = 80, S = []; for (let i = 0; i <= N; i++) S.push(sec(i / N));

// Rendu « dessin animé » : ombrage en 3 tons + contours à l'encre
const ramp = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 180, 180, 180, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ color, gradientMap: ramp, ...extra });
const matWhite = toon(0xfff6e5, { side: THREE.DoubleSide });
const matBottom = toon(0xff6b4a, { side: THREE.DoubleSide });
const matTeak = toon(0xe9a75a, { side: THREE.DoubleSide });
const matGlass = toon(0x2a1f6b);
const matMetal = toon(0x3b3550);
const matStand = toon(0x5b2bff);
const inkMat = new THREE.LineBasicMaterial({ color: 0x14112b });
const lineMat = new THREE.LineBasicMaterial({ color: 0x18181b });
const lineSoft = new THREE.LineBasicMaterial({ color: 0x18181b, transparent: true, opacity: 0.35 });
const lineWL = new THREE.LineDashedMaterial({ color: 0xd9441c, dashSize: 0.08, gapSize: 0.06 });
const dimMat = new THREE.LineBasicMaterial({ color: 0xd9441c });
const dotMat = new THREE.MeshBasicMaterial({ color: 0xd9441c });

function add(geo, mat, { edges = true, pos, rot, parent = solid } = {}) {
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
  if (pos) m.position.set(...pos); if (rot) m.rotation.set(...rot);
  parent.add(m);
  if (edges) {
    const eg = new THREE.EdgesGeometry(geo, 30);
    const l = new THREE.LineSegments(eg, lineMat); l.position.copy(m.position); l.rotation.copy(m.rotation); wire.add(l);
    if (parent === solid) { const o = new THREE.LineSegments(eg, inkMat); o.position.copy(m.position); o.rotation.copy(m.rotation); solid.add(o); }
  }
  return m;
}
add(strip(S.map(s => [V(s.x, s.chineY, -s.c), V(s.x, s.keel, 0), V(s.x, s.chineY, s.c)])), matBottom, { edges: false });
add(strip(S.map(s => [V(s.x, s.sheer, -s.b), V(s.x, s.chineY, -s.c)])), matWhite, { edges: false });
add(strip(S.map(s => [V(s.x, s.chineY, s.c), V(s.x, s.sheer, s.b)])), matWhite, { edges: false });
add(strip(S.map(s => [V(s.x, s.sheer, -s.b), V(s.x, s.sheer, s.b)])), matTeak, { edges: false });
{
  const s = S[0], cy = (s.keel + s.sheer) / 2;
  const ring = [V(s.x, s.sheer, -s.b), V(s.x, s.chineY, -s.c), V(s.x, s.keel, 0), V(s.x, s.chineY, s.c), V(s.x, s.sheer, s.b)];
  const pos = [s.x, cy, 0]; ring.forEach(v => pos.push(v.x, v.y, v.z));
  const idx = []; for (let i = 1; i < ring.length; i++) idx.push(0, i, i + 1); idx.push(0, ring.length, 1);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  add(g, matWhite, { edges: false });
}
// contours de coque visibles en mode rendu
const inkLine = pts => solid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), inkMat));
inkLine(S.map(s => V(s.x, s.keel, 0)));
[-1, 1].forEach(sg => { inkLine(S.map(s => V(s.x, s.chineY, sg * s.c))); inkLine(S.map(s => V(s.x, s.sheer, sg * s.b))); });
{ const s = S[0]; inkLine([V(s.x, s.sheer, -s.b), V(s.x, s.chineY, -s.c), V(s.x, s.keel, 0), V(s.x, s.chineY, s.c), V(s.x, s.sheer, s.b)]); }
const lineFrom = (pts, mat = lineMat) => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat); wire.add(l); return l; };
for (let k = 0; k <= 10; k++) { const s = sec(k / 10); lineFrom([V(s.x, s.sheer, -s.b), V(s.x, s.chineY, -s.c), V(s.x, s.keel, 0), V(s.x, s.chineY, s.c), V(s.x, s.sheer, s.b)], lineSoft); }
lineFrom(S.map(s => V(s.x, s.keel, 0)));
[-1, 1].forEach(sg => { lineFrom(S.map(s => V(s.x, s.chineY, sg * s.c))); lineFrom(S.map(s => V(s.x, s.sheer, sg * s.b))); });
{
  const wl = [[], []];
  S.forEach(s => {
    let z = null;
    if (s.keel < 0 && s.chineY > 0) z = s.c * (0 - s.keel) / (s.chineY - s.keel);
    else if (s.chineY <= 0 && s.sheer > 0) z = s.c + (s.b - s.c) * (0 - s.chineY) / (s.sheer - s.chineY);
    if (z !== null) { wl[0].push(V(s.x, 0, -z)); wl[1].push(V(s.x, 0, z)); }
  });
  lineFrom([...wl[0], ...wl[1].reverse(), wl[0][0]], lineWL).computeLineDistances();
}
const RB = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 4, r);
add(RB(2.7, 0.42, 1.12, 0.1), matWhite, { pos: [-0.75, 0.61, 0] });
add(RB(2.4, 0.15, 1.15, 0.05), matGlass, { pos: [-0.62, 0.66, 0] });
add(RB(0.6, 0.34, 1.0, 0.1), matWhite, { pos: [0.62, 0.56, 0], rot: [0, 0, 0.55] });
add(RB(1.8, 0.24, 0.98, 0.08), matWhite, { pos: [-0.95, 0.94, 0] });
add(RB(0.22, 0.14, 0.86, 0.04), matGlass, { pos: [-0.1, 1.1, 0], rot: [0, 0, -0.6] });
add(RB(1.45, 0.045, 1.02, 0.02), matWhite, { pos: [-1.15, 1.5, 0] });
for (const x of [-1.7, -0.65]) for (const z of [-0.42, 0.42]) add(new THREE.CylinderGeometry(0.02, 0.02, 0.44, 12), matMetal, { edges: false, pos: [x, 1.28, z] });
add(new THREE.CylinderGeometry(0.022, 0.028, 0.18, 12), matMetal, { edges: false, pos: [-1.3, 1.6, 0] });
for (const z of [-0.2, 0.2]) add(new THREE.SphereGeometry(0.075, 24, 16), matWhite, { pos: [-1.05, 1.6, z] });
add(new THREE.BoxGeometry(0.34, 0.03, 1.25), matTeak, { pos: [-3.14, 0.02, 0] });
{
  const pts = []; for (let i = 0; i <= 24; i++) { const u = 0.58 + 0.42 * i / 24, s = sec(u); pts.push(V(s.x, s.sheer + 0.09, s.b * 0.92)); }
  const curve = new THREE.CatmullRomCurve3([...pts, ...pts.map(p => V(p.x, p.y, -p.z)).reverse().slice(1)]);
  add(new THREE.TubeGeometry(curve, 120, 0.007, 6), matMetal, { edges: false });
  for (let i = 0; i <= 24; i += 4) { const p = pts[i]; for (const sg of [1, -1]) add(new THREE.CylinderGeometry(0.005, 0.005, 0.09, 6), matMetal, { edges: false, pos: [p.x, p.y - 0.045, sg * p.z] }); }
}
for (const z of [-0.26, 0.26]) {
  add(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 10), matMetal, { edges: false, pos: [-1.9, -0.33, z], rot: [0, 0, Math.PI / 2 - 0.19] });
  const hub = new THREE.Group(); hub.position.set(-2.42, -0.43, z); solid.add(hub);
  for (let k = 0; k < 5; k++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.13, 0.05), matMetal); bl.position.y = 0.06; bl.rotation.y = 0.5; bl.castShadow = true; const piv = new THREE.Group(); piv.rotation.x = k * Math.PI * 2 / 5; piv.add(bl); hub.add(piv); }
  add(new THREE.BoxGeometry(0.16, 0.16, 0.015), matMetal, { edges: false, pos: [-2.62, -0.36, z] });
}
const stand = new THREE.Group(); root.add(stand);
add(RB(3.6, 0.06, 0.8, 0.02), matStand, { edges: false, pos: [0, -0.66, 0], parent: stand });
for (const x of [-1.3, 1.0]) { const s = sec((x + L / 2) / L); add(new THREE.BoxGeometry(0.06, s.keel + 0.63, 0.5), matStand, { edges: false, pos: [x, (s.keel - 0.63) / 2, 0], parent: stand }); }
const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), shadowMat);
floor.rotation.x = -Math.PI / 2; floor.position.y = -0.69; floor.receiveShadow = true; root.add(floor);

const dims = [];
function dim(a, b, el, html) {
  wire.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), dimMat));
  [a, b].forEach(p => { const t = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), dotMat); t.position.copy(p); wire.add(t); });
  el.innerHTML = html; dims.push({ el, p: a.clone().add(b).multiplyScalar(0.5) });
}
dim(V(-3.17, -0.5, 1.0), V(3, -0.5, 1.0), document.getElementById('dimL'), 'LOA 26,76 m<small>669 mm</small>');
dim(V(-3.4, 0.4, -0.72), V(-3.4, 0.4, 0.72), document.getElementById('dimB'), 'B 6,35 m<small>158,8 mm</small>');
dim(V(-1.15, -0.3, -1.0), V(-1.15, 1.65, -1.0), document.getElementById('dimH'), '≈ 7 m<small>hors d\'eau</small>');

// Couleurs selon le thème clair / sombre
function applyTheme() {
  const fg = new THREE.Color(css('--ink') || '#14112b'), ac = new THREE.Color(css('--accent') || '#ff6b4a');
  lineMat.color.copy(fg); lineSoft.color.copy(fg);
  lineWL.color.copy(ac); dimMat.color.copy(ac); dotMat.color.copy(ac);
  const dark = fg.getHSL({}).l > 0.5;
  shadowMat.opacity = dark ? 0.5 : 0.2;
  inkMat.color.set(0x14112b);
}
applyTheme();
addEventListener('themechange', () => requestAnimationFrame(applyTheme));

let plan = false;
const bR = document.getElementById('mRender'), bP = document.getElementById('mPlan');
function setPlan(v) {
  plan = v; bR.setAttribute('aria-pressed', !v); bP.setAttribute('aria-pressed', v);
  solid.visible = !v; stand.visible = !v; floor.visible = !v; wire.visible = v;
  host.classList.toggle('plan', v); dims.forEach(d => d.el.hidden = !v);
}
bR.addEventListener('click', () => setPlan(false));
bP.addEventListener('click', () => setPlan(true));

let W = 1, H = 1;
function resize() {
  W = host.clientWidth; H = host.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  const d = W / H < 1.1 ? 17 : 13.5;
  camera.position.set(0.55 * d, 0.24 * d, 0.8 * d);
  camera.lookAt(0, 0.15, 0);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(host); resize();

let drag = null, ang = -0.6, tAng = -0.6, vel = 0, tilt = 0, tTilt = 0, lastY = scrollY;
host.addEventListener('pointerdown', e => { drag = e.clientX; });
host.addEventListener('pointermove', e => {
  const r = host.getBoundingClientRect(); tTilt = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
  if (drag !== null) { const dx = e.clientX - drag; tAng += dx * 0.009; vel = dx * 0.0009; drag = e.clientX; }
});
addEventListener('pointerup', () => drag = null);
host.addEventListener('pointercancel', () => drag = null);
host.addEventListener('pointerleave', () => tTilt = 0);
addEventListener('scroll', () => { if (!reduce) tAng += (scrollY - lastY) * 0.003; lastY = scrollY; }, { passive: true });

// Entrée en scène : la maquette descend sur son socle
let intro = reduce ? 1 : 0, running = true;
new IntersectionObserver(([e]) => running = e.isIntersecting).observe(host);
const clock = new THREE.Clock(), v = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  if (!running || document.hidden) { clock.getDelta(); return; }
  const raw = clock.getDelta();
  if (intro < 1) intro = Math.min(1, intro + raw / 1.6);
  const e = 1 - Math.pow(1 - intro, 4);
  turn.position.y = (1 - e) * 1.2;
  if (drag === null) { tAng += vel + (reduce ? 0 : 0.0016); vel *= 0.94; }
  ang += (tAng - ang) * 0.07; tilt += (tTilt - tilt) * 0.06;
  root.rotation.y = ang + (1 - e) * 1.2; root.rotation.x = tilt * 0.4;
  if (plan) for (const d of dims) {
    turn.localToWorld(v.copy(d.p)).project(camera);
    d.el.style.left = ((v.x + 1) / 2 * W) + 'px';
    d.el.style.top = ((1 - v.y) / 2 * H) + 'px';
  }
  renderer.render(scene, camera);
}
frame();
