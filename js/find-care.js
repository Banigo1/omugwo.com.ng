/* ============================================================
   OMUGWO — Find Care Page JS
   find-care.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Set minimum care start date to today ── */
  const careDateInput = document.getElementById('fc-care-date');
  if (careDateInput) {
    careDateInput.min = new Date().toISOString().split('T')[0];
  }

  /* ── Stagger fields on load ── */
  const fields = document.querySelectorAll('.fc-field');
  fields.forEach((f, i) => {
    setTimeout(() => f.classList.add('fc-field--visible'), 500 + i * 80);
  });

  /* ── Role toggle — Mother / Caregiver ── */
  const roleInputs    = document.querySelectorAll('input[name="fc-role"]');
  const motherFields  = document.querySelectorAll('.fc-field--mother');
  const caregiverFields = document.querySelectorAll('.fc-field--caregiver');
  const roleLabels    = document.querySelectorAll('.fc-role-option');

  const updateRole = (role) => {
    // Toggle active class on labels
    roleLabels.forEach(label => {
      label.classList.toggle('fc-role-option--active',
        label.querySelector('input').value === role);
    });

    // Show/hide role-specific fields with animation
    if (role === 'mother') {
      caregiverFields.forEach(f => {
        f.hidden = true;
        f.classList.remove('fc-field--visible');
      });
      const btn = document.getElementById('fc-submit-btn');
      if (btn) btn.style.display = '';
      setTimeout(() => {
        motherFields.forEach((f, i) => {
          f.hidden = false;
          setTimeout(() => f.classList.add('fc-field--visible'), i * 70);
        });
      }, 80);
    } else {
      motherFields.forEach(f => {
        f.hidden = true;
        f.classList.remove('fc-field--visible');
      });
      setTimeout(() => {
        caregiverFields.forEach((f, i) => {
          f.hidden = false;
          setTimeout(() => f.classList.add('fc-field--visible'), i * 70);
        });
      }, 80);
      // Update submit button to reflect caregiver state
      const btn = document.getElementById('fc-submit-btn');
      if (btn) btn.style.display = 'none';
    }
  };

  roleInputs.forEach(input => {
    input.addEventListener('change', () => updateRole(input.value));
  });

  // Init — show mother fields
  updateRole('mother');

  // Also allow clicking label area to switch
  roleLabels.forEach(label => {
    label.addEventListener('click', () => {
      const radio = label.querySelector('input');
      radio.checked = true;
      updateRole(radio.value);
    });
  });

  /* ── Reveal observer for why cards ── */
  const whyCards = document.querySelectorAll('.fc-why-card');
  const whyObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Trigger progress bar fill
        const bar = entry.target.querySelector('.fc-why-card__bar[data-width]');
        if (bar) {
          setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 300);
        }

        whyObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  whyCards.forEach(card => whyObs.observe(card));

  /* ── Form submission ── */
  const submitBtn  = document.getElementById('fc-submit-btn');
  const formCard   = document.getElementById('fc-form-card');
  const successEl  = document.getElementById('fc-success');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name  = document.getElementById('fc-name')?.value?.trim();
      const email = document.getElementById('fc-email')?.value?.trim();
      const phone = document.getElementById('fc-phone')?.value?.trim();

      // Simple validation
      if (!name || !email || !phone) {
        // Shake the button
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight; // reflow
        submitBtn.style.animation = 'fcShake 0.4s ease';
        setTimeout(() => { submitBtn.style.animation = ''; }, 400);

        // Highlight empty fields
        [
          { id: 'fc-name',  val: name  },
          { id: 'fc-email', val: email },
          { id: 'fc-phone', val: phone },
        ].forEach(({ id, val }) => {
          if (!val) {
            const field = document.getElementById(id);
            if (field) {
              field.style.borderBottomColor = 'var(--rust)';
              field.focus();
              setTimeout(() => { field.style.borderBottomColor = ''; }, 2000);
            }
          }
        });
        return;
      }

      // Loading state
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Joining…';
      submitBtn.disabled = true;

      // Collect all form data
      const role     = document.querySelector('input[name="fc-role"]:checked')?.value || 'mother';
      const city     = document.getElementById('fc-city')?.value     || '';
      const service  = document.getElementById('fc-service')?.value  || '';
      const careDate = document.getElementById('fc-care-date')?.value || '';
      const duration = document.getElementById('fc-duration')?.value  || '';
      const urgency  = document.getElementById('fc-urgency')?.value   || '';

      const data = new FormData();
      data.append('name',  name);
      data.append('email', email);
      data.append('phone', phone);
      data.append('role',  role);
      if (role === 'mother') {
        data.append('city',             city);
        data.append('service',          service);
        data.append('care_start_date',  careDate);
        data.append('care_duration',    duration);
        data.append('urgency',          urgency);
      }
      data.append('_subject', `New Omugwo waitlist signup — ${role}`);

      try {
        const res = await fetch('https://formspree.io/f/xjgjaenk', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data,
        });

        if (res.ok) {
          formCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          formCard.style.opacity = '0';
          formCard.style.transform = 'translateY(-12px) scale(0.98)';
          setTimeout(() => {
            formCard.hidden = true;
            successEl.hidden = false;
            successEl.style.animation = 'fcFadeUp 0.6s cubic-bezier(0.25,1,0.5,1) forwards';
          }, 400);
        } else {
          submitBtn.textContent = 'Failed — try again';
          submitBtn.disabled = false;
          setTimeout(() => { submitBtn.textContent = 'Join the waitlist'; }, 3000);
        }
      } catch {
        submitBtn.textContent = 'No connection — try again';
        submitBtn.disabled = false;
        setTimeout(() => { submitBtn.textContent = 'Join the waitlist'; }, 3000);
      }
    });
  }

  /* ── Smooth scroll for anchor links on this page ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Inject shake keyframe ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fcShake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);

});
