"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LibraryBig,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { EditBookDialog } from "@/components/books/EditBookDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const CATEGORIES = [
  "All Categories",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

const COLUMNS = "md:grid-cols-[minmax(0,2.2fr)_1fr_0.7fr_11rem]";

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

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
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
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/books?mine=true`, {
          headers: { Authorization: `Bearer ${token}` },
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
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyBooks();

    return () => controller.abort();
  }, [isPending, session, reloadKey]);

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  const hasFilters = searchTerm !== "" || selectedCategory !== "All Categories";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
  };

  const handleRetry = () => {
    setError("");
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

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
              category: updatedBook.category,
              totalCopies: updatedBook.totalCopies,
            }
          : book,
      ),
    );
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    const book = bookToDelete;
    setDeletingId(book._id);

    try {
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/books/${book._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete the book.");
      }

      setBooks((currentBooks) =>
        currentBooks.filter((item) => item._id !== book._id),
      );
      toast.success("Book deleted.");
      setBookToDelete(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete the book.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || !session) {
    return (
      <>
        <main className="min-h-screen bg-[#EEF1EA]">
          <header className="bg-[#17302A] text-[#F3EFE3]">
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
              <div className="h-10 w-48 animate-pulse rounded bg-white/15 sm:h-12 sm:w-56" />
              <div className="mt-4 h-4 w-72 max-w-full animate-pulse rounded bg-white/10" />
              <div className="mt-6 h-9 w-40 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="h-0.5 bg-[#D9A441]" />
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="overflow-hidden rounded-md border border-[#D3DACD] bg-white shadow-sm">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4 border-b border-[#DDE4D8] px-6 py-5 last:border-b-0"
                >
                  <div className="h-20 w-14 shrink-0 rounded-sm bg-[#DDE4D8]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 rounded bg-[#DDE4D8]" />
                    <div className="h-3 w-1/5 rounded bg-[#E8EDE4]" />
                  </div>
                  <div className="hidden h-9 w-20 rounded bg-[#E8EDE4] sm:block" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#EEF1EA]">
        {/* Header */}
        <header className="relative overflow-hidden bg-[#17302A] text-[#F3EFE3]">
          <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
              My Books
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#C9D3C3] sm:text-base">
              Books you added to the library. Edit or remove them anytime.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D9A441]/40 bg-white/5 px-4 py-2 text-sm">
                {isLoading ? (
                  <span>Loading your books...</span>
                ) : (
                  <span>
                    <strong className="font-semibold text-[#D9A441]">
                      {books.length}
                    </strong>{" "}
                    {books.length === 1 ? "book" : "books"} in your collection
                  </span>
                )}
              </div>

              <Link
                href="/books/add"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#D9A441] px-4 py-2 text-sm font-semibold text-[#17302A] transition-colors hover:bg-[#F3EFE3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3EFE3]"
              >
                <Plus size={16} />
                Add New Book
              </Link>
            </div>
          </div>

          <div className="h-0.5 bg-[#D9A441]" />
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          {/* Search and filter (only when there are books) */}
          {!isLoading && !error && books.length > 0 && (
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8A9A8F]" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or author..."
                  className="h-11 w-full rounded-md border border-[#C9D3C3] bg-white pl-10 pr-10 text-sm font-medium text-[#17302A] outline-none transition placeholder:font-normal placeholder:text-[#8A9A8F] focus:border-[#17302A] focus:ring-2 focus:ring-[#D9A441]/40"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9A8F] transition hover:text-[#17302A]"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="h-11 w-full rounded-md border border-[#C9D3C3] bg-white px-3 text-sm font-medium text-[#17302A] outline-none transition focus:border-[#17302A] focus:ring-2 focus:ring-[#D9A441]/40 sm:w-48"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#17302A] underline-offset-4 hover:text-[#B5483B] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Loading */}
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

          {/* Error */}
          {!isLoading && error && (
            <div className="flex flex-col gap-4 rounded-md border border-[#E3C9C4] border-l-4 border-l-[#B5483B] bg-white px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <BookOpen className="mt-1 size-7 shrink-0 text-[#B5483B]" />

                <div>
                  <h2 className="font-serif text-xl font-bold text-[#17302A]">
                    Unable to load your books
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

          {/* Empty collection */}
          {!isLoading && !error && books.length === 0 && (
            <div className="mx-auto max-w-xl rounded-md border border-dashed border-[#17302A]/40 bg-white px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-sm bg-[#17302A]">
                <LibraryBig className="size-7 text-[#D9A441]" />
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#17302A]">
                You haven&apos;t added any books yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#5B6B61]">
                Share a book with the BookNook community and it will show up
                here.
              </p>

              <Link
                href="books/add"
                className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-[#17302A] px-5 py-2.5 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
              >
                <Plus size={16} />
                Add your first book
              </Link>
            </div>
          )}

          {/* No search results */}
          {!isLoading &&
            !error &&
            books.length > 0 &&
            filteredBooks.length === 0 && (
              <div className="rounded-md border border-dashed border-[#17302A]/40 bg-white px-6 py-12 text-center">
                <Search className="mx-auto mb-3 size-8 text-[#4F7A63]" />

                <h2 className="font-serif text-xl font-bold text-[#17302A]">
                  No matching books
                </h2>

                <p className="mt-1 text-sm text-[#5B6B61]">
                  Try a different title, author, or category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-md bg-[#17302A] px-4 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
                >
                  Clear filters
                </button>
              </div>
            )}

          {/* Table */}
          {!isLoading && !error && filteredBooks.length > 0 && (
            <>
              <p className="mb-3 text-sm text-[#5B6B61]">
                Showing {filteredBooks.length} of {books.length}{" "}
                {books.length === 1 ? "book" : "books"}
              </p>

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
                  {filteredBooks.map((book) => (
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
                          className="h-20 w-14 shrink-0 rounded-sm border border-[#D3DACD] object-cover shadow-sm"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-serif text-lg font-bold text-[#17302A]">
                            {book.title}
                          </p>
                          <p className="truncate text-sm text-[#5B6B61]">
                            by {book.author}
                          </p>
                        </div>
                      </div>

                      <div role="cell" className="flex items-center gap-2">
                        <span className="text-xs text-[#5B6B61] md:hidden">
                          Category:
                        </span>
                        {book.category && (
                          <span className="rounded-full bg-[#E4EBDF] px-3 py-1 text-xs font-semibold text-[#17302A]">
                            {book.category}
                          </span>
                        )}
                      </div>

                      <div role="cell" className="flex items-center gap-2">
                        <span className="text-xs text-[#5B6B61] md:hidden">
                          Copies:
                        </span>
                        <span className="font-serif text-xl font-bold text-[#17302A]">
                          {book.totalCopies ?? "-"}
                        </span>
                      </div>

                      <div role="cell" className="flex gap-2 md:justify-end">
                        <button
                          type="button"
                          onClick={() => handleEditClick(book._id)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#17302A] px-3.5 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17302A] md:flex-none"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setBookToDelete(book)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#B5483B]/50 px-3.5 py-2 text-sm font-semibold text-[#B5483B] transition-colors hover:bg-[#B5483B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5483B] md:flex-none"
                        >
                          <Trash2 size={14} />
                          Delete
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

      {/* Edit dialog */}
      <EditBookDialog
        bookId={selectedBookId}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdated={handleBookUpdated}
      />

      {/* Delete confirmation */}
      <Dialog
        open={bookToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setBookToDelete(null);
        }}
      >
        <DialogContent
          showCloseButton
          className="w-full max-w-[calc(100%-1rem)] gap-4 rounded-md border-2 border-[#17302A] bg-[#EEF1EA] p-5 text-[#17302A] shadow-none sm:max-w-md"
        >
          <DialogHeader className="text-left">
            <DialogTitle className="font-serif text-xl font-bold text-[#17302A]">
              Delete this book?
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-[#5B6B61]">
              &quot;{bookToDelete?.title}&quot; will be removed from the
              library. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setBookToDelete(null)}
              disabled={deletingId !== null}
              className="rounded-md border border-[#17302A]/40 bg-white px-5 py-2 text-sm font-semibold text-[#17302A] transition-colors hover:bg-[#E4EBDF] disabled:opacity-60"
            >
              Keep book
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deletingId !== null}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#B5483B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#9A3A2F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={14} />
              {deletingId ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
