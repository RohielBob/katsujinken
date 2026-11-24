/* Contact : un bac de boules qu'on attrape et qu'on lance (moteur physique Matter.js).
   Sans physique (bibliothèque absente ou « réduire les animations »), les boules sont simplement rangées. */
(() => {
  const pit = document.getElementById('pit');
  if (!pit) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = innerWidth < 700;
  const k = small ? .64 : 1;
  const IG = 'https://www.instagram.com/tumaini_group1/';
  const balls = [
    { t: 'Instagram ↗', c: 'coral', r: 74, href: IG },
    { t: 'Un stage ?', c: 'lime', r: 66 },
    { t: 'Un projet ?', c: 'sun', r: 70 },
    { t: 'Partenariat ?', c: 'cream', r: 64 },
    { t: '活人剣', c: 'ink', r: 58, fs: 26 },
    { t: 'Kinshasa', c: 'violet2', r: 56 },
    { t: 'ULC-ICAM', c: 'lime', r: 52 },
    { t: 'On répond vite', c: 'cream', r: 60 },
    ...['isaa', 'angelo', 'ben', 'rohiel', 'chancelier', 'arnold', 'severina', 'benjamin'].map((id, i) => ({ face: id, c: ['sun', 'coral', 'lime', 'cream'][i % 4], r: 44 }))
  ];
  pit.innerHTML = `<span class="pit-hint hand">attrapez-les, lancez-les →</span>` + balls.map((b, i) => {
    const r = Math.round(b.r * k), inner = b.face && window.KJAvatar ? window.KJAvatar(b.face).replace('viewBox="0 0 200 232"', 'viewBox="44 26 112 124"') : b.t;
    const tag = b.href ? `a href="${b.href}" target="_blank" rel="noopener"` : 'span';
    // le texte est dimensionné pour tenir dans la boule (mot le plus long sur un diamètre)
    const longest = b.t ? Math.max(...b.t.split(' ').map(w => w.length)) : 1;
    const fs = b.t ? Math.min(b.fs || 20, (2 * r - 28) / (longest * .92)) : 16;
    return `<${tag} class="ball ${b.c}${b.face ? ' face' : ''}" data-i="${i}" data-cursor="${b.href ? 'Ouvrir' : 'Lancer'}" style="width:${r * 2}px;height:${r * 2}px;--fs:${fs.toFixed(1)}px">${inner}</${b.href ? 'a' : 'span'}>`;
  }).join('');
  const els = [...pit.querySelectorAll('.ball')];

  if (reduce || !window.Matter) { pit.classList.add('static'); return; }
  const { Engine, Bodies, Composite, Constraint, Body } = Matter;
  const engine = Engine.create({ gravity: { y: 1.1 } });
  let W = pit.clientWidth, H = pit.clientHeight, walls = [];
  function makeWalls() {
    Composite.remove(engine.world, walls);
    const t = 200;
    walls = [
      Bodies.rectangle(W / 2, H + t / 2, W + 2 * t, t, { isStatic: true }),
      Bodies.rectangle(-t / 2, H / 2 - 400, t, H * 2 + 800, { isStatic: true }),
      Bodies.rectangle(W + t / 2, H / 2 - 400, t, H * 2 + 800, { isStatic: true })
    ];
    Composite.add(engine.world, walls);
  }
  makeWalls();
  const bodies = els.map((el, i) => {
    const r = el.offsetWidth / 2;
    const b = Bodies.circle(r + Math.random() * Math.max(1, W - 2 * r), -r - i * 70 - Math.random() * 200, r, { restitution: .55, friction: .08, frictionAir: .012, density: .002 });
    b.el = el; b.r = r; return b;
  });

  // glisser une boule : on la relie au doigt ou à la souris par un ressort
  let drag = null;
  const local = e => { const r = pit.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  els.forEach((el, i) => {
    el.addEventListener('pointerdown', e => {
      const p = local(e), b = bodies[i];
      el.setPointerCapture(e.pointerId); el.classList.add('grab');
      drag = { b, el, sx: e.clientX, sy: e.clientY, moved: 0, c: Constraint.create({ pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y }, stiffness: .18, damping: .08, length: 0 }) };
      Composite.add(engine.world, drag.c);
      e.preventDefault();
    });
    el.addEventListener('pointermove', e => { if (!drag || drag.el !== el) return; drag.c.pointA = local(e); drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy)); });
    const end = () => { if (!drag || drag.el !== el) return; Composite.remove(engine.world, drag.c); el.classList.remove('grab'); el.dataset.moved = drag.moved; drag = null; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    // un vrai clic (sans glisser) ouvre le lien ; un lancer ne l'ouvre pas
    el.addEventListener('click', e => { if (+el.dataset.moved > 6) e.preventDefault(); });
  });
  // la souris qui passe vite pousse les boules
  let last = null;
  pit.addEventListener('pointermove', e => {
    if (drag || e.pointerType !== 'mouse') return;
    const p = local(e);
    if (last) {
      const vx = p.x - last.x, vy = p.y - last.y;
      bodies.forEach(b => { const d = Math.hypot(b.position.x - p.x, b.position.y - p.y); if (d < b.r + 24) Body.setVelocity(b, { x: b.velocity.x + vx * .35, y: b.velocity.y + vy * .35 - 1 }); });
    }
    last = p;
  });
  pit.addEventListener('pointerleave', () => last = null);

  let started = false, visible = false;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !started) { started = true; Composite.add(engine.world, bodies); requestAnimationFrame(tick); }
  }, { threshold: .25 }).observe(pit);
  new ResizeObserver(() => {
    W = pit.clientWidth; H = pit.clientHeight; makeWalls();
    bodies.forEach(b => { if (b.position.x > W - b.r) Body.setPosition(b, { x: W - b.r - 2, y: b.position.y }); });
  }).observe(pit);
  let prev = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    if (!visible) { prev = now; return; }
    Engine.update(engine, Math.min(32, now - prev)); prev = now;
    for (const b of bodies) b.el.style.transform = `translate(${(b.position.x - b.r).toFixed(1)}px,${(b.position.y - b.r).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`;
  }
})();
