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
    <section className="bg-[#EEF1EA] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#D3DACD] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[#8A6414]">
              Fresh from the shelves
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#17302A] sm:text-4xl">
              Latest Books
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#5B6B61] sm:text-base">
              Explore the newest additions to our community library and find
              your next favorite read.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-[#17302A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17302A]"
          >
            <span className="border-b border-[#17302A]/30 transition-colors group-hover:border-[#D9A441]">
              Explore All Books
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="flex items-center gap-4 rounded-md border border-[#E3C9C4] border-l-4 border-l-[#B5483B] bg-white px-6 py-6">
            <BookOpen className="size-7 shrink-0 text-[#B5483B]" />
            <p className="text-sm font-medium text-[#5B6B61]">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && books.length === 0 && (
          <div className="mx-auto max-w-xl overflow-hidden rounded-sm border border-[#D3DACD] bg-white shadow-[6px_6px_0_0_#D9A441]">
            <div className="flex items-center gap-4 border-b-2 border-[#B5483B] px-6 py-6">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-[#17302A]">
                <LibraryBig className="size-7 text-[#D9A441]" />
              </div>

              <h3 className="font-serif text-2xl font-bold leading-tight text-[#17302A]">
                No Books Yet
              </h3>
            </div>

            <div className="bg-[repeating-linear-gradient(to_bottom,transparent,transparent_31px,#DDE4D8_32px)] px-6 py-6">
              <p className="text-sm leading-8 text-[#5B6B61]">
                Our library is waiting for its first collection. New books will
                appear here as soon as they are added.
              </p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
