/**
 * Facts about the school and where each one was verified. Only fields with a
 * source are shown on the site; `null` means "not yet supplied by the school"
 * and the UI renders a "being updated" state instead of a guess.
 * See docs/content-inventory.md for the full verification log.
 */
export const school = {
  /** Official English name. Source: official logo ("NALANDA ENGLISH MEDIUM HR. SEC. SCHOOL - BHILAI"). */
  officialName: "Nalanda English Medium Higher Secondary School",
  /** Initials on the emblem. Source: official logo. */
  initials: "NEMHSS",
  /** Source: official logo ribbon. */
  motto: "Run your race to win",
  /** Source: official logo. Kurud locality is implied by the domain but not yet confirmed. */
  city: "Bhilai",
  state: "Chhattisgarh",
  country: "IN",
  /** Existing public website, supplied by the project owner. */
  existingWebsite: "https://www.nalandakurud.in/",
  /** Not yet verified: never publish a guessed address, phone or email. */
  postalAddress: null as string | null,
  phone: null as string | null,
  /** WhatsApp number (with country code) for the mobile action bar; only once verified. */
  whatsapp: null as string | null,
  email: null as string | null,
  /** Parent portal: none verified, so none is linked. */
  parentPortalUrl: null as string | null,
} as const;

/** Google Maps photo collections supplied by the project owner (external links only). */
export const mapsPhotoCollections = [
  "https://maps.app.goo.gl/eJEsfWcpXfiiPWdN7",
  "https://maps.app.goo.gl/jykVTkjyv2B3KHsK6",
] as const;

/** Legacy page on the existing site, supplied by the project owner. */
export const legacyGuidelinesUrl = "https://www.nalandakurud.in/guidelines/";
