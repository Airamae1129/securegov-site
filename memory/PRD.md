# SecureGov — Public Demo Landing Page

## Original problem statement
Build a public, heavily-animated demo landing page for SecureGov (by CyberHealth, Ireland), an AI-powered cyber GRC platform for European SMEs. Match the live product identity (deep-aubergine sidebar, lavender canvas, royal-purple accents, Inter) with a modern cinematic layer: 3D hero shield, scroll stories, faithful product-tour replica, honest scoring as a differentiator. No real client data, no auth, no real AI — scripted demo content only.

## User decisions (confirmed)
- Certification claims confirmed: "ISO 27001 & ISO 42001 certified" + "Hosted in EU data centres" are published.
- Demo form stores submissions in MongoDB via `POST /api/demo-requests`.
- Full Three.js/R3F hero on desktop + static SVG fallback on mobile/reduced-motion.
- Priority: motion and hero wow-factor.

## Architecture
- Frontend: Vite + React 19 + TS, Tailwind v4, GSAP/ScrollTrigger, Lenis, motion (Framer Motion), R3F/three (lazy hero), all copy in `src/content.ts`, tokens in `src/index.css`.
- Components in `src/components/landing/`; page assembled in `src/pages/Home.tsx`.
- Backend: FastAPI, `/api/demo-requests` POST/GET (Mongo `demo_requests` collection), plus template status routes.

## Implemented (2026-10-08)
- Intro loader (shield draw → curtain wipe, skippable), custom cursor, scroll progress bar, Lenis smooth scroll.
- Hero: R3F glowing shield + binary orbit rings + upward particles + mouse parallax, masked line-by-line headline reveal, magnetic CTAs, video modal placeholder, floating glass stat cards.
- Framework marquee (ISO 27001, ISO 42001, NIS2, CyFun, GDPR, CRA, DORA).
- Problem→consolidation pinned GSAP scroll story (chips scatter→merge→shield), static fallback on mobile/reduced-motion.
- Solution hub: orb + 5 module pills with SVG connector draw + travelling pulses.
- Bento grid of 7 capabilities, each with looping micro-animation; 5-step "How it works" timeline.
- Product tour: faithful app-shell replica (sidebar #220A43, breadcrumbs, top bar, footer v4.1.0) with 9 screens — Dashboard, Monitoring (6.3% honest assurance score), Alert Center carousel, Policies, Risk Register, Evidence, Framework Mapping (animated Sankey), Reports tabs, scripted AI Advisor (typewriter, disabled free-text).
- Use cases (4 flip cards), Security & Trust (orbiting badges), Pricing (3 glass cards), CTA with working demo-request form → MongoDB, coming-soon roadmap with scanline + notify-me, footer, GDPR cookie banner.
- SEO: title, meta description, OG image, Organization/SoftwareApplication JSON-LD. Favicon = shield SVG mark.

## Verified
- `yarn typecheck` clean; backend import clean.
- Public URL e2e: POST/GET demo-requests OK; browser pass: hero, tour navigation, advisor chips, form submit → success state.

## Remaining placeholders (from brief)
- Overview PDF URL (UI says "coming soon").
- 60-second explainer video (modal placeholder).
- Footer legal pages (About/Terms/Privacy) — stub links.

## Backlog
- P1: Real overview PDF + explainer video assets.
- P1: Legal pages (Terms/Privacy) content.
- P2: Lighthouse audit ≥90 tuning (cap WebGL cost further, image optimisation).
- P2: Admin view of demo requests (auth-gated).
