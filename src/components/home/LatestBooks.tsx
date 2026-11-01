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
    <section className="bg-[#FAF6F0] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-0.5 w-7 rounded-full bg-[#C18469]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B6B54]">
                Fresh From The Shelves
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#292B27] sm:text-4xl">
              Latest Books
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#75665B] sm:text-base">
              Explore the newest additions to our community library and find
              your next favorite read.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#4A6F58] transition hover:gap-3"
          >
            Explore All Books
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-[#EDE2D5] bg-white"
              >
                <div className="h-56 bg-[#EDE2D5]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-[#EDE2D5]" />
                  <div className="h-5 w-3/4 rounded bg-[#EDE2D5]" />
                  <div className="h-4 w-1/2 rounded bg-[#EDE2D5]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-[#E6C8B8] bg-white px-5 py-12 text-center">
            <BookOpen className="mx-auto mb-4 size-10 text-[#C18469]" />
            <p className="text-sm font-medium text-[#75665B]">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCCABD] bg-white/60 px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#EDE2D5]">
              <LibraryBig className="size-8 text-[#9B6B54]" />
            </div>

            <h3 className="text-xl font-bold text-[#292B27]">No Books Yet</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75665B]">
              Our library is waiting for its first collection. New books will
              appear here as soon as they are added.
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
