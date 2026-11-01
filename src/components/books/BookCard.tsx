import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

interface BookCardProps {
  _id: string;
  title: string;
  author: string;
  image: string;
}

export function BookCard({ book }: { book: BookCardProps }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#EADFD3] bg-[#FFFDF9] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#C17F64]/40 hover:shadow-2xl hover:shadow-[#C17F64]/20">
      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-[#F3E8DC] to-[#FAF6EF]">
        {book.image ? (
          <>
            <img
              src={book.image}
              alt={book.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
            />
            {/* soft warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2420]/70 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="size-16 text-[#C17F64]/60" />
          </div>
        )}

        {/* floating arrow badge */}
        <Link
          href={`/books/${book._id}`}
          aria-label={`View details of ${book.title}`}
          className="absolute right-4 top-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-[#FAF6EF]/90 text-[#C17F64] opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#C17F64] hover:text-white"
        >
          <ArrowUpRight className="size-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug text-[#2B2420] transition-colors group-hover:text-[#C17F64]">
            {book.title}
          </h3>
          <p className="truncate text-sm font-medium text-[#8A7B70]">
            by <span className="text-[#5A4A40]">{book.author}</span>
          </p>
        </div>

        <div className="mt-auto h-px w-full bg-gradient-to-r from-[#EADFD3] via-[#EADFD3] to-transparent" />

        <Link
          href={`/books/${book._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C17F64] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C17F64]/25 transition-all duration-300 hover:gap-3 hover:bg-[#A96A50] hover:shadow-lg hover:shadow-[#C17F64]/35 active:scale-[0.98]"
        >
          View Details
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
