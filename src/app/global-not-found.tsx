import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "Page not found | पृष्ठ नहीं मिला – Nalanda English Medium Hr. Sec. School",
};

/** 404 for URLs that match no route at all (bilingual, since no locale is known). */
export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body className="bg-paper flex min-h-dvh items-center justify-center px-4">
        <main className="w-full max-w-lg text-center">
          <Image
            src="/branding/nalanda-official-logo.png"
            alt="Nalanda English Medium Hr. Sec. School, Bhilai"
            width={2000}
            height={218}
            className="mx-auto h-auto w-full max-w-[420px]"
          />
          <p className="font-display text-navy-800 mt-10 text-6xl font-bold">404</p>
          <h1 className="text-navy-900 mt-3 text-3xl font-bold">
            Page not found
            <span lang="hi" className="mt-1 block text-2xl">
              पृष्ठ नहीं मिला
            </span>
          </h1>
          <p className="text-muted mt-4">
            The page you were looking for does not exist or has moved.
            <span lang="hi" className="mt-1 block">
              आप जो पृष्ठ ढूँढ रहे हैं, वह मौजूद नहीं है या कहीं और चला गया है।
            </span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/en"
              className="bg-crimson-800 inline-flex min-h-11 items-center rounded-lg px-5 font-semibold text-white"
            >
              Go to the homepage
            </Link>
            <Link
              href="/hi"
              lang="hi"
              className="border-navy-800/25 text-navy-800 inline-flex min-h-11 items-center rounded-lg border bg-white px-5 font-semibold"
            >
              मुखपृष्ठ पर जाएँ
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
