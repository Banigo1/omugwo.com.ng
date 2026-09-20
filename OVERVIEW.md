# OVERVIEW.md — Omugwo.com.ng

Static marketing website for a Nigerian startup connecting new mothers with vetted postpartum caregivers. Named after the traditional Igbo postpartum care practice ("omugwo"). Currently launching in Port Harcourt, with Abuja and Lagos to follow.

## Tech Stack

**No build tools, no framework, no package.json** — plain HTML/CSS/JS, served statically or opened directly in a browser.

## Project Structure

```
├── index.html          # Homepage (hero slider, services, gallery, problem, trust, FAQ, waitlist CTA)
├── about.html          # About Us
├── services.html       # Services overview
├── find-care.html      # "Get a caregiver" flow (form page)
├── caregiver.html      # "Become a caregiver" flow (form page)
├── contact.html        # Contact page
├── coming-soon.html    # Placeholder for future pages (Privacy, Terms, etc.)
├── css/
│   ├── style.css       # Design system: tokens, nav, buttons, hero, problem/FAQ sections (large, BEM)
│   ├── animations.css  # Keyframes/animation effects
│   └── [about|caregiver|contact|find-care|pages|services].css  # Per-page styles
├── js/
│   ├── main.js         # Shared behaviors (loaded by every page, ~570 lines)
│   └── [caregiver|contact|find-care|pages|services].js          # Per-page scripts
├── images/             # Photos (mothers, midwives, hero banners)
├── assets/             # Logos & favicon
├── s/                  # Self-hosted Inter font files
└── reference-images/   # Design mockups used as visual reference
```

## Key Patterns

- **BEM naming** throughout (`hero__headline`, `svc-card__title`, `faq__question`)
- **CSS custom properties** as a design system in `style.css`:
  - Color tokens: `--rust`, `--sage`, `--earth`, `--cream`
  - Fluid type scale via `clamp()`, spacing, shadows, easings
  - Note: `--rust` is actually blue (`#2f6fb0`) — token names are leftovers from an older palette
- **Shared script** (`main.js`) handles:
  - Mobile drawer menu with iOS scroll-lock (position:fixed + saved scroll offset)
  - Hero image slider with dots (5s autoplay, Ken Burns zoom)
  - FAQ accordion
  - Scroll-reveal via `IntersectionObserver` with stagger delays
  - Count-up stats animation
  - Sticky-scroll sections ("How it works" card stack, services reveal)
  - Magnetic buttons, 3D card tilt, cursor glow
  - Mailchimp waitlist signup via **JSONP** (because Mailchimp blocks CORS from browsers)
- **Per-page scripts** are guarded `DOMContentLoaded` modules — safe to load everywhere; they no-op if their selectors are missing
- **Scroll-driven effects** are desktop-only (guarded by `window.innerWidth <= 768` checks), with a debounced resize handler to switch modes

## Notable Quirks / Things to Watch

- `@import url("../css2")` at the top of `style.css` pulls in locally downloaded Google Fonts CSS (that's what the `css2` files and `s/inter/` TTFs are for).
- Recent changes (per git) touched all 7 HTML pages plus main CSS — likely a design refresh, with `reference-images/` holding the design comps being matched.
- The homepage CTA/waitlist form submits via Mailchimp JSONP — it works, but there is no server-side or honeypot spam protection.
- The CTA "200+ mothers on the waitlist" proof line is marketing copy, not live data.

## Fixed (Sept 2026)

- Hero slider: had 5 dots for 4 slides; now 4 dots matching the 4 slides.
- Homepage CTA: was decoration-only (orbs/particles, no form). The waitlist form was rebuilt inline (`.cta__form.newsletter-form`), wired to the existing Mailchimp JSONP handler in `main.js`, reusing the surviving `.cta__*` styles.
- Footer quick links: `#about`, `#faq`, `#how-it-works` existed only on the homepage (or nowhere). All footers now link to `about.html`, `index.html#faq`, and `services.html#how-it-works` (id added to the vetting-steps section).
- `assets/logo.svg` / `assets/logo1.svg` (caregiver, coming-soon) didn't exist — replaced with `assets/omugwologo-nobg.png`.
- Favicon `<link>` tags declared `type="image/svg+xml"` for .png files on all 7 pages — now `type="image/png"`.
- Newsletter submit handler: button label is now captured once (before first submit) and `innerHTML` is used, so the arrow icon survives and a "Try again" state can't become the new default label.
