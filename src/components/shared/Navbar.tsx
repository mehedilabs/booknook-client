"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  LibraryBig,
  ChevronRight,
  UserRound,
  LogOut,
  BookPlus,
  Bookmark,
  History,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

const privateLinks = [
  { label: "Add Book", href: "/books/add", icon: BookPlus },
  { label: "My Books", href: "/my-books", icon: Bookmark },
  { label: "My Borrows", href: "/my-borrows", icon: History },
];

export function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "User";
  const avatarLetter = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setIsProfileOpen(false);
      setIsMenuOpen(false);

      toast.success("Logged out successfully.");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#EDE2D5] bg-[#FAF6F0]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-0 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#C18469] text-white shadow-md shadow-[#C18469]/20">
            <BookOpen className="size-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#292B27]">
              BookNook
            </h1>
            <p className="text-[10px] font-medium tracking-[0.15em] text-[#A18B7A]">
              YOUR PERSONAL LIBRARY
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#75665B] transition-colors hover:text-[#C18469]"
            >
              {link.label}
            </Link>
          ))}

          {user &&
            privateLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#75665B] transition-colors hover:text-[#C18469]"
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? null : user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#EDE2D5] bg-white/70 p-1.5 pr-3 transition hover:border-[#C18469] hover:bg-[#F5EAE1]"
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="size-9 rounded-full border border-[#EDE2D5] object-cover"
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#C18469] text-sm font-bold text-white">
                    {avatarLetter}
                  </span>
                )}

                <ChevronDown
                  className={`size-4 text-[#75665B] transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-[#EDE2D5] bg-[#FFFCF8] p-2 shadow-xl shadow-[#59483D]/10">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F5EAE1] p-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="size-11 rounded-full border border-white object-cover"
                      />
                    ) : (
                      <span className="flex size-11 items-center justify-center rounded-full bg-[#C18469] text-base font-bold text-white">
                        {avatarLetter}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#59483D]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#A18B7A]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-2 border-t border-[#EDE2D5]" />

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#59483D] transition hover:bg-[#F5EAE1] hover:text-[#9B6B54]"
                  >
                    <UserRound className="size-4" />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#B45345] transition hover:bg-[#FCEDEA]"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#DCCABD] bg-white/70 px-5 text-sm font-semibold text-[#9B6B54] transition hover:border-[#C18469] hover:bg-[#F5EAE1]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#C18469] px-5 text-sm font-semibold text-white shadow-md shadow-[#C18469]/20 transition hover:bg-[#AD7057]"
              >
                Register
                <ChevronRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-[#59483D] hover:bg-[#EDE2D5] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#EDE2D5] bg-[#FAF6F0] px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#75665B] transition hover:bg-[#EDE2D5] hover:text-[#A66D53]"
              >
                <LibraryBig className="size-4" />
                {link.label}
              </Link>
            ))}

            {user &&
              privateLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#75665B] transition hover:bg-[#EDE2D5] hover:text-[#A66D53]"
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                );
              })}

            <div className="my-2 border-t border-[#EDE2D5]" />

            {isPending ? null : user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-[#F5EAE1] p-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="size-10 rounded-full border border-white object-cover"
                    />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#C18469] text-sm font-bold text-white">
                      {avatarLetter}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#59483D]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#A18B7A]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#59483D] transition hover:bg-[#EDE2D5]"
                >
                  <UserRound className="size-4" />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#B45345] transition hover:bg-[#FCEDEA]"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl border border-[#DCCABD] bg-white/60 text-sm font-semibold text-[#9B6B54] transition hover:bg-[#F5EAE1]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl bg-[#C18469] text-sm font-semibold text-white transition hover:bg-[#AD7057]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
