"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  LibraryBig,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/shared/Navbar";
import { authClient } from "@/lib/auth-client";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  status: "active" | "returned";
  borrowedAt: string;
  returnedAt: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getAuthToken() {
  const tokenResponse = await fetch("/api/auth/token");

  if (!tokenResponse.ok) {
    throw new Error("Could not verify your login session.");
  }

  const tokenData = await tokenResponse.json();

  if (!tokenData.token) {
    throw new Error("Authentication token is missing.");
  }

  return tokenData.token as string;
}

function formatDate(date: string) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const DISMISSED_EVENT = "booknook-dismissed-change";

function subscribeToDismissed(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DISMISSED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DISMISSED_EVENT, callback);
  };
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [returningId, setReturningId] = useState<string | null>(null);

  const userId = session?.user?.id;
  const dismissedKey = userId ? `booknook:dismissed-borrows:${userId}` : null;

  // Records the user has removed from their history (kept in localStorage)
  const dismissedRaw = useSyncExternalStore(
    subscribeToDismissed,
    () => {
      if (!dismissedKey) return null;

      try {
        return localStorage.getItem(dismissedKey);
      } catch {
        return null;
      }
    },
    () => null,
  );

  const dismissedIds = useMemo<string[]>(() => {
    try {
      return dismissedRaw ? JSON.parse(dismissedRaw) : [];
    } catch {
      return [];
    }
  }, [dismissedRaw]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session) return;

    const controller = new AbortController();

    const fetchMyBorrows = async () => {
      try {
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/borrows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load borrow history.");
        }

        setBorrows(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Borrow history could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyBorrows();

    return () => controller.abort();
  }, [isPending, session, reloadKey]);

  // Records the user has not removed from history
  const visibleBorrows = useMemo(
    () => borrows.filter((borrow) => !dismissedIds.includes(borrow._id)),
    [borrows, dismissedIds],
  );

  const activeCount = visibleBorrows.filter(
    (borrow) => borrow.status === "active",
  ).length;

  const returnedCount = visibleBorrows.filter(
    (borrow) => borrow.status === "returned",
  ).length;

  const filteredBorrows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return visibleBorrows.filter((borrow) => {
      const matchesSearch =
        !query || borrow.bookTitle.toLowerCase().includes(query);

      const matchesStatus =
        selectedFilter === "All" ||
        (selectedFilter === "Active" && borrow.status === "active") ||
        (selectedFilter === "Returned" && borrow.status === "returned");

      return matchesSearch && matchesStatus;
    });
  }, [visibleBorrows, searchTerm, selectedFilter]);

  const handleRetry = () => {
    setError("");
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleReturn = async (borrow: Borrow) => {
    if (borrow.status !== "active" || returningId) return;

    setReturningId(borrow._id);

    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/borrows/${borrow._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to return the book.");
      }

      // Keep the record in the list and mark it as returned
      setBorrows((currentBorrows) =>
        currentBorrows.map((item) =>
          item._id === borrow._id
            ? {
                ...item,
                status: "returned",
                returnedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success("Book returned successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not return the book.",
      );
    } finally {
      setReturningId(null);
    }
  };

  // Remove a returned record from the history list
  const handleDismiss = (borrow: Borrow) => {
    if (borrow.status !== "returned" || !dismissedKey) return;

    try {
      localStorage.setItem(
        dismissedKey,
        JSON.stringify([...dismissedIds, borrow._id]),
      );
      window.dispatchEvent(new Event(DISMISSED_EVENT));
      toast.success("Removed from your history.");
    } catch {
      toast.error("Could not remove this record. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#EEF1EA]">
        <header className="bg-[#17302A] text-[#F3EFE3]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
              My Borrows
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#C9D3C3] sm:text-base">
              Keep track of the books you have borrowed and returned.
            </p>

            <div className="mt-5 flex gap-2 sm:mt-6 sm:flex-wrap sm:gap-3">
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9A441]/40 bg-white/5 px-2.5 py-1 text-xs sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <LibraryBig className="hidden size-4 text-[#D9A441] sm:block" />
                <span>
                  <strong className="text-[#D9A441]">
                    {visibleBorrows.length}
                  </strong>{" "}
                  Total<span className="hidden sm:inline"> Borrows</span>
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9A441]/40 bg-white/5 px-2.5 py-1 text-xs sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <BookOpen className="hidden size-4 text-[#D9A441] sm:block" />
                <span>
                  <strong className="text-[#D9A441]">{activeCount}</strong>{" "}
                  Active
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D9A441]/40 bg-white/5 px-2.5 py-1 text-xs sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                <RotateCcw className="hidden size-4 text-[#D9A441] sm:block" />
                <span>
                  <strong className="text-[#D9A441]">{returnedCount}</strong>{" "}
                  Returned
                </span>
              </div>
            </div>
          </div>

          <div className="h-0.5 bg-[#D9A441]" />
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          {!isLoading && !error && visibleBorrows.length > 0 && (
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8A9A8F]" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by book title..."
                  className="h-11 w-full rounded-md border border-[#C9D3C3] bg-white pl-10 pr-4 text-sm text-[#17302A] outline-none transition placeholder:text-[#8A9A8F] focus:border-[#17302A] focus:ring-2 focus:ring-[#D9A441]/40"
                />
              </div>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                aria-label="Filter borrow history"
                className="h-11 w-full rounded-md border border-[#C9D3C3] bg-white px-3 text-sm font-medium text-[#17302A] outline-none transition focus:border-[#17302A] focus:ring-2 focus:ring-[#D9A441]/40 sm:w-44"
              >
                <option value="All">All Borrows</option>
                <option value="Active">Active</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          )}

          {isLoading && (
            <div className="overflow-hidden rounded-md border border-[#D3DACD] bg-white">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-[#DDE4D8] px-6 py-5 last:border-b-0 motion-safe:animate-pulse"
                >
                  <div className="h-20 w-14 rounded-sm bg-[#DDE4D8]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-[#DDE4D8]" />
                    <div className="h-3 w-1/5 rounded bg-[#E8EDE4]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col gap-4 rounded-md border border-[#E3C9C4] border-l-4 border-l-[#B5483B] bg-white px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <BookOpen className="mt-1 size-7 shrink-0 text-[#B5483B]" />
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#17302A]">
                    Unable to load borrow history
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#5B6B61]">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#17302A] px-4 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && visibleBorrows.length === 0 && (
            <div className="mx-auto max-w-xl rounded-md border border-dashed border-[#17302A]/40 bg-white px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-sm bg-[#17302A]">
                <LibraryBig className="size-7 text-[#D9A441]" />
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#17302A]">
                No borrowed books yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#5B6B61]">
                Explore the library and borrow a book to see it here.
              </p>

              <Link
                href="/books"
                className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-[#17302A] px-5 py-2.5 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
              >
                <BookOpen size={16} />
                Explore Books
              </Link>
            </div>
          )}

          {!isLoading &&
            !error &&
            visibleBorrows.length > 0 &&
            filteredBorrows.length === 0 && (
              <div className="rounded-md border border-dashed border-[#17302A]/40 bg-white px-6 py-12 text-center">
                <Search className="mx-auto mb-3 size-8 text-[#4F7A63]" />
                <h2 className="font-serif text-xl font-bold text-[#17302A]">
                  No matching borrow records
                </h2>
                <p className="mt-1 text-sm text-[#5B6B61]">
                  Try another title or status filter.
                </p>
              </div>
            )}

          {!isLoading && !error && filteredBorrows.length > 0 && (
            <>
              <p className="mb-3 text-sm text-[#5B6B61]">
                Showing {filteredBorrows.length} of {visibleBorrows.length}{" "}
                borrow records
              </p>

              <div className="overflow-hidden rounded-md border border-[#D3DACD] bg-white">
                <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_12rem] gap-4 bg-[#17302A] px-6 py-3.5 text-sm font-semibold text-[#F3EFE3] md:grid">
                  <div>Book</div>
                  <div>Borrowed Date</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-[#DDE4D8]">
                  {filteredBorrows.map((borrow) => (
                    <div
                      key={borrow._id}
                      className="flex flex-col gap-4 px-4 py-5 transition-colors hover:bg-[#F6F8F3] sm:px-6 md:grid md:grid-cols-[minmax(0,2fr)_1fr_1fr_12rem] md:items-center md:gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <img
                          src={borrow.bookImage}
                          alt={borrow.bookTitle}
                          className="h-20 w-14 shrink-0 rounded-sm border border-[#D3DACD] object-cover shadow-sm"
                        />

                        <div className="min-w-0">
                          <Link
                            href={`/books/${borrow.bookId}`}
                            className="line-clamp-2 font-serif text-lg font-bold text-[#17302A] transition-colors hover:text-[#9A7024]"
                          >
                            {borrow.bookTitle}
                          </Link>
                          <p className="mt-1 text-xs text-[#8A9A8F]">
                            Borrow ID: {borrow._id.slice(-8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[#5B6B61]">
                        <CalendarDays className="size-4 shrink-0 text-[#9A7024]" />
                        <span className="md:hidden">Borrowed:</span>
                        {formatDate(borrow.borrowedAt)}
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            borrow.status === "active"
                              ? "bg-[#E4EBDF] text-[#17302A]"
                              : "bg-[#EDE6D3] text-[#795B20]"
                          }`}
                        >
                          {borrow.status === "active" ? "Active" : "Returned"}
                        </span>
                      </div>

                      <div className="md:text-right">
                        {borrow.status === "active" ? (
                          <button
                            type="button"
                            onClick={() => handleReturn(borrow)}
                            disabled={returningId !== null}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#17302A] px-3.5 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                          >
                            <RotateCcw size={14} />
                            {returningId === borrow._id
                              ? "Returning..."
                              : "Return Book"}
                          </button>
                        ) : (
                          <div className="flex items-center justify-between gap-3 md:justify-end">
                            <span className="text-sm text-[#8A9A8F]">
                              Returned{" "}
                              {borrow.returnedAt
                                ? formatDate(borrow.returnedAt)
                                : ""}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleDismiss(borrow)}
                              aria-label={`Remove ${borrow.bookTitle} from history`}
                              title="Remove from history"
                              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[#C9D3C3] text-[#5B6B61] transition-colors hover:border-[#B5483B] hover:bg-[#B5483B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5483B]"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
