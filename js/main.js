/* ═══════════════════════════════════════════════════════
   TJ MAREK — MAIN JS
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. HEADER SCROLL ─────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE NAV ────────────────────────────────── */
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

    document.addEventListener('click', e => {
      if (
        mainNav.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
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

  /* ── 3. STAT COUNTER — NO LAYOUT JUMP ────────────────
     The fix has two parts:
     1. CSS: position:absolute on image wrap + contain:strict
        on the strip means text changes can't reach the image.
     2. JS: we snapshot and hard-lock the element's pixel width
        BEFORE the first digit changes, so the container
        never resizes during animation.
  ─────────────────────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix   || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;

    // Lock width before any text change
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      el.style.width      = Math.ceil(rect.width) + 'px';
      el.style.display    = 'inline-block';
      el.style.textAlign  = 'center';
      el.style.overflow   = 'hidden';
    }

    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent  = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObs.observe(el));
  }

  /* ── 4. AOS (animate on scroll) ──────────────────── */
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

  /* ── 5. IMPACT BAR CHART ──────────────────────────── */
  function initImpactBars() {
    const fills = document.querySelectorAll('.ibar__fill');
    if (!fills.length) return;

    const ibarObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const index = Array.from(fills).indexOf(bar);
          setTimeout(() => bar.classList.add('animated'), index * 120);
          ibarObs.unobserve(bar);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    fills.forEach(el => {
      // If already in viewport on page load, fire immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const index = Array.from(fills).indexOf(el);
        setTimeout(() => el.classList.add('animated'), index * 120);
      } else {
        ibarObs.observe(el);
      }
    });
  }

  initImpactBars();

  /* ── 6. SKILL BARS ────────────────────────────────── */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  if (skillFills.length) {
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObs.observe(el));
  }

  /* ── 7. CASE STUDY FILTER ─────────────────────────── */
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

  /* ── 8. CONTACT FORM ──────────────────────────────── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn     = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sent ✓';
      btn.disabled    = true;
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.textContent  = original;
        btn.disabled     = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ── 9. ACTIVE NAV LINK ───────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPath || (currentPath === '' && href === 'index.html'));
  });

})();
