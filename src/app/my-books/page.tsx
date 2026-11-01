"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LibraryBig, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/shared/Navbar";
import { EditBookDialog } from "@/components/books/EditBookDialog";
import { authClient } from "@/lib/auth-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  category?: string;
  totalCopies?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Style only: decorative book spines in the header
const SPINES = [
  { h: "h-20", c: "bg-[#D9A441]" },
  { h: "h-28", c: "bg-[#B5483B]" },
  { h: "h-24", c: "bg-[#EDE6D3]" },
  { h: "h-32", c: "bg-[#4F7A63]" },
  { h: "h-24", c: "bg-[#D9A441]" },
  { h: "h-28", c: "bg-[#7A2E2E]" },
];

// Same column layout for the header row and every book row (desktop)
const COLUMNS = "md:grid-cols-[minmax(0,2.2fr)_1fr_0.7fr_11rem]";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session) return;

    const controller = new AbortController();

    const fetchMyBooks = async () => {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          signal: controller.signal,
        });

        if (!tokenResponse.ok) {
          throw new Error("Could not verify your login session.");
        }

        const tokenData = await tokenResponse.json();

        if (!tokenData.token) {
          throw new Error("Authentication token is missing.");
        }

        const response = await fetch(`${API_URL}/books?mine=true`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load your books.");
        }

        setBooks(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Books could not be loaded. Please try again.",
        );

        toast.error("Could not load your books.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyBooks();

    return () => controller.abort();
  }, [isPending, session]);

  const handleEditClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsEditDialogOpen(true);
  };

  const handleBookUpdated = (updatedBook: Book) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book._id === updatedBook._id
          ? {
              ...book,
              title: updatedBook.title,
              author: updatedBook.author,
              image: updatedBook.image,
            }
          : book,
      ),
    );
  };

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;

    setDeletingId(book._id);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Could not verify your login session.");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(`${API_URL}/books/${book._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete the book.");
      }

      setBooks((currentBooks) =>
        currentBooks.filter((item) => item._id !== book._id),
      );
      toast.success("Book deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the book.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#EEF1EA]">
        <header className="relative overflow-hidden bg-[#17302A] text-[#F3EFE3]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-4 flex items-end gap-1.5 sm:right-12 lg:right-24"
          >
            {SPINES.map((spine, index) => (
              <div
                key={index}
                className={`w-4 rounded-t-sm sm:w-6 ${spine.h} ${spine.c}`}
              />
            ))}
          </div>

          <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10">
            <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
              My Books
            </h1>

            <p className="mt-4 max-w-md text-base leading-7 text-[#B9C7BD]">
              Books you added to the library.
            </p>

            <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#D9A441]/50 bg-white/5 px-4 py-2 text-sm font-medium">
              <LibraryBig className="size-4 text-[#D9A441]" />
              {isLoading
                ? "Loading your books..."
                : `${books.length} books in your collection`}
            </div>
          </div>

          <div className="h-1.5 bg-[#D9A441]" />
        </header>

        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
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
            <div className="flex items-start gap-4 rounded-md border border-[#E3C9C4] border-l-4 border-l-[#B5483B] bg-white px-6 py-8">
              <BookOpen className="mt-1 size-7 shrink-0 text-[#B5483B]" />

              <div>
                <h2 className="font-serif text-xl font-bold text-[#17302A]">
                  Unable to Load Your Books
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#5B6B61]">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && books.length === 0 && (
            <div className="mx-auto max-w-xl overflow-hidden rounded-sm border border-[#D3DACD] bg-white shadow-[6px_6px_0_0_#D9A441]">
              <div className="flex items-center gap-4 border-b-2 border-[#B5483B] px-6 py-6">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-[#17302A]">
                  <LibraryBig className="size-7 text-[#D9A441]" />
                </div>

                <h2 className="font-serif text-2xl font-bold leading-tight text-[#17302A]">
                  You Haven&apos;t Added Any Books Yet
                </h2>
              </div>

              <div className="bg-[repeating-linear-gradient(to_bottom,transparent,transparent_31px,#DDE4D8_32px)] px-6 py-6">
                <p className="text-sm leading-8 text-[#5B6B61]">
                  Share your books with the BookNook community. Your collection
                  will appear here.
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && books.length > 0 && (
            <>
              <div
                role="table"
                aria-label="My books"
                className="overflow-hidden rounded-md border border-[#D3DACD] bg-white"
              >
                <div
                  role="row"
                  className={`hidden gap-4 bg-[#17302A] px-6 py-3.5 text-sm font-semibold text-[#F3EFE3] md:grid ${COLUMNS}`}
                >
                  <div role="columnheader">Book</div>
                  <div role="columnheader">Category</div>
                  <div role="columnheader">Copies</div>
                  <div role="columnheader" className="text-right">
                    Actions
                  </div>
                </div>

                <div className="divide-y divide-[#DDE4D8]">
                  {books.map((book) => (
                    <div
                      key={book._id}
                      role="row"
                      className={`flex flex-col gap-4 px-4 py-5 transition-colors hover:bg-[#F6F8F3] sm:px-6 md:grid md:items-center md:gap-4 ${COLUMNS}`}
                    >
                      <div
                        role="cell"
                        className="flex min-w-0 items-center gap-4"
                      >
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-20 w-14 shrink-0 rounded-sm border border-[#D3DACD] object-cover shadow-[3px_3px_0_0_#D9A441]"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-serif text-lg font-bold text-[#17302A]">
                            {book.title}
                          </p>
                          <p className="truncate text-sm text-[#5B6B61]">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      <div role="cell" className="flex items-center gap-2">
                        <span className="text-xs text-[#5B6B61] md:hidden">
                          Category
                        </span>
                        {book.category && (
                          <span className="rounded-full bg-[#E4EBDF] px-3 py-1 text-xs font-semibold text-[#17302A]">
                            {book.category}
                          </span>
                        )}
                      </div>

                      <div role="cell" className="flex items-center gap-2">
                        <span className="text-xs text-[#5B6B61] md:hidden">
                          Copies
                        </span>
                        <span className="font-serif text-xl font-bold text-[#17302A]">
                          {book.totalCopies ?? "-"}
                        </span>
                      </div>

                      <div role="cell" className="flex gap-2 md:justify-end">
                        <button
                          type="button"
                          onClick={() => handleEditClick(book._id)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-[#17302A] px-3.5 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17302A]"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(book)}
                          disabled={deletingId === book._id}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#B5483B]/50 px-3.5 py-2 text-sm font-semibold text-[#B5483B] transition-colors hover:bg-[#B5483B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5483B] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                          {deletingId === book._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <EditBookDialog
        bookId={selectedBookId}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdated={handleBookUpdated}
      />
    </>
  );
}
