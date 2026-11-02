"use client";

import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  Check,
  ChevronDown,
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

function CategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full md:w-52">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter by category"
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 text-sm font-medium text-[#17302A] outline-none transition focus-visible:border-[#17302A] focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 ${
          open
            ? "border-[#17302A] ring-2 ring-[#D9A441]/40"
            : "border-[#C9D3C3]"
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#4F7A63] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Categories"
          className="absolute left-0 right-0 z-20 mt-1.5 overflow-hidden rounded-md border border-[#C9D3C3] bg-white py-1 shadow-lg"
        >
          {categories.map((category) => {
            const isSelected = category === value;

            return (
              <li key={category} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(category);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-[#E4EBDF] font-semibold text-[#17302A]"
                      : "text-[#17302A] hover:bg-[#F6F8F3]"
                  }`}
                >
                  {category}
                  {isSelected && <Check className="size-4 text-[#4F7A63]" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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

      <main className="min-h-screen bg-[#EEF1EA]">
        {/* Page Header */}
        <section className="border-b-4 border-[#D9A441] bg-[#17302A] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D9A441] sm:text-xs">
                Explore Our Collection
              </span>
            </div>

            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#F3EFE3] sm:text-3xl lg:text-4xl">
              Discover Your Next
              <span className="text-[#D9A441]"> Favorite Book</span>
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#C9D3C3] sm:text-sm">
              Explore books shared by our community, discover new stories, and
              find something wonderful to read.
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#C9D3C3] sm:text-sm">
              <LibraryBig className="size-4 text-[#D9A441]" />
              <span>
                {books.length} {books.length === 1 ? "Book" : "Books"} in our
                collection
              </span>
            </div>
          </div>
        </section>

        {/* Books Section */}
        <section className="px-5 py-8 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Search and Filter */}
            <div className="mb-5 flex flex-col gap-3 sm:mb-7 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8A9A8F]" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by book title or author..."
                  className="h-10 w-full rounded-md border border-[#C9D3C3] bg-white pl-12 pr-11 text-sm font-medium text-[#17302A] outline-none transition placeholder:font-normal placeholder:text-[#8A9A8F] focus:border-[#17302A] focus:ring-2 focus:ring-[#D9A441]/40"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9A8F] transition hover:text-[#17302A]"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex w-full items-center gap-3 md:w-auto">
                <SlidersHorizontal className="hidden size-5 shrink-0 text-[#4F7A63] md:block" />

                <CategoryDropdown
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </div>

            {/* Result Information */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#D3DACD] pb-3 sm:mb-6">
              <p className="text-sm font-medium text-[#5B6B61]">
                {isLoading
                  ? "Loading books..."
                  : `Showing ${filteredBooks.length} of ${books.length} books`}
              </p>

              {(searchTerm || selectedCategory !== "All Categories") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#17302A] underline-offset-4 transition hover:text-[#B5483B] hover:underline"
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
                    className="animate-pulse overflow-hidden rounded-md border border-[#D3DACD] bg-white"
                  >
                    <div className="h-60 bg-[#DDE4D8]" />
                    <div className="space-y-3 p-5">
                      <div className="h-4 w-1/3 rounded bg-[#DDE4D8]" />
                      <div className="h-5 w-3/4 rounded bg-[#DDE4D8]" />
                      <div className="h-4 w-1/2 rounded bg-[#DDE4D8]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="rounded-md border border-[#B5483B]/40 bg-white px-5 py-14 text-center">
                <BookOpen className="mx-auto mb-4 size-10 text-[#B5483B]" />

                <h2 className="font-serif text-lg font-bold text-[#17302A]">
                  Unable to Load Books
                </h2>

                <p className="mt-2 text-sm text-[#5B6B61]">{error}</p>
              </div>
            )}

            {/* Empty Library */}
            {!isLoading && !error && books.length === 0 && (
              <div className="rounded-md border border-dashed border-[#17302A]/40 bg-white/60 px-5 py-16 text-center">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-sm bg-[#17302A]">
                  <LibraryBig className="size-8 text-[#D9A441]" />
                </div>

                <h2 className="font-serif text-xl font-bold text-[#17302A]">
                  Our Library Is Waiting
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5B6B61]">
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
                <div className="rounded-md border border-dashed border-[#17302A]/40 bg-white/60 px-5 py-14 text-center">
                  <Search className="mx-auto mb-4 size-9 text-[#4F7A63]" />

                  <h2 className="font-serif text-lg font-bold text-[#17302A]">
                    No Matching Books Found
                  </h2>

                  <p className="mt-2 text-sm text-[#5B6B61]">
                    Try a different title, author, or category.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-md bg-[#17302A] px-4 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
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
