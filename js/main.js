/* ═══════════════════════════════════════════════
   TJ MAREK PORTFOLIO — MAIN JS
   No cursor effect. Clean utility scripts only.
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. HEADER SCROLL STATE ─────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. MOBILE NAV TOGGLE ───────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. COUNTER ANIMATION ───────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix   || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Observe all counter elements
  const counterEls = document.querySelectorAll(
    '[data-target].stat-card__number, [data-target].mini-stat-value'
  );

  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── 4. AOS (Animate on Scroll) ─────────────── */
  const aosEls = document.querySelectorAll('[data-aos]');
  if (aosEls.length) {
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const delay = (entry.target.dataset.aosDelay ||
            Array.from(aosEls).indexOf(entry.target) % 4 * 80);
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    aosEls.forEach(el => aosObserver.observe(el));
  }

  /* ── 5. SKILL BAR ANIMATION ─────────────────── */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  if (skillFills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObserver.observe(el));
  }

  /* ── 6. CASE STUDY FILTER TABS ───────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const csCards    = document.querySelectorAll('.cs-card[data-category]');

  if (filterTabs.length && csCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.filter;
        csCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── 7. CONTACT FORM SUBMIT ──────────────────── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Swap in your real form handler / endpoint here
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  /* ── 8. ACTIVE NAV LINK ──────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

})();
