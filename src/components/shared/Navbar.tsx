"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  Home,
  LibraryBig,
  UserRound,
  LogOut,
  BookPlus,
  Bookmark,
  History,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "All Books", href: "/books", icon: LibraryBig },
];

const privateLinks = [
  { label: "Add Book", href: "/books/add", icon: BookPlus },
  { label: "My Books", href: "/my-books", icon: Bookmark },
  { label: "My Borrows", href: "/my-borrows", icon: History },
];

const allHrefs = [...navLinks, ...privateLinks].map((link) => link.href);

const isActiveLink = (pathname: string, href: string) => {
  const matches = (target: string) =>
    target === "/"
      ? pathname === "/"
      : pathname === target || pathname.startsWith(`${target}/`);

  if (!matches(href)) return false;

  return !allHrefs.some(
    (other) => other !== href && other.length > href.length && matches(other),
  );
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17302A]/50";

const desktopLinkClass = (active: boolean) =>
  `group relative inline-flex h-[68px] items-center px-3.5 text-sm font-medium transition-colors ${focusRing} focus-visible:ring-inset ${
    active ? "text-[#17302A]" : "text-[#5B6B61] hover:text-[#17302A]"
  }`;

const mobileLinkClass = (active: boolean) =>
  `flex items-center gap-3 rounded-md border-l-2 px-3 py-3 text-sm font-medium transition-colors ${focusRing} ${
    active
      ? "border-[#D9A441] bg-[#E4EBDF] text-[#17302A]"
      : "border-transparent text-[#5B6B61] hover:bg-[#EEF1EA] hover:text-[#17302A]"
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

  const visibleLinks = user ? [...navLinks, ...privateLinks] : navLinks;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
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
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className={`flex shrink-0 items-center gap-2.5 rounded-md ${focusRing}`}
        >
          <div className="flex size-9 items-center justify-center rounded-md bg-[#17302A]">
            <BookOpen className="size-5 text-[#D9A441]" />
          </div>

          <span className="font-serif text-xl font-bold tracking-tight text-[#17302A]">
            BookNook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center lg:ml-6 lg:mr-auto lg:flex xl:ml-24">
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
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3.5 -bottom-px h-0.5 origin-center bg-[#D9A441] transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}

          {isPending ? (
            <div className="flex items-center" aria-label="Loading navigation">
              {[20, 20, 24].map((width, index) => (
                <div key={index} className="flex h-[68px] items-center px-3.5">
                  <div
                    className="h-3.5 animate-pulse rounded-full bg-[#DDE4D8]"
                    style={{ width: `${width * 4}px` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            user &&
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
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3.5 -bottom-px h-0.5 origin-center bg-[#D9A441] transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })
          )}
        </div>

        {/* Right Side */}
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          {isPending ? null : user ? (
            <div className="relative min-w-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsMenuOpen(false);
                }}
                className={`flex cursor-pointer items-center gap-2 rounded-full ${focusRing}`}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    referrerPolicy="no-referrer"
                    className="size-8 shrink-0 rounded-full object-cover ring-2 ring-[#D9A441] ring-offset-1 ring-offset-[#F6F8F3]"
                  />
                ) : (
                  <>
                    <span className="inline-flex h-8 min-w-0 max-w-[5.5rem] items-center rounded-full bg-[#17302A] px-3 text-xs font-semibold text-[#F3EFE3] transition-colors hover:bg-[#244438] sm:hidden">
                      <span className="truncate">{firstName}</span>
                    </span>

                    <span className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-[#17302A] font-serif text-base font-bold text-[#D9A441] sm:flex">
                      {avatarLetter}
                    </span>
                  </>
                )}

                <span className="hidden max-w-28 truncate text-md font-semibold text-[#17302A] sm:inline">
                  {firstName}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-md border border-[#D3DACD] bg-white shadow-[0_18px_40px_-12px_rgba(23,48,42,0.3)] lg:w-64"
                >
                  <div className="h-1 bg-[#D9A441]" />

                  <div className="flex items-center gap-3 bg-[#F6F8F3] p-4">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        referrerPolicy="no-referrer"
                        className="size-11 shrink-0 rounded-full object-cover ring-2 ring-[#D9A441] ring-offset-2 ring-offset-[#F6F8F3]"
                      />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#17302A] font-serif text-lg font-bold text-[#D9A441]">
                        {avatarLetter}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-base font-bold text-[#17302A]">
                        <span className="lg:hidden">{firstName}</span>
                        <span className="hidden lg:inline">
                          {user.name || firstName}
                        </span>
                      </p>

                      <p className="hidden truncate text-xs text-[#5B6B61] lg:block">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#DDE4D8] p-1.5">
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-[#17302A] transition-colors hover:bg-[#EEF1EA]"
                    >
                      <UserRound className="size-4 text-[#4F7A63]" />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-medium text-[#B5483B] transition-colors hover:bg-[#F8E9E6]"
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
              {/* Mobile and Tablet Login */}
              <Link
                href="/login"
                className={`inline-flex h-8 items-center rounded-full bg-[#17302A] px-3.5 text-xs font-semibold text-[#F3EFE3] transition-colors hover:bg-[#244438] sm:h-9 sm:px-4 sm:text-sm lg:hidden ${focusRing}`}
              >
                Login
              </Link>

              {/* Desktop Login and Register */}
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/login"
                  className={`inline-flex h-9 items-center justify-center rounded-md bg-[#cbd2c6] px-4 text-sm font-medium text-[#3F5249] transition-colors hover:bg-[#D9A441] hover:text-[#17302A] ${focusRing}`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={`inline-flex h-9 items-center justify-center gap-1 rounded-md bg-[#17302A] px-4 text-sm font-medium text-[#F3EFE3] transition-colors hover:bg-[#244438] ${focusRing}`}
                >
                  Register
                </Link>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-[#17302A] hover:bg-[#E4EBDF] sm:size-10 lg:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
            }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="size-8" />
            ) : (
              <Menu className="size-8" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="max-h-[calc(100vh-69px)] overflow-y-auto border-t border-[#DDE4D8] bg-[#F6F8F3] px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {visibleLinks.map((link) => {
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

            {isPending && (
              <div className="space-y-1 py-1" aria-label="Loading navigation">
                {[24, 20, 24].map((width, index) => (
                  <div
                    key={index}
                    className="flex h-[46px] items-center gap-3 rounded-md px-3"
                  >
                    <div className="size-2.5 shrink-0 animate-pulse rounded-full bg-[#DDE4D8]" />
                    <div
                      className="h-2 animate-pulse rounded-full bg-[#DDE4D8]"
                      style={{ width: `${width * 4}px` }}
                    />
                  </div>
                ))}
              </div>
            )}

            {!isPending && !user && (
              <>
                <div className="my-2 border-t border-[#DDE4D8]" />

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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
