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
 /* ═══════════════════════════════════════════
   COUNTER FIX — replace your existing animateCounter()
   ═══════════════════════════════════════════ */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix   || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1600;

  // 1. Snapshot rendered width BEFORE any text changes
  const computedWidth = el.getBoundingClientRect().width;

  // 2. Hard-lock it — counter digits can never make this wider/narrower
  el.style.width     = Math.ceil(computedWidth) + 'px';
  el.style.display   = 'inline-block';
  el.style.textAlign = 'center';
  el.style.overflow  = 'hidden';

  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

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
/* ═══════════════════════════════════════════
   IMPACT BAR CHART FIX — replace in main.js
   ═══════════════════════════════════════════ */
function initImpactBars() {
  const fills = document.querySelectorAll('.ibar__fill');
  if (!fills.length) return;

  // Fallback: if already in viewport on load, fire immediately
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger each bar slightly for a polished cascade effect
        const bar   = entry.target;
        const index = Array.from(fills).indexOf(bar);
        setTimeout(() => bar.classList.add('animated'), index * 120);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  fills.forEach((el) => {
    // If already visible (e.g. on a wide screen where section is in view)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const index = Array.from(fills).indexOf(el);
      setTimeout(() => el.classList.add('animated'), index * 120);
    } else {
      observer.observe(el);
    }
  });
}

initImpactBars();


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

