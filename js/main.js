/* ═══════════════════════════════════════════════
   TJ MAREK PORTFOLIO — MAIN JS
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. HEADER SCROLL ───────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE NAV ──────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. COUNTER ANIMATION ───────────────────── */
  // Pre-sets final value immediately to lock layout,
  // then counts up visually without changing element dimensions.
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix   || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;

    // CRITICAL: set min-width to current rendered width BEFORE animation
    // This is what prevents the image from jumping during count-up.
    const currentW = el.getBoundingClientRect().width;
    el.style.minWidth = currentW + 'px';
    el.style.display  = 'inline-block';
    el.style.textAlign = 'center';

    const start = performance.now();
    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ── 4. AOS (Animate on Scroll) ─────────────── */
  const aosEls = document.querySelectorAll('[data-aos]');
  if (aosEls.length) {
    const aosObs = new IntersectionObserver((entries) => {
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

  /* ── 5. SKILL BAR ANIMATION ─────────────────── */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  if (skillFills.length) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(el => skillObs.observe(el));
  }

  /* ── 6. IMPACT BAR CHART ANIMATION ──────────── */
  const ibarFills = document.querySelectorAll('.ibar__fill');
  if (ibarFills.length) {
    const ibarObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          ibarObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    ibarFills.forEach(el => ibarObs.observe(el));
  }

  /* ── 7. CASE STUDY FILTER ────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const csCards    = document.querySelectorAll('.cs-card[data-category]');
  if (filterTabs.length && csCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        csCards.forEach(card => {
          card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
        });
      });
    });
  }

  /* ── 8. CONTACT FORM ─────────────────────────── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        contactForm.reset();
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
      }, 1200);
    });
  }

  /* ── 9. ACTIVE NAV LINK ──────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });

})();

