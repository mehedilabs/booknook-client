import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

interface BookCardProps {
  _id: string;
  title: string;
  author: string;
  image: string;
  category?: string;
}

export function BookCard({ book }: { book: BookCardProps }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-[#D3DACD] bg-white transition-all duration-300 focus-within:ring-2 focus-within:ring-[#17302A]/50 hover:border-[#17302A]/40 hover:shadow-2xl hover:shadow-[#17302A]/15 motion-safe:hover:-translate-y-1">
      {/* Display case */}
      <div className="relative flex h-80 items-end justify-center bg-[radial-gradient(ellipse_at_50%_30%,#2F5A49_0%,#17302A_72%)] pb-3 [perspective:800px]">
        {/* Wooden shelf */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#A98563] bg-[#7A5A3E]"
        />

        {/* Floor shadow */}
        <span
          aria-hidden="true"
          className="absolute bottom-[0.6rem] left-1/2 h-3 w-36 -translate-x-1/2 rounded-full bg-black/50 blur-md transition-all duration-500 group-hover:w-28 group-hover:opacity-70"
        />

        {/* Category tag */}
        {book.category && (
          <span className="absolute left-3 top-3 z-20 rounded-full border border-[#D9A441]/50 bg-white/5 px-3 py-1 text-xs font-semibold text-[#D9A441] backdrop-blur-sm">
            {book.category}
          </span>
        )}

        {/* The book */}
        <div className="relative z-10 shadow-[8px_10px_18px_-6px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out motion-safe:group-hover:[transform:rotateY(-14deg)_translateY(-6px)]">
          {/* Page edges */}
          <span
            aria-hidden="true"
            className="absolute inset-y-[3px] -right-1 w-1.5 rounded-r-[2px] bg-[repeating-linear-gradient(to_right,#F3EFE3_0,#F3EFE3_1px,#BFB8A4_1px,#BFB8A4_2px)]"
          />

          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              loading="lazy"
              className="relative h-60 w-40 rounded-sm object-cover"
            />
          ) : (
            <div className="relative flex h-60 w-40 items-center justify-center rounded-sm border border-[#D9A441]/60 bg-[#2F5A49]">
              <div className="flex h-[13.5rem] w-[8.5rem] items-center justify-center border border-[#D9A441]/40">
                <BookOpen className="size-10 text-[#D9A441]" />
              </div>
            </div>
          )}

          {/* Spine fold and light */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-sm bg-[linear-gradient(to_right,rgba(0,0,0,0.38),rgba(255,255,255,0.28)_4%,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_92%,rgba(0,0,0,0.18))]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-5">
          <h3 className="line-clamp-2 font-serif text-xl font-bold leading-snug text-[#17302A]">
            {book.title}
          </h3>
          <p className="mt-1.5 truncate text-sm text-[#5B6B61]">
            by <span className="font-medium text-[#3F5249]">{book.author}</span>
          </p>
        </div>

        {/* The whole card is clickable through this link */}
        <Link
          href={`/books/${book._id}`}
          aria-label={`View details of ${book.title}`}
          className="mt-auto flex items-center justify-between border-t border-[#DDE4D8] pt-4 text-sm font-semibold text-[#17302A] outline-none after:absolute after:inset-0"
        >
          <span>View Details</span>

          <span className="flex size-9 items-center justify-center rounded-full bg-[#17302A] text-[#D9A441] transition-colors duration-300 group-hover:bg-[#D9A441] group-hover:text-[#17302A]">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>

      {/* Gold line that slides in on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#D9A441] transition-transform duration-300 group-hover:scale-x-100"
      />
    </article>
  );
}
