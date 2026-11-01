"use client";

import { useEffect, useState } from "react";

import {
  BookOpen,
  Search,
  LibraryBig,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";
import { BookCard } from "@/components/books/BookCard";

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

const categories = [
  "All Categories",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch books.");
        }

        setBooks(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError("Books could not be loaded. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF6F0]">
        {/* Page Header */}
        <section className="border-b border-[#EDE2D5] bg-[#F5EAE1] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-0.5 w-7 rounded-full bg-[#C18469]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B6B54] sm:text-xs">
                Explore Our Collection
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#292B27] sm:text-3xl lg:text-4xl">
              Discover Your Next
              <span className="text-[#C18469]"> Favorite Book</span>
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#75665B] sm:text-sm">
              Explore books shared by our community, discover new stories, and
              find something wonderful to read.
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#75665B] sm:text-sm">
              <LibraryBig className="size-4 text-[#4A6F58]" />
              <span>
                {books.length} {books.length === 1 ? "Book" : "Books"} in our
                collection
              </span>
            </div>
          </div>
        </section>

        {/* Books Section */}
        <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Search and Filter */}
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#A18B7A]" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by book title or author..."
                  className="h-12 w-full rounded-xl border border-[#DCCABD] bg-white pl-12 pr-11 text-sm text-[#59483D] outline-none transition placeholder:text-[#A18B7A] focus:border-[#C18469] focus:ring-2 focus:ring-[#C18469]/15"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A18B7A] transition hover:text-[#59483D]"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex w-full items-center gap-3 md:w-auto">
                <SlidersHorizontal className="size-5 shrink-0 text-[#9B6B54]" />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#DCCABD] bg-white px-4 text-sm font-medium text-[#59483D] outline-none transition focus:border-[#C18469] focus:ring-2 focus:ring-[#C18469]/15 md:w-52"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Information */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#75665B]">
                {isLoading
                  ? "Loading books..."
                  : `Showing ${filteredBooks.length} of ${books.length} books`}
              </p>

              {(searchTerm || selectedCategory !== "All Categories") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#9B6B54] transition hover:text-[#59483D]"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-[#EDE2D5] bg-white"
                  >
                    <div className="h-60 bg-[#EDE2D5]" />
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
              <div className="rounded-2xl border border-[#E6C8B8] bg-white px-5 py-14 text-center">
                <BookOpen className="mx-auto mb-4 size-10 text-[#C18469]" />

                <h2 className="text-lg font-bold text-[#292B27]">
                  Unable to Load Books
                </h2>

                <p className="mt-2 text-sm text-[#75665B]">{error}</p>
              </div>
            )}

            {/* Empty Library */}
            {!isLoading && !error && books.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#DCCABD] bg-white/60 px-5 py-16 text-center">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#EDE2D5]">
                  <LibraryBig className="size-8 text-[#9B6B54]" />
                </div>

                <h2 className="text-xl font-bold text-[#292B27]">
                  Our Library Is Waiting
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75665B]">
                  No books have been added yet. Once our community starts
                  sharing books, you will find them here.
                </p>
              </div>
            )}

            {/* No Search Results */}
            {!isLoading &&
              !error &&
              books.length > 0 &&
              filteredBooks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#DCCABD] bg-white/60 px-5 py-14 text-center">
                  <Search className="mx-auto mb-4 size-9 text-[#C18469]" />

                  <h2 className="text-lg font-bold text-[#292B27]">
                    No Matching Books Found
                  </h2>

                  <p className="mt-2 text-sm text-[#75665B]">
                    Try a different title, author, or category.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 text-sm font-semibold text-[#4A6F58] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

            {!isLoading && !error && filteredBooks.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
