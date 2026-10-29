import Image from "next/image";
import { LanguageChoice } from "./LanguageChoice";

/**
 * First-visit language selection. Visitors who already chose a language are
 * redirected past this page by src/proxy.ts.
 */
export default function LanguageGatePage() {
  return (
    <main className="bg-navy-900 relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full border-[48px] border-white/[0.04]" />
        <div className="border-gold-400/[0.07] absolute -right-24 -bottom-40 h-[34rem] w-[34rem] rounded-full border-[56px]" />
      </div>
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-10">
        <Image
          src="/branding/nalanda-official-logo.png"
          alt="Nalanda English Medium Hr. Sec. School, Bhilai – official logo"
          width={2000}
          height={218}
          priority
          sizes="(min-width: 640px) 480px, 90vw"
          className="mx-auto h-auto w-full max-w-[480px]"
        />
        <div className="bg-gold-500 mx-auto mt-8 h-px w-24" aria-hidden="true" />
        <h1 className="text-navy-900 mt-6 text-2xl font-bold sm:text-3xl">
          Choose your language
          <span lang="hi" className="text-crimson-800 mt-1 block text-xl sm:text-2xl">
            अपनी भाषा चुनें
          </span>
        </h1>
        <div className="mt-8 grid gap-3">
          <LanguageChoice locale="en" title="English" subtitle="Continue in English" primary />
          <LanguageChoice locale="hi" title="हिन्दी" subtitle="हिन्दी में आगे बढ़ें" />
        </div>
        <p className="text-muted mt-6 text-sm">
          You can change the language at any time from the top of every page.
          <span lang="hi" className="mt-1 block">
            आप हर पृष्ठ के ऊपर से कभी भी भाषा बदल सकते हैं।
          </span>
        </p>
      </div>
    </main>
  );
}
