/* ============================================================
   OMUGWO — Services Page JS   services.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Counter animation ── */
  const animateCounter = (el, target, suffix = '', prefix = '') => {
    const duration  = 1600;
    const start     = performance.now();
    const isDecimal = target % 1 !== 0;
    const tick = now => {
      const p     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + (isDecimal ? (eased * target).toFixed(1) : Math.round(eased * target)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ── Stat card reveal observer ── */
  const statCards = document.querySelectorAll('.sv-stat-card');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.classList.add('sv-revealed');

      /* Trigger progress bar */
      const bar = card.querySelector('.sv-stat-card__bar[data-width]');
      if (bar) {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 350);
      }

      /* Trigger counter */
      const counter = card.querySelector('[data-target]');
      if (counter) {
        setTimeout(() => {
          animateCounter(counter,
            parseFloat(counter.dataset.target),
            counter.dataset.suffix || '',
            counter.dataset.prefix || ''
          );
        }, 200);
      }

      statObs.unobserve(card);
    });
  }, { threshold: 0.25 });

  statCards.forEach(c => statObs.observe(c));

  /* ── Step hover lift ── */
  document.querySelectorAll('.sv-step').forEach((step, i) => {
    step.style.transitionDelay = `${i * 60}ms`;
  });

  /* ── Service card entrance stagger ── */
  const svCards = document.querySelectorAll('.sv-card');
  const svObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        svObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  svCards.forEach(c => svObs.observe(c));

});
