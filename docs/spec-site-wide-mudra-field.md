# Spec: Site-Wide Mudra Field Background

## Objective

Replace the hero's standalone 3D scene (`RhythmScene` — a taal-ring/icosahedron composition) and the boxed-in `MudraField` currently stuck inside the About section with a single `MudraField` instance that acts as the persistent background for the entire site.

**Why:** The hero scene doesn't communicate anything to a visitor and reads as unexplained decoration. The Mudra Field (a lattice of nodes that lift and glow where the cursor passes, evoking a gesture recognizer reading a hand) is well-liked but wasted sitting alone in one section.

**User:** Visitors scrolling through the portfolio top to bottom, on both desktop and mobile, light and dark theme.

**Success looks like:** One consistent, cursor-reactive field visible behind the whole page as you scroll, present in the empty space and margins of every section, and never visible behind any text or any card — with no visible box/border marking where it's excluded.

## Tech Stack

- Next.js 16 (App Router), React 19
- `@react-three/fiber` + `@react-three/drei` + `three` for the WebGL scene
- Tailwind CSS v4, theme via `next-themes` (CSS variable–driven `bg-background` / `bg-card` etc.)
- No test framework currently configured (no jest/vitest in `package.json`)

## Project Structure (relevant paths)

```
app/layout.tsx                  → root layout; MudraField mounts here, fixed, full-page
components/three/mudra-field.tsx → the field itself (Field, Rig, MudraField) — logic unchanged
components/three/rhythm-scene.tsx → DELETED
components/sections/hero.tsx     → drop RhythmScene import/usage
components/sections/about.tsx    → drop the boxed MudraField instance + its "MUDRA FIELD / READS ON HOVER" caption card
components/text-plate.tsx        → NEW — reusable opaque backdrop wrapper for bare text
components/sections/*.tsx        → wrap bare text in TextPlate; bump text-bearing card backgrounds to opaque
```

## Design Rules (the part that makes this not just "move the canvas")

1. **One fixed canvas.** `MudraField`'s `<Canvas>` becomes `position: fixed; inset: 0` at the root layout, `z-index` below all page content, `pointer-events` passed through except where the field's own hover interaction needs the raycast (it already reads `useThree().pointer`, which tracks global pointer position regardless of DOM pointer-events — no change needed there).

2. **Section-level tints stay translucent, exactly as they are today.** `Experience` and `Skills`'s `bg-card/30` section wash, and Hero's gradient wash, are left untouched. These sit over open space, not text, so letting the field show through tinted is fine and desired.

3. **Text-bearing cards become opaque.** Any card/panel that has readable text sitting directly inside it gets its background bumped from translucent to solid, same color family, same border/radius — visually near-identical to today, but now fully blocking the field. This applies to:
   - Experience: `article` cards (`bg-background/60` → `bg-background`)
   - Projects: `article` cards (`bg-card/50` → `bg-card`)
   - Skills: education card (`bg-background/60` → `bg-background`)
   - About: image-frame container (`bg-card/40` → `bg-card`) — and since the boxed MudraField preview is being removed from About anyway, this frame either goes away or gets repurposed (see Open Questions)
   - Hero: location pill (`bg-card/60` → `bg-card`)

4. **Bare text gets a `TextPlate` wrapper.** For text with no card behind it (Hero h1/tagline/footer hint, nav logo/links, About paragraphs, `SectionHeading`'s index/title/kicker, Skills group labels, Contact heading/subtext/email, footer copyright line), wrap in a small reusable component:
   ```tsx
   export function TextPlate({ className, children }: { className?: string; children: React.ReactNode }) {
     return (
       <span className={cn("bg-background box-decoration-clone px-1 -mx-1 py-0.5 -my-0.5", className)}>
         {children}
       </span>
     )
   }
   ```
   Solid `bg-background` (theme-aware CSS var), no border/shadow/radius — a flat patch in the page's base color, close-padded so it hugs the text without reading as an obvious rectangle. `box-decoration-clone` keeps the patch correct across line wraps.

   **Padding is tuned per call site, not one global default.** The default (`px-1 -mx-1 py-0.5 -my-0.5`) is a starting point for body-sized text; large text needs proportionally more breathing room or the patch reads as clipped, small text (nav links, mono labels) needs less or the patch looks oversized relative to the glyphs. Pass a `className` override per usage — e.g. the Hero h1 (5xl–7xl) gets a larger `px-2 py-1`-scale patch, nav links and footer mono text get a tighter `px-0.5 py-0` scale. Exact values are set by eye once the field is running behind real text, not calculated in advance.

5. **Rectangular exclusion only** — no per-glyph masking. `TextPlate` wraps the smallest sensible unit (a line/paragraph/heading), not individual characters.

6. **`RhythmScene` is deleted outright**, along with its dynamic import in `hero.tsx`. Not repurposed elsewhere.

## Code Style

Match existing conventions: function components, Tailwind utility classes inline, `cn()` helper from `lib/utils.ts` for conditional classes, no CSS modules. Example of the target pattern (Hero heading, after change):

```tsx
<h1 className="text-balance font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">
  <TextPlate>Arundhati</TextPlate>
  <br />
  <TextPlate className="text-primary">Vasishth</TextPlate>
</h1>
```

## Testing Strategy

No automated test suite exists. Verification is manual:
- `npm run dev`, check in browser at mobile/tablet/desktop breakpoints
- Toggle light/dark theme, confirm `TextPlate` and opaque cards track the theme correctly (no hardcoded colors)
- Scroll the full page slowly, visually confirm zero field pixels visible behind any text or any card, in both themes
- Move the cursor around at various scroll positions, confirm nodes lift/glow under the pointer everywhere, not just where About used to be
- Rough perf check: no visible jank/frame drops scrolling with the field running (dev tools FPS meter or just visual smoothness)

## Boundaries

- **Always:** keep the cursor-reactive field logic untouched; keep `TextPlate` theme-aware (no hardcoded hex); preserve existing card border/radius/hover styles when bumping opacity.
- **Ask first:** anything beyond this scope — e.g., if a section turns out to need a layout change (not just a background swap) to make the exclusion look right, pause and check before improvising.
- **Never:** implement per-glyph masking; leave any card or bare text with the field visibly showing through it; reintroduce a second simultaneous 3D canvas.

## Success Criteria

- [ ] `RhythmScene` and its usage in `hero.tsx` are removed
- [ ] `MudraField` is mounted once, fixed, full-viewport, at the root layout
- [ ] Every text-bearing card listed above is opaque
- [ ] Every bare text element listed above is wrapped in `TextPlate`
- [ ] Manual scroll-through in both themes shows zero field pixels behind any text or card
- [ ] Cursor lift/glow works anywhere on the page, not just one section
- [ ] `About`'s old boxed field preview + caption is gone entirely (no replacement copy elsewhere)
- [ ] `TextPlate` padding is visually tuned per call site (hero heading vs. nav links vs. body text are not using identical padding values)

## Open Questions

None outstanding — both resolved: About's field preview/caption is dropped with no replacement, and `TextPlate` padding is tuned per element rather than using one global default.
