# Content inventory

Every fact shown on the site, where it came from, and what is still missing. Facts live in `src/content/` and the dictionaries in `src/i18n/dictionaries/`.

## Verified facts in use

| Fact               | Value                                                              | Source                                                  | Used on                                  |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------- |
| Official name      | Nalanda English Medium Higher Secondary School                     | Official logo                                           | Everywhere                               |
| Short form         | Nalanda English Medium Hr. Sec. School / ENG. MED. HR. SEC. SCHOOL | Logo, poster                                            | Header, titles                           |
| Initials           | NEMHSS                                                             | Logo                                                    | About, structured data                   |
| Motto              | "Run your race to win"                                             | Logo ribbon                                             | Hero, top bar, About, footer             |
| City / state       | Bhilai, Chhattisgarh                                               | Logo ("– BHILAI")                                       | Header, contact, footer, structured data |
| Highest level      | Class 12 (higher secondary)                                        | "Hr. Sec." in the name; Class 12 students on the poster | Home, About, Academics                   |
| Medium             | English                                                            | Name                                                    | Home, About, Academics                   |
| CBSE participation | CBSE Far East Zone Judo Championship 2026                          | Poster                                                  | Home, Academics, Achievements            |
| Judo results       | 5 students (see below)                                             | Poster                                                  | Home, Achievements                       |
| Venue              | Maharishi Vidya Mandir, Tatibandh, Raipur, CG                      | Poster                                                  | Achievements                             |

### Judo results (as printed on the poster)

| Student            | Class | Category          | Result                                                                                                                            |
| ------------------ | ----- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Rashi Sahu         | 12 B  | Under 19 (−36 kg) | Gold                                                                                                                              |
| Mitanjali Singh    | 12 C2 | Under 19 (−48 kg) | Silver                                                                                                                            |
| Ansh Choudhary     | 9 E   | Under 17 (−60 kg) | Silver                                                                                                                            |
| Aditya Kumar Singh | 8 A   | Under 14 (−40 kg) | Silver                                                                                                                            |
| Aaditya Sahu       | 8 F   | Under 14 (−45 kg) | **Medal colour not stated** (the poster shows only a medal icon). Displayed as "Medal (see poster)". **Confirm with the school.** |

## Assets

| File                                                  | Source                                                 | Notes                                           |
| ----------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| `reference/assets/nalanda-official-logo.webp`         | Supplied by the project owner (2000×218)               | Original, untouched                             |
| `public/branding/nalanda-official-logo.png`           | Lossless conversion of the above                       | Header, footer, language page, OG image         |
| `public/branding/nalanda-emblem.png`                  | Crop of the seal from the official logo (no redrawing) | Mobile header, hero, About, favicons            |
| `reference/assets/judo-achievers-2026.webp`           | Supplied (980×1236)                                    | Original, untouched                             |
| `public/images/achievements/judo-achievers-2026.webp` | Byte-identical copy                                    | Achievements feature and "full-resolution" link |
| `public/og-image.png`                                 | Generated from the official logo                       | Social sharing card                             |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico`   | Resized emblem crop                                    | Browser icons                                   |

The supplied images look like they were re-encoded by the upload (WebP). If the school has the original poster or a higher-resolution or vector logo, replace these files and keep the same names.

**No stock or placeholder photographs are used anywhere.**

## Missing content (shown as "being updated")

| Item                                           | Where it appears    | Needed from                     |
| ---------------------------------------------- | ------------------- | ------------------------------- |
| Postal address, phone, email                   | Contact             | School office                   |
| History, vision, principal's message           | About               | School management               |
| Classes/sections offered, streams and subjects | Academics           | School                          |
| Admission dates, eligibility, documents, fees  | Admission           | School                          |
| Facilities and photos                          | Facilities, Gallery | School (with photo permissions) |
| Guidelines (full text or PDF)                  | Guidelines          | Original site / school          |
| Academic calendar                              | Academic Calendar   | Original site / school          |
| Book list                                      | Book List           | Original site / school          |
| Teachers list                                  | Teachers List       | Original site / school          |
| Mandatory public disclosure documents          | Public Disclosure   | Original site / school          |
| Parent portal URL (if any)                     | Not linked          | School                          |
| Affiliation number, UDISE code                 | Not shown           | School                          |
| Hindi copy sign-off                            | All Hindi pages     | Native-speaking staff member    |
