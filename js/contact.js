/* ============================================================
   OMUGWO — Contact Page JS   contact.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Trigger top accent bar after card enters view ── */
  const formCard = document.getElementById('ctFormCard');
  if (formCard) {
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        setTimeout(() => formCard.classList.add('ct-form-card--ready'), 300);
        obs.unobserve(formCard);
      }
    }, { threshold: 0.2 }).observe(formCard);
  }

  /* ── Textarea character counter ── */
  const textarea = document.getElementById('ct-message');
  const counter  = document.getElementById('ctCount');
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      const max = parseInt(textarea.getAttribute('maxlength')) || 600;
      counter.textContent = `${len} / ${max}`;
      counter.classList.toggle('ct-field__count--warn', len > max * 0.85);
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.ct-faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.ct-faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.ct-faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.ct-faq-item__q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Ripple on submit button ── */
  const submitBtn = document.getElementById('ctSubmit');
  submitBtn?.addEventListener('click', function (e) {
    const btn  = this;
    const rect = btn.getBoundingClientRect();
    const rip  = document.createElement('span');
    rip.className = 'ct-ripple';
    rip.style.left = (e.clientX - rect.left) + 'px';
    rip.style.top  = (e.clientY - rect.top)  + 'px';
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  });

  /* ── Form submission ── */
  const form      = document.getElementById('ctForm');
  const submitTxt = document.getElementById('ctSubmitText');
  const success   = document.getElementById('ctSuccess');

  if (form) {
    /* Inline validation — highlight empties on blur */
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(el => {
      el.addEventListener('blur', () => {
        const field = el.closest('.ct-field');
        if (!field) return;
        if (!el.value.trim()) {
          field.style.setProperty('--bar-color', 'var(--rust)');
          el.style.borderBottomColor = 'rgba(187,107,95,0.45)';
        } else {
          el.style.borderBottomColor = '';
        }
      });
      el.addEventListener('input', () => { el.style.borderBottomColor = ''; });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const name    = document.getElementById('ct-name')?.value.trim();
      const email   = document.getElementById('ct-email')?.value.trim();
      const subject = document.getElementById('ct-subject')?.value;
      const message = document.getElementById('ct-message')?.value.trim();

      /* Validate required fields */
      let firstInvalid = null;
      [
        { el: document.getElementById('ct-name'),    val: name    },
        { el: document.getElementById('ct-email'),   val: email   },
        { el: document.getElementById('ct-subject'), val: subject },
        { el: document.getElementById('ct-message'), val: message },
      ].forEach(({ el, val }) => {
        if (!val) {
          el.style.borderBottomColor = 'rgba(187,107,95,0.6)';
          if (!firstInvalid) firstInvalid = el;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        /* Shake button */
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = 'ctShake 0.4s ease';
        setTimeout(() => { submitBtn.style.animation = ''; }, 400);
        return;
      }

      /* Loading state */
      submitTxt.textContent = 'Sending…';
      submitBtn.classList.add('ct-submit--loading');

      /* Send to Formspree */
      try {
        const data = new FormData();
        data.append('name',    name);
        data.append('email',   email);
        data.append('phone',   document.getElementById('ct-phone')?.value.trim() || '');
        data.append('subject', subject);
        data.append('message', message);

        const res = await fetch('https://formspree.io/f/xjgjaenk', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data,
        });

        submitTxt.textContent = 'Send Message';
        submitBtn.classList.remove('ct-submit--loading');

        if (res.ok) {
          success.classList.add('ct-success--visible');
          form.reset();
          if (counter) counter.textContent = '0 / 600';
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => success.classList.remove('ct-success--visible'), 6000);
        } else {
          submitTxt.textContent = 'Failed — try again';
          setTimeout(() => { submitTxt.textContent = 'Send Message'; }, 3000);
        }
      } catch {
        submitTxt.textContent = 'Send Message';
        submitBtn.classList.remove('ct-submit--loading');
        submitTxt.textContent = 'No connection — try again';
        setTimeout(() => { submitTxt.textContent = 'Send Message'; }, 3000);
      }
    });
  }

  /* ── Inject shake keyframe ── */
  const s = document.createElement('style');
  s.textContent = `@keyframes ctShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }`;
  document.head.appendChild(s);

});
