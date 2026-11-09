# Roadmap: Round 2 Part A (homepage)

## Round 3 Part F

- [x] Deck navigation has a single hash reader, preserved history state and portrait-mobile-only tracking; browser checks at 1536x674, 1280x800 and 375x812 pass keyboard, dots, buttons, real touch swipe, shared hashes and print isolation. Nine deck tests pass; hosted verification still returns 401.
- [x] Standalone 23-slide company deck with shared-source facts and reference-inspired visuals; additional featured work gets a More work slide
- [x] Keyboard, hash/reload, real touch swipe, controls, mobile stack and print layout; 23 landscape pages verified from desktop and mobile
- [x] Menu/footer/sitemap metadata; 375/768/1280 checks without horizontal scroll or runtime errors, no serious/critical axe findings, content-integrity tests pass

## Round 3 Part E

- [x] Service placeholder cap and generic UI fillers
- [x] Booking settings, secure storage and optional emails (no email secret configured, safely skipped)
- [x] Reusable calendar, project form, confirmation and calendar export
- [x] Homepage/book placement and plan/service preselection; remove Cal.com
- [x] Admin booking list/actions and overview count implemented with admin-only RLS
- [ ] Authenticated admin end-to-end check: no auth users exist, session minting cannot supply an admin session
- [x] Team locations and founding-year audit
- [x] Real competing submissions: one stored booking, one conflict returned to calendar; Google/ICS checked; test row deleted. Keyboard and 375/768/1280 checks passed.

## Round 3 Part D

- [x] Hide carousel cursor on native/Lenis scroll and viewport exit; both scroll flows checked in browser.
- [x] Study Orbix services; replace homepage with eight service panels using existing work and labelled placeholders.
- [x] Shared service template, seven new detail pages, index and restyled custom software; existing build copy/contact/pricing note retained.
- [x] Menu/footer/sitemap inventory, unique page metadata and FAQ structured data verified.
- [x] Keyboard Before/After, 25 content/routing tests, 375/768/1280 checks without overflow/errors; axe serious/critical zero across ten affected pages.

## Round 3 Part C

- [ ] Preview follow-up: automatic build reports build OK; hosted asset and homepage both return 401 Unauthorized, blocking deployed-version verification. Manual builds are managed by the harness.
- [x] Cursor follow-up: body portal at layer 9000; navigation/menu at 9100/9200. Screenshot and temporary hit-test probe confirm cursor above cards; pointer passthrough preserved.
- [x] Badge follow-up: Demo versus Concept classification tested, 12 content tests pass; Bloom Demo verified in browser. No overflow at 375/768/1280 or runtime errors.
- [x] Study Orbix live motion (exact reference timing could not be established)
- [x] Lenis synced with ScrollTrigger, accessible fallbacks
- [x] Floating tile burst and colour-wave statement
- [x] Portal DRAG cursor and frosted carousel cards
- [x] Scroll-driven process with 12 generated images
- [x] Shared six featured stacking cards on homepage and case studies
- [x] Verify reverse scrolling, keyboard, mobile and reduced motion
- [ ] Verify production initial bytes under 2 MB: no production deployment or production output is available; local development transfers are not representative.

- [x] 1 Storm hero video (dark hero, 1080p + 720p + poster)
- [x] 2 Reduce "No lock-in"
- [x] 3 Floating projects section
- [x] 4 Arc carousel + DRAG cursor (replace Recent projects grid)
- [x] 5 Who we are size + tilted pills
- [x] 6 AI agent pinned section with sliding cards
- [x] 7 Client portal section on homepage
- [x] 8 Menu overlay redesign
- [x] 9 Social icons (5, coming soon state)
- [x] 10 Portal demo banner grey
- [x] 11 Invoice table alignment
- [x] Verify 375/768/1280, bytes, console
