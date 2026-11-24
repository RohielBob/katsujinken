/* Animations au défilement : défilement doux (Lenis) + GSAP ScrollTrigger.
   Tout part de l'état visible : si une bibliothèque ne charge pas, la page reste lisible. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('progress');
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }, { passive: true });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mobile = matchMedia('(max-width: 760px)').matches;

  /* Apparitions : déclenchées par ce qui est réellement visible (fiable même si des images se chargent en route) */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) fire(e.target); }), { rootMargin: '0px 0px -8% 0px' });
  const pending = new Set();
  const fire = el => { if (!pending.has(el)) return; pending.delete(el); io.unobserve(el); (el.__kj || []).forEach(f => f()); };
  const onView = (trig, fn) => { const el = typeof trig === 'string' ? document.querySelector(trig) : trig; if (!el) return fn(); (el.__kj = el.__kj || []).push(fn); pending.add(el); io.observe(el); };
  // filet de sécurité : tout ce qui est déjà passé à l'écran s'affiche, même si l'observateur a raté le moment
  setInterval(() => pending.forEach(el => { if (el.getBoundingClientRect().top < innerHeight * .95) fire(el); }), 700);
  const reveal = (targets, vars, trig) => { const tw = gsap.from(targets, { clearProps: 'transform,opacity', ...vars, paused: true }); onView(trig, () => tw.play()); };

  /* ---------- défilement doux ---------- */
  let lenis = null;
  if (window.Lenis) {
    document.documentElement.style.scrollBehavior = 'auto';
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // les ancres internes passent par Lenis
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const el = document.querySelector(a.getAttribute('href')); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: -20 });
    });
    // pause pendant qu'une fiche ou une image est ouverte
    $$('dialog').forEach(d => new MutationObserver(() => {
      $$('dialog').some(x => x.open) ? lenis.stop() : lenis.start();
    }).observe(d, { attributes: true, attributeFilter: ['open'] }));
  }
  window.KJ = { scrollTo: el => lenis ? lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' }) };

  /* ---------- barre de progression ---------- */
  gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------- héros : les lignes du titre s'écartent, l'équipage monte ---------- */
  const hero = document.querySelector('.hero');
  const lines = $$('.tl');
  const hx = mobile ? [-10, 10, -6] : [-16, 14, -8];
  lines.forEach((l, i) => gsap.to(l, { xPercent: hx[i], ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } }));
  gsap.from('.stk', { scale: 0, duration: .8, ease: 'back.out(2.2)', stagger: .08, delay: 2 });
  $$('.stk').forEach((s, i) => gsap.to(s, { y: -(80 + (i % 4) * 60), rotate: (i % 2 ? 1 : -1) * 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .8 } }));
  gsap.to('.hero-mid', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: .6 } });
  // l'équipage saute une fois le chargement terminé
  gsap.from('#crew button svg', { yPercent: 120, duration: 1, ease: 'back.out(1.8)', stagger: .07, delay: 2.1 });

  /* ---------- blocs de couleur : ils s'ouvrent à pleine largeur en arrivant ---------- */
  $$('.slab, .work, .team-sec').forEach(sec => {
    gsap.fromTo(sec, { clipPath: `inset(0% ${mobile ? 3 : 6}% 0% ${mobile ? 3 : 6}% round 80px 80px 0px 0px)` },
      { clipPath: 'inset(0% 0% 0% 0% round 44px 44px 0px 0px)', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 30%', scrub: .5 } });
  });

  /* ---------- titres : lettres qui basculent ---------- */
  $$('.split').forEach(t => reveal(t.querySelectorAll('.c'), { yPercent: 115, rotate: 12, duration: .9, ease: 'power4.out', stagger: .035 }, t));
  $$('.sec-head .aside').forEach(a => reveal(a, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', }, a));

  /* ---------- manifeste ---------- */
  gsap.to('.kanji-col', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '#manifeste', start: 'top bottom', end: 'bottom top', scrub: .5 } });
  reveal('.mani-foot > div', { y: 80, opacity: 0, rotate: 4, duration: 1, ease: 'back.out(1.6)', stagger: .1, }, '.mani-foot');

  /* ---------- cartes de projets ---------- */
  $$('.pcard').forEach((c, i) => {
    const pol = c.querySelector('.polar'), img = c.querySelector('.pimg img'), txt = c.querySelector('.pc-text');
    reveal(pol, { rotate: (i % 2 ? -1 : 1) * 24, scale: .7, y: 120, duration: 1.2, ease: 'elastic.out(1, .7)', }, c);
    reveal(txt.children, { y: 50, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08, clearProps: 'transform,opacity', }, c);
    if (img && !img.classList.contains('contain')) gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- index ---------- */
  $$('.row').forEach((r, i) => reveal(r, { x: -60, opacity: 0, duration: .8, ease: 'power3.out', delay: (i % 4) * .05, clearProps: 'transform,opacity' }, r));

  /* ---------- yacht ---------- */
  reveal('#bateau .frame', { scale: .82, rotate: -4, y: 100, duration: 1.3, ease: 'elastic.out(1, .75)', }, '#bateau .frame');
  reveal('#bateau .spec', { x: mobile ? 0 : 120, y: mobile ? 60 : 0, opacity: 0, duration: 1.1, ease: 'power3.out', }, '#bateau .spec');
  reveal('.calc', { y: 120, rotate: i => [-8, 6, -5, 9][i % 4], opacity: 0, duration: 1.1, ease: 'back.out(1.7)', stagger: .1, clearProps: 'transform,opacity', }, '.calcs');
  reveal('.scaler', { y: 100, scale: .94, opacity: 0, duration: 1, ease: 'power3.out', }, '.scaler');
  reveal('.tablist button', { y: 40, opacity: 0, duration: .7, ease: 'back.out(2)', stagger: .07, clearProps: 'transform,opacity', }, '.tablist');

  /* ---------- savoir-faire : les lignes arrivent par la gauche et la droite ---------- */
  $$('.sk-row').forEach((r, i) => {
    reveal(r.querySelector('h3'), { x: (i % 2 ? 1 : -1) * (mobile ? 60 : 180), opacity: 0, duration: 1.1, ease: 'power4.out', }, r);
    reveal(r.querySelectorAll('.chips span'), { scale: 0, rotate: -20, duration: .6, ease: 'back.out(2.4)', stagger: .04, clearProps: 'transform', }, r);
  });

  /* ---------- équipage : les cartes tombent comme des cartes à jouer ---------- */
  reveal('.mate', { y: 160, rotate: i => [-14, 10, -8, 12, -10, 8, -12, 14][i % 8], opacity: 0, duration: 1.2, ease: 'back.out(1.4)', stagger: .09, clearProps: 'transform,opacity' }, '#team');


  /* ---------- journal + contact + pied ---------- */
  $$('.log-row').forEach((r, i) => reveal(r, { x: 80, opacity: 0, duration: .8, ease: 'power3.out', delay: (i % 3) * .06, clearProps: 'transform,opacity' }, r));
  reveal('.pit', { y: 80, scale: .96, opacity: 0, duration: 1, ease: 'power3.out' }, '.pit');
  reveal('#wordmark .ch', { yPercent: 110, rotate: 10, duration: 1, ease: 'power4.out', stagger: .045, }, 'footer');

  // recalcul après chargement des images et des polices
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
