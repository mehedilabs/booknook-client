"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, X, Upload, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import { authClient } from "@/lib/auth-client";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddBookPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?callbackURL=${encodeURIComponent("/books/add")}`);
    }
  }, [isPending, session, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a book cover image.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("image", imageFile);

    setIsSubmitting(true);

    try {
      // Get Better Auth JWT
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Could not verify your login session.");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token is missing.");
      }

      // Send book data to backend
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add book.");
      }

      toast.success("Book added successfully!");

      form.reset();
      setImageFile(null);
      setImagePreview(null);

      router.push("/books");
      router.refresh();
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

  if (isPending || !session) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#EDE6D3]">
          <p className="text-sm font-medium text-[#4F7A63]">
            Checking your session...
          </p>
        </main>
      </>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#D3DACD] bg-white px-3 py-2.5 text-sm font-medium text-[#2F3E33] outline-none transition placeholder:font-normal placeholder:text-[#6B7A6E] focus:border-[#4F7A63] focus:ring-2 focus:ring-[#4F7A63]/15";

  const labelClass = "mb-1.5 block text-[13px] font-semibold text-[#2F3E33]";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#EEF1EA] px-4 py-7 sm:px-6 sm:py-9">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F7A63] transition hover:text-[#3D5F4C]"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#2F3E33]">
              Add a New Book
            </h1>
            <p className="mt-1.5 text-sm text-[#4F7A63]">
              Share a book with the BookNook community.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 rounded-xl border border-[#D3DACD] bg-white p-4 shadow-sm sm:p-6 md:grid-cols-[1fr_250px] md:gap-7">
              <section>
                <div className="mb-5 flex items-center gap-2 border-b border-[#D3DACD] pb-3">
                  <BookOpen size={17} className="text-[#4F7A63]" />
                  <h2 className="text-sm font-bold text-[#2F3E33]">
                    Book Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className={labelClass}>
                      Book Title <span className="text-[#7A2E2E]">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter book title"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="author" className={labelClass}>
                        Author Name <span className="text-[#7A2E2E]">*</span>
                      </label>
                      <input
                        id="author"
                        name="author"
                        type="text"
                        placeholder="Author name"
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className={labelClass}>
                        Category <span className="text-[#7A2E2E]">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        defaultValue=""
                        required
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="max-w-[180px]">
                    <label htmlFor="totalCopies" className={labelClass}>
                      Total Copies <span className="text-[#7A2E2E]">*</span>
                    </label>
                    <input
                      id="totalCopies"
                      name="totalCopies"
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className={labelClass}>
                      Description <span className="text-[#7A2E2E]">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Write a short description about the book..."
                      required
                      className={`${inputClass} resize-y leading-6`}
                    />
                  </div>
                </div>
              </section>

              <aside>
                <div className="mb-5 border-b border-[#D3DACD] pb-3">
                  <h2 className="text-sm font-bold text-[#2F3E33]">
                    Book Cover
                  </h2>
                  <p className="mt-1 text-xs text-[#4F7A63]">
                    Upload an image from your device.
                  </p>
                </div>

                {imagePreview ? (
                  <div className="relative rounded-lg border border-[#D3DACD] bg-[#EDE6D3] p-3">
                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#7A2E2E] shadow-sm hover:bg-[#F6F8F3]"
                    >
                      <X size={15} />
                    </button>

                    <div className="flex h-52 items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Book cover preview"
                        className="max-h-full max-w-full rounded object-contain"
                      />
                    </div>

                    <p className="mt-2 truncate text-center text-xs font-medium text-[#2F3E33]">
                      {imageFile?.name}
                    </p>

                    <label className="mt-3 block cursor-pointer rounded-lg border border-[#D3DACD] bg-white px-3 py-2 text-center text-xs font-semibold text-[#4F7A63] hover:bg-[#F6F8F3]">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex min-h-[235px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D3DACD] bg-[#E4EBDF] px-3 py-6 text-center transition hover:border-[#4F7A63] hover:bg-[#F6F8F3]">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#D3DACD] text-[#4F7A63]">
                      <ImagePlus size={21} />
                    </div>

                    <span className="text-xs font-semibold text-[#2F3E33]">
                      Choose book cover
                    </span>
                    <span className="mt-1.5 text-[11px] text-[#4F7A63]">
                      PNG, JPG, WEBP
                    </span>

                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#4F7A63] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3D5F4C]">
                      <Upload size={14} />
                      Browse Files
                    </span>

                    <span className="mt-3 text-[10px] text-[#6B7A6E]">
                      Maximum size: 5 MB
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                )}
              </aside>
            </div>

            <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-lg border border-[#D3DACD] bg-white px-5 py-2.5 text-sm font-semibold text-[#4F7A63] transition hover:bg-[#F6F8F3]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#4F7A63] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3D5F4C] focus:outline-none focus:ring-2 focus:ring-[#4F7A63]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Adding Book..." : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
