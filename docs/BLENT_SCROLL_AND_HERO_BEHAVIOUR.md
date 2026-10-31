# blent — Scroll chapters and hero motion specification
Date: 31 October 2026
Status: user-directed design requirement; implement with the approved website designs.

## Reference / problem
The reference screenshot shows an unrelated prototype with the media area persistently stuck in a small upper-left/sidebar panel while text continues to scroll. That behavior must **not** be replicated on blent.

## Desktop section rhythm (priority)
- Every major storytelling chapter should **feel approximately one desktop viewport high**, at common viewport widths 1280–1600px and heights 720–1000px, measured against the visible viewport *minus the fixed/sticky header*.
- Use `min-height: calc(100svh - var(--header-height))` for appropriate hero/chapter sections, with flexible height when actual content exceeds the viewport. Never clip essential text or forms merely to force a screenful.
- One clear subject per chapter: a large headline, concise supporting copy, relevant high-quality fluid image or infographic, and an appropriate CTA where relevant. Maintain abundant white space and precise optical alignment.
- Keep the existing agreed customer-first architecture and copy; do not invent new brand slogans.
- **Visibly signal that more content is below**: unobtrusive `Scroll to explore ↓` / down-chevron and/or a glimpse of the next chapter at the lower edge. It should be a real anchor/scroll action, not an inert icon. Keep a clear indication of the next chapter on the first viewport.
- Navigation can remain available at the top (sticky header) but the layout should not become a persistent left-column dashboard.
- Scrolling should be native, smooth and predictable. Avoid forced `scroll-snap-type: mandatory` which can trap users or make text inaccessible. Optional proximity snap on desktop is permissible after usability testing, not a requirement.
- Motion between chapters: subtle text reveal, parallax of a **real approved liquid asset**, restrained transitions. Honor `prefers-reduced-motion`.

## Hero video (priority)
- The video / liquid animation should be a **cinematic element owned by the first hero section**. It may fill the hero backdrop or hero-right visual region; it must not persist in a top-left thumbnail, floating player, sticky sidebar, or picture-in-picture as the user scrolls past.
- The hero video is contained within the hero and scrolls away *with the hero*. No `position: fixed` on the video or its parent. If layering is needed: hero `position: relative; overflow: hidden`; video `position: absolute; inset: 0` (or a right-side absolute region) with `object-fit: cover` / `contain` depending on artwork.
- Use an appropriate high-resolution still as `poster` for the motion, and a clear static fallback. Do not launch the generic SVG wave as the final fluid.
- Suggested playback: `autoPlay muted loop playsInline`, `preload="metadata"`; use IntersectionObserver to pause when out of view and restart only when visible. Respect reduced motion and save-data preferences.
- Keep text and CTAs readable, with overlay treatment only as needed. Avoid enormous headline wrapping that crowds or obscures the hero material.
- On mobile, retain the same hierarchy with the video in a dedicated visual region; it must not obscure buttons or create horizontal scroll.

## Specific sections to prototype
1. HERO — Making clean, clean. Early dual CTA, full-height premium fluid visual, scroll cue.
2. CHALLENGE — Essential cleaning. Outdated chemistry. Industrial photography.
3. SOLUTION — Engineered for the demands of industry. Performance + cleaner formulation story; fluid close-up.
4. APPROACH — Considered chemistry across formulation, sourcing, quality and tests; editable infographic.
5. TRIAL JOURNEY — managed product test, steps anchored in a clear diagram.
6. RESULTS/RESOURCE EXCHANGE — proof hierarchy, info request CTA (no unsupported figures).
7. CORPORATE VISION — A new standard in industrial chemistry.
8. FINAL CTA — Discuss your application, direct email, forms.

Long content pages (resources, technical details, forms and future portal) may grow naturally taller than a viewport; do **not** turn these into artificial one-screen-only pages.

## Developer acceptance checks
- At desktop 1440×900 and 1280×800, screenshot each chapter before merging; each key section occupies approximately a viewport and content is not clipped.
- At initial load, there is an unmistakable cue that the user can scroll.
- After scrolling past the hero, the hero video is **completely gone**. No top-left persistent box, mini-video or overlay.
- Buttons are optically centered; labels and arrows share a stable baseline.
- At 390px mobile width, no fixed 100vh traps, horizontal overflow or hidden text.
- Media poster loads if video fails; prefers-reduced-motion yields a good static page.
- Preserve approved brand voice and exact hero language.
