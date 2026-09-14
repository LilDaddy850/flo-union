# Flo Union — Design System

Direction: **built like the work.** Warm, industrial, premium. The job photos are the design; everything around them stays quiet. The site's one job is to make the phone ring.

## Color
| token | value | use |
|---|---|---|
| charcoal | #1C1C1E | hero, dark sections, footer |
| graphite | #2A2A2D | dark surfaces, cards on dark |
| orange | #E8862A | primary CTA, stat numerals, eyebrows on dark |
| copper | #B85C14 | hover and gradient end |
| off-white | #F4F1EC | light sections (never pure white) |
| steel | #8C8C8C | hairlines, secondary text |

Rules: orange only on things you tap, the stat numerals, and the single orange CTA band. One gradient: orange to copper. Sections alternate charcoal / off-white, full-bleed, one idea per section. Fine 2.8% grain over everything.

## Type
- Michroma: eyebrow labels, nav, buttons, stat captions. 11px, 0.2em tracking, uppercase. Never body text.
- Barlow Semi Condensed 600/700/800: all headlines. Tight leading (0.96–1.05).
- Barlow 400/500: body at 17px, line-height 1.6, measure 60ch.

Scale: hero clamp(2.75rem, 7.2vw, 6.25rem) · h1 clamp(2.125rem, 4.6vw, 3.75rem) · h2 clamp(1.625rem, 2.8vw, 2.5rem) · h3 clamp(1.25rem, 1.8vw, 1.5rem).

## Rhythm
8-pt spacing (8/16/24/40/64/96). Section padding clamp(80px, 11vw, 152px). Gutter clamp(20px, 5vw, 72px). Max width 1320px. Radius 4px on buttons, 12px on photos.

## Layout devices
- Hero: headline left, vertical crew video right (desktop); video behind text (phone).
- Stats: giant numerals with orange→copper text fill, small Michroma captions.
- Editorial hairline rows: small label / big headline / short paragraph. No icon cards.
- Scattered numbered project gallery: varied sizes on a 12-column grid, negative space, title overlapping the photo edge. Phone: staggered single column.
- Quiet text nav with one orange Call pill.

## Motion
Ease cubic-bezier(.16,1,.3,1), 0.7s reveals. Hero video muted loop + thin rain canvas. Logo wipe-reveal once (600ms). Flow line = scroll progress, left edge, desktop only. Count-up on stats. Hover lift 2px. Nothing else. All motion off under prefers-reduced-motion.

## Don't
Pure white · Inter · Lucide icon rows · three feature cards · checkmark bullets · purple, neon, pastel · dot grids · radial orbs · sparkle icons · parallax · scroll-jacking · loading screens · fake reviews · em-dashes in copy.
