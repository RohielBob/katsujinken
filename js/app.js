(() => {
  const D = window.PORTFOLIO, IMG = 'img/p/';
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const byId = Object.fromEntries(D.membres.map(m => [m.id, m]));
  const first = m => m.nom.split(' ')[0];
  const P = D.projets, pById = Object.fromEntries(P.map(p => [p.id, p]));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const INK = '#14112b';

  /* ================= Équipage dessiné ================= */
  // Teintes reprises des photos ; coiffures texturées (boucles), regard qui suit la souris.
  const LOOK = {
    angelo:     { skin: '#7b4b2e', hair: 'afro', top: '#2b3a8c', cut: 'jacket', face: 'mustache', bg: 'lime', say: 'Le planning, c\'est moi.' },
    rohiel:     { skin: '#6e4026', hair: 'fade', top: '#a9b4ba', cut: 'polo', acc: 'headphones', face: 'mustache', bg: 'coral', say: 'J\'écris le code.' },
    arnold:     { skin: '#8a5634', hair: 'short', top: '#8a5a2b', cut: 'bands', bg: 'sun', say: 'Méca et électronique !' },
    ben:        { skin: '#5e3620', hair: 'short', top: '#a8d8ff', cut: 'vest', acc: 'hardhat', bg: 'violet', say: 'Direction le chantier.' },
    benjamin:   { skin: '#4f2c1a', hair: 'short', top: '#c9a46a', cut: 'stripes', face: 'goatee', bg: 'lime', say: 'CAO, câblage, code.' },
    chancelier: { skin: '#5a321e', hair: 'full', top: '#ffffff', cut: 'tie', bg: 'coral', say: 'CAO, certifié.' },
    isaa:       { skin: '#8b5535', hair: 'bun', top: '#1f1b2e', cut: 'sweater', acc: 'earrings', bg: 'sun', say: 'On s\'organise ?' },
    severina:   { skin: '#4a2a1a', hair: 'bun', top: '#2a2438', cut: 'tee', acc: 'glasses', bg: 'violet', say: 'Je prends les notes.' }
  };
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16), f = c => clamp(c + amt, 0, 255);
    return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  }
  function rng(seed) { let a = 0; for (const c of seed) a = (a * 31 + c.charCodeAt(0)) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // boucles posées le long d'un arc d'ellipse
  function curls(cx, cy, rx, ry, a0, a1, n, r, fill, rand, stroke = true) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const t = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180;
      const rr = r * (.8 + rand() * .45);
      out += `<circle cx="${(cx + rx * Math.cos(t)).toFixed(1)}" cy="${(cy + ry * Math.sin(t)).toFixed(1)}" r="${rr.toFixed(1)}" fill="${fill}"${stroke ? ` stroke="${INK}" stroke-width="2.5"` : ''}/>`;
    }
    return out;
  }
  function texture(cx, cy, rx, ry, n, color, rand) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand());
      out += `<circle cx="${(cx + Math.cos(a) * rx * d).toFixed(1)}" cy="${(cy + Math.sin(a) * ry * d).toFixed(1)}" r="${(1.4 + rand() * 1.6).toFixed(1)}" fill="${color}"/>`;
    }
    return out;
  }
  let uid = 0;
  const S3 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  function avatar(id) {
    const o = LOOK[id], u = `av${id}${uid++}`, rand = rng(id);
    const hair = '#17110d', hairHi = '#3d2c22', skinD = shade(o.skin, -22), skinL = shade(o.skin, 26), lip = shade(o.skin, -40);
    const body = 'M24 232 C24 184 56 160 100 160 C144 160 176 184 176 232 Z';
    let back = '', front = '', top = '', acc = '', fh = '';
    // ---- cheveux ----
    if (o.hair === 'afro') {
      back = `<ellipse cx="100" cy="64" rx="47" ry="38" fill="${hair}"/>${curls(100, 64, 47, 38, 0, 360, 30, 9.5, hair, rand)}`;
      front = `<path d="M58 96 C54 66 74 50 100 50 C126 50 146 66 142 96 C136 82 126 74 116 72 C104 76 94 76 84 72 C74 74 64 82 58 96Z" fill="${hair}"/>${texture(100, 58, 40, 22, 26, hairHi, rand)}`;
    }
    if (o.hair === 'short' || o.hair === 'full') {
      const ry = o.hair === 'full' ? 36 : 31, rr = o.hair === 'full' ? 8.5 : 7;
      front = `<path d="M58 96 C54 60 74 ${74 - ry} 100 ${74 - ry} C126 ${74 - ry} 146 60 142 96 C136 80 126 72 116 70 C104 74 96 74 84 70 C74 72 64 80 58 96Z" fill="${hair}"/>
        ${curls(100, 76, 42, ry, 186, 354, 17, rr, hair, rand)}${texture(100, 60, 34, 14, 22, hairHi, rand)}`;
    }
    if (o.hair === 'fade') {
      front = `<path d="M59 96 C56 58 76 42 100 42 C124 42 144 58 141 96 L137 94 C135 80 130 73 124 70 L76 70 C70 73 65 80 63 94Z" fill="${hair}" ${S3}/>
        <path d="M70 58 q15 -6 30 0 t30 0 M68 66 q16 -5 32 0 t32 0" fill="none" stroke="${hairHi}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M60 96 L63 110 M140 96 L137 110" stroke="${hair}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
    }
    if (o.hair === 'bun') {
      back = `<circle cx="100" cy="40" r="17" fill="${hair}"/>${curls(100, 40, 16, 16, 0, 360, 12, 6, hair, rand)}`;
      front = `<path d="M58 100 C54 58 76 46 100 46 C124 46 146 58 142 100 C136 78 120 66 100 66 C80 66 64 78 58 100Z" fill="${hair}" ${S3}/>
        <path d="M72 84 C76 64 88 54 100 52 M86 72 C90 60 96 54 100 52 M128 84 C124 64 112 54 100 52 M114 72 C110 60 104 54 100 52" fill="none" stroke="${hairHi}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    // ---- vêtements ----
    const clip = `<clipPath id="${u}c"><path d="${body}"/></clipPath>`;
    const collar = c => `<path d="M84 160 L100 176 L90 188 L78 168Z M116 160 L100 176 L110 188 L122 168Z" fill="${c}" ${S3}/>`;
    if (o.cut === 'jacket') top = `<path d="M86 162 L100 200 L114 162Z" fill="#fff6e5" ${S3}/><path d="M100 200 V232" stroke="#ffc83d" stroke-width="3"/><path d="M70 176 L80 232 M130 176 L120 232" stroke="#1f2b6a" stroke-width="3"/>`;
    if (o.cut === 'polo') top = `${collar('#c9d2d7')}<path d="M80 168 l20 8 l20 -8" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M100 176 V202" stroke="${INK}" stroke-width="3"/><circle cx="100" cy="186" r="2.5" fill="${INK}"/><circle cx="100" cy="196" r="2.5" fill="${INK}"/>`;
    if (o.cut === 'bands') top = `<g clip-path="url(#${u}c)"><rect x="0" y="186" width="200" height="22" fill="#fff6e5"/></g>${collar('#8a5a2b')}`;
    if (o.cut === 'vest') top = `<path d="M30 232 C34 196 56 172 84 164 L90 232Z M170 232 C166 196 144 172 116 164 L110 232Z" fill="#d7ff3d" ${S3}/><g clip-path="url(#${u}c)"><rect x="0" y="206" width="200" height="8" fill="#c9c9c9"/></g><path d="M86 162 L100 180 L114 162" fill="none" ${S3}/>`;
    if (o.cut === 'stripes') top = `<g clip-path="url(#${u}c)">${[40, 64, 88, 112, 136, 160].map(x => `<rect x="${x}" y="150" width="10" height="90" fill="${INK}" opacity=".85"/>`).join('')}</g>${collar('#c9a46a')}`;
    if (o.cut === 'tie') top = `<path d="M84 160 L100 174 L92 184 L80 166Z M116 160 L100 174 L108 184 L120 166Z" fill="#fff" ${S3}/><path d="M96 172 H104 L108 206 L100 222 L92 206Z" fill="${INK}"/>`;
    if (o.cut === 'sweater') top = `<path d="M84 160 L100 178 L116 160 L112 176 L100 186 L88 176Z" fill="#fff" ${S3}/><g clip-path="url(#${u}c)"><path d="M24 190 L64 170 M176 190 L136 170" stroke="#9a96a8" stroke-width="8"/></g>`;
    if (o.cut === 'tee') top = `<path d="M84 162 Q100 178 116 162" fill="none" ${S3}/>`;
    // ---- accessoires ----
    if (o.acc === 'hardhat') acc = `<path d="M56 80 C56 34 144 34 144 80Z" fill="#fff" ${S3}/><path d="M76 78 C76 50 86 42 100 40 M124 78 C124 50 114 42 100 40" fill="none" stroke="#e4e4e4" stroke-width="5"/><rect x="46" y="76" width="108" height="11" rx="5.5" fill="#fff" ${S3}/>`;
    if (o.acc === 'headphones') acc = `<path d="M58 100 C52 32 148 32 142 100" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><rect x="45" y="88" width="19" height="31" rx="8" fill="#ff6b4a" ${S3}/><rect x="136" y="88" width="19" height="31" rx="8" fill="#ff6b4a" ${S3}/>`;
    if (o.acc === 'glasses') acc = `<g fill="rgb(255 255 255 / .25)" ${S3}><rect x="72" y="56" width="22" height="16" rx="6"/><rect x="106" y="56" width="22" height="16" rx="6"/></g><path d="M94 63 H106" ${S3}/>`;
    if (o.acc === 'earrings') acc = `<path d="M60 118 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z M140 118 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z" fill="#ffc83d" stroke="${INK}" stroke-width="1.5"/>`;
    if (o.face === 'mustache') fh = `<path d="M90 117 q10 -5 20 0" fill="none" stroke="${hair}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (o.face === 'goatee') fh = `<path d="M92 117 q8 -4 16 0 M96 134 q4 6 8 0" fill="none" stroke="${hair}" stroke-width="3.5" stroke-linecap="round"/>`;
    const eye = x => `<ellipse cx="${x}" cy="101" rx="7" ry="6" fill="#fffdf7" ${S3.replace('3"', '2.2"')}/>`;
    const pupil = x => `<circle cx="${x}" cy="101.5" r="3.6" fill="#2a1a12"/><circle cx="${x + 1.3}" cy="100.2" r="1.2" fill="#fff"/>`;
    const lid = x => `<ellipse class="lid" cx="${x}" cy="101" rx="7.6" ry="6.6" fill="${skinD}"/>`;
    const blinkDelay = (-rand() * 5).toFixed(2);
    return `<svg class="av" viewBox="0 0 200 232" aria-hidden="true"><defs>${clip}
        <radialGradient id="${u}s" cx="42%" cy="36%" r="70%"><stop offset="0" stop-color="${skinL}"/><stop offset=".6" stop-color="${o.skin}"/><stop offset="1" stop-color="${skinD}"/></radialGradient></defs>
      <g class="bob">
        <g class="arm"><path d="M150 192 L154 262" stroke="${INK}" stroke-width="29" stroke-linecap="round"/><path d="M150 192 L154 262" stroke="${o.top}" stroke-width="23" stroke-linecap="round"/><circle cx="154" cy="266" r="12" fill="${o.skin}" ${S3}/></g>
        <path d="${body}" fill="${o.top}" ${S3}/>
        ${top}
        <path d="M86 126 h28 v36 c-8 6 -20 6 -28 0z" fill="${skinD}" ${S3}/>
        <g class="head" style="transform-origin:100px 150px">
          ${back}
          <ellipse cx="60" cy="102" rx="8" ry="11" fill="${o.skin}" ${S3}/><ellipse cx="140" cy="102" rx="8" ry="11" fill="${o.skin}" ${S3}/>
          <path d="M60 92 C60 60 78 50 100 50 C122 50 140 60 140 92 C140 124 124 145 100 145 C76 145 60 124 60 92Z" fill="url(#${u}s)" ${S3}/>
          ${front}
          <path d="M75 88 q9 -7 18 -2 M107 86 q9 -5 18 2" fill="none" stroke="${hair}" stroke-width="4.5" stroke-linecap="round"/>
          ${eye(85)}${eye(115)}
          <g class="pupils">${pupil(85)}${pupil(115)}</g>
          <g style="animation-delay:${blinkDelay}s">${lid(85).replace('class="lid"', `class="lid" style="animation-delay:${blinkDelay}s"`)}${lid(115).replace('class="lid"', `class="lid" style="animation-delay:${blinkDelay}s"`)}</g>
          <path d="M97 106 q-4 8 0 10 q3 2 6 0" fill="none" stroke="${skinD}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="74" cy="117" r="6.5" fill="#ff6b4a" opacity=".25"/><circle cx="126" cy="117" r="6.5" fill="#ff6b4a" opacity=".25"/>
          <path d="M88 122 Q100 134 112 122 Q100 127 88 122Z" fill="${lip}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
          ${fh}
          ${acc}
        </g>
      </g></svg>`;
  }

  window.KJAvatar = avatar;

  /* ================= Thème : clair par défaut ================= */
  const root = document.documentElement;
  try { if (localStorage.getItem('theme') === 'dark') root.dataset.theme = 'dark'; } catch (e) {}
  const isDark = () => root.dataset.theme === 'dark';
  $('#themeBtn').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    if (next === 'dark') root.dataset.theme = 'dark'; else delete root.dataset.theme;
    try { localStorage.setItem('theme', next); } catch (e) {}
    dispatchEvent(new Event('themechange'));
  });

  /* ================= Héros ================= */
  document.querySelectorAll('.tl .w').forEach((w, li) => {
    w.innerHTML = [...w.dataset.word].map((c, i) => `<span class="ch" style="animation-delay:${(reduce ? 0 : 1.55) + li * .12 + i * .05}s">${c}</span>`).join('');
  });
  document.querySelectorAll('.kj').forEach((k, i) => k.style.animationDelay = (1.75 + i * .12) + 's');
  $('#wordmark').innerHTML = [...'KATSUJINKEN'].map(c => `<span class="ch">${c}</span>`).join('');

  const crewOrder = ['isaa', 'angelo', 'ben', 'rohiel', 'chancelier', 'arnold', 'severina', 'benjamin'];
  $('#crew').innerHTML = crewOrder.map(id => `<button type="button" data-m="${id}" aria-label="${esc(byId[id].nom)}" data-cursor="Profil"><span class="bubble">${esc(first(byId[id]))} !</span>${avatar(id)}</button>`).join('');
  document.querySelectorAll('#crew .bob').forEach((g, i) => g.style.animationDelay = (-i * .45) + 's');

  const STK = [
    ['Yacht 1:40', 'lime', 4, 26, -8], ['IMOCA 60', 'coral', 74, 13, 7], ['Afyabora', 'sun', 81, 37, -5],
    ['Pont en H', 'violet', 2, 52, 6], ['LTspice', 'ink', 62, 6, -11], ['Titanic', 'coral', 44, 4, 4],
    ['SolidWorks', 'violet', 88, 58, 9], ['Froude = 1,11', 'sun', 24, 9, -4]
  ];
  // sur téléphone, les étiquettes se rangent à droite de la note manuscrite, loin du texte
  if (innerWidth < 760) [[55, 80, -8], [60, 86, 6], [50, 92, -5]].forEach((v, i) => { STK[i][2] = v[0]; STK[i][3] = v[1]; STK[i][4] = v[2]; });
  const stickers = $('#stickers');
  stickers.innerHTML = STK.map(([t, c, x, y, r], i) => `<div class="stk ${c}" style="left:${x}%;top:${y}%;rotate:${r}deg" data-cursor="Tirer">${esc(t)}</div>`).join('');
  let z = 10;
  stickers.addEventListener('pointerdown', e => {
    const s = e.target.closest('.stk'); if (!s) return;
    e.preventDefault(); s.setPointerCapture(e.pointerId); s.classList.add('drag'); s.style.zIndex = ++z;
    const host = stickers.getBoundingClientRect(), r = s.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    let lastX = e.clientX;
    const move = ev => {
      const maxX = 100 - r.width / host.width * 100;
      s.style.left = clamp((ev.clientX - ox - host.left) / host.width * 100, 0, maxX) + '%';
      s.style.top = clamp((ev.clientY - oy - host.top) / host.height * 100, 0, 95) + '%';
      s.style.rotate = clamp((ev.clientX - lastX) * 1.4, -20, 20) + 'deg'; lastX = ev.clientX;
    };
    const up = () => { s.classList.remove('drag'); s.style.rotate = (Math.random() * 16 - 8).toFixed(1) + 'deg'; s.removeEventListener('pointermove', move); s.removeEventListener('pointerup', up); };
    s.addEventListener('pointermove', move); s.addEventListener('pointerup', up);
  });

  /* ================= Bandeau défilant ================= */
  const star = `<svg viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5Z" fill="currentColor"/></svg>`;
  const words = ['活人剣', 'Yacht 1:40', 'IMOCA 60', 'Afyabora', 'Pont en H', 'Enceinte Bluetooth', 'Titanic', 'Usine libérée', 'Île Web', 'Kinshasa'];
  const run = words.map(w => `<span>${esc(w)} ${star}</span>`).join('');
  const track = $('#marquee'); track.innerHTML = run + run;
  let mx = 0, vel = 0, lastY = scrollY;
  addEventListener('scroll', () => { vel += (scrollY - lastY) * .25; lastY = scrollY; }, { passive: true });

  /* ================= Manifeste ================= */
  const scrub = $('#scrub');
  [...scrub.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) frag.append(t); else { const s = document.createElement('span'); s.className = 'wd'; s.textContent = t; frag.append(s); } });
      n.replaceWith(frag);
    } else n.classList.add('wd');
  });
  const wds = [...scrub.querySelectorAll('.wd')];
  if (!reduce) scrub.classList.add('armed'); else scrub.querySelectorAll('.mark,.scrib').forEach(e => e.classList.add('on'));
  const facts = [[D.membres.length, 'membres, de la mécanique au code'], [P.length, 'projets et PBL ce semestre'], [2431, 'tests automatisés sur Afyabora'], [669, 'mm : notre yacht au 1:40']];
  $('#facts').innerHTML = facts.map(([n, t]) => `<div><div class="v num" data-count="${n}">${n.toLocaleString('fr-FR')}</div><p>${esc(t)}</p></div>`).join('');

  /* ================= Projets : pile de cartes ================= */
  const featured = ['imoca', 'bateau', 'statique', 'pbl3eee', 'pbl4eee', 'pbl5meo', 'afyabora'];
  const colors = ['lime', 'violet', 'coral', 'ink', 'sun', 'violet', 'lime'];
  const caps = { bateau: 'GM > 0 : il tient debout !', imoca: 'notre IMOCA hybride', statique: 'au port ou en tempête ?', afyabora: 'lancée le 14 oct.', pbl3eee: 'la WBS de l\'enceinte', pbl4eee: 'système 1 en 3D', pbl5meo: 'la route des 9 outils' };
  const stack = $('#stack');
  stack.innerHTML = featured.map((id, i) => {
    const p = pById[id];
    return `<article class="pcard ${colors[i]}" style="--i:${i};--rot:${i % 2 ? -3 : 3}deg" data-p="${id}" data-cursor="Ouvrir" tabindex="0" role="button" aria-label="Ouvrir ${esc(p.titre)}">
      <div class="pc-text">
        <div class="no">${esc(p.n)}</div>
        <h3>${esc(p.titre)}</h3>
        <p>${esc(p.resume)}</p>
        <div class="tags"><span>${esc(p.sous)}</span><span>${esc(p.periode)}</span></div>
        <span class="btn">Lire la fiche <span class="ar">→</span></span>
      </div>
      <figure class="polar" style="margin:0"><span class="tape"></span><div class="pimg"><img src="${esc(p.cover)}" alt="" loading="lazy" class="${p.contain ? 'contain' : ''}"></div><span class="cap">${esc(caps[id])}</span></figure>
    </article>`;
  }).join('');
  const cards = [...stack.children];

  /* ================= Index ================= */
  const sorted = [...P].sort((a, b) => a.n.localeCompare(b.n));
  const idx = $('#idx');
  idx.innerHTML = sorted.map(p => `
    <div class="row" role="button" tabindex="0" data-p="${p.id}" data-cat="${esc(p.cat)}" data-img="${esc(p.cover || (p.images ? IMG + p.images[0][0] : ''))}" data-cursor="Lire" aria-label="Ouvrir ${esc(p.titre)}">
      <span class="n">${esc(p.n)}</span>
      <h4>${esc(p.titre)}<small>${esc(p.sous)}</small></h4>
      <span class="d">${esc(p.dom)} · ${esc(p.periode)}</span>
      <span class="ar" aria-hidden="true">→</span>
    </div>`).join('') + `<div class="empty" id="empty" hidden>Rien dans ce domaine.</div>`;
  const cats = ['Tous', ...new Set(sorted.map(p => p.cat))];
  $('#filters').innerHTML = cats.map((c, i) => `<button class="chip" type="button" id="f${i}" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('');
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $('#filters').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
    let n = 0; idx.querySelectorAll('.row').forEach(r => { const ok = b.dataset.cat === 'Tous' || r.dataset.cat === b.dataset.cat; r.hidden = !ok; if (ok) n++; });
    $('#empty').hidden = n > 0;
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  $('#others').innerHTML = `<b>Et aussi, côté membres :</b> ${esc(D.autres)}.`;
  const prev = $('#preview'), prevImg = prev.querySelector('img');
  let px = 0, py = 0, tx = 0, ty = 0;
  idx.addEventListener('mouseover', e => { const r = e.target.closest('.row'); if (r && r.dataset.img) { prevImg.src = r.dataset.img; prev.classList.add('on'); } });
  idx.addEventListener('mouseleave', () => prev.classList.remove('on'));

  /* ================= Yacht : calculateur + onglets ================= */
  const REAL = { loa: 26760, b: 6350, t: 1900, vol: 81.95, v: 16.46 };
  let rho = 1000;
  const nf = (n, d = 1) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  function calc() {
    const l = parseFloat($('#lam').value); $('#lamOut').textContent = nf(l, l % 1 ? 1 : 0);
    const loa = REAL.loa / l, volL = REAL.vol / Math.pow(l, 3) * 1000, ok = loa <= 700;
    $('#readout').innerHTML = `
      <div><div class="k">Longueur</div><div class="v">${nf(loa)} mm</div></div>
      <div><div class="k">Largeur</div><div class="v">${nf(REAL.b / l)} mm</div></div>
      <div><div class="k">Tirant d'eau</div><div class="v">${nf(REAL.t / l)} mm</div></div>
      <div><div class="k">Volume de carène</div><div class="v">${nf(volL, 2)} L</div></div>
      <div><div class="k">Masse cible</div><div class="v">${nf(volL * rho / 1000, 2)} kg</div></div>
      <div><div class="k">Vitesse d'essai</div><div class="v">${nf(REAL.v / Math.sqrt(l), 2)} m/s</div></div>
      <div class="verdict ${ok ? 'ok' : 'ko'}">${ok ? `Ça rentre : ${nf(700 - loa)} mm de marge sous les 700 mm.` : `Trop long de ${nf(loa - 700)} mm. Minimum : 1:38,2.`}</div>`;
  }
  $('#lam').addEventListener('input', calc);
  [['#rhoDouce', 1000], ['#rhoMer', 1025]].forEach(([s, r]) => $(s).addEventListener('click', () => { rho = r; $('#rhoDouce').setAttribute('aria-pressed', r === 1000); $('#rhoMer').setAttribute('aria-pressed', r === 1025); calc(); }));
  calc();
  const thumb = (src, cap, set) => `<button class="thumb" type="button" data-lb="${esc(set)}" data-src="${esc(IMG + src)}" data-cap="${esc(cap)}" data-cursor="Zoom"><img src="${esc(IMG + src)}" alt="${esc(cap)}" loading="lazy"></button>`;
  $('#tablist').innerHTML = D.bateauTabs.map((t, i) => `<button role="tab" type="button" id="tab${i}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}" data-i="${i}">${esc(t.k)} · ${esc(t.t)}</button>`).join('');
  function showTab(i) {
    const t = D.bateauTabs[i];
    $('#tablist').querySelectorAll('[role=tab]').forEach(b => { const on = +b.dataset.i === i; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    $('#tabpanel').innerHTML = `<div class="panel">
      <div><h3>${esc(t.t)}</h3>${t.p.map(x => `<p>${esc(x)}</p>`).join('')}<ul class="list">${t.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="thumbs">${t.img.length ? t.img.map(([s, c]) => thumb(s, c, 'tab')).join('') : `<p class="hand" style="font-size:26px;color:var(--violet);transform:rotate(-3deg)">pas de figure pour ce domaine, tout est dans le texte</p>`}</div>
    </div>`;
  }
  $('#tablist').addEventListener('click', e => { const b = e.target.closest('[role=tab]'); if (b) showTab(+b.dataset.i); });
  $('#tablist').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const cur = +$('#tablist [aria-selected="true"]').dataset.i, n = D.bateauTabs.length;
    const nx = (cur + (e.key === 'ArrowRight' ? 1 : n - 1)) % n; showTab(nx); $('#tab' + nx).focus();
  });
  showTab(0);

  /* ================= Savoir-faire ================= */
  const skc = ['var(--lime)', 'var(--coral)', 'var(--sun)', 'var(--cream)'];
  $('#skills').innerHTML = D.competences.map(([t, items, ou], i) => `
    <div class="sk-row" style="--c:${skc[i % 4]}">
      <h3>${esc(t)}</h3>
      <div class="chips">${items.map((x, j) => `<span style="--t:${((i + j) % 3 - 1) * 3}deg">${esc(x)}</span>`).join('')}</div>
      <div class="from">Vu dans : ${esc(ou)}</div>
    </div>`).join('');

  /* ================= Équipage ================= */
  $('#team').innerHTML = D.membres.map(m => `
    <button class="mate" type="button" data-m="${m.id}" data-cursor="Profil">
      <div class="mcard ${LOOK[m.id].bg}">
        ${avatar(m.id)}
        ${m.photo ? `<span class="pol"><img src="${esc(m.photo)}" alt="Portrait de ${esc(m.nom)}" loading="lazy"></span>` : ''}
        <span class="say">${esc(LOOK[m.id].say)}</span>
      </div>
      <h3>${esc(m.nom)}</h3><p>${esc(m.role)}</p>
    </button>`).join('');

  /* ================= Journal + contact ================= */
  $('#log').innerHTML = D.journal.map(([d, l, r, q]) => `<div class="log-row"><span class="d">${esc(d)}</span><span class="w">${esc(l)}</span><span>${esc(r)}</span><span class="who">${esc(first(byId[q]))}</span></div>`).join('');
  $('#thanks').textContent = 'Merci à nos encadrants : ' + D.encadrants;
  const toast = $('#toast');
  const say = msg => { toast.textContent = msg; toast.classList.add('on'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('on'), 1800); };
  if (D.email) {
    $('#mailBox').innerHTML = `<div class="mail-row"><a class="mail-link" id="mailText" href="mailto:${esc(D.email)}">${esc(D.email)}</a><button class="magnet small" id="copyBtn" type="button" data-cursor="Copier">Copier</button></div>`;
    $('#copyBtn').addEventListener('click', () => {
      const fb = () => { const r = document.createRange(); r.selectNodeContents($('#mailText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Adresse sélectionnée, faites Ctrl+C'); };
      try { navigator.clipboard.writeText(D.email).then(() => say('Adresse copiée'), fb); } catch (e) { fb(); }
    });
  } else {
    $('#mailBox').innerHTML = `<p class="mono" style="font-size:15px;opacity:.92">E-mail du groupe : bientôt</p>`;
  }

  /* ================= Panneau latéral ================= */
  const drawer = $('#drawer'), dWrap = $('#dWrap');
  const face = m => m.photo ? `<img src="${esc(m.photo)}" alt="" loading="lazy">` : `<i>${esc(m.nom[0])}</i>`;
  const open = (cls, crumb, hero, body) => {
    dWrap.className = cls; $('#dCrumb').textContent = crumb;
    $('#dBody').innerHTML = `<div class="d-hero">${hero}</div><div class="d-body">${body}</div>`;
    if (!drawer.open) drawer.showModal(); drawer.scrollTop = 0;
  };
  const people = p => {
    const ids = p.equipe === 'all' ? D.membres.map(m => m.id) : p.equipe;
    return `<div class="people">${ids.map(id => byId[id]).map(m => `<button type="button" data-m="${m.id}">${face(m)}${esc(first(m))}${p.lead === m.id ? ' · lead tech' : ''}</button>`).join('')}</div>`;
  };
  function openProject(id) {
    const p = pById[id]; if (!p) return;
    const fi = featured.indexOf(id), cls = fi >= 0 ? colors[fi] : ['violet', 'lime', 'coral', 'sun'][(+p.n) % 4];
    const kv = (p.chiffres || []).map(([k, v, s]) => `<div><div class="k">${esc(k)}</div><div class="v num">${esc(v)}${s ? `<small>${esc(s)}</small>` : ''}</div></div>`).join('');
    open(cls, `${p.n} · ${p.sous}`,
      `<div class="kicker">${esc(p.dom)} · ${esc(p.periode)} · ${esc(p.type)}</div><h2 id="dTitle">${esc(p.titre)}</h2><p class="lead">${esc(p.resume)}</p>`,
      `${p.probleme ? `<div><h4>Le problème</h4><p class="txt">${esc(p.probleme)}</p></div>` : ''}
       ${p.fait ? `<div><h4>Ce qu'on a fait</h4><ul class="list">${p.fait.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
       ${kv ? `<div><h4>Les chiffres</h4><div class="kv">${kv}</div></div>` : ''}
       ${p.limites ? `<div><h4>Ce qui reste ouvert</h4><p class="callout">${esc(p.limites)}</p></div>` : ''}
       ${p.livrables ? `<div><h4>Livrables</h4><p class="txt" style="color:var(--muted)">${esc(p.livrables)}</p></div>` : ''}
       ${p.images ? `<div><h4>Figures · ${p.images.length}</h4><div class="gallery">${p.images.map(([s, c]) => `<figure>${thumb(s, c, 'd')}<figcaption>${esc(c)}</figcaption></figure>`).join('')}</div></div>` : ''}
       ${p.section ? `<div><button class="btn hot" type="button" data-go="${p.section}">Voir la section du yacht <span class="ar">→</span></button></div>` : ''}
       <div><h4>L'équipe</h4>${p.roles ? `<p class="txt" style="margin-bottom:14px;color:var(--muted)">${esc(p.roles)}</p>` : ''}${people(p)}</div>`);
  }
  function openMember(id, tab = 'about') {
    const m = byId[id]; if (!m) return;
    const cited = P.filter(p => p.lead === id || (Array.isArray(p.equipe) && p.equipe.includes(id)));
    const tabs = [['about', 'À propos'], ['path', 'Parcours'], ['skills', 'Compétences'], ['work', 'Projets']];
    open(LOOK[id].bg, 'Équipage',
      `<div class="d-member"><div class="pic">${m.photo ? `<img src="${esc(m.photo)}" alt="Portrait de ${esc(m.nom)}">` : avatar(id)}</div>
        <div><div class="kicker">${esc(m.role)}</div><h2 id="dTitle">${esc(m.nom)}</h2>${m.surnom ? `<p class="hand" style="font-size:30px;margin-top:8px">« ${esc(m.surnom)} »</p>` : ''}<p class="lead">${esc(m.bio)}</p></div></div>
       <div class="mtabs" role="tablist" aria-label="Profil de ${esc(first(m))}">${tabs.map(([k, l]) => `<button type="button" role="tab" data-mt="${k}" data-mid="${id}" aria-selected="${k === tab}">${l}</button>`).join('')}</div>`,
      `<div id="mPanel"></div>`);
    showMemberTab(id, tab, cited);
  }
  function showMemberTab(id, tab, cited) {
    const m = byId[id];
    cited = cited || P.filter(p => p.lead === id || (Array.isArray(p.equipe) && p.equipe.includes(id)));
    document.querySelectorAll('.mtabs [data-mt]').forEach(b => b.setAttribute('aria-selected', b.dataset.mt === tab));
    const panel = $('#mPanel'); let html = '';
    const row = (k, v) => v ? `<div><h4>${k}</h4><p class="txt">${esc(v)}</p></div>` : '';
    if (tab === 'about') html = `<p class="about-txt">${esc(m.apropos || m.bio)}</p>
      ${m.skills.length ? `<div><h4>En quelques mots</h4><div class="people">${m.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>` : ''}
      ${row('Langues', m.langues)}${row("Centres d'intérêt", m.interets)}
      ${(m.liens || []).length ? `<div><h4>En ligne</h4><div class="people">${m.liens.map(([l, u]) => `<a class="txt-link" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join('')}</div></div>` : ''}
      <button class="btn hot" type="button" data-mt="path" data-mid="${id}">Voir son parcours <span class="ar">→</span></button>`;
    if (tab === 'path') html = `<div class="road" id="road"><svg class="road-svg" aria-hidden="true"><path class="road-bed"/><path class="road-line"/></svg>
      ${(m.parcours || []).map(([d, t, x], i) => `<div class="stop ${i % 2 ? 'r' : 'l'}" style="--d:${i * .12 + .2}s"><span class="pin"><span class="pin-n">${i + 1}</span></span><div class="stop-card"><span class="when">${esc(d || 'Étape ' + (i + 1))}</span><h5>${esc(t)}</h5><p>${esc(x)}</p></div></div>`).join('')}
      <div class="stop end ${(m.parcours || []).length % 2 ? 'r' : 'l'}" style="--d:${(m.parcours || []).length * .12 + .2}s"><span class="pin"><span class="pin-n">?</span></span><div class="stop-card"><span class="when">La suite</span><h5>À écrire ensemble</h5><p>Stage, projet, rencontre : la prochaine étape commence peut-être ici.</p></div></div></div>`;
    if (tab === 'skills') html = (m.competences || []).length
      ? `<div class="skill-groups">${m.competences.map(([g, items], i) => `<div class="sg" style="--d:${i * .08}s"><h4>${esc(g)}</h4><div class="people">${items.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>`).join('')}</div>`
      : `<p class="hand" style="font-size:26px;color:var(--muted)">Compétences à venir : la fiche arrive bientôt.</p>`;
    if (tab === 'work') {
      const others = P.filter(p => !cited.includes(p) && p.equipe === 'all');
      html = `${cited.length ? `<div><h4>Rôle cité dans</h4><div class="people">${cited.map(p => `<button type="button" class="txt" data-p="${p.id}">${esc(p.titre)}</button>`).join('')}</div></div>` : ''}
        <div><h4>Avec tout le Groupe 1</h4><div class="people">${others.map(p => `<button type="button" class="txt" data-p="${p.id}">${esc(p.n)} · ${esc(p.titre)}</button>`).join('')}</div></div>`;
    }
    panel.innerHTML = `<div class="mpanel">${html}</div>`;
    if (tab === 'path') requestAnimationFrame(() => drawRoad());
  }
  // route sinueuse qui relie les étapes du parcours
  function drawRoad() {
    const road = $('#road'); if (!road) return;
    const svg = road.querySelector('svg'), rb = road.getBoundingClientRect();
    const pts = [...road.querySelectorAll('.pin')].map(p => { const r = p.getBoundingClientRect(); return [r.left + r.width / 2 - rb.left, r.top + r.height / 2 - rb.top]; });
    if (pts.length < 2) return;
    svg.setAttribute('viewBox', `0 0 ${rb.width} ${rb.height}`);
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2; d += ` C${x0} ${my} ${x1} ${my} ${x1} ${y1}`; }
    svg.querySelectorAll('path').forEach(p => p.setAttribute('d', d));
    const len = svg.querySelector('.road-bed').getTotalLength();
    svg.style.setProperty('--len', len);
    road.classList.remove('go'); void road.offsetWidth; road.classList.add('go');
  }
  addEventListener('resize', () => { if ($('#road')) drawRoad(); });
  $('#dClose').addEventListener('click', () => drawer.close());

  /* ================= Visionneuse ================= */
  const lb = $('#lb'); let gal = [], li = 0;
  function openLb(btn) {
    const scope = btn.closest('#drawer, #tabpanel') || document;
    gal = [...scope.querySelectorAll(`[data-lb="${btn.dataset.lb}"]`)];
    li = Math.max(0, gal.indexOf(btn)); showLb(); if (!lb.open) lb.showModal();
  }
  function showLb() {
    const b = gal[li], img = $('#lbImg');
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    img.src = b.dataset.src; img.alt = b.dataset.cap; $('#lbCap').textContent = b.dataset.cap;
    $('#lbCount').textContent = `${li + 1} / ${gal.length}`;
    $('#lbPrev').hidden = $('#lbNext').hidden = gal.length < 2;
  }
  const step = d => { li = (li + d + gal.length) % gal.length; showLb(); };
  $('#lbPrev').addEventListener('click', () => step(-1));
  $('#lbNext').addEventListener('click', () => step(1));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });

  document.addEventListener('click', e => {
    if (e.target === drawer) return drawer.close();
    const t = e.target.closest('[data-lb]'); if (t) return openLb(t);
    const mt = e.target.closest('[data-mt]'); if (mt) { showMemberTab(mt.dataset.mid, mt.dataset.mt); if (mt.classList.contains('btn')) drawer.scrollTo({ top: $('.mtabs').offsetTop - 70, behavior: 'smooth' }); return; }
    const m = e.target.closest('[data-m]'), p = e.target.closest('[data-p]'), g = e.target.closest('[data-go]');
    if (m) openMember(m.dataset.m);
    else if (p) openProject(p.dataset.p);
    else if (g) { drawer.close(); const el = document.getElementById(g.dataset.go); window.KJ?.scrollTo ? window.KJ.scrollTo(el) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  });
  document.addEventListener('keydown', e => {
    const r = e.target.closest && e.target.closest('.row,.pcard');
    if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProject(r.dataset.p); }
  });

  /* ================= Titres découpés en lettres (animés par motion.js) ================= */
  document.querySelectorAll('.split').forEach(el => {
    const parts = el.textContent.trim().split(/\s+/);
    el.innerHTML = parts.map(w => `<span class="w">${[...w].map(c => `<span class="c">${esc(c)}</span>`).join('')}</span>`).join(' ');
  });

  /* ================= Compteurs ================= */
  if (!reduce && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, t0 = performance.now();
      const tick = now => { const q = Math.min(1, (now - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - q, 4))).toLocaleString('fr-FR'); if (q < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
  }

  /* ================= Curseur, aimants, regards ================= */
  const cur = $('#cursor'), dot = cur.querySelector('.c-dot'), ring = cur.querySelector('.c-ring'), label = $('#cLabel');
  let cx = innerWidth / 2, cy = innerHeight * .4, rx = cx, ry = cy, hasPointer = false;
  addEventListener('pointermove', e => { cx = e.clientX; cy = e.clientY; tx = cx; ty = cy; if (e.pointerType === 'mouse') hasPointer = true; }, { passive: true });
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('big', !!t); if (t) label.textContent = t.dataset.cursor;
    });
    addEventListener('pointermove', e => {
      document.querySelectorAll('.magnet,.btn.hot').forEach(m => {
        const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        m.style.translate = Math.hypot(dx, dy) < 140 ? `${dx * .25}px ${dy * .25}px` : '';
      });
    }, { passive: true });
  }
  // Chaque personnage suit la souris des yeux et penche la tête ; sans souris, il regarde autour de lui.
  const faces = [...document.querySelectorAll('svg.av')].map(svg => ({ svg, pupils: svg.querySelector('.pupils'), head: svg.querySelector('.head'), x: 0, y: 0, r: 0, gx: 0, gy: 0 }));
  if (!reduce) setInterval(() => { if (!hasPointer) faces.forEach(f => { f.gx = (Math.random() * 2 - 1); f.gy = (Math.random() * 1.4 - .7); }); }, 2200);

  function loop() {
    if (fine && !reduce) {
      rx += (cx - rx) * .18; ry += (cy - ry) * .18;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      px += (tx - px) * .12; py += (ty - py) * .12;
      prev.style.left = px + 'px'; prev.style.top = py + 'px';
    }
    if (!reduce) {
      vel *= .9; mx -= .6 + Math.abs(vel) * .5;
      const half = track.scrollWidth / 2; if (half && -mx > half) mx += half;
      track.style.transform = `translateX(${mx}px)`;

      const r = scrub.getBoundingClientRect(), vh = innerHeight;
      const q = clamp((vh * .85 - r.top) / (r.height + vh * .35));
      const lit = Math.round(q * wds.length);
      wds.forEach((w, i) => { const on = i < lit; w.classList.toggle('lit', on); if (w.matches('.mark,.scrib')) w.classList.toggle('on', on); });

      // pile de cartes : la carte recouverte bascule en arrière, rétrécit et s'assombrit ;
      // la suivante arrive inclinée puis se pose à plat en atteignant sa place
      cards.forEach((c, i) => {
        const a = c.getBoundingClientRect(), nx = cards[i + 1];
        const stick = parseFloat(getComputedStyle(c).top) || 0;
        const k = nx ? clamp(1 - (nx.getBoundingClientRect().top - a.top) / a.height) : 0;
        const e = clamp((a.top - stick) / (innerHeight * .7));
        const tilt = (i % 2 ? 1 : -1) * 6 * e;
        c.style.transform = `perspective(1400px) translateY(${(-k * 18).toFixed(1)}px) rotateX(${(k * 9).toFixed(2)}deg) rotate(${tilt.toFixed(2)}deg) scale(${(1 - k * .12).toFixed(3)})`;
        c.style.filter = k > .01 ? `brightness(${(1 - k * .35).toFixed(3)}) saturate(${(1 - k * .3).toFixed(3)})` : '';
      });

      for (const f of faces) {
        const b = f.svg.getBoundingClientRect();
        if (b.bottom < 0 || b.top > innerHeight || !b.width) continue;
        let gx = f.gx, gy = f.gy;
        if (hasPointer) {
          const dx = cx - (b.left + b.width / 2), dy = cy - (b.top + b.height * .42), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
          gx = dx / d * k; gy = dy / d * k;
        }
        f.x += (gx - f.x) * .15; f.y += (gy - f.y) * .15; f.r += (gx * 6 - f.r) * .08;
        f.pupils.setAttribute('transform', `translate(${(f.x * 2.8).toFixed(2)} ${(f.y * 2.4).toFixed(2)})`);
        f.head.style.transform = `rotate(${f.r.toFixed(2)}deg)`;
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
