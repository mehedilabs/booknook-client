"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, BookOpen, ImagePlus, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  description: string;
  image: string;
}

interface EditBookDialogProps {
  bookId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (book: Book) => void;
}

export function EditBookDialog({
  bookId,
  open,
  onOpenChange,
  onUpdated,
}: EditBookDialogProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePreview || !imageFile) return;

    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview, imageFile]);

  useEffect(() => {
    if (!open || !bookId) return;

    const controller = new AbortController();

    const fetchBook = async () => {
      setIsLoading(true);
      setBook(null);
      setImageFile(null);
      setImagePreview(null);

      try {
        const response = await fetch(`${API_URL}/books/${bookId}`, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load book details.");
        }

        setBook(result.data);
        setImagePreview(result.data.image || null);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load book details.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchBook();

    return () => controller.abort();
  }, [open, bookId]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!book || !bookId) return;

    const formData = new FormData(event.currentTarget);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsSubmitting(true);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Could not verify your login session.");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update book.");
      }

      onUpdated(result.data);
      toast.success("Book updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-[#C9D3C3] bg-white px-3 py-2 text-sm font-medium text-[#17302A] outline-none transition placeholder:font-normal placeholder:text-[#8A9A8F] focus:border-[#17302A] focus:ring-2 focus:ring-[#D9A441]/40";

  const labelClass = "mb-1 block text-xs font-semibold text-[#17302A]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] w-full max-w-[calc(100%-1rem)] gap-3 overflow-y-auto rounded-md border-2 border-[#17302A] bg-[#EEF1EA] p-4 text-[#17302A] shadow-xl sm:max-w-3xl sm:p-5"
      >
        <DialogHeader className="border-b-2 border-[#D9A441] pb-3 pr-9 text-left">
          <DialogTitle className="font-serif text-2xl font-bold tracking-tight text-[#17302A]">
            Edit Book
          </DialogTitle>

          <DialogDescription className="text-sm text-[#5B6B61]">
            Update your book information and cover image.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-sm bg-[#17302A]">
              <BookOpen className="size-7 text-[#D9A441] motion-safe:animate-pulse" />
            </div>

            <p className="text-sm font-medium text-[#5B6B61]">
              Preparing your book details...
            </p>

            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-[#D9A441] motion-safe:animate-bounce motion-safe:[animation-delay:-0.3s]" />
              <span className="size-2 rounded-full bg-[#D9A441] motion-safe:animate-bounce motion-safe:[animation-delay:-0.15s]" />
              <span className="size-2 rounded-full bg-[#D9A441] motion-safe:animate-bounce" />
            </div>
          </div>
        ) : !book ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <BookOpen className="size-9 text-[#B5483B]" />
            <p className="text-sm font-semibold text-[#17302A]">
              Book details could not be loaded.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#17302A] px-4 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
            >
              <ArrowLeft size={15} />
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 rounded-md border border-[#D3DACD] bg-white p-4 md:grid-cols-[1fr_210px]">
              <section>
                <div className="mb-3 flex items-center gap-2 border-b border-[#DDE4D8] pb-2">
                  <BookOpen size={16} className="text-[#4F7A63]" />
                  <h3 className="text-sm font-bold text-[#17302A]">
                    Book Information
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="edit-title" className={labelClass}>
                      Book Title
                    </label>
                    <input
                      id="edit-title"
                      name="title"
                      type="text"
                      defaultValue={book.title}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr_5.5rem]">
                    <div>
                      <label htmlFor="edit-author" className={labelClass}>
                        Author Name
                      </label>
                      <input
                        id="edit-author"
                        name="author"
                        type="text"
                        defaultValue={book.author}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-category" className={labelClass}>
                        Category
                      </label>
                      <select
                        id="edit-category"
                        name="category"
                        defaultValue={book.category}
                        required
                        className={inputClass}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="edit-totalCopies" className={labelClass}>
                        Copies
                      </label>
                      <input
                        id="edit-totalCopies"
                        name="totalCopies"
                        type="number"
                        min="1"
                        defaultValue={book.totalCopies}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-description" className={labelClass}>
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      rows={3}
                      defaultValue={book.description}
                      required
                      className={`${inputClass} resize-none leading-6`}
                    />
                  </div>
                </div>
              </section>

              <aside>
                <div className="mb-3 border-b border-[#DDE4D8] pb-2">
                  <h3 className="text-sm font-bold text-[#17302A]">
                    Book Cover
                  </h3>
                  <p className="mt-0.5 text-xs leading-4 text-[#5B6B61]">
                    Choose a new cover to replace the existing one.
                  </p>
                </div>

                <div className="rounded-md border border-[#D3DACD] bg-[#F6F8F3] p-2.5">
                  {imagePreview ? (
                    <div className="flex h-40 items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Book cover preview"
                        className="max-h-full max-w-full rounded-sm object-contain shadow-[3px_3px_0_0_#D9A441]"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                      <ImagePlus className="mb-2 size-8 text-[#8A9A8F]" />
                      <p className="text-xs text-[#5B6B61]">
                        No cover image available
                      </p>
                    </div>
                  )}

                  <label className="mt-2.5 block cursor-pointer rounded-md border border-dashed border-[#17302A]/50 bg-white px-3 py-2 text-center text-xs font-semibold text-[#17302A] transition-colors hover:bg-[#17302A] hover:text-[#F3EFE3]">
                    <span className="inline-flex items-center gap-1.5">
                      <Upload size={14} />
                      {imageFile ? "Change Image" : "Choose New Image"}
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>

                  <p className="mt-1.5 text-center text-[10px] text-[#5B6B61]">
                    JPG, PNG, WEBP · Maximum 5 MB
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-3 flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="rounded-md border border-[#17302A]/40 bg-white px-5 py-2 text-sm font-semibold text-[#17302A] transition-colors hover:bg-[#E4EBDF] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-[#17302A] px-6 py-2 text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17302A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Updating Book..." : "Update Book"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
