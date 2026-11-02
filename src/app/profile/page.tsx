"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Camera,
  Mail,
  Pencil,
  UserRound,
  BookOpen,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  if (isPending || !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center bg-[#EEF1EA]">
          <div className="flex items-center gap-3 text-[#5B6B61]">
            <LoaderCircle className="size-5 animate-spin" />
            <span className="text-sm">Loading your profile...</span>
          </div>
        </main>
      </>
    );
  }

  const firstLetter = user.name?.trim().charAt(0).toUpperCase() || "U";
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleEditOpenChange = (open: boolean) => {
    if (open) {
      setName(user.name || "");
      setImageUrl(user.image || "");
      setImageError(false);
    }
    setIsEditOpen(open);
  };

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedName = name.trim();
    const updatedImage = imageUrl.trim();

    if (!updatedName) {
      toast.error("Please enter your name.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
        image: updatedImage || null,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully.");
      setIsEditOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[75vh] bg-[#EEF1EA] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="font-serif text-2xl font-bold text-[#17302A] sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-2 text-xs text-[#5B6B61] sm:text-sm">
              Manage your personal information.
            </p>
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-xl border border-[#D3DACD] bg-[#F6F8F3] shadow-[0_8px_30px_-18px_rgba(23,48,42,0.3)]">
            <div className="h-1.5 bg-[#17302A]" />

            <div className="p-5 sm:p-7">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {user.image && !imageError ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile picture"}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="size-24 rounded-full border-[3px] border-[#D9A441] object-cover shadow-sm sm:size-28"
                    />
                  ) : (
                    <div className="flex size-24 items-center justify-center rounded-full border-[3px] border-[#D9A441] bg-[#17302A] font-serif text-4xl font-bold text-[#F3EFE3] sm:size-28 sm:text-5xl">
                      {firstLetter}
                    </div>
                  )}
                </div>

                <h2 className="font-serif text-xl font-bold text-[#17302A] sm:text-2xl">
                  {user.name}
                </h2>
                <p className="mt-1 text-xs text-[#5B6B61]">BookNook Member</p>

                <Button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="mt-4 gap-2 rounded-md cursor-pointer bg-[#17302A] px-5 text-[#F3EFE3] hover:bg-[#244438]"
                >
                  <Pencil className="size-3.5" />
                  Edit Profile
                </Button>
              </div>

              <div className="my-6 border-t border-[#DDE4D8]" />

              {/* Info grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={<UserRound className="size-4" />}
                  label="Full Name"
                  value={user.name}
                  serif
                />
                <InfoCard
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value={user.email}
                />
                <div className="sm:col-span-2">
                  <InfoCard
                    icon={<CalendarDays className="size-4" />}
                    label="Member Since"
                    value={memberSince}
                    serif
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-[#5B6B61]">
                <BookOpen className="size-3.5 shrink-0 text-[#8A6414]" />
                <span>Your reading journey, all in one place.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
        <DialogContent className="border border-[#D3DACD] bg-[#F6F8F3] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-[#17302A]">
              Edit Your Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5B6B61]">
              Update your name and profile picture.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="profile-name"
                className="text-xs font-semibold text-[#17302A]"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                maxLength={100}
                className="h-10 w-full rounded-md border border-[#D3DACD] bg-white px-3 text-sm text-[#17302A] outline-none transition focus:border-[#4F7A63] focus:ring-2 focus:ring-[#4F7A63]/15"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-image"
                className="text-xs font-semibold text-[#17302A]"
              >
                Profile Picture URL
                <span className="ml-1 font-normal text-[#8A6414]">
                  (Optional)
                </span>
              </label>
              <input
                id="profile-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/profile.jpg"
                className="h-10 w-full rounded-md border border-[#D3DACD] bg-white px-3 text-sm text-[#17302A] outline-none transition focus:border-[#4F7A63] focus:ring-2 focus:ring-[#4F7A63]/15"
              />
              <p className="text-[11px] leading-4 text-[#5B6B61]">
                Leave empty to use your name&apos;s first letter.
              </p>
            </div>

            <DialogFooter className="gap-2 border-[#DDE4D8]">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setIsEditOpen(false)}
                className="border-[#D3DACD] text-[#17302A]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="gap-2 bg-[#17302A] text-[#F3EFE3] hover:bg-[#244438]"
              >
                {isSaving && <LoaderCircle className="size-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Small reusable info card */
function InfoCard({
  icon,
  label,
  value,
  serif,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  serif?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#D3DACD] bg-[#F3EFE3] p-4">
      <div className="mb-2 flex items-center gap-2 text-[#8A6414]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`break-words text-sm font-medium text-[#17302A] ${
          serif ? "font-serif text-base font-semibold" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
