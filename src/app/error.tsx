"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, BookOpen, RefreshCw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#EEF1EA] px-4 py-16 sm:px-6">
      <div className="w-full max-w-xl text-center">
        {/* Error Illustration */}
        <div className="relative mx-auto mb-8 flex size-28 items-center justify-center rounded-full bg-[#DDE4D8] sm:size-32">
          <div className="flex size-20 items-center justify-center rounded-full bg-[#17302A] shadow-lg sm:size-24">
            <AlertTriangle className="size-10 text-[#D9A441] sm:size-12" />
          </div>

          <span className="absolute -right-1 -top-1 flex size-10 items-center justify-center rounded-full border-4 border-[#EEF1EA] bg-[#D9A441]">
            <BookOpen className="size-4 text-[#17302A]" />
          </span>
        </div>

        {/* Error Content */}
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#5B6B61]">
          Something went wrong
        </p>

        <h1 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#17302A] sm:text-4xl">
          Oops! An Unexpected Error
        </h1>

        <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-[#5B6B61] sm:text-base">
          We&apos;re sorry, but something went wrong while loading this page.
          Please try again. If the problem continues, you can return to the
          homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#17302A] px-7 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#244438] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 sm:w-auto"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#17302A]/20 bg-transparent px-7 text-sm font-semibold text-[#17302A] transition-colors hover:bg-[#DDE4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mx-auto mt-12 flex items-center justify-center gap-2 border-t border-[#D3DACD] pt-6">
          <BookOpen className="size-4 text-[#4F7A63]" />
          <span className="font-serif text-sm font-bold tracking-wide text-[#17302A]">
            BookNook
          </span>
          <span className="text-xs text-[#8A968C]">
            — Your little corner of books
          </span>
        </div>
      </div>
    </main>
  );
}
