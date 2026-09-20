/* ============================================
   Omugwo.com.ng — Main JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Newsletter card — scroll-triggered entrance ── */
  const newsletterCard = document.querySelector(".newsletter-float__card");
  if (newsletterCard) {
    new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          newsletterCard.classList.add("is-visible");
          obs.unobserve(newsletterCard);
        }
      },
      { threshold: 0.3 },
    ).observe(newsletterCard);
  }

  /* ── Navbar — fix position after hero (homepage only) ── */
  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero");
  if (nav && hero) {
    const onNavScroll = () => {
      nav.classList.toggle(
        "nav--fixed",
        hero.getBoundingClientRect().bottom <= 0,
      );
    };
    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ────────────────────────────────────────────────
     MOBILE MENU — works on ALL pages
  ─────────────────────────────────────────────────*/
  const hamburger = document.querySelector(".nav__hamburger");
  const mobileMenu = document.querySelector(".nav__mobile");
  const mobileMenuToggle = document.querySelector(".nav__mobile-toggle");
  const spans = hamburger ? Array.from(hamburger.querySelectorAll("span")) : [];

  let savedScrollY = 0;

  const openMobileMenu = () => {
    if (!mobileMenu || !hamburger) return;
    savedScrollY = window.scrollY;
    /* iOS scroll lock — position:fixed + top offset keeps visual position */
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    mobileMenu.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    spans[0] &&
      (spans[0].style.transform = "rotate(45deg) translate(5px, 5px)");
    spans[1] && (spans[1].style.opacity = "0");
    spans[2] &&
      (spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)");
  };

  const closeMobileMenu = () => {
    if (!mobileMenu || !hamburger) return;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    window.scrollTo(0, savedScrollY);
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    spans[0] && (spans[0].style.transform = "");
    spans[1] && (spans[1].style.opacity = "");
    spans[2] && (spans[2].style.transform = "");
  };

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      mobileMenu?.classList.contains("open")
        ? closeMobileMenu()
        : openMobileMenu();
    });
  }

  mobileMenuToggle?.addEventListener("click", closeMobileMenu);

  /* Close on link / button click inside menu */
  document
    .querySelectorAll(".nav__mobile .nav__link, .nav__mobile .btn")
    .forEach((el) => {
      el.addEventListener("click", closeMobileMenu);
    });

  /* Close on backdrop tap */
  mobileMenu?.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });

  /* Close on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("open"))
      closeMobileMenu();
  });

  /* ────────────────────────────────────────────────
     HERO SLIDER (homepage only — guarded)
  ─────────────────────────────────────────────────*/
  const slides = document.querySelectorAll(".hero__slide");
  const dots = document.querySelectorAll(".hero__dot");

  if (slides.length > 1) {
    let currentSlide = 0;
    let sliderTimer = null;

    const goToSlide = (index) => {
      if (!slides[currentSlide] || !dots[currentSlide]) return;
      slides[currentSlide].classList.remove("hero__slide--active");
      const prevDot = dots[currentSlide];
      prevDot.classList.remove("hero__dot--active");
      void prevDot.offsetWidth;

      currentSlide = (index + slides.length) % slides.length;
      if (!slides[currentSlide] || !dots[currentSlide]) return;
      slides[currentSlide].classList.add("hero__slide--active");
      const activeDot = dots[currentSlide];
      activeDot.classList.remove("hero__dot--active");
      void activeDot.offsetWidth;
      activeDot.classList.add("hero__dot--active");
    };

    const startSlider = () => {
      sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    };
    const resetSlider = () => {
      clearInterval(sliderTimer);
      startSlider();
    };

    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        goToSlide(i);
        resetSlider();
      }),
    );
    startSlider();
  }

  /* ────────────────────────────────────────────────
     HOW IT WORKS — sticky scroll card stack
  ─────────────────────────────────────────────────*/
  const hiwOuter = document.querySelector(".hiw__sticky-outer");
  const hiwCards = document.querySelectorAll(".hiw__card");
  const hiwDots = document.querySelectorAll(".hiw__progress-dot");
  const hiwCounter = document.querySelector(".hiw__counter-current");

  if (hiwOuter && hiwCards.length) {
    const isMobile = () => window.innerWidth <= 768;
    let activeIndex = 0;

    const setCardState = (active) => {
      hiwCards.forEach((card, i) => {
        card.classList.remove(
          "hiw__card--active",
          "hiw__card--behind-1",
          "hiw__card--behind-2",
          "hiw__card--behind-3",
          "hiw__card--exited",
        );
        if (i < active) card.classList.add("hiw__card--exited");
        else if (i === active) card.classList.add("hiw__card--active");
        else if (i === active + 1) card.classList.add("hiw__card--behind-1");
        else if (i === active + 2) card.classList.add("hiw__card--behind-2");
        else card.classList.add("hiw__card--behind-3");
      });
      hiwDots.forEach((dot, i) =>
        dot.classList.toggle("hiw__progress-dot--active", i === active),
      );
      if (hiwCounter) {
        hiwCounter.style.opacity = "0";
        hiwCounter.style.transform = "translateY(-8px)";
        setTimeout(() => {
          hiwCounter.textContent = String(active + 1).padStart(2, "0");
          hiwCounter.style.opacity = "1";
          hiwCounter.style.transform = "translateY(0)";
        }, 180);
      }
    };

    const onScrollHIW = () => {
      if (isMobile()) return;
      const rect = hiwOuter.getBoundingClientRect();
      const totalScroll = hiwOuter.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / totalScroll));
      const zone = Math.min(3, Math.floor(progress * 4));
      if (zone !== activeIndex) {
        activeIndex = zone;
        setCardState(activeIndex);
      }
    };

    setCardState(0);
    if (hiwCounter)
      hiwCounter.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    window.addEventListener("scroll", onScrollHIW, { passive: true });
  }

  /* ────────────────────────────────────────────────
     SERVICES — sticky scroll card reveal
  ─────────────────────────────────────────────────*/
  const svcOuter = document.querySelector(".svc__scroll-outer");
  const svcBadges = document.querySelectorAll(".svc__badge");

  if (svcOuter) {
    const svcItems = Array.from(
      document.querySelectorAll("[data-svc-index]"),
    ).sort((a, b) => +a.dataset.svcIndex - +b.dataset.svcIndex);

    if (window.innerWidth > 768 && svcItems.length) {
      const TOTAL_VH = 110;
      svcOuter.style.height = `${TOTAL_VH}vh`;
      let currentIndex = -1;

      const onScrollSvc = () => {
        const rect = svcOuter.getBoundingClientRect();
        const totalScroll = svcOuter.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
        const targetIndex =
          scrolled <= 0
            ? rect.top < window.innerHeight
              ? 0
              : -1
            : Math.min(
                svcItems.length - 1,
                Math.floor(progress * svcItems.length),
              );
        if (targetIndex === currentIndex) return;

        if (targetIndex > currentIndex) {
          for (let i = currentIndex + 1; i <= targetIndex; i++) {
            const el = svcItems[i];
            if (!el) continue;
            el.classList.remove("svc-out");
            el.classList.add("svc-in");
            if (+el.dataset.svcIndex === 0) {
              setTimeout(
                () =>
                  svcBadges.forEach((b, bi) => {
                    b.classList.remove("svc-out");
                    setTimeout(() => b.classList.add("svc-in"), bi * 250);
                  }),
                700,
              );
            }
          }
        }
        currentIndex = Math.max(currentIndex, targetIndex);
      };

      window.addEventListener("scroll", onScrollSvc, { passive: true });
      onScrollSvc();
    } else {
      /* Mobile — show all cards immediately on scroll */
      svcOuter.style.height = "auto";
      new IntersectionObserver(
        ([entry], obs) => {
          if (entry.isIntersecting) {
            svcItems.forEach((el, i) =>
              setTimeout(() => el.classList.add("svc-in"), i * 120),
            );
            setTimeout(
              () =>
                svcBadges.forEach((b, bi) =>
                  setTimeout(() => b.classList.add("svc-in"), 600 + bi * 200),
                ),
              0,
            );
            obs.unobserve(svcOuter);
          }
        },
        { threshold: 0.1 },
      ).observe(svcOuter);
    }
  }

  /* ────────────────────────────────────────────────
     SCROLL REVEAL — all pages
  ─────────────────────────────────────────────────*/
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        const bar = entry.target.querySelector(".stat-card__bar[data-width]");
        if (bar)
          setTimeout(() => {
            bar.style.width = bar.dataset.width + "%";
          }, 300);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.closest(".hero")) {
      el.classList.add("visible");
      return;
    }
    revealObserver.observe(el);
  });

  /* ── Stagger delays ── */
  [
    ".services__all-services .service-mini",
    ".how-it-works__steps .step",
    ".stats__grid .stat-item",
    ".problem__pain-list .problem__pain-item",
  ].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  /* ── Label underline draw-in ── */
  document
    .querySelectorAll(
      ".problem__label,.svc__label,.trust__label,.stats__label,.faq__label,.hiw__label",
    )
    .forEach((label) => {
      new IntersectionObserver(
        ([entry], obs) => {
          if (entry.isIntersecting) {
            label.classList.add("label-visible");
            obs.unobserve(label);
          }
        },
        { threshold: 0.8 },
      ).observe(label);
    });

  /* ── FAQ accordion ── */
  document.querySelectorAll(".faq__question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq__question").setAttribute(
          "aria-expanded",
          "false",
        );
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ── Stats counter animation ── */
  const animateCounter = (el, target, suffix = "", prefix = "") => {
    const duration = 1800;
    const start = performance.now();
    const decimal = target % 1 !== 0;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const v = (1 - Math.pow(1 - p, 4)) * target;
      el.textContent =
        prefix + (decimal ? v.toFixed(1) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  document.querySelectorAll("[data-target]").forEach((el) => {
    new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          animateCounter(
            el,
            parseFloat(el.dataset.target),
            el.dataset.suffix || "",
            el.dataset.prefix || "",
          );
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 },
    ).observe(el);
  });

  /* ── Newsletter / waitlist forms — Mailchimp JSONP ── */
  /*
   * Mailchimp blocks CORS from browsers, so we use JSONP:
   * a <script> tag is injected with the subscription URL,
   * and Mailchimp calls our named callback with the result.
   */
  const submitToMailchimp = (email) =>
    new Promise((resolve, reject) => {
      const cb = "mc_cb_" + Date.now();
      const url =
        "https://Omugwo.com.ng.us14.list-manage.com/subscribe/post-json" +
        "?u=d4acb3cc983b1fa96bc7ba771" +
        "&id=cd9aedb3e8" +
        "&EMAIL=" +
        encodeURIComponent(email) +
        "&c=" +
        cb;

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("timeout"));
      }, 10000);

      const cleanup = () => {
        clearTimeout(timer);
        delete window[cb];
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      window[cb] = (data) => {
        cleanup();
        data.result === "success"
          ? resolve(data)
          : reject(new Error(data.msg || "error"));
      };

      const script = document.createElement("script");
      script.src = url;
      script.onerror = () => {
        cleanup();
        reject(new Error("network"));
      };
      document.head.appendChild(script);
    });

  document.querySelectorAll(".newsletter-form").forEach((form) => {
    const initialLabel =
      form.querySelector('button[type="submit"]')?.innerHTML ?? "";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[name="EMAIL"]');
      const btn = form.querySelector('button[type="submit"]');
      const email = input?.value.trim();
      if (!email) return;

      btn.innerHTML = "Sending…";
      btn.disabled = true;

      try {
        await submitToMailchimp(email);
        btn.innerHTML = "You're in! ✓";
        btn.style.background = "var(--sage)";
        btn.style.boxShadow = "0 2px 12px rgba(122,158,126,0.4)";
        input.value = "";
        setTimeout(() => {
          btn.innerHTML = initialLabel;
          btn.style.background = "";
          btn.style.boxShadow = "";
          btn.disabled = false;
        }, 3500);
      } catch (err) {
        // "already subscribed" is still a success from UX perspective
        if (
          err.message &&
          err.message.toLowerCase().includes("already subscribed")
        ) {
          btn.innerHTML = "Already subscribed ✓";
          btn.style.background = "var(--sage)";
          input.value = "";
          setTimeout(() => {
            btn.innerHTML = initialLabel;
            btn.style.background = "";
            btn.disabled = false;
          }, 3500);
        } else {
          console.error("Mailchimp error:", err.message);
          btn.innerHTML = "Try again";
          btn.style.background = "";
          btn.disabled = false;
        }
      }
    });
  });

  /* ── Magnetic button hover ── */
  document
    .querySelectorAll(".btn--rust, .btn--white, .btn--ghost-white")
    .forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px,${(e.clientY - r.top - r.height / 2) * 0.18}px) translateY(-1px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });

  /* ── 3D card tilt ── */
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) scale(1.01)`;
      card.style.transition = "transform 0.08s ease";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "";
    });
  });

  /* ── Hero overlay scroll darken ── */
  const heroOverlay = document.querySelector(".hero__bg-overlay");
  if (heroOverlay) {
    window.addEventListener(
      "scroll",
      () => {
        heroOverlay.style.opacity = (
          1 +
          Math.min(window.scrollY / 500, 1) * 0.25
        ).toString();
      },
      { passive: true },
    );
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    });
  });

  /* ── Cursor glow on hero (pointer devices only) ── */
  if (window.matchMedia("(pointer: fine)").matches && hero) {
    const trail = document.createElement("div");
    trail.style.cssText =
      "position:fixed;pointer-events:none;z-index:9999;width:10px;height:10px;border-radius:50%;background:rgba(196,103,74,0.45);transform:translate(-50%,-50%);transition:opacity 0.5s ease;opacity:0;mix-blend-mode:screen;";
    document.body.appendChild(trail);
    hero.addEventListener("mousemove", (e) => {
      trail.style.left = e.clientX + "px";
      trail.style.top = e.clientY + "px";
      trail.style.opacity = "1";
    });
    hero.addEventListener("mouseleave", () => {
      trail.style.opacity = "0";
    });
  }
});

/* ── Resize / orientation change handler ── */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const svcOuter = document.querySelector(".svc__scroll-outer");
    if (svcOuter) {
      if (window.innerWidth <= 768) {
        svcOuter.style.height = "auto";
      } else {
        const items = document.querySelectorAll("[data-svc-index]");
        if (items.length) svcOuter.style.height = "110vh";
      }
    }
    if (window.innerWidth <= 768) {
      document.querySelectorAll(".hiw__card").forEach((card) => {
        card.style.position = "relative";
        card.style.transform = "none";
        card.style.opacity = "1";
      });
    }
  }, 150);
});
