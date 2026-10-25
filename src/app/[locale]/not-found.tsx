import Link from "next/link";
import { buttonClasses } from "@/components/ui/ButtonLink";

/**
 * Rendered for notFound() inside a locale. Locale isn't available here, so the
 * message is shown in both languages.
 */
export default function LocaleNotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="font-display text-navy-800 text-6xl font-bold">404</p>
      <h1 className="text-navy-900 mt-4 text-3xl font-bold">
        Page not found
        <span lang="hi" className="mt-1 block text-2xl">
          पृष्ठ नहीं मिला
        </span>
      </h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/en" className={buttonClasses("primary")}>
          Go to the homepage
        </Link>
        <Link href="/hi" lang="hi" className={buttonClasses("secondary")}>
          मुखपृष्ठ पर जाएँ
        </Link>
      </div>
    </div>
  );
}
