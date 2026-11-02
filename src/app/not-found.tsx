import Link from "next/link";
import { ArrowLeft, BookOpen, LibraryBig, Search } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#EEF1EA] px-5 py-16">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-[#D9A441]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-[#17302A]/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-2xl text-center">
          {/* Error message */}
          <div className="mb-5 inline-flex items-center gap-2 border border-[#D9A441]/50 bg-[#F3EFE3] px-4 py-2">
            <Search className="size-3.5 text-[#8A6414]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6414]">
              Page Not Found
            </span>
          </div>

          <h1 className="font-serif text-7xl font-bold tracking-tight text-[#897442] sm:text-8xl md:text-9xl">
            404
          </h1>

          <h2 className="mt-5 font-serif text-2xl font-bold text-[#17302A] sm:text-3xl">
            This Page Is Missing
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#5B6B61] sm:text-base">
            Looks like this story has gone missing from our shelves. The page
            you&apos;re looking for may have been moved, removed, or never
            existed.
          </p>

          {/* Home button */}
          <Link
            href="/"
            className="group mt-8 inline-flex items-center rounded-2xl gap-3 bg-[#17302A] px-7 py-3.5 text-sm font-semibold text-[#F3EFE3] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#25463D] hover:shadow-lg"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <p className="mt-10 font-serif text-sm italic text-[#8A6414]">
            &ldquo;Every great reading journey deserves a way back.&ldquo;
          </p>
        </div>
      </main>
    </>
  );
}
