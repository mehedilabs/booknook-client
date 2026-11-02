import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export function ShareBooksSection() {
  return (
    <section className="bg-[#EEF1EA] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-7 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div
          role="img"
          aria-label="A collection of books arranged in a cozy reading space"
          className="relative h-56 overflow-hidden rounded-md bg-cover bg-center shadow-[0_18px_40px_-12px_rgba(23,48,42,0.35)] sm:h-80 lg:h-auto lg:min-h-[460px]"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(15,33,28,0.35), transparent 55%), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=85')",
          }}
        >
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-sm border border-white/20 bg-[#17302A]/90 px-3 py-2 text-[#F3EFE3] backdrop-blur-sm sm:bottom-5 sm:left-5 sm:px-4 sm:py-3">
            <BookOpen className="size-4 text-[#D9A441] sm:size-5" />
            <span className="text-xs font-medium sm:text-sm">
              Every book has a story
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6414] sm:text-sm">
            Share the joy of reading
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold leading-tight tracking-tight text-[#17302A] sm:mt-4 sm:text-4xl lg:text-5xl">
            A Book Shared Is a Story Multiplied.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5B6B61] sm:mt-6 sm:text-base sm:leading-8">
            Your bookshelf may hold someone else&apos;s next favorite story.
            Share the books you love, make them available to fellow readers, and
            let great stories travel from one reader to another.
          </p>

          <div className="mt-6 sm:mt-8">
            <Link
              href="/books/add"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-[#17302A] px-6 py-3.5 text-sm font-semibold text-[#F3EFE3] transition-colors duration-300 hover:bg-[#D9A441] hover:text-[#17302A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17302A] sm:w-auto"
            >
              Share Your Books
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-7 border-l-2 border-[#D9A441] pl-4 sm:mt-9 sm:pl-5">
            <p className="font-serif text-base italic leading-7 text-[#5B6B61] sm:text-lg">
              &ldquo;The more that you read, the more things you will
              know.&rdquo;
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#8A6414]">
              The joy of sharing knowledge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
