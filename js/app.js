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
  const LOOK = {
    angelo:     { skin: '#8a5a3c', hair: 'short', top: '#2b3a8c', cut: 'jacket', bg: 'lime' },
    rohiel:     { skin: '#6a3f28', hair: 'high', top: '#a9b4ba', cut: 'polo', acc: 'headphones', bg: 'coral' },
    arnold:     { skin: '#7a4b30', hair: 'short', top: '#8a5a2b', cut: 'bands', bg: 'sun' },
    ben:        { skin: '#6b3f27', hair: 'short', top: '#a8d8ff', cut: 'vest', acc: 'hardhat', bg: 'violet' },
    benjamin:   { skin: '#5a3420', hair: 'short', top: '#c9a46a', cut: 'stripes', bg: 'lime' },
    chancelier: { skin: '#6e4330', hair: 'afro', top: '#ffffff', cut: 'tie', bg: 'coral' },
    isaa:       { skin: '#7c4a30', hair: 'bun', top: '#1f1b2e', cut: 'sweater', acc: 'earrings', bg: 'sun' },
    severina:   { skin: '#5d3622', hair: 'bun', top: '#2a2438', cut: 'tee', acc: 'glasses', bg: 'violet' }
  };
  const S3 = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  function avatar(id) {
    const o = LOOK[id], u = 'a' + id, hair = '#1b1410';
    const body = 'M24 232 C24 184 56 160 100 160 C144 160 176 184 176 232 Z';
    let back = '', front = '', top = '', acc = '';
    if (o.hair === 'afro') back = `<circle cx="100" cy="72" r="52" fill="${hair}" ${S3}/>`;
    if (o.hair === 'bun') back = `<circle cx="100" cy="44" r="17" fill="${hair}" ${S3}/>`;
    const caps = {
      short: 'M59 94 C56 50 144 50 141 94 C134 74 118 66 100 66 C82 66 66 74 59 94Z',
      afro: 'M58 96 C52 52 148 52 142 96 C134 76 118 70 100 70 C82 70 66 76 58 96Z',
      high: 'M60 90 C60 74 64 46 70 38 Q100 26 130 38 C136 46 140 74 140 90 C132 72 118 64 100 64 C82 64 68 72 60 90Z',
      bun: 'M59 96 C56 56 144 56 141 96 C132 74 116 64 100 64 C84 64 68 74 59 96Z'
    };
    front = `<path d="${caps[o.hair]}" fill="${hair}" ${S3}/>`;
    // vêtements
    const clip = `<clipPath id="${u}c"><path d="${body}"/></clipPath>`;
    if (o.cut === 'jacket') top = `<path d="M86 162 L100 200 L114 162Z" fill="#fff6e5" ${S3}/><path d="M100 200 V232" stroke="#ffc83d" stroke-width="3"/>`;
    if (o.cut === 'polo') top = `<path d="M84 160 L100 176 L90 188 L78 168Z M116 160 L100 176 L110 188 L122 168Z" fill="#c9d2d7" ${S3}/><path d="M100 176 V200" stroke="${INK}" stroke-width="3"/><circle cx="100" cy="190" r="2.5" fill="${INK}"/>`;
    if (o.cut === 'bands') top = `<g clip-path="url(#${u}c)"><rect x="0" y="190" width="200" height="20" fill="#fff6e5"/></g><path d="M84 160 L100 176 L90 188 L78 168Z M116 160 L100 176 L110 188 L122 168Z" fill="#8a5a2b" ${S3}/>`;
    if (o.cut === 'vest') top = `<path d="M30 232 C34 196 56 172 84 164 L90 232Z M170 232 C166 196 144 172 116 164 L110 232Z" fill="#d7ff3d" ${S3}/><g clip-path="url(#${u}c)"><rect x="0" y="206" width="200" height="8" fill="#c9c9c9"/></g><path d="M86 162 L100 180 L114 162" fill="none" ${S3}/>`;
    if (o.cut === 'stripes') top = `<g clip-path="url(#${u}c)">${[40, 64, 88, 112, 136, 160].map(x => `<rect x="${x}" y="150" width="10" height="90" fill="${INK}" opacity=".85"/>`).join('')}</g><path d="M84 160 L100 176 L90 188 L78 168Z M116 160 L100 176 L110 188 L122 168Z" fill="#c9a46a" ${S3}/>`;
    if (o.cut === 'tie') top = `<path d="M84 160 L100 174 L92 184 L80 166Z M116 160 L100 174 L108 184 L120 166Z" fill="#fff" ${S3}/><path d="M96 172 H104 L108 206 L100 222 L92 206Z" fill="${INK}"/>`;
    if (o.cut === 'sweater') top = `<path d="M84 160 L100 178 L116 160 L112 176 L100 186 L88 176Z" fill="#fff" ${S3}/><g clip-path="url(#${u}c)"><path d="M24 190 L64 170 M176 190 L136 170" stroke="#9a96a8" stroke-width="8"/></g>`;
    if (o.cut === 'tee') top = `<path d="M84 162 Q100 178 116 162" fill="none" ${S3}/>`;
    if (o.acc === 'hardhat') acc = `<path d="M56 80 C56 36 144 36 144 80Z" fill="#fff" ${S3}/><rect x="46" y="76" width="108" height="11" rx="5.5" fill="#fff" ${S3}/><path d="M100 42 V78" stroke="${INK}" stroke-width="3"/>`;
    if (o.acc === 'headphones') acc = `<path d="M58 100 C52 34 148 34 142 100" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><rect x="46" y="88" width="18" height="30" rx="8" fill="#ff6b4a" ${S3}/><rect x="136" y="88" width="18" height="30" rx="8" fill="#ff6b4a" ${S3}/>`;
    if (o.acc === 'glasses') acc = `<g fill="none" ${S3}><circle cx="84" cy="64" r="11"/><circle cx="116" cy="64" r="11"/><path d="M95 64 H105"/></g>`;
    if (o.acc === 'earrings') acc = `<path d="M60 116 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z M140 116 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z" fill="#ffc83d" stroke="${INK}" stroke-width="1.5"/>`;
    const skinD = shade(o.skin, -18);
    return `<svg class="av" viewBox="0 0 200 232" aria-hidden="true"><defs>${clip}</defs><g class="bob">
      ${back}
      <path d="${body}" fill="${o.top}" ${S3}/>
      ${top}
      <path d="M86 128 h28 v34 c-8 6 -20 6 -28 0z" fill="${skinD}" ${S3}/>
      <ellipse cx="60" cy="102" rx="8" ry="11" fill="${o.skin}" ${S3}/><ellipse cx="140" cy="102" rx="8" ry="11" fill="${o.skin}" ${S3}/>
      <ellipse cx="100" cy="98" rx="40" ry="45" fill="${o.skin}" ${S3}/>
      ${front}
      <path d="M76 88 q9 -6 17 -1 M107 87 q8 -5 17 1" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse class="eye" cx="85" cy="101" rx="4.5" ry="5.8" fill="${INK}"/><ellipse class="eye" cx="115" cy="101" rx="4.5" ry="5.8" fill="${INK}"/>
      <path d="M101 104 q-6 9 1 11" fill="none" stroke="${skinD}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="76" cy="116" r="6" fill="#ff6b4a" opacity=".28"/><circle cx="124" cy="116" r="6" fill="#ff6b4a" opacity=".28"/>
      <path d="M88 122 q12 10 24 0" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>
      ${acc}
    </g></svg>`;
  }
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16), f = c => clamp(c + amt, 0, 255);
    return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  /* ================= Thème ================= */
  const root = document.documentElement, sysDark = matchMedia('(prefers-color-scheme: dark)');
  try { const t = localStorage.getItem('theme'); if (t === 'dark' || t === 'light') root.dataset.theme = t; } catch (e) {}
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : sysDark.matches;
  $('#themeBtn').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next; try { localStorage.setItem('theme', next); } catch (e) {}
    dispatchEvent(new Event('themechange'));
  });

  /* ================= Héros ================= */
  document.querySelectorAll('.tl .w').forEach((w, li) => {
    w.innerHTML = [...w.dataset.word].map((c, i) => `<span class="ch" style="animation-delay:${(reduce ? 0 : 1.55) + li * .12 + i * .05}s">${c}</span>`).join('');
  });
  document.querySelectorAll('.kj').forEach((k, i) => k.style.animationDelay = (1.75 + i * .12) + 's');
  $('#wordmark').innerHTML = [...'KATSUJINKEN'].map(c => `<span class="ch">${c}</span>`).join('');

  const crewOrder = ['isaa', 'angelo', 'ben', 'rohiel', 'chancelier', 'arnold', 'severina', 'benjamin'];
  $('#crew').innerHTML = crewOrder.map((id, i) => `<button type="button" data-m="${id}" aria-label="${esc(byId[id].nom)}" data-cursor="Profil" style="--d:${i}"><span class="bubble">${esc(first(byId[id]))} !</span>${avatar(id)}</button>`).join('');
  document.querySelectorAll('#crew .bob').forEach((g, i) => g.style.animationDelay = (-i * .45) + 's');

  const STK = [
    ['Yacht 1:40', 'lime', 4, 26, -8], ['IMOCA 60', 'coral', 74, 13, 7], ['Afyabora', 'sun', 81, 37, -5],
    ['Pont en H', 'violet', 2, 52, 6], ['LTspice', 'ink', 62, 6, -11], ['Titanic', 'coral', 44, 4, 4],
    ['SolidWorks', 'violet', 88, 58, 9], ['Froude = 1,11', 'sun', 24, 9, -4]
  ];
  const stickers = $('#stickers');
  stickers.innerHTML = STK.map(([t, c, x, y, r], i) => `<div class="stk ${c}" style="left:${x}%;top:${y}%;rotate:${r}deg;animation-delay:${2 + i * .08}s" data-cursor="Tirer">${esc(t)}</div>`).join('');
  let z = 10;
  stickers.addEventListener('pointerdown', e => {
    const s = e.target.closest('.stk'); if (!s) return;
    e.preventDefault(); s.setPointerCapture(e.pointerId); s.classList.add('drag'); s.style.zIndex = ++z;
    const host = stickers.getBoundingClientRect(), r = s.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    let lastX = e.clientX;
    const move = ev => {
      s.style.left = ((ev.clientX - ox - host.left) / host.width * 100) + '%';
      s.style.top = ((ev.clientY - oy - host.top) / host.height * 100) + '%';
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

  /* ================= Manifeste : mots qui s'allument ================= */
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
  const featured = ['bateau', 'imoca', 'afyabora', 'pbl3eee', 'pbl4eee', 'pbl5meo'];
  const colors = ['violet', 'lime', 'coral', 'ink', 'sun', 'violet'];
  const caps = { bateau: 'GM > 0 : il tient debout !', imoca: 'notre IMOCA hybride', afyabora: 'lancée le 14 oct.', pbl3eee: 'la WBS de l\'enceinte', pbl4eee: 'système 1 en 3D', pbl5meo: 'la route des 9 outils' };
  const stack = $('#stack');
  stack.innerHTML = featured.map((id, i) => {
    const p = pById[id];
    return `<article class="pcard ${colors[i]}" style="--i:${i};--rot:${i % 2 ? -3 : 3}deg" data-p="${id}" data-cursor="Ouvrir" tabindex="0" role="button" aria-label="Ouvrir ${esc(p.titre)}">
      <div>
        <div class="no">${esc(p.n)}</div>
        <h3>${esc(p.titre)}</h3>
        <p>${esc(p.resume)}</p>
        <div class="tags"><span>${esc(p.sous)}</span><span>${esc(p.periode)}</span></div>
        <span class="btn">Lire la fiche <span class="ar">→</span></span>
      </div>
      <figure class="polar" style="margin:0"><span class="tape"></span><img src="${esc(p.cover)}" alt="" loading="lazy" class="${p.contain ? 'contain' : ''}"><span class="cap">${esc(caps[id])}</span></figure>
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
  });
  $('#others').innerHTML = `<b>Et aussi, côté membres :</b> ${esc(D.autres)}.`;

  // aperçu qui suit la souris
  const prev = $('#preview'), prevImg = prev.querySelector('img');
  let px = 0, py = 0, tx = 0, ty = 0;
  idx.addEventListener('mouseover', e => { const r = e.target.closest('.row'); if (r && r.dataset.img) { prevImg.src = r.dataset.img; prev.classList.add('on'); } });
  idx.addEventListener('mouseleave', () => prev.classList.remove('on'));
  idx.addEventListener('mouseout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('.row')) prev.classList.remove('on'); });

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
      <div class="from">↳ ${esc(ou)}</div>
    </div>`).join('');

  /* ================= Équipage ================= */
  $('#team').innerHTML = D.membres.map(m => `
    <button class="mate reveal" type="button" data-m="${m.id}" data-cursor="Profil">
      <div class="flip">
        <div class="face front ${LOOK[m.id].bg}">${avatar(m.id)}</div>
        <div class="face back">${m.photo ? `<img src="${esc(m.photo)}" alt="Portrait de ${esc(m.nom)}" loading="lazy">` : ''}<span>${esc(first(m))}</span></div>
      </div>
      <h3>${esc(m.nom)}</h3><p>${esc(m.role)}</p>
    </button>`).join('');

  /* ================= Journal + contact ================= */
  $('#log').innerHTML = D.journal.map(([d, l, r, q]) => `<div class="log-row"><span class="d">${esc(d)}</span><span class="w">${esc(l)}</span><span>${esc(r)}</span><span class="who">${esc(first(byId[q]))}</span></div>`).join('');
  $('#thanks').textContent = 'Merci à nos encadrants : ' + D.encadrants;
  const toast = $('#toast');
  const say = msg => { toast.textContent = msg; toast.classList.add('on'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('on'), 1800); };
  if (D.email) {
    $('#mailBox').innerHTML = `<button class="magnet" id="copyBtn" type="button" data-cursor="Copier">Copier notre e-mail</button><p class="mono" style="margin-top:18px;font-size:16px;user-select:all" id="mailText">${esc(D.email)}</p>`;
    $('#copyBtn').addEventListener('click', () => {
      const fb = () => { const r = document.createRange(); r.selectNodeContents($('#mailText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Adresse sélectionnée, faites Ctrl+C'); };
      try { navigator.clipboard.writeText(D.email).then(() => say('Adresse copiée'), fb); } catch (e) { fb(); }
    });
  } else {
    $('#mailBox').innerHTML = `<a class="magnet" href="https://www.instagram.com/tumaini_group1/" target="_blank" rel="noopener" data-cursor="Go">Écrivez-nous sur Instagram ↗</a><p class="mono" style="margin-top:18px;font-size:14px;opacity:.75">E-mail du groupe : bientôt</p>`;
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
  function openMember(id) {
    const m = byId[id]; if (!m) return;
    const row = (k, v) => v ? `<div><h4>${k}</h4><p class="txt">${esc(v)}</p></div>` : '';
    const projs = P.filter(p => p.lead === id || (Array.isArray(p.equipe) && p.equipe.includes(id)));
    open(LOOK[id].bg, 'Équipage',
      `<div class="d-member"><div class="pic">${m.photo ? `<img src="${esc(m.photo)}" alt="Portrait de ${esc(m.nom)}">` : avatar(id)}</div>
        <div><div class="kicker">${esc(m.role)}</div><h2 id="dTitle">${esc(m.nom)}</h2>${m.surnom ? `<p class="hand" style="font-size:30px;margin-top:8px">« ${esc(m.surnom)} »</p>` : ''}<p class="lead">${esc(m.bio)}</p></div></div>`,
      `${m.skills.length ? `<div><h4>Compétences</h4><div class="people">${m.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>` : ''}
       ${row('Parcours', m.parcours)}${row('Stages et engagements', m.engagements)}${row('Langues', m.langues)}
       ${projs.length ? `<div><h4>Rôle cité dans</h4><div class="people">${projs.map(p => `<button type="button" class="txt" data-p="${p.id}">${esc(p.titre)}</button>`).join('')}</div></div>` : ''}
       <p class="hand" style="font-size:24px;color:var(--muted)">membre de tous les PBL du Groupe 1</p>`);
  }
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

  /* ================= Clics délégués ================= */
  document.addEventListener('click', e => {
    if (e.target === drawer) return drawer.close();
    const t = e.target.closest('[data-lb]'); if (t) return openLb(t);
    const m = e.target.closest('[data-m]'), p = e.target.closest('[data-p]'), g = e.target.closest('[data-go]');
    if (m) openMember(m.dataset.m);
    else if (p) openProject(p.dataset.p);
    else if (g) { drawer.close(); document.getElementById(g.dataset.go).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  });
  document.addEventListener('keydown', e => {
    const r = e.target.closest && e.target.closest('.row,.pcard');
    if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProject(r.dataset.p); }
  });

  /* ================= Titres découpés + apparitions ================= */
  document.querySelectorAll('.split').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="w"><span style="transition-delay:${i * .08}s">${esc(w)}</span></span>`).join(' ');
  });
  if (!reduce && 'IntersectionObserver' in window) {
    const els = [...document.querySelectorAll('.reveal,.split')].filter(el => el.getBoundingClientRect().top > innerHeight);
    els.forEach(el => el.classList.add('pre'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    let k = 0; els.forEach(el => { if (el.matches('.mate,.calc')) el.style.transitionDelay = (k++ % 4) * 80 + 'ms'; io.observe(el); });

    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, t0 = performance.now();
      const tick = now => { const q = Math.min(1, (now - t0) / 1500); el.textContent = Math.round(end * (1 - Math.pow(1 - q, 4))).toLocaleString('fr-FR'); if (q < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
  }

  /* ================= Curseur + aimants ================= */
  const cur = $('#cursor'), dot = cur.querySelector('.c-dot'), ring = cur.querySelector('.c-ring'), label = $('#cLabel');
  let cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', e => { cx = e.clientX; cy = e.clientY; tx = cx; ty = cy; }, { passive: true });
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('big', !!t); if (t) label.textContent = t.dataset.cursor;
    });
  }
  const magnets = () => document.querySelectorAll('.magnet,.btn.hot');
  if (fine && !reduce) addEventListener('pointermove', e => {
    magnets().forEach(m => {
      const r = m.getBoundingClientRect(), mx2 = r.left + r.width / 2, my2 = r.top + r.height / 2;
      const dx = e.clientX - mx2, dy = e.clientY - my2, d = Math.hypot(dx, dy);
      m.style.transform = d < 140 ? `translate(${dx * .25}px,${dy * .25}px)` : '';
    });
  }, { passive: true });

  /* ================= Boucle d'animation ================= */
  function loop() {
    // curseur
    if (fine && !reduce) {
      rx += (cx - rx) * .18; ry += (cy - ry) * .18;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      px += (tx - px) * .12; py += (ty - py) * .12;
      prev.style.left = px + 'px'; prev.style.top = py + 'px';
    }
    // bandeau
    if (!reduce) {
      vel *= .9; mx -= .6 + Math.abs(vel) * .5;
      const half = track.scrollWidth / 2; if (half && -mx > half) mx += half;
      track.style.transform = `translateX(${mx}px)`;
    }
    // manifeste
    if (!reduce) {
      const r = scrub.getBoundingClientRect(), vh = innerHeight;
      const q = clamp((vh * .85 - r.top) / (r.height + vh * .35));
      const lit = Math.round(q * wds.length);
      wds.forEach((w, i) => { const on = i < lit; w.classList.toggle('lit', on); if (w.matches('.mark,.scrib')) w.classList.toggle('on', on); });
    }
    // pile de cartes : les précédentes reculent
    if (!reduce) cards.forEach((c, i) => {
      const nx = cards[i + 1]; if (!nx) return;
      const r = c.getBoundingClientRect(), n = nx.getBoundingClientRect();
      const q = clamp(1 - (n.top - r.top) / r.height);
      c.style.transform = `scale(${1 - q * .06})`; c.style.filter = `brightness(${1 - q * .18})`;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
