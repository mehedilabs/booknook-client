"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  LibraryBig,
  UserRound,
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/shared/Navbar";
import { authClient } from "@/lib/auth-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userId: string;
  userName: string;
  userEmail: string;
}

interface Borrow {
  bookId: string | { toString(): string };
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [borrowedBookId, setBorrowedBookId] = useState<string | null>(null);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);

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

  // Check whether the current user has already borrowed this book
  useEffect(() => {
    if (!session || !book) return;

    const controller = new AbortController();

    const checkBorrowStatus = async () => {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          signal: controller.signal,
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.token) return;

        const response = await fetch(`${API_URL}/borrows`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) return;

        const alreadyBorrowed = result.data.some(
          (borrow: Borrow) =>
            borrow.bookId.toString() === book._id && borrow.status === "active",
        );

        setBorrowedBookId(alreadyBorrowed ? book._id : null);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Check borrow status error:", error);
        }
      }
    };

    checkBorrowStatus();

    return () => controller.abort();
  }, [session, book]);

  const handleBorrow = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!book || isBorrowing || borrowedBookId === book._id) {
      return;
    }

    if (book.userId === session.user.id) {
      toast.error("You cannot borrow your own book.");
      return;
    }

    if (book.availableCopies < 1) {
      toast.error("This book is currently unavailable.");
      return;
    }

    try {
      setIsBorrowing(true);

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error(
          "Authentication token is missing. Please log in again.",
        );
      }

      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (response.status === 401) {
          router.push("/login");
          throw new Error("Please log in to borrow this book.");
        }

        if (response.status === 409) {
          setBorrowedBookId(book._id);
        }

        throw new Error(result.message || "Failed to borrow book.");
      }

      setBook((previousBook) =>
        previousBook
          ? {
              ...previousBook,
              availableCopies: previousBook.availableCopies - 1,
            }
          : previousBook,
      );

      setBorrowedBookId(book._id);
      setIsBorrowDialogOpen(false);
      toast.success("Book borrowed successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsBorrowing(false);
    }
  };

  const isOwnBook = !!session && !!book && book.userId === session.user.id;
  const isAlreadyBorrowed = !!book && borrowedBookId === book._id;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#EEF1EA] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/books"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#17302A] transition hover:gap-3 hover:text-[#4F7A63]"
          >
            <ArrowLeft className="size-4" />
            Back to All Books
          </Link>

          {/* Loading */}
          {isLoading && (
            <div className="grid animate-pulse gap-8 rounded-md border border-[#D3DACD] bg-white p-5 sm:p-8 md:grid-cols-[320px_1fr]">
              <div className="aspect-[3/4] rounded-md bg-[#DDE4D8]" />
              <div className="space-y-5 py-2">
                <div className="h-6 w-24 rounded-full bg-[#DDE4D8]" />
                <div className="h-9 w-3/4 rounded bg-[#DDE4D8]" />
                <div className="h-5 w-1/3 rounded bg-[#E8EDE4]" />
                <div className="h-28 rounded bg-[#E8EDE4]" />
              </div>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-md border border-[#E3C9C4] border-l-4 border-l-[#B5483B] bg-white px-6 py-12 text-center">
              <BookOpen className="mx-auto mb-4 size-10 text-[#B5483B]" />

              <h1 className="font-serif text-xl font-bold text-[#17302A]">
                Book not found
              </h1>

              <p className="mt-2 text-sm text-[#5B6B61]">{error}</p>

              <Link
                href="/books"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#17302A] px-5 py-2.5 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
              >
                <ArrowLeft className="size-4" />
                Browse All Books
              </Link>
            </div>
          )}

          {/* Book details */}
          {!isLoading && !error && book && (
            <article className="overflow-hidden rounded-md border border-[#D3DACD] bg-white">
              <div className="h-1.5 bg-[#D9A441]" />

              <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[320px_1fr] md:gap-10">
                {/* Cover */}
                <div className="flex items-center justify-center rounded-md bg-[#F6F8F3] p-6 md:self-start">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="max-h-[420px] w-auto max-w-full rounded-sm object-contain shadow-md"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] w-full items-center justify-center">
                      <BookOpen className="size-20 text-[#8A9A8F]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <span className="w-fit rounded-full bg-[#E4EBDF] px-3.5 py-1.5 text-xs font-semibold text-[#17302A]">
                    {book.category}
                  </span>

                  <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-[#17302A] sm:text-4xl">
                    {book.title}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-[#4F7A63]">
                    <UserRound className="size-4" />
                    <span className="text-sm font-medium">
                      by {book.author}
                    </span>
                  </div>

                  {/* Added By */}
                  <div className="mt-4 rounded-md border border-[#D3DACD] bg-[#F6F8F3] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#5B6B61]">
                      Added By
                    </p>

                    <p className="mt-2 font-serif text-base font-bold text-[#17302A]">
                      {book.userName || "Unknown User"}
                    </p>

                    <p className="mt-1 break-all text-sm text-[#5B6B61]">
                      {book.userEmail}
                    </p>
                  </div>

                  <div className="my-6 border-t border-[#DDE4D8]" />

                  <h2 className="mb-2 font-serif text-lg font-bold text-[#17302A]">
                    About this book
                  </h2>

                  <p className="max-w-prose text-sm leading-7 text-[#5B6B61]">
                    {book.description}
                  </p>

                  <div className="my-6 border-t border-[#DDE4D8]" />

                  {/* Copies */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-md border border-[#D3DACD] bg-[#F6F8F3] p-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[#17302A]">
                        <LibraryBig className="size-5 text-[#D9A441]" />
                      </div>

                      <div>
                        <p className="text-xs text-[#5B6B61]">Total copies</p>
                        <p className="font-serif text-xl font-bold text-[#17302A]">
                          {book.totalCopies}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-[#D3DACD] bg-[#F6F8F3] p-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-[#17302A]">
                        <Tag className="size-5 text-[#D9A441]" />
                      </div>

                      <div>
                        <p className="text-xs text-[#5B6B61]">
                          Available copies
                        </p>
                        <p className="font-serif text-xl font-bold text-[#17302A]">
                          {book.availableCopies}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Borrow action */}
                  <div className="mt-7">
                    {isSessionPending ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-md bg-[#DDE4D8] px-6 py-3 text-sm font-semibold text-[#5B6B61] sm:w-auto"
                      >
                        Checking account...
                      </button>
                    ) : !session ? (
                      <Link
                        href="/login"
                        className="inline-flex w-full items-center justify-center rounded-md bg-[#17302A] px-6 py-3 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] sm:w-auto"
                      >
                        Login to Borrow
                      </Link>
                    ) : isOwnBook ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-md bg-[#DDE4D8] px-6 py-3 text-sm font-semibold text-[#5B6B61] sm:w-auto"
                      >
                        Your Own Book
                      </button>
                    ) : isAlreadyBorrowed ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-md bg-[#DDE4D8] px-6 py-3 text-sm font-semibold text-[#5B6B61] sm:w-auto"
                      >
                        Borrowed
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsBorrowDialogOpen(true)}
                        disabled={book.availableCopies < 1}
                        className="w-full rounded-md bg-[#17302A] px-6 py-3 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] disabled:cursor-not-allowed disabled:bg-[#DDE4D8] disabled:text-[#5B6B61] sm:w-auto"
                      >
                        {book.availableCopies < 1
                          ? "Currently Unavailable"
                          : "Borrow This Book"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      {/* Borrow Confirmation Dialog */}
      {isBorrowDialogOpen && book && session && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17302A]/50 px-4 py-6 backdrop-blur-sm"
          onClick={() => {
            if (!isBorrowing) setIsBorrowDialogOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-dialog-title"
            className="w-full max-w-sm overflow-hidden rounded-md border border-[#D3DACD] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#DDE4D8] px-4 py-3">
              <h2
                id="borrow-dialog-title"
                className="font-serif text-lg font-bold text-[#17302A]"
              >
                Confirm Borrow
              </h2>

              <button
                type="button"
                onClick={() => setIsBorrowDialogOpen(false)}
                disabled={isBorrowing}
                aria-label="Close dialog"
                className="rounded-sm p-1.5 text-[#5B6B61] transition hover:bg-[#E4EBDF] hover:text-[#17302A] disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-16 w-12 shrink-0 rounded-sm border border-[#D3DACD] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-sm bg-[#E4EBDF]">
                    <BookOpen className="size-6 text-[#17302A]" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A9A8F]">
                    Book
                  </p>
                  <p className="mt-1 line-clamp-2 font-serif text-sm font-bold text-[#17302A]">
                    {book.title}
                  </p>
                  <p className="mt-1 text-xs text-[#5B6B61]">
                    by {book.author}
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-[#DDE4D8]" />

              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A9A8F]">
                Borrowing as
              </p>

              <div className="rounded-sm border border-[#D3DACD] bg-[#F6F8F3] px-3 py-2.5">
                <p className="text-sm font-semibold text-[#17302A]">
                  {session.user.name || "User"}
                </p>
                <p className="mt-1 break-all text-xs text-[#5B6B61]">
                  {session.user.email}
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#5B6B61]">
                Please confirm that you want to borrow this book.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBorrowDialogOpen(false)}
                  disabled={isBorrowing}
                  className="flex-1 rounded-sm border border-[#D3DACD] px-3 py-2.5 text-xs font-semibold text-[#17302A] transition hover:bg-[#F6F8F3] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBorrow}
                  disabled={isBorrowing}
                  className="flex-1 rounded-sm bg-[#17302A] px-3 py-2.5 text-xs font-semibold text-[#F3EFE3] transition hover:bg-[#D9A441] hover:text-[#17302A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBorrowing ? "Borrowing..." : "Confirm Borrow"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF1EA]">
          <p className="text-sm text-[#5B6B61]">Loading book details...</p>
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
