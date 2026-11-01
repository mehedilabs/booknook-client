"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, LibraryBig, UserRound, Tag } from "lucide-react";

import { Navbar } from "@/components/shared/Navbar";

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

function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchBook = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load book details.");
        }

        setBook(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchBook();

    return () => controller.abort();
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF6F0] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/books"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4A6F58] transition hover:gap-3"
          >
            <ArrowLeft className="size-4" />
            Back to All Books
          </Link>

          {isLoading && (
            <div className="grid animate-pulse gap-8 md:grid-cols-2">
              <div className="h-[420px] rounded-2xl bg-[#EDE2D5]" />
              <div className="space-y-5 py-4">
                <div className="h-5 w-1/4 rounded bg-[#EDE2D5]" />
                <div className="h-9 w-3/4 rounded bg-[#EDE2D5]" />
                <div className="h-5 w-1/2 rounded bg-[#EDE2D5]" />
                <div className="h-24 rounded bg-[#EDE2D5]" />
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-[#E6C8B8] bg-white px-6 py-16 text-center">
              <BookOpen className="mx-auto mb-4 size-12 text-[#C18469]" />

              <h1 className="text-xl font-bold text-[#292B27]">
                Book Not Found
              </h1>

              <p className="mt-2 text-sm text-[#75665B]">{error}</p>

              <Link
                href="/books"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#4A6F58] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#385941]"
              >
                <ArrowLeft className="size-4" />
                Browse All Books
              </Link>
            </div>
          )}

          {!isLoading && !error && book && (
            <div className="grid gap-8 rounded-2xl border border-[#EDE2D5] bg-white p-5 shadow-sm sm:p-8 md:grid-cols-2 md:gap-10 lg:p-10">
              <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl bg-[#EDE2D5] sm:min-h-[440px]">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full max-h-[520px] w-full object-cover"
                  />
                ) : (
                  <BookOpen className="size-24 text-[#A18B7A]" />
                )}
              </div>

              <div className="flex flex-col justify-center">
                <span className="mb-5 w-fit rounded-full bg-[#F5EAE1] px-4 py-2 text-xs font-semibold text-[#9B6B54]">
                  {book.category}
                </span>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#292B27] sm:text-4xl">
                  {book.title}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-[#9B6B54]">
                  <UserRound className="size-4" />
                  <span className="text-sm font-medium">by {book.author}</span>
                </div>

                <div className="my-7 border-t border-[#EDE2D5]" />

                <div>
                  <h2 className="mb-3 text-lg font-bold text-[#59483D]">
                    About This Book
                  </h2>

                  <p className="text-sm leading-7 text-[#75665B]">
                    {book.description}
                  </p>
                </div>

                <div className="my-7 border-t border-[#EDE2D5]" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F0] p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EDE2D5]">
                      <LibraryBig className="size-5 text-[#9B6B54]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#A18B7A]">Total Copies</p>
                      <p className="mt-1 text-lg font-bold text-[#59483D]">
                        {book.totalCopies}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F0] p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EDE2D5]">
                      <Tag className="size-5 text-[#9B6B54]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#A18B7A]">Category</p>
                      <p className="mt-1 text-sm font-bold text-[#59483D]">
                        {book.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
          <p className="text-sm text-[#75665B]">Loading book details...</p>
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
