# Design System: Nalanda English Medium Hr. Sec. School

> Format follows [awesome-design-md](https://github.com/VoltAgent/awesome-design-md). Tokens live in `src/app/globals.css` (`@theme`). Page-level rules: `design-system/nalanda/MASTER.md`.

## Overview

A calm, institutional site built from the school's own logo: deep navy and crimson on warm white, set in a serif display face with a bilingual sans for text. The structure borrows **Uber's** discipline (one pill-shaped action style, sentence-case headings, a working form on the first screen, full-width alternating bands), **Apple's** photography-first galleries, and **Revolut/Oura's** mobile patterns (large type, a bottom action bar). It refuses the template tells listed by impeccable and taste-skill: eyebrow labels, icon-card grids, index numbers, gradients, decorative blobs, resting shadows.

**Key characteristics**

- One ground (paper), one ink (navy-ink), one accent (crimson) used only for actions.
- Gold appears only for the motto and medals.
- Full-width bands alternate paper → white → navy; the colour change is the divider. No hairlines between sections.
- Display type is large (up to 5.75rem) with tight leading; body text is 18px.
- Every interactive element that starts an action is a pill.
- Pictures are real (school-supplied or credited archive) or absent; never stock.

## Colors

### Brand & Accent

| Token                   | Hex                   | Role                                                     |
| ----------------------- | --------------------- | -------------------------------------------------------- |
| `navy-800`              | `#002D67`             | Brand navy (logo). Links, nav bar, focus outline partner |
| `navy-900`              | `#002050`             | Headings, navy bands                                     |
| `navy-950`              | `#00183A`             | Footer, deepest band                                     |
| `crimson-800`           | `#82040E`             | **Actions only**: primary buttons, active states         |
| `gold-400` / `gold-500` | `#DCB35F` / `#C8973A` | Motto, medals, focus ring. Never body text on paper      |

### Surface

| Token      | Hex       | Role                                                                          |
| ---------- | --------- | ----------------------------------------------------------------------------- |
| `paper`    | `#FBF9F4` | Page ground                                                                   |
| `white`    | `#FFFFFF` | Raised surface (form cards, document rows) — separated by tone, not by shadow |
| `navy-50`  | `#F2F5FA` | Quiet band                                                                    |
| `gold-100` | `#F6ECD6` | "Being updated" notices                                                       |

### Text

| Token   | Hex                   | Role                                                    |
| ------- | --------------------- | ------------------------------------------------------- |
| `ink`   | `#14213D`             | Running text (always full ink)                          |
| `muted` | `#4F5B70`             | Secondary notes only (captions, hints) — 7.6:1 on paper |
| on navy | `#FFFFFF` / 80% white | Text on navy bands                                      |

### Semantic

Success `emerald-800` on `emerald-50`; error `crimson-800` on `crimson-50`. Never colour alone: icons and words accompany state.

## Typography

### Font Family

- **Display:** Noto Serif 700, paired with Noto Serif Devanagari 700 for Hindi.
- **Text:** Mukta 400/600/700 (Latin + Devanagari in one family).
- Self-hosted via `next/font`; no preload; `unicode-range` subsets so each language downloads only its script.

### Hierarchy

| Role    | Size                                     | Leading          | Notes                                            |
| ------- | ---------------------------------------- | ---------------- | ------------------------------------------------ |
| Display | `clamp(2.5rem, 1.4rem + 4.6vw, 5.75rem)` | 1.02             | One per page (h1). Tracking −0.02em (Latin only) |
| Heading | `clamp(1.875rem, 1.3rem + 2.2vw, 3rem)`  | 1.1              | Section h2                                       |
| Title   | `1.375rem`                               | 1.3              | h3, list titles                                  |
| Body    | `1.125rem`                               | 1.6 (1.75 Hindi) | Max 70ch                                         |
| Small   | `0.9375rem`                              | 1.5              | Captions, hints, credits                         |

### Principles

- Five sizes on a page at most. Left-aligned; centre only the language page.
- No letter-spacing on Devanagari; no all-caps labels anywhere.
- Headlines ≤ 2 lines at every width; no styled accent word.

## Layout

### Spacing System

4px base. Inside a section: 16 / 24 / 32. Between sections: 80px (phone) → 128px (desktop). More space above a heading than below it.

### Grid & Container

Max width 80rem, gutters 16px (phone) / 24px (≥640px). Two-column splits at `lg` (1024px). Every half of a split holds content; no empty halves.

## Elevation & Depth

No shadows at rest. Surfaces are separated by a step in tone. Shadows only on what floats: menus, dialogs, the mobile action bar.

## Components

### Buttons

- **Primary:** crimson pill, white text, min-height 44px.
- **Secondary:** white pill with navy text and a navy outline (2px).
- **On navy:** gold-400 pill with navy text; outline variant in white.
- Pressed state scales to 0.98; focus ring 3px gold-500.

### Cards & Containers

White surface, 16px radius, no border, no shadow. Media corners 4px. No icon-topped feature cards; lists and splits instead.

### Navigation

Logo row (logo links home, language pill, primary action) + navy link bar (Rules & Regulations disclosure dropdown, search). Phones: bottom-sheet menu and a fixed bottom action bar (Enquire · Search · Call/WhatsApp when verified numbers exist).

### Forms

Visible labels, 48px fields, errors under the field with an icon, an error summary announced politely, success only after delivery.

### Documents

Rows: title, type, date, size, then **View** and **Download**. Missing documents: one honest "being updated" notice with a way to ask.

## Motion

- **Signature:** the hero picture opens with a clip-path reveal (CSS, 900ms, `cubic-bezier(0.16,1,0.3,1)`).
- **Entrances:** homepage sections only; content rises 20px with opacity, once. Visible by default if scripts fail.
- **Lightbox:** Motion (`motion/react`) cross-fades and slides between photos.
- **Feedback:** 150ms colour/scale on press and hover.
- `prefers-reduced-motion`: all travel removed, content shown in its final state.

## Do's and Don'ts

### Do

- Put the working enquiry on the first screen.
- Use the school's real pictures large; credit any archive picture in a caption.
- Keep Hindi and English equally complete.
- Show missing content honestly with a way to ask.

### Don't

- Eyebrow labels above headings, index numbers (01/02), pill badges above headlines.
- Rows of identical icon cards; nested cards.
- Gradients, glows, blurred blobs, decorative circles, glass as decoration.
- Shadows on resting cards; 1px outline boxes as section dividers; coloured side borders.
- Dark showroom themes, 3D, stock photography, emoji as icons.
- Invented facts, numbers, testimonials or contact details.

## Responsive Behavior

- Phone (< 640px): single column, emblem + short name in the header, bottom action bar, tables become stacked rows.
- Tablet (640–1023px): logo banner, menu sheet, two-column lists where they fit.
- Desktop (≥ 1024px): navy link bar with dropdown, split heroes, full gallery grid.
