"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

const allHrefs = [...navLinks, ...privateLinks].map((link) => link.href);

// Style only: decides which link is marked for the current page
const isActiveLink = (pathname: string, href: string) => {
  const matches = (target: string) =>
    target === "/"
      ? pathname === "/"
      : pathname === target || pathname.startsWith(`${target}/`);

  if (!matches(href)) return false;

  // "/books" must not stay marked on "/books/add"
  return !allHrefs.some(
    (other) => other !== href && other.length > href.length && matches(other),
  );
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17302A]/50";

const desktopLinkClass = (active: boolean) =>
  `relative inline-flex h-[68px] items-center px-3 text-sm font-medium transition-colors ${focusRing} focus-visible:ring-inset ${
    active ? "text-[#17302A]" : "text-[#5B6B61] hover:text-[#17302A]"
  }`;

const mobileLinkClass = (active: boolean) =>
  `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${focusRing} ${
    active
      ? "bg-[#E4EBDF] text-[#17302A]"
      : "text-[#5B6B61] hover:bg-[#EEF1EA] hover:text-[#17302A]"
  }`;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

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
    <header className="sticky top-0 z-50 border-b border-[#DDE4D8] bg-[#F6F8F3]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2.5 rounded-md ${focusRing}`}
        >
          <div className="flex size-9 items-center justify-center rounded-md bg-[#17302A]">
            <BookOpen className="size-5 text-[#D9A441]" />
          </div>

          <span className="font-serif text-xl font-bold tracking-tight text-[#17302A]">
            BookNook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center lg:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={desktopLinkClass(active)}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-0.5 bg-[#D9A441]"
                  />
                )}
              </Link>
            );
          })}

          {user &&
            privateLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={desktopLinkClass(active)}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-0.5 bg-[#D9A441]"
                    />
                  )}
                </Link>
              );
            })}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-2 lg:flex">
          {isPending ? null : user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-1.5 rounded-full border border-[#DDE4D8] bg-white p-1 pr-2.5 transition-colors hover:border-[#17302A]/40 ${focusRing}`}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#17302A] text-sm font-semibold text-[#F3EFE3]">
                    {avatarLetter}
                  </span>
                )}

                <ChevronDown
                  className={`size-4 text-[#5B6B61] transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-lg border border-[#DDE4D8] bg-white shadow-lg shadow-[#17302A]/10">
                  <div className="flex items-center gap-3 border-b border-[#EEF1EA] bg-[#F6F8F3] p-4">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-10 items-center justify-center rounded-full bg-[#17302A] text-sm font-semibold text-[#F3EFE3]">
                        {avatarLetter}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#17302A]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#5B6B61]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#3F5249] transition-colors hover:bg-[#EEF1EA] hover:text-[#17302A]"
                    >
                      <UserRound className="size-4" />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#B5483B] transition-colors hover:bg-[#F8E9E6]"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-[#3F5249] transition-colors hover:bg-[#E4EBDF] hover:text-[#17302A] ${focusRing}`}
              >
                Login
              </Link>

              <Link
                href="/register"
                className={`inline-flex h-9 items-center justify-center gap-1 rounded-md bg-[#17302A] px-4 text-sm font-medium text-[#F3EFE3] transition-colors hover:bg-[#244438] ${focusRing}`}
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
          className="size-10 text-[#17302A] hover:bg-[#E4EBDF] lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="max-h-[calc(100vh-69px)] overflow-y-auto border-t border-[#DDE4D8] bg-[#F6F8F3] px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={mobileLinkClass(active)}
                >
                  <LibraryBig
                    className={`size-4 ${active ? "text-[#4F7A63]" : ""}`}
                  />
                  {link.label}
                </Link>
              );
            })}

            {user &&
              privateLinks.map((link) => {
                const Icon = link.icon;
                const active = isActiveLink(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={mobileLinkClass(active)}
                  >
                    <Icon
                      className={`size-4 ${active ? "text-[#4F7A63]" : ""}`}
                    />
                    {link.label}
                  </Link>
                );
              })}

            <div className="my-2 border-t border-[#DDE4D8]" />

            {isPending ? null : user ? (
              <>
                <div className="flex items-center gap-3 rounded-md bg-white p-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#17302A] text-sm font-semibold text-[#F3EFE3]">
                      {avatarLetter}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#17302A]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#5B6B61]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={mobileLinkClass(false)}
                >
                  <UserRound className="size-4" />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-[#B5483B] transition-colors hover:bg-[#F8E9E6]"
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
                  className="flex h-11 items-center justify-center rounded-md border border-[#17302A]/30 text-sm font-medium text-[#17302A] transition-colors hover:bg-[#E4EBDF]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 items-center justify-center rounded-md bg-[#17302A] text-sm font-medium text-[#F3EFE3] transition-colors hover:bg-[#244438]"
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
