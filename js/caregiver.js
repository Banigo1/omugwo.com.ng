/* ============================================================
   OMUGWO — Caregiver Registration JS
   caregiver.js
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Trigger accent bar when card enters view ── */
  const formCard = document.getElementById('cg-form-card');
  if (formCard) {
    new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        setTimeout(() => formCard.classList.add('cg-ready'), 300);
        obs.unobserve(formCard);
      }
    }, { threshold: 0.15 }).observe(formCard);
  }

  /* ── Stagger fields on load ── */
  const fields = document.querySelectorAll('.cg-field');
  fields.forEach((f, i) => {
    setTimeout(() => f.classList.add('cg-field--visible'), 400 + i * 60);
  });

  /* ── Textarea character counter ── */
  const postpartumDetail  = document.getElementById('cg-postpartum-detail');
  const postpartumCount   = document.getElementById('cg-postpartum-count');
  if (postpartumDetail && postpartumCount) {
    postpartumDetail.addEventListener('input', () => {
      const len = postpartumDetail.value.length;
      postpartumCount.textContent = `${len} / 500`;
      postpartumCount.classList.toggle('cg-char-count--warn', len > 425);
    });
  }

  /* ── File upload UI ── */
  const cvInput    = document.getElementById('cg-cv');
  const uploadUi   = document.getElementById('cg-upload-ui');
  const uploadText = document.getElementById('cg-upload-text');

  if (cvInput && uploadUi && uploadText) {
    cvInput.addEventListener('change', () => {
      const file = cvInput.files[0];
      if (file) {
        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          uploadText.textContent = 'File too large — max 5MB';
          uploadUi.style.borderColor = 'var(--rust)';
          cvInput.value = '';
          setTimeout(() => {
            uploadText.textContent = 'Click to attach CV';
            uploadUi.style.borderColor = '';
          }, 3000);
          return;
        }
        uploadText.textContent = `✓  ${file.name}`;
        uploadUi.classList.add('has-file');
      } else {
        uploadText.textContent = 'Click to attach CV';
        uploadUi.classList.remove('has-file');
      }
    });
  }

  /* ── Form validation helpers ── */
  const shake = (el) => {
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'cgShake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 400);
  };

  const highlight = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderBottomColor = 'rgba(196,103,74,0.6)';
    el.focus();
    setTimeout(() => { el.style.borderBottomColor = ''; }, 2500);
  };

  /* ── Submit ── */
  const submitBtn = document.getElementById('cg-submit-btn');
  const successEl = document.getElementById('cg-success');

  submitBtn?.addEventListener('click', async () => {

    // Collect values
    const name       = document.getElementById('cg-name')?.value.trim();
    const email      = document.getElementById('cg-email')?.value.trim();
    const phone      = document.getElementById('cg-phone')?.value.trim();
    const address    = document.getElementById('cg-address')?.value.trim();
    const education  = document.getElementById('cg-education')?.value;
    const occupation = document.getElementById('cg-occupation')?.value.trim();
    const postpartumExp    = document.getElementById('cg-postpartum-exp')?.value;
    const postpartumDetail = document.getElementById('cg-postpartum-detail')?.value.trim();
    const domesticExp      = document.getElementById('cg-domestic-exp')?.value;
    const training         = document.getElementById('cg-training')?.value;

    // Preferred contact methods (checkboxes)
    const contactMethods = Array.from(
      document.querySelectorAll('input[name="cg-contact"]:checked')
    ).map(cb => cb.value).join(', ');

    // Validate required fields
    const required = [
      { id: 'cg-name',           val: name },
      { id: 'cg-email',          val: email },
      { id: 'cg-phone',          val: phone },
      { id: 'cg-address',        val: address },
      { id: 'cg-education',      val: education },
      { id: 'cg-occupation',     val: occupation },
      { id: 'cg-postpartum-exp', val: postpartumExp },
      { id: 'cg-domestic-exp',   val: domesticExp },
      { id: 'cg-training',       val: training },
    ];

    let firstEmpty = null;
    required.forEach(({ id, val }) => {
      if (!val) {
        highlight(id);
        if (!firstEmpty) firstEmpty = id;
      }
    });

    if (!contactMethods) {
      const group = document.querySelector('.cg-checkbox-group');
      if (group) {
        group.style.outline = '2px solid rgba(196,103,74,0.5)';
        group.style.borderRadius = '8px';
        setTimeout(() => { group.style.outline = ''; }, 2500);
      }
    }

    if (firstEmpty || !contactMethods) {
      shake(submitBtn);
      return;
    }

    // Loading state
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    // Build FormData — file upload included
    const data = new FormData();
    data.append('name',               name);
    data.append('email',              email);
    data.append('phone',              phone);
    data.append('address',            address);
    data.append('preferred_contact',  contactMethods);
    data.append('education',          education);
    data.append('occupation',         occupation);
    data.append('postpartum_experience',        postpartumExp);
    data.append('postpartum_experience_detail', postpartumDetail || 'Not provided');
    data.append('domestic_experience',          domesticExp);
    data.append('training_availability',        training);
    data.append('_subject', 'New Omugwo Caregiver Application');

    // CV file
    const cvFile = document.getElementById('cg-cv')?.files[0];
    if (cvFile) {
      data.append('cv', cvFile);
    }

    // CV link
    const cvLink = document.getElementById('cg-cv-link')?.value.trim();
    if (cvLink) {
      data.append('cv_link', cvLink);
    }

    try {
      const res = await fetch('https://formspree.io/f/xjgjaenk', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      });

      if (res.ok) {
        formCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        formCard.style.opacity    = '0';
        formCard.style.transform  = 'translateY(-12px) scale(0.98)';
        setTimeout(() => {
          formCard.hidden     = true;
          successEl.hidden    = false;
          successEl.style.animation = 'cgFadeUp 0.6s cubic-bezier(0.25,1,0.5,1) forwards';
        }, 400);
      } else {
        submitBtn.textContent = 'Failed — try again';
        submitBtn.disabled    = false;
        setTimeout(() => { submitBtn.textContent = 'Submit Application'; }, 3000);
      }
    } catch {
      submitBtn.textContent = 'No connection — try again';
      submitBtn.disabled    = false;
      setTimeout(() => { submitBtn.textContent = 'Submit Application'; }, 3000);
    }
  });

  /* ── Inject shake keyframe ── */
  const s = document.createElement('style');
  s.textContent = `
    @keyframes cgShake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-5px); }
      40%     { transform: translateX(5px); }
      60%     { transform: translateX(-3px); }
      80%     { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(s);

});
