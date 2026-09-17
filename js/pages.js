/* ============================================================
   OMUGWO — Inner Pages JavaScript
   Handles: reveal animations, contact form, multi-step form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll reveal ── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  /* ── Magnetic buttons ── */
  document.querySelectorAll('.btn--rust, .btn--white').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px) translateY(-1px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── CONTACT FORM ── */
  const contactForm    = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('.contact-form__submit');

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const origText = submitBtn.querySelector('span').textContent;
      submitBtn.querySelector('span').textContent = 'Sending…';
      submitBtn.disabled = true;

      // Simulate async submission
      setTimeout(() => {
        contactSuccess.hidden = false;
        contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        submitBtn.querySelector('span').textContent = origText;
        submitBtn.disabled = false;
        contactForm.reset();

        setTimeout(() => { contactSuccess.hidden = true; }, 6000);
      }, 1200);
    });
  }

  /* ── FIND CARE MULTI-STEP FORM ── */
  const stepEls = document.querySelectorAll('.fc-form-step');
  const stepDots = document.querySelectorAll('.fc-step');

  if (stepEls.length) {
    let currentStep = 1;

    const showStep = (n) => {
      stepEls.forEach(el => { el.hidden = parseInt(el.id.split('-')[2]) !== n; });
      stepDots.forEach((dot, i) => {
        dot.classList.remove('fc-step--active', 'fc-step--done');
        if (i + 1 < n)  dot.classList.add('fc-step--done');
        if (i + 1 === n) dot.classList.add('fc-step--active');
      });
      currentStep = n;

      // Build summary on step 3
      if (n === 3) buildSummary();

      // Scroll card into view
      document.querySelector('.fc-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Next buttons
    document.querySelectorAll('.fc-form__next[data-next]').forEach(btn => {
      btn.addEventListener('click', () => showStep(parseInt(btn.dataset.next)));
    });

    // Back buttons
    document.querySelectorAll('.fc-form__back[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prev)));
    });

    // Build summary content
    const buildSummary = () => {
      const el = document.getElementById('fc-summary');
      if (!el) return;

      const fname    = document.getElementById('fc-fname')?.value || '—';
      const lname    = document.getElementById('fc-lname')?.value || '—';
      const email    = document.getElementById('fc-email')?.value || '—';
      const phone    = document.getElementById('fc-phone')?.value || '—';
      const city     = document.getElementById('fc-city')?.value  || '—';
      const duration = document.getElementById('fc-duration')?.value || '—';
      const language = document.getElementById('fc-language')?.value || '—';
      const services = Array.from(document.querySelectorAll('.fc-checkboxes input:checked'))
                            .map(c => c.value).join(', ') || '—';

      el.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;">
          <div><strong>Name</strong><br>${fname} ${lname}</div>
          <div><strong>Email</strong><br>${email}</div>
          <div><strong>WhatsApp</strong><br>${phone}</div>
          <div><strong>City</strong><br>${city}</div>
          <div style="grid-column:1/-1"><strong>Services needed</strong><br>${services}</div>
          <div><strong>Duration</strong><br>${duration}</div>
          <div><strong>Language preference</strong><br>${language || 'No preference'}</div>
        </div>
      `;
    };

    // Submit
    const submitBtn = document.getElementById('fc-submit');
    const successEl = document.getElementById('fc-success');

    submitBtn?.addEventListener('click', () => {
      const consent = document.getElementById('fc-consent');
      const consentWrap = consent?.closest('.fc-form__consent');
        if (!consent?.checked) {
        if (consentWrap) {
          consentWrap.style.outline = '2px solid var(--rust)';
          consentWrap.style.borderRadius = '8px';
          setTimeout(() => { consentWrap.style.outline = ''; }, 2000);
        }
        return;
      }

      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;

      setTimeout(() => {
        stepEls.forEach(el => { el.hidden = true; });
        successEl.hidden = false;
      }, 1200);
    });
  }

});
