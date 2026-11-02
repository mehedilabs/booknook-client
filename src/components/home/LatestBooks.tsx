"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, LibraryBig } from "lucide-react";
import { BookCard } from "../books/BookCard";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function LatestBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatestBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books?limit=6`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load books.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load books.");
        }

        setBooks(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError("Books could not be loaded. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchLatestBooks();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-[#EEF1EA] px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col gap-5 border-b border-[#D3DACD] pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:pb-8">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#8A6414] sm:text-sm">
              Fresh from the shelves
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#17302A] sm:text-4xl">
              Latest Books
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5B6B61] sm:mt-3 sm:text-base sm:leading-7">
              Explore the newest additions to our community library and find
              your next favorite read.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#17302A] bg-[#17302A] px-5 py-3 text-sm font-semibold text-[#F3EFE3] transition-colors hover:border-[#D9A441] hover:bg-[#D9A441] hover:text-[#17302A] sm:w-fit sm:shrink-0 sm:bg-transparent sm:text-[#17302A]"
          >
            Explore All Books
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col">
                <div className="motion-safe:animate-pulse overflow-hidden rounded-md border border-[#D3DACD] bg-white">
                  <div className="h-56 bg-[#DDE4D8]" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-1/3 rounded bg-[#DDE4D8]" />
                    <div className="h-5 w-3/4 rounded bg-[#DDE4D8]" />
                    <div className="h-4 w-1/2 rounded bg-[#E8EDE4]" />
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-sm bg-[#C9B49B]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex items-center gap-4 rounded-md border border-[#E3C9C4] border-l-4 border-l-[#B5483B] bg-white px-5 py-5 sm:px-6 sm:py-6">
            <BookOpen className="size-7 shrink-0 text-[#B5483B]" />
            <p className="text-sm font-medium text-[#5B6B61]">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && books.length === 0 && (
          <div className="mx-auto max-w-xl overflow-hidden rounded-sm border border-[#D3DACD] bg-white shadow-[6px_6px_0_0_#D9A441]">
            <div className="flex items-center gap-4 border-b-2 border-[#B5483B] px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-[#17302A] sm:size-14">
                <LibraryBig className="size-6 text-[#D9A441] sm:size-7" />
              </div>

              <h3 className="font-serif text-xl font-bold leading-tight text-[#17302A] sm:text-2xl">
                No Books Yet
              </h3>
            </div>

            <div className="bg-[repeating-linear-gradient(to_bottom,transparent,transparent_31px,#DDE4D8_32px)] px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-sm leading-8 text-[#5B6B61]">
                Our library is waiting for its first collection. New books will
                appear here as soon as they are added.
              </p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3">
            {books.map((book) => (
              <div key={book._id} className="flex flex-col">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
