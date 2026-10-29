import type { Bilingual, Picture } from "./types";
import { judoPoster } from "./achievements";

export type GalleryCategory = "campus" | "classrooms" | "sports" | "events" | "achievements";

export const galleryCategoryLabels: Record<GalleryCategory, Bilingual> = {
  campus: { en: "Campus", hi: "परिसर" },
  classrooms: { en: "Classrooms", hi: "कक्षाएँ" },
  sports: { en: "Sports", hi: "खेल" },
  events: { en: "Events", hi: "कार्यक्रम" },
  achievements: { en: "Achievements", hi: "उपलब्धियाँ" },
};

export interface GalleryItem extends Picture {
  id: string;
  category: GalleryCategory;
  title: Bilingual;
}

/**
 * School-approved photographs. Put files in public/images/gallery/ and add
 * them here (with written permission for any photo showing students).
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "judo-achievers-2026",
    category: "achievements",
    src: judoPoster.src,
    width: judoPoster.width,
    height: judoPoster.height,
    title: { en: "Judo Achievers 2026", hi: "जूडो अचीवर्स 2026" },
    alt: {
      en: "Achievers poster for the CBSE Far East Zone Judo Championship 2026, showing five medal-winning students.",
      hi: "CBSE फ़ार ईस्ट ज़ोन जूडो चैंपियनशिप 2026 का अचीवर्स पोस्टर, जिसमें पदक जीतने वाले पाँच विद्यार्थी दिखाए गए हैं।",
    },
    caption: {
      en: "CBSE Far East Zone Judo Championship 2026",
      hi: "CBSE फ़ार ईस्ट ज़ोन जूडो चैंपियनशिप 2026",
    },
  },
];

/** True once the school has supplied photographs of its own campus and life. */
export const hasSchoolPhotos = galleryItems.some((item) => item.category !== "achievements");
