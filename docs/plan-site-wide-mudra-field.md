# Implementation Plan: Site-Wide Mudra Field Background

Spec: `docs/spec-site-wide-mudra-field.md`

## Overview

Swap the hero's `RhythmScene` and the boxed-in `MudraField` for one fixed, full-page `MudraField` mounted at the root layout, then go section by section making sure the field is never visible behind text — either by wrapping bare text in a new `TextPlate` patch, or by making its containing card fully opaque (which protects everything nested inside it for free, so most cards need a one-line fix, not per-element wrapping).

## Architecture Decisions

- **Opaque containers protect their contents for free.** Once a card's background goes from translucent (`bg-card/50`, `bg-background/60`, etc.) to solid, nothing nested inside it can ever show the field, regardless of that nested element's own background. So `TextPlate` is only needed for text sitting *directly* on a transparent or translucent section background — not for anything already inside an opaque card. This cuts the actual `TextPlate` usage down to: Hero copy, nav, `SectionHeading` (shared by 4 sections), About's paragraphs, Skills' group labels, and Contact's copy/footer.
- **Bordered "outline" buttons currently have zero fill**, not just low opacity — Hero's Resume button and Contact's LinkedIn/GitHub buttons are `border` with no `bg-*` at all. These need a fill added, not just an opacity bump, or their label text would sit directly on the animated field with nothing behind it.
- **Section-level tints (`bg-card/30`, hero gradient wash) are untouched** per your decision — they don't sit under text directly, only under `SectionHeading`/paragraphs, which get their own `TextPlate`.

## Task List

### Phase 1: Foundation — swap the background

- [ ] **Task 1: Build `TextPlate`**
  - **Description:** New reusable component, a solid `bg-background` inline patch with tunable padding via `className`, no border/shadow/radius.
  - **Acceptance:** Renders children wrapped in a themed opaque patch; accepts `className` for per-call-site padding; uses `box-decoration-clone` so multi-line text doesn't get a broken/gapped patch.
  - **Verification:** Manual — render it once anywhere, confirm solid patch in both themes, confirm it looks correct across a line wrap.
  - **Dependencies:** None
  - **Files:** `components/text-plate.tsx`
  - **Scope:** XS (1 file)

- [ ] **Task 2: Swap the background — fixed field at root, delete `RhythmScene`, delete About's boxed panel**
  - **Description:** Mount `MudraField` once in `app/layout.tsx` as `position: fixed; inset: 0`, behind all content (`z-index` below `<main>`), non-interactive except for the pointer tracking it already does. Delete `components/three/rhythm-scene.tsx` and its import/usage in `hero.tsx`. Delete About's boxed field preview (the square panel, "MUDRA FIELD / READS ON HOVER" caption, and the "Move across the lattice..." paragraph) with no replacement.
  - **Acceptance:** One `MudraField` canvas visible full-page behind every section while scrolling; no second canvas anywhere; hero no longer imports `RhythmScene`; About no longer has the boxed panel or its caption copy.
  - **Verification:** `npm run dev`, scroll the full page, confirm the field is visible behind every section and reacts to the cursor anywhere on screen. `npm run build` succeeds (catches the deleted-file import if anything still references `rhythm-scene`).
  - **Dependencies:** None (independent of Task 1)
  - **Files:** `app/layout.tsx`, `components/sections/hero.tsx`, `components/sections/about.tsx`, delete `components/three/rhythm-scene.tsx`
  - **Scope:** M (4 files)

### Checkpoint: Foundation
- [ ] `npm run build` succeeds
- [ ] `npm run dev` shows one field, full-page, cursor-reactive everywhere
- [ ] **Expected at this point:** text is *not yet* protected — it's fine and expected that the field is currently visible behind text and cards. That's Phase 2.
- [ ] Review with you before proceeding to Phase 2

### Phase 2: Text & card exclusion (vertical slice per section — each is independent)

- [ ] **Task 3: Hero**
  - **Description:** Wrap `h1` ("Arundhati" / "Vasishth"), the tagline paragraph, and the "TEENTAL · 16 BEATS / MOVE YOUR CURSOR" footer hint in `TextPlate` with generous padding (large text needs more). Bump the location pill from `bg-card/60` to solid `bg-card`. Add a solid fill (`bg-background` or `bg-card`) to the Resume button, which currently has a border but no fill at all.
  - **Acceptance:** No field pixels visible behind any Hero text or the Resume button label, in either theme.
  - **Verification:** Manual visual check, both themes, both mobile and desktop widths.
  - **Dependencies:** Task 1, Task 2
  - **Files:** `components/sections/hero.tsx`
  - **Scope:** S (1 file)

- [ ] **Task 4: SiteNav**
  - **Description:** Wrap the logo text and every nav link (desktop bar + mobile dropdown, including the mobile-only "Resume" link) in `TextPlate` with tight padding. Do this unconditionally, regardless of the header's own scroll-triggered background — simpler than branching on scroll state.
  - **Acceptance:** No field pixels behind any nav text at any scroll position, open or closed mobile menu, either theme.
  - **Verification:** Manual — check nav at top of page (transparent header) and after scrolling (blurred header), both themes.
  - **Dependencies:** Task 1, Task 2
  - **Files:** `components/site-nav.tsx`
  - **Scope:** S (1 file)

- [ ] **Task 5: `SectionHeading` (shared by About, Experience, Projects, Skills)**
  - **Description:** Wrap the index label, `h2` title, and optional kicker paragraph in `TextPlate`. One change here fixes all four sections that use this component.
  - **Acceptance:** No field pixels behind any section heading anywhere on the site.
  - **Verification:** Manual — check all four section headings, both themes.
  - **Dependencies:** Task 1, Task 2
  - **Files:** `components/section-heading.tsx`
  - **Scope:** XS (1 file)

- [ ] **Task 6: About paragraphs**
  - **Description:** Wrap each About body paragraph in `TextPlate`.
  - **Acceptance:** No field pixels behind About's body text.
  - **Verification:** Manual, both themes.
  - **Dependencies:** Task 1, Task 2
  - **Files:** `components/sections/about.tsx`
  - **Scope:** XS (1 file)

- [ ] **Task 7: Experience card opacity**
  - **Description:** Bump the `article` card background from `bg-background/60` to solid `bg-background`. This alone protects everything nested inside (role/org/place text, period pill, bullet points, repo link) — no per-element `TextPlate` needed inside the card.
  - **Acceptance:** No field pixels visible anywhere inside an Experience card, in either theme.
  - **Verification:** Manual, both themes.
  - **Dependencies:** Task 2 (not Task 1 — this task doesn't use `TextPlate`)
  - **Files:** `components/sections/experience.tsx`
  - **Scope:** XS (1 file)

- [ ] **Task 8: Projects card opacity**
  - **Description:** Same pattern as Task 7 — bump the `article` card from `bg-card/50` to solid `bg-card`.
  - **Acceptance:** No field pixels visible anywhere inside a Projects card, in either theme.
  - **Verification:** Manual, both themes.
  - **Dependencies:** Task 2
  - **Files:** `components/sections/projects.tsx`
  - **Scope:** XS (1 file)

- [ ] **Task 9: Skills — group labels + education card**
  - **Description:** Wrap each skill-group `h3` label ("Languages", "Frameworks & Cloud", "Data & AI") in `TextPlate` (these sit bare on the section's translucent wash). Bump the education card from `bg-background/60` to solid `bg-background` (protects everything nested inside it — school name, degree, honors chips, expected date — for free). Skill chips themselves already use opaque `bg-background` and need no change.
  - **Acceptance:** No field pixels behind any group label or anywhere inside the education card.
  - **Verification:** Manual, both themes.
  - **Dependencies:** Task 1, Task 2
  - **Files:** `components/sections/skills.tsx`
  - **Scope:** S (1 file)

- [ ] **Task 10: Contact + footer**
  - **Description:** Wrap the "Let's talk" heading, subtext, and the plain-text email line in `TextPlate`. Add a solid fill to the LinkedIn and GitHub buttons (currently border-only, no fill) — the Email button already has a solid `bg-primary` fill and needs no change. Wrap the footer's copyright line and "BUILT ON RHYTHM · AMHERST, MA" tagline in `TextPlate`.
  - **Acceptance:** No field pixels behind any Contact or footer text, or behind the LinkedIn/GitHub button labels.
  - **Verification:** Manual, both themes.
  - **Dependencies:** Task 1, Task 2
  - **Files:** `components/sections/contact.tsx`
  - **Scope:** S (1 file)

### Checkpoint: Complete
- [ ] `npm run build` succeeds, `npm run lint` clean
- [ ] Full scroll-through in both themes: zero field pixels visible behind any text or any card, top to bottom
- [ ] Cursor lift/glow confirmed working at multiple scroll positions, not just near the old About location
- [ ] Mobile width spot-check (nav menu open, Hero, cards) in both themes
- [ ] Ready for your review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `TextPlate` padding looks wrong on first pass for a given element (too tight/loose) | Low — cosmetic | Each section is its own task; adjust padding per-file without touching others |
| Fixed full-page canvas + higher instance count (field spans much more screen area than the old small square) causes scroll jank on lower-end devices | Medium | Checkpoint after Phase 1 explicitly calls out a perf spot-check before continuing; if janky, reduce `Field`'s `cols`/`rows` count as a follow-up, not blocking this plan |
| Removing `RhythmScene` before the fixed field is mounted leaves the hero blank mid-work | Low | Task 2 does both halves of that swap atomically, not as two separate tasks |

## Task Dependency Graph

```
Task 1 (TextPlate) ──┐
                      ├──> Task 3 (Hero)
Task 2 (bg swap) ─────┼──> Task 4 (SiteNav)
                      ├──> Task 5 (SectionHeading)
                      ├──> Task 6 (About)
                      ├──> Task 9 (Skills)
                      └──> Task 10 (Contact)

Task 2 alone ─────────┬──> Task 7 (Experience — no TextPlate needed)
                      └──> Task 8 (Projects — no TextPlate needed)
```

Tasks 3–10 are independent of each other once 1 and 2 land — safe to do in any order, or in parallel across sessions.

## Open Questions

None — spec is fully resolved.
