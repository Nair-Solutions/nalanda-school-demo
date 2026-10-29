# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/nalanda/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Nalanda English Medium Hr. Sec. School, Bhilai
**Category:** Institution / school website (ui-ux-pro-max profile: trust navy + gold, clarity first, reduced motion)
**Design Dials:** variance 4 · motion 3 · density 3 (spacious)
**Visual source of truth:** [`/DESIGN.md`](../../DESIGN.md) · Product context: [`/PRODUCT.md`](../../PRODUCT.md)

---

## Global Rules

### Color Palette

| Role                             | Hex       | CSS Variable          |
| -------------------------------- | --------- | --------------------- |
| Primary (brand)                  | `#002D67` | `--color-navy-800`    |
| Heading / band                   | `#002050` | `--color-navy-900`    |
| Action (CTA)                     | `#82040E` | `--color-crimson-800` |
| On action                        | `#FFFFFF` | —                     |
| Highlight (motto, medals, focus) | `#C8973A` | `--color-gold-500`    |
| Background                       | `#FBF9F4` | `--color-paper`       |
| Surface                          | `#FFFFFF` | —                     |
| Text                             | `#14213D` | `--color-ink`         |
| Muted text                       | `#4F5B70` | `--color-muted`       |

**Color Notes:** One accent. Crimson appears only on actions. Gold never carries body text on light grounds.

### Typography

- **Heading Font:** Noto Serif 700 + Noto Serif Devanagari 700
- **Body Font:** Mukta 400/600/700
- **Mood:** institutional, warm, legible in two scripts

### Spacing Variables

_Density: 3/10 — spacious_

| Token         | Value | Usage                  |
| ------------- | ----- | ---------------------- |
| `--space-xs`  | 8px   | Icon gaps              |
| `--space-sm`  | 16px  | Inside groups          |
| `--space-md`  | 24px  | Between related blocks |
| `--space-lg`  | 32px  | Card padding           |
| `--space-xl`  | 80px  | Section gap (phone)    |
| `--space-2xl` | 128px | Section gap (desktop)  |

### Shadow Depths

| Level | Value                                  | Usage                             |
| ----- | -------------------------------------- | --------------------------------- |
| none  | —                                      | Everything at rest                |
| float | `0 12px 32px -12px rgb(0 24 58 / .35)` | Menus, dialogs, mobile action bar |

---

## Page Modes (impeccable)

| Pages                                          | Mode       | Success                                                           |
| ---------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| Home, Admission                                | Persuade   | Understand the school in 5 seconds; enquire from the first screen |
| Rules & Regulations and its sub-pages, Privacy | Read       | Find and open the document fast; comfortable reading column       |
| Contact, enquiry form                          | Operate    | Complete the form with a thumb; honest result                     |
| Gallery, Achievements                          | Experience | The pictures lead; interface recedes                              |

---

## Anti-Patterns (never)

- Eyebrow / kicker labels, index numbers, icon-card grids, nested cards
- Gradients, blobs, glass as decoration, resting shadows, coloured side borders
- Emoji icons, stock photos, invented facts, fake success states
- Removing focus rings, placeholder-only labels, hover-only affordances

---

## Pre-Delivery Checklist

- [ ] Contrast ≥ 4.5:1 (text) / 3:1 (large text, UI) — axe clean
- [ ] Touch targets ≥ 44×44px; 8px spacing
- [ ] Keyboard: every control reachable, visible focus, Escape closes overlays
- [ ] No horizontal scroll at 360px; headings ≤ 2 lines
- [ ] Images: width/height set, lazy below the fold, alt text in both languages
- [ ] `prefers-reduced-motion` honoured
- [ ] Hindi page reviewed: no stray English, no clipped matras
- [ ] Forms: labels, inline errors, loading state, success only after delivery
- [ ] `impeccable detect src/` reviewed; taste-skill `inspect` 0 FAIL; Playwright + axe green
