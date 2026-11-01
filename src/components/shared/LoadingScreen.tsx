import { BookOpen, Sparkles } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({
  message = "Preparing your library...",
}: LoadingScreenProps) {
  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-[#FAF6F0] px-5 py-12">
        <div className="relative w-full max-w-md text-center">
          {/* Decorative background */}
          <div className="absolute -left-10 top-0 size-32 rounded-full bg-[#EDE2D5]/60 blur-3xl" />
          <div className="absolute -right-10 bottom-0 size-32 rounded-full bg-[#C18469]/10 blur-3xl" />

          <div className="relative">
            {/* Animated book illustration */}
            <div className="relative mx-auto mb-8 flex size-28 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-[2rem] bg-[#EDE2D5]" />

              <div className="relative flex size-20 items-center justify-center rounded-2xl border border-[#DCCFC2] bg-white shadow-lg shadow-[#59483D]/10">
                <BookOpen
                  size={42}
                  strokeWidth={1.5}
                  className="animate-pulse text-[#B87559]"
                />
              </div>

              <div className="absolute -right-1 top-1 flex size-8 items-center justify-center rounded-full border border-[#EDE2D5] bg-white shadow-sm">
                <Sparkles size={16} className="text-[#C18469]" />
              </div>

              <div className="absolute -bottom-1 -left-1 size-4 rounded-full bg-[#4A6F58]/80" />
            </div>

            {/* Loading text */}
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#AD7057]">
              BOOKNOOK LIBRARY
            </p>

            <h2 className="text-xl font-bold tracking-tight text-[#392B24] sm:text-2xl">
              Just a Moment
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#75665B]">{message}</p>

            {/* Animated loading indicator */}
            <div className="mx-auto mt-7 flex w-32 items-center justify-center gap-1.5">
              <span className="size-2 animate-bounce rounded-full bg-[#B87559] [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-[#B87559] [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-[#B87559]" />
            </div>

            <p className="mt-5 text-[11px] font-medium text-[#A18B7A]">
              Every book has a story. Yours is waiting.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
