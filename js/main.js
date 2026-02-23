/* ═══════════════════════════════════════════════
   TJ MAREK PORTFOLIO — MAIN JS v4
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. HEADER SCROLL ─────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE NAV ────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mainNav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
    document.addEventListener('click', e => {
      if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. COUNTER — NO LAYOUT JUMP FIX ─────────────────────
     Strategy:
     1. Read the element's rendered width BEFORE animation.
     2. Hard-lock it with style.width so text changes can NEVER
        make the element wider or narrower.
     3. Count up purely visually inside that locked box.
  ──────────────────────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix   || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;

    // Lock dimensions before a single character changes
    const rect = el.getBoundingClientRect();
    el.style.width      = rect.width  + 'px';
    el.style.height     = rect.height + 'px';
    el.style.display    = 'inline-block';
    el.style.textAlign  = 'center';
    el.style.overflow   = 'hidden';

    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent  = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => obs.observe(el));
  }

  /* ── 4. AOS ───────────────────────────────── */
  const aosEls = document.querySelectorAll('[data-aos]');
  if (aosEls.length) {
    const aosObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.aosDelay || '0', 10);
          setTimeout(() => entry.target.classList.add('aos-animate'), delay);
          aosObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    aosEls.forEach(el => aosObs.observe(el));
  }

  /* ── 5. SKILL BARS ────────────────────────── */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  if (skillFills.length) {
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); sObs.unobserve(e.target); }});
    }, { threshold: 0.3 });
    skillFills.forEach(el => sObs.observe(el));
  }

  /* ── 6. IMPACT BAR CHART ──────────────────── */
  const ibarFills = document.querySelectorAll('.ibar__fill');
  if (ibarFills.length) {
    const iObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); iObs.unobserve(e.target); }});
    }, { threshold: 0.3 });
    ibarFills.forEach(el => iObs.observe(el));
  }

  /* ── 7. CASE STUDY FILTER ─────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const csCards    = document.querySelectorAll('.cs-card[data-category]');
  if (filterTabs.length && csCards.length) {
    filterTabs.forEach(tab => tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      csCards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f));
    }));
  }

  /* ── 8. CONTACT FORM ──
